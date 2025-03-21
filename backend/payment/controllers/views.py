from course.services.course_service import CourseService
from payment.serializers import (
    CheckoutSerializer,
    EnrollmentListSerializer,
    PaymentResponseSerializer,
    VerifyPaymentSerializer,
)
from payment.services.enrollment_service import EnrollmentService
from payment.services.payment_service import PaymentService
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from useraccount.permissions import IsAdminOrStaff
from useraccount.renderers import UserRenderer


class CheckoutView(APIView):
    """
    Handles the checkout process: Creates an enrollment with 'pending' status before payment.
    """

    permission_classes = [IsAuthenticated]
    renderer_classes = [UserRenderer]

    def post(self, request):
        # Initialize the serializer with request data and context
        serializer = CheckoutSerializer(data=request.data, context={"request": request})

        if serializer.is_valid():
            user = request.user
            validated_data = serializer.validated_data
            course_id = validated_data.get("course_id")
            payment_method = validated_data.get("payment_method")
            amount = validated_data.get("amount")
            transaction_id = validated_data.get("transaction_id")

            # Get course from validated course_id
            course = CourseService.get_course_by_id(course_id)

            # Create enrollment with 'pending' status
            enrollment = EnrollmentService.enroll_student(user, course)

            # Create payment record
            payment = PaymentService.process_payment(
                enrollment, amount, payment_method, transaction_id
            )

            # Serialize the payment response
            payment_serializer = PaymentResponseSerializer(payment)

            return Response(
                {
                    "message": "Checkout initiated, proceed to payment within 24 hours it confirmed",
                    "payment": payment_serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyPaymentView(APIView):
    """
    Hadle payment verification and automatic enrollment activation
    """

    permission_classes = [IsAuthenticated, IsAdminOrStaff]
    renderer_classes = [UserRenderer]

    def post(self, request):
        serializer = VerifyPaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        transaction_id = serializer.validated_data.get("transaction_id")
        status_value = serializer.validated_data.get("status")

        payment = PaymentService.get_payment_details_by_transaction(transaction_id)

        if not payment:
            return Response(
                {"error": "Payment record not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        updated_payment = PaymentService.update_payment_status(
            transaction_id, status_value
        )

        if updated_payment:
            # If payment status updated successfully and enrollment activated
            return Response(
                {"message": "Payment successful, enrollment activated"},
                status=status.HTTP_200_OK,
            )

        return Response(
            {"error": "Payment verification failed or not found"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class EnrollmentListView(APIView):
    """
    Retrieves all enrollments for the logged-in student.
    """

    permission_classes = [IsAuthenticated]
    renderer_classes = [UserRenderer]

    def get(self, request):
        student = request.user
        enrollments = EnrollmentService.get_active_student_enrollments(student)
        if enrollments:
            serializer = EnrollmentListSerializer(enrollments, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(
            {"message": "No active enrollment found"}, status=status.HTTP_404_NOT_FOUND
        )
