from django.db import IntegrityError
from django.utils.timezone import now
from payment.models import Enrollment


class EnrollmentRepository:
    """Handles database operations for Enrollment"""

    @staticmethod
    def create_enrollment(student, course):
        """Creates an enrollment if it does not already exist"""
        try:
            enrollment, created = Enrollment.objects.get_or_create(
                student=student, course=course
            )
            return enrollment
        except IntegrityError:
            return None

    @staticmethod
    def get_enrollment_by_id(enrollment_id):
        """Fetch an enrollment by ID"""
        return Enrollment.objects.filter(id=enrollment_id).first()

    @staticmethod
    def get_enrollment(student, course):
        """Fetch an enrollment for a student in a specific course"""
        return Enrollment.objects.filter(student=student, course=course).first()

    @staticmethod
    def get_enrollments_by_student(student):
        """Fetch all enrollments for a given student"""
        return Enrollment.objects.filter(student=student)

    @staticmethod
    def get_active_enrollments(student):
        """Fetch only active enrollments"""
        return Enrollment.objects.filter(student=student, status="active")

    @staticmethod
    def get_enrollments_by_course(course):
        """Fetch all enrollments for a given course"""
        return Enrollment.objects.filter(course=course)

    @staticmethod
    def get_enrollment_by_id_and_student(enrollment_id, student):
        try:
            return Enrollment.objects.select_related("course").get(
                id=enrollment_id, student=student
            )
        except Enrollment.DoesNotExist:
            return None

    @staticmethod
    def update_progress(enrollment_id, progress):
        """Updates student progress and issues a certificate if 100% completed"""
        enrollment = EnrollmentRepository.get_enrollment_by_id(enrollment_id)
        if enrollment:
            enrollment.progress = progress
            if progress == 100:
                enrollment.status = "completed"
                enrollment.completion_date = now()
                enrollment.certificate_issued = True
            enrollment.save()
            return enrollment
        return None

    @staticmethod
    def update_status(enrollment_id, status):
        """Updates the status of an enrollment"""
        enrollment = EnrollmentRepository.get_enrollment_by_id(enrollment_id)
        if enrollment:
            enrollment.status = status
            enrollment.save()
            return enrollment
        return None

    @staticmethod
    def update_payment_status(enrollment_id, payment_status):
        """Updates the payment status for an enrollment"""
        enrollment = EnrollmentRepository.get_enrollment_by_id(enrollment_id)
        if enrollment:
            enrollment.payment_status = payment_status
            if payment_status == "completed":
                enrollment.status = "active"  # Auto-activate on successful payment
            enrollment.save()
            return enrollment
        return None

    @staticmethod
    def delete_enrollment(enrollment_id):
        """Deletes an enrollment"""
        enrollment = EnrollmentRepository.get_enrollment_by_id(enrollment_id)
        if enrollment:
            enrollment.delete()
            return True
        return False
