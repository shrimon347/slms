from course.models import Course
from course.services.course_service import CourseService
from payment.models import Enrollment, Payment, PaymentMethod, PaymentStatus
from rest_framework import serializers


class CheckoutSerializer(serializers.Serializer):
    """
    Serializer for the checkout process that validates the input data
    before creating an enrollment and payment.
    """

    payment_method = serializers.ChoiceField(
        choices=PaymentMethod.choices, required=True
    )
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
    transaction_id = serializers.CharField(max_length=255, required=True)

    def validate_transaction_id(self, value):
        """Validate that the transaction ID is unique."""
        if Payment.objects.filter(transaction_id=value).exists():
            raise serializers.ValidationError("Transaction ID already exists.")
        return value

    def validate(self, data):
        request = self.context.get("request")
        user = request.user
        course_slug = self.context.get("course_slug")

        if not course_slug:
            raise serializers.ValidationError({"course": "Course slug is required."})

        # Get course using slug
        try:
            course = CourseService.get_course_by_slug(course_slug)
        except Course.DoesNotExist:
            raise serializers.ValidationError({"course": "Course not found."})

        # Check enrollment status
        if Enrollment.objects.filter(
            student=user, course=course, status__in=["active", "completed"]
        ).exists():
            raise serializers.ValidationError(
                {"course": "You are already enrolled in this course."}
            )

        # Check amount matches
        if data.get("amount") != course.price:
            raise serializers.ValidationError(
                {"amount": "Payment amount does not match course price."}
            )

        # Store course in context for use in view
        self.context["course"] = course

        return data


class CheckoutCourseSerilizers(serializers.ModelSerializer):
    enrollment_status = serializers.SerializerMethodField()
    class Meta:
        model = Course
        fields = ["title", "course_image_url", "price", "slug", "enrollment_status",]

    def get_enrollment_status(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return None

        enrollment = obj.enrollments.filter(student=request.user).first()
        print(enrollment)
        return enrollment.payment_status if enrollment else None


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
