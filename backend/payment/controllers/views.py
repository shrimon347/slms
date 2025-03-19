from django.forms import ValidationError
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from services.enrollment_service import EnrollmentService
from useraccount.permissions import IsAdminOrStaff
from useraccount.renderers import UserRenderer

from backend.course.services.course_service import CourseService
from backend.payment.services.payment_service import PaymentService


class EnrollmentView(APIView):
    permission_classes = [IsAuthenticated]
    renderer_classes = [UserRenderer]

    def post(self, request):
        student = request.user
        course_id = request.data.get("course_id")

        # Check if already enrolled
        if EnrollmentService.enroll_student(student, course_id) is None:
            return Response(
                {"message": "Already enrolled"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Check if seats are available
        try:
            course = CourseService.get_course_by_id(course_id)
            if course.remaining_seat <= 0:
                return Response(
                    {"message": "No seats available"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except Exception as e:
            return Response(
                {"message": "Course not found"}, status=status.HTTP_404_NOT_FOUND
            )

        # Create Enrollment with pending payment
        enrollment = EnrollmentService.enroll_student(student, course)

        return Response(
            {"message": "Enrollment created. Proceed to payment."},
            status=status.HTTP_201_CREATED,
        )


class PaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        student = request.user
        enrollment_id = request.data.get("enrollment_id")
        payment_method = request.data.get("payment_method")
        transaction_id = request.data.get("transaction_id")

        enrollment = EnrollmentService.get_enrollment_by_id(enrollment_id)
        if (
            not enrollment
            or enrollment.student != student
            or enrollment.payment_status != "pending"
        ):
            return Response(
                {"message": "Invalid enrollment or already paid."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Process payment
        payment = PaymentService.process_payment(
            enrollment, enrollment.course.price, payment_method, transaction_id
        )
        if not payment:
            return Response(
                {"message": "Payment processing failed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Confirm payment and update enrollment
        PaymentService.confirm_payment(transaction_id)

        return Response(
            {"message": "Payment successful, admin will verify."},
            status=status.HTTP_200_OK,
        )
