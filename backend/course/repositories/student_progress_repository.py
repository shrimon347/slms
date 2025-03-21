from course.models import StudentProgress
from django.db.models import Count, Q
from django.utils import timezone


class StudentProgressRepository:
    @staticmethod
    def get_or_create_lesson_progress(student, lesson):
        """
        Retrieve or create a StudentProgress record for a lesson.
        """
        progress, created = StudentProgress.objects.get_or_create(
            student=student, lesson=lesson, defaults={"completed": False}
        )
        return progress

    @staticmethod
    def get_or_create_quiz_progress(student, quiz):
        """
        Retrieve or create a StudentProgress record for a quiz.
        """
        progress, created = StudentProgress.objects.get_or_create(
            student=student, quiz=quiz, defaults={"completed": False}
        )
        return progress

    @staticmethod
    def update_progress(instance, completed=True):
        """
        Marks a lesson or quiz as completed and updates the progress.
        """
        instance.completed = completed
        instance.save()

    @staticmethod
    def update_enrollment_progress(enrollment):
        """
        Updates the enrollment progress based on completed lessons and quizzes.
        """

        course = enrollment.course
        student = enrollment.student

        total_lessons = course.modules.all().aggregate(total=Count("lessons"))["total"]
        total_quizzes = course.modules.filter(quiz__isnull=False).count()

        completed_lessons = StudentProgress.objects.filter(
            student=student, lesson__module__course=course, completed=True
        ).count()
        completed_quizzes = StudentProgress.objects.filter(
            student=student, quiz__module__course=course, completed=True
        ).count()

        total_items = total_lessons + total_quizzes
        completed_items = completed_lessons + completed_quizzes

        progress_percentage = (
            (completed_items / total_items) * 100 if total_items > 0 else 0
        )

        # Update Enrollment progress
        enrollment.progress = int(progress_percentage)

        # If fully completed, update status and completion date
        if progress_percentage == 100:
            enrollment.status = "completed"
            enrollment.certificate_issued = True
            enrollment.completion_date = timezone.now()

        enrollment.save()
