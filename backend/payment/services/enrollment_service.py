from repositories.enrollment_repository import EnrollmentRepository


class EnrollmentService:
    @staticmethod
    def enroll_student(student, course):
        return EnrollmentRepository.create_enrollment(student, course)

    @staticmethod
    def update_progress(enrollment_id, progress):
        return EnrollmentRepository.update_progress(enrollment_id, progress)

    @staticmethod
    def cancel_enrollment(enrollment_id):
        return EnrollmentRepository.update_status(enrollment_id, "cancelled")

    @staticmethod
    def complete_enrollment(enrollment_id):
        enrollment = EnrollmentRepository.get_enrollment_by_id(enrollment_id)
        if enrollment:
            return EnrollmentRepository.update_progress(enrollment_id, 100)
        return None
