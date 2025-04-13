from course.services.course_service import CourseService
from django.http import FileResponse, Http404
from django.utils import timezone
from payment.models import Enrollment
from payment.serializers import (
    CheckoutCourseSerilizers,
    CheckoutSerializer,
    EnrollmentListSerializer,
    PaymentResponseSerializer,
    VerifyPaymentSerializer,
)
from payment.services.enrollment_service import EnrollmentService
from payment.services.payment_service import PaymentService
from payment.utils.certificate_generator import generate_certificate_pdf
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from useraccount.permissions import IsAdminOrStaff, IsStudent
from useraccount.renderers import UserRenderer


class CheckoutView(APIView):
    """
    Handles the checkout process: Creates an enrollment with 'pending' status before payment.
    """

    permission_classes = [IsAuthenticated]
    renderer_classes = [UserRenderer]

    def post(self, request):
        course_slug = request.query_params.get("course")

        if not course_slug:
            return Response(
                {"error": "Missing 'course' slug in query parameters."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Pass course_slug to serializer context
        serializer = CheckoutSerializer(
            data=request.data, context={"request": request, "course_slug": course_slug}
        )

        if serializer.is_valid():
            user = request.user
            validated_data = serializer.validated_data
            course = serializer.context["course"]  # get course from context
            payment_method = validated_data["payment_method"]
            amount = validated_data["amount"]
            transaction_id = validated_data["transaction_id"]

            # Create enrollment with 'pending' status
            enrollment = EnrollmentService.enroll_student(user, course)

            # Create payment record
            payment = PaymentService.process_payment(
                enrollment, amount, payment_method, transaction_id
            )

            # Serialize and return response
            payment_serializer = PaymentResponseSerializer(payment)
            return Response(
                {
                    "message": "Checkout initiated. Please complete payment within 24 hours.",
                    "payment": payment_serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CheckoutCourseView(APIView):
    permission_classes = [AllowAny]
    renderer_classes = [UserRenderer]

    def get(self, request, slug):
        try:
            course = CourseService.get_course_by_slug(slug)
            serializer = CheckoutCourseSerilizers(course, context={"request": request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except course.DoesNotExist:
            return Response(
                {"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND
            )


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


class CertificateDownloadView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request, enrollment_id):
        try:
            enrollment = Enrollment.objects.get(id=enrollment_id, student=request.user)
        except Enrollment.DoesNotExist:
            raise Http404("Enrollment not found")

        if not enrollment.certificate_issued:
            return Response(
                {"error": "Certificate not yet issued."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Update download tracking
        enrollment.certificate_download_count += 1
        if not enrollment.certificate_issue_date:
            enrollment.certificate_issue_date = timezone.now()
        enrollment.save()

        # Generate PDF and return as inline
        buffer = generate_certificate_pdf(enrollment)
        filename = f"certificate_{enrollment.course.slug}.pdf"

        response = FileResponse(buffer, content_type="application/pdf")
        response["Content-Disposition"] = f'inline; filename="{filename}"'
        return response
