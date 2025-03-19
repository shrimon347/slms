from django.db import IntegrityError
from django.utils.timezone import now
from models import Enrollment


class EnrollmentRepository:
    @staticmethod
    def create_enrollment(student, course):
        try:
            enrollment = Enrollment.objects.create(student=student, course=course)
            return enrollment
        except IntegrityError:
            return None

    @staticmethod
    def get_enrollment_by_id(enrollment_id):
        return Enrollment.objects.filter(id=enrollment_id).first()

    @staticmethod
    def get_enrollments_by_student(student):
        return Enrollment.objects.filter(student=student)

    @staticmethod
    def get_enrollments_by_course(course):
        return Enrollment.objects.filter(course=course)

    @staticmethod
    def update_progress(enrollment_id, progress):
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
        enrollment = EnrollmentRepository.get_enrollment_by_id(enrollment_id)
        if enrollment:
            enrollment.status = status
            enrollment.save()
            return enrollment
        return None

    @staticmethod
    def update_payment_status(enrollment_id, payment_status):
        enrollment = EnrollmentRepository.get_enrollment_by_id(enrollment_id)
        if enrollment:
            enrollment.payment_status = payment_status
            enrollment.save()
            return enrollment
        return None

    @staticmethod
    def delete_enrollment(enrollment_id):
        enrollment = EnrollmentRepository.get_enrollment_by_id(enrollment_id)
        if enrollment:
            enrollment.delete()
            return True
        return False
