from django.db import IntegrityError
from models import Payment


class PaymentRepository:
    @staticmethod
    def create_payment(
        enrollment, amount, payment_method, transaction_id, status="pending"
    ):
        try:
            payment = Payment.objects.create(
                enrollment=enrollment,
                amount=amount,
                payment_method=payment_method,
                transaction_id=transaction_id,
                status=status,
            )
            return payment
        except IntegrityError:
            return None

    @staticmethod
    def get_payment_by_enrollment(enrollment):
        return Payment.objects.filter(enrollment=enrollment).first()

    @staticmethod
    def get_payment_by_transaction_id(transaction_id):
        return Payment.objects.filter(transaction_id=transaction_id).first()

    @staticmethod
    def update_payment_status(transaction_id, status):
        payment = PaymentRepository.get_payment_by_transaction_id(transaction_id)
        if payment:
            payment.status = status
            payment.save()
            return payment
        return None

    @staticmethod
    def delete_payment(transaction_id):
        payment = PaymentRepository.get_payment_by_transaction_id(transaction_id)
        if payment:
            payment.delete()
            return True
        return False
