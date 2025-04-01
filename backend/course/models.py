from django.conf import settings
from django.db import models
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.forms import ValidationError
from django.utils import timezone
from django.utils.text import slugify
from useraccount.models import User


# course categories
class CourseCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name


# Courses
class Course(models.Model):
    category = models.ForeignKey(
        CourseCategory, on_delete=models.CASCADE, related_name="courses"
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    course_picture = models.ImageField(
        upload_to="uploads/courses",
        null=True,
        blank=True,
    )
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    duration = models.IntegerField(help_text="Duration in minutes")
    batch = models.CharField(max_length=255)
    remaining_seat = models.IntegerField(default=100)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    slug = models.SlugField(unique=True, blank=True, max_length=255)
    demo_url = models.TextField()  # demo url
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
            self.slug = self.slug[:255]
        super().save(*args, **kwargs)

    def time_remaining(self):
        if self.start_date:
            delta = self.start_date - timezone.now().date()
            return delta.days if delta.days > 0 else "Course Started"
        return "Closed Enrollment"

    def course_image_url(self):
        if self.course_picture:
            return f"{settings.WEBSITE_URL}{self.course_picture.url}"
        else:
            return ""

    def __str__(self):
        return self.title


# course module
class Module(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="modules")
    title = models.CharField(max_length=255)
    description = models.TextField()
    order = models.PositiveIntegerField()  # Position of module in the course
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# course module lesson
class Lesson(models.Model):
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name="lessons")
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    content = models.TextField()  # URL for video or text content
    duration = models.IntegerField()  # Duration in minutes
    order = models.PositiveIntegerField()  # Position of lesson in the module
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Quiz(models.Model):
    module = models.OneToOneField(Module, on_delete=models.CASCADE, related_name="quiz")
    title = models.CharField(max_length=255)
    total_questions = models.PositiveIntegerField()
    passing_score = models.PositiveIntegerField()
    time_limit = models.PositiveIntegerField(
        default=10 * 60
    )
    

    def __str__(self):
        return self.title


class MCQQuestion(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")
    question_text = models.CharField(max_length=512)
    correct_option_index = (
        models.PositiveIntegerField()
    )  # Index of correct option (1, 2, 3, 4)

    def __str__(self):
        return self.question_text

    def get_options(self):
        return self.options.all()

    def clean(self):
        """Ensure each question has exactly 4 options and one correct option."""
        if (
            not self.pk
        ):  # Only validate if the question has been saved (has a primary key)
            return

        if self.options.count() != 4:
            raise ValidationError("Each question must have exactly 4 options.")

        correct_options = self.options.filter(is_correct=True)
        if correct_options.count() != 1:
            raise ValidationError("Each question must have exactly 1 correct option.")

    def save(self, *args, **kwargs):
        """Save the question only if it does not exceed 4 options."""
        super().save(*args, **kwargs)  # Save the instance first

        if self.options.count() > 4:
            raise ValidationError("Each question can have at most 4 options.")


class Option(models.Model):
    question = models.ForeignKey(
        MCQQuestion, on_delete=models.CASCADE, related_name="options"
    )
    option_text = models.CharField(max_length=255)
    order = models.PositiveIntegerField()  # Order for display (1, 2, 3, 4)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.option_text

    class Meta:
        ordering = ["order"]  # Ensures options are retrieved in the correct order

    def clean(self):
        """Ensure that a question cannot have more than 4 options."""
        if self.question.options.count() >= 4 and self.pk is None:
            raise ValidationError("Each question can have at most 4 options.")


# Signal to validate that there are no more than 4 options for each question
@receiver(pre_save, sender=Option)
def validate_option_count(sender, instance, **kwargs):
    if instance.question.options.count() >= 4 and instance.pk is None:
        raise ValidationError("Each question can have at most 4 options.")


class StudentProgress(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="progress")
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, null=True, blank=True)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, null=True, blank=True)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("student", "quiz")

    def __str__(self):
        return f"{self.student.full_name} - {self.lesson or self.quiz} - {'Completed' if self.completed else 'In Progress'}"
