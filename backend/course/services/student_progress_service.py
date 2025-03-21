from course.repositories.student_progress_repository import StudentProgressRepository
from payment.models import Enrollment


class StudentProgressService:
    @staticmethod
    def complete_lesson(student, lesson):
        progress = StudentProgressRepository.get_or_create_lesson_progress(
            student, lesson
        )
        StudentProgressRepository.update_progress(progress)


    @staticmethod
    def complete_quiz(student, quiz):
        """
        Marks the quiz as completed for the student and updates enrollment progress.
        """
        progress = StudentProgressRepository.get_or_create_quiz_progress(student, quiz)

        # Mark the quiz as completed
        StudentProgressRepository.update_progress(progress)

        try:
            enrollment = Enrollment.objects.get(student=student, course=quiz.module.course)
            # Update enrollment progress
            StudentProgressRepository.update_enrollment_progress(enrollment)
        except Enrollment.DoesNotExist:
            raise ValueError("Student is not enrolled in this course.")
