from course.repositories.course_repository import CourseRepository
from payment.repositories.enrollment_repository import EnrollmentRepository


class EnrollmentService:
    """Handles business logic for enrollments"""

    @staticmethod
    def enroll_student(student, course):
        """Enrolls a student in a course if not already enrolled"""
        enrollment = EnrollmentRepository.get_enrollment(student, course)
        if not enrollment:
            enrollment = EnrollmentRepository.create_enrollment(student, course)
        return enrollment

    @staticmethod
    def get_enrollment_details(enrollment_id):
        """Retrieves details of a specific enrollment"""
        return EnrollmentRepository.get_enrollment_by_id(enrollment_id)

    @staticmethod
    def get_enrolled_course(enrollment_id, student):
        # Fetch the enrollment
        enrollment = EnrollmentRepository.get_enrollment_by_id_and_student(
            enrollment_id, student
        )
        if not enrollment:
            return None

        # Fetch the course with its related modules and lessons
        course = CourseRepository.get_course_with_modules_and_lessons(
            enrollment.course.id
        )
        return course

    @staticmethod
    def get_student_enrollments(student):
        """Retrieves all enrollments for a student"""
        return EnrollmentRepository.get_enrollments_by_student(student)

    @staticmethod
    def get_active_student_enrollments(student):
        """Retrieves active enrollments for a student"""
        return EnrollmentRepository.get_active_enrollments(student)

    @staticmethod
    def get_course_enrollments(course):
        """Retrieves all enrollments for a course"""
        return EnrollmentRepository.get_enrollments_by_course(course)

    @staticmethod
    def update_student_progress(enrollment_id, progress):
        """Updates the student's progress and issues a certificate if completed"""
        return EnrollmentRepository.update_progress(enrollment_id, progress)

    @staticmethod
    def change_enrollment_status(enrollment_id, status):
        """Updates the status of an enrollment"""
        return EnrollmentRepository.update_status(enrollment_id, status)

    @staticmethod
    def process_payment(enrollment_id, payment_status):
        """Updates the payment status of an enrollment and activates it if paid"""
        return EnrollmentRepository.update_payment_status(enrollment_id, payment_status)

    @staticmethod
    def remove_enrollment(enrollment_id):
        """Deletes an enrollment"""
        return EnrollmentRepository.delete_enrollment(enrollment_id)
