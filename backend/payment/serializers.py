from course.models import Course
from course.services.course_service import CourseService
from payment.models import Enrollment, Payment, PaymentMethod, PaymentStatus
from rest_framework import serializers


class CheckoutSerializer(serializers.Serializer):
    """
    Serializer for the checkout process that validates the input data
    before creating an enrollment and payment.
    """

    course_id = serializers.IntegerField(required=True)
    payment_method = serializers.ChoiceField(
        choices=PaymentMethod.choices, required=True
    )
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
    transaction_id = serializers.CharField(max_length=255, required=True)

    def validate_course_id(self, value):
        """Validate that the course exists."""
        try:
            CourseService.get_course_by_id(value)
        except Course.DoesNotExist:
            raise serializers.ValidationError("Course not found.")
        return value

    def validate_transaction_id(self, value):
        """Validate that the transaction ID is unique."""
        if Payment.objects.filter(transaction_id=value).exists():
            raise serializers.ValidationError("Transaction ID already exists.")
        return value

    def validate(self, data):
        """
        Additional validation to check if the user is already enrolled
        in the course with an active status.
        """
        request = self.context.get("request")
        user = request.user
        course_id = data.get("course_id")

        # Check if course exists (this is redundant with validate_course_id but keeps the logic clear)
        try:
            course = CourseService.get_course_by_id(course_id)
        except Course.DoesNotExist:
            raise serializers.ValidationError({"course_id": "Course not found."})

        # Check if user is already enrolled with an active status
        if Enrollment.objects.filter(
            student=user, course=course, status__in=["active", "completed"]
        ).exists():
            raise serializers.ValidationError(
                {"course_id": "You are already enrolled in this course."}
            )

        # Check if amount matches the course price
        if data.get("amount") != course.price:
            raise serializers.ValidationError(
                {"amount": "Payment amount does not match course price."}
            )

        return data


from rest_framework import serializers

from .models import Payment, PaymentStatus  # Assuming PaymentStatus is an Enum


class VerifyPaymentSerializer(serializers.ModelSerializer):
    transaction_id = serializers.CharField(required=True)
    status = serializers.ChoiceField(choices=PaymentStatus.choices, required=True)

    class Meta:
        model = Payment
        fields = ["transaction_id", "status"]

    def validate_transaction_id(self, value):
        """Ensure transaction_id is not empty."""
        if not value:
            raise serializers.ValidationError("Transaction ID cannot be empty.")
        return value


class EnrollmentListSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="course.title")  # Title of the course
    course_slug = serializers.CharField(
        source="course.slug"
    )  # Slug for URL or identifiers
    course_image_url = serializers.CharField(source="course.course_image_url")
    batch = serializers.CharField(source="course.batch")
    progress = serializers.IntegerField()

    class Meta:
        model = Enrollment
        fields = [
            "id",
            "course_title",
            "course_slug",
            "progress",
            "status",
            "payment_status",
            "course_image_url",
            "batch",
        ]


class PaymentResponseSerializer(serializers.ModelSerializer):
    """Serializer for payment response data."""

    class Meta:
        model = Payment
        fields = [
            "id",
            "amount",
            "payment_method",
            "transaction_id",
            "status",
            "payment_date",
        ]
