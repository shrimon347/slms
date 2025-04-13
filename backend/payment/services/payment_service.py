from payment.repositories.payment_repository import PaymentRepository


class PaymentService:
    """Handles business logic for payments"""

    @staticmethod
    def process_payment(enrollment, amount, payment_method, transaction_id):
        """Processes a new payment for an enrollment"""
        return PaymentRepository.create_payment(
            enrollment, amount, payment_method, transaction_id
        )

    @staticmethod
    def get_payment_details_by_enrollment(enrollment):
        """Retrieves payment details for a given enrollment"""
        return PaymentRepository.get_payment_by_enrollment(enrollment)

    @staticmethod
    def get_payment_details_by_transaction(transaction_id):
        """Retrieves payment details using a transaction ID"""
        return PaymentRepository.get_payment_by_transaction_id(transaction_id)

    @staticmethod
    def get_successful_payments_for_student(student):
        """Retrieves all successful payments for a student"""
        return PaymentRepository.get_successful_payments_by_student(student)

    @staticmethod
    def update_payment_status(transaction_id, status):
        """Updates payment status and activates enrollment if payment is successful"""
        return PaymentRepository.update_payment_status(transaction_id, status)

    @staticmethod
    def remove_payment(transaction_id):
        """Deletes a payment record"""
        return PaymentRepository.delete_payment(transaction_id)
