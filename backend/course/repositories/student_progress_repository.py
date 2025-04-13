from course.models import StudentProgress
from django.db.models import Count, Q
from django.forms import ValidationError
from django.utils import timezone
from payment.models import Enrollment


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

    
