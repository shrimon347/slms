from django.db import models
from django.utils.text import slugify


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
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    duration = models.IntegerField(help_text="Duration in minutes")
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    slug = models.SlugField(unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

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
