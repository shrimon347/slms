from django.db import IntegrityError, transaction
from django.forms import ValidationError
from django.utils.timezone import now
from course.models import StudentProgress
from payment.models import Enrollment
from django.utils import timezone


class EnrollmentRepository:
    """Handles database operations for Enrollment"""

    @staticmethod
    @transaction.atomic
    def create_enrollment(student, course):
        """Creates an enrollment if it does not already exist abd decreses available seats"""
        try:
            if course.remaining_seat <= 0:
                return None
            enrollment, created = Enrollment.objects.get_or_create(
                student=student, course=course
            )
            if created:
                course.remaining_seat -= 1
                course.save()
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
        return Enrollment.objects.filter(student=student)

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

    @staticmethod
    @transaction.atomic
    def cancel_enrollment(enrollment):
        """Cancels enrollment and restores a seat"""
        if enrollment.status != "cancelled":
            enrollment.status = "cancelled"
            enrollment.save()

            # Restore the seat
            course = enrollment.course
            course.remaining_seat += 1
            course.save()

        return enrollment

    @staticmethod
    def update_enrollment_progress(course, student):

        
        enrollment = Enrollment.objects.filter(student=student, course=course).first()
        if not enrollment:
            raise ValidationError("Enrollment not found.")

        # Total quizzes across all modules in the course
        total_quizzes = course.modules.filter(quiz__isnull=False).count()

        # Completed quizzes for the student in this course
        completed_quizzes = StudentProgress.objects.filter(
            student=student,
            quiz__module__course=course,
            completed=True
        ).count()

        # Calculate progress percentage
        progress_percentage = (
            (completed_quizzes / total_quizzes) * 100 if total_quizzes > 0 else 0
        )

        # Update Enrollment progress
        enrollment.progress = int(progress_percentage)

        # Check if all quizzes are completed
        if progress_percentage == 100:
            enrollment.status = "completed"
            enrollment.certificate_issued = True
            enrollment.completion_date = timezone.now()

        # Save the updated enrollment
        enrollment.save()