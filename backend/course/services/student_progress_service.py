from course.repositories.student_progress_repository import StudentProgressRepository
from payment.models import Enrollment


class StudentProgressService:
    @staticmethod
    def complete_lesson(student, lesson):
        progress = StudentProgressRepository.get_or_create_lesson_progress(
            student, lesson
        )
        StudentProgressRepository.update_progress(progress)


    
