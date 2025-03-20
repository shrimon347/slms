from django.db import IntegrityError
from payment.models import Payment


class PaymentRepository:
    """Handles database operations for Payment"""

    @staticmethod
    def create_payment(
        enrollment, amount, payment_method, transaction_id, status="pending"
    ):
        """Creates a new payment record, ensuring a single payment per enrollment"""
        try:
            payment, created = Payment.objects.get_or_create(
                enrollment=enrollment,
                defaults={
                    "amount": amount,
                    "payment_method": payment_method,
                    "transaction_id": transaction_id,
                    "status": status,
                },
            )
            return payment
        except IntegrityError:
            return None

    @staticmethod
    def get_payment_by_enrollment(enrollment):
        """Fetch payment record associated with an enrollment"""
        return Payment.objects.filter(enrollment=enrollment).first()

    @staticmethod
    def get_payment_by_transaction_id(transaction_id):
        """Fetch payment using transaction ID"""
        return Payment.objects.filter(transaction_id=transaction_id).first()

    @staticmethod
    def get_successful_payments_by_student(student):
        """Fetch all successful payments for a given student"""
        return Payment.objects.filter(enrollment__student=student, status="success")

    @staticmethod
    def update_payment_status(transaction_id, status):
        """Updates payment status and automatically activates enrollment if successful"""
        payment = PaymentRepository.get_payment_by_transaction_id(transaction_id)
        if payment:
            payment.status = status
            payment.save()

            if status == "success":
                # Auto-activate enrollment
                enrollment = payment.enrollment
                enrollment.status = "active"
                enrollment.payment_status = "success"
                enrollment.save()

            return payment
        return None

    @staticmethod
    def delete_payment(transaction_id):
        """Deletes a payment record"""
        payment = PaymentRepository.get_payment_by_transaction_id(transaction_id)
        if payment:
            payment.delete()
            return True
        return False
