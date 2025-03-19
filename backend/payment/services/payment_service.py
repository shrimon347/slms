from repositories.enrollment_repository import EnrollmentRepository
from repositories.payment_repository import PaymentRepository


class PaymentService:
    @staticmethod
    def process_payment(enrollment, amount, payment_method, transaction_id):
        return PaymentRepository.create_payment(
            enrollment, amount, payment_method, transaction_id, "pending"
        )

    @staticmethod
    def confirm_payment(transaction_id):
        payment = PaymentRepository.update_payment_status(transaction_id, "success")
        if payment:
            EnrollmentRepository.update_payment_status(
                payment.enrollment.id, "completed"
            )
        return payment

    @staticmethod
    def fail_payment(transaction_id):
        return PaymentRepository.update_payment_status(transaction_id, "failed")
