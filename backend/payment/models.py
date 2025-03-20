import uuid

from course.models import Course
from django.db import models
from useraccount.models import User


# Choice Constants
class EnrollmentStatus(models.TextChoices):
    ACTIVE = "active", "Active"
    PENDING = "pending", "Pending"
    COMPLETED = "completed", "Completed"
    CANCELLED = "cancelled", "Cancelled"


class PaymentStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    SUCCESS = "success", "Success"
    FAILED = "failed", "Failed"


class PaymentMethod(models.TextChoices):
    CARD = "card", "Card"
    BKASH = "bkash", "BKash"
    STRIPE = "stripe", "Stripe"
    BANK_TRANSFER = "bank_transfer", "Bank Transfer"


# Enrollment Model (Linked to Payment)
class Enrollment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="enrollments"
    )
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="enrollments"
    )
    enrollment_date = models.DateTimeField(auto_now_add=True)
    progress = models.IntegerField(default=0)  # Store as percentage
    status = models.CharField(
        max_length=20,
        choices=EnrollmentStatus.choices,
        default=EnrollmentStatus.PENDING,
    )
    payment_status = models.CharField(
        max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING
    )
    completion_date = models.DateTimeField(null=True, blank=True)
    certificate_issued = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.student.full_name} - {self.course.title} - {self.status}"


# Payment Model (Linked to Enrollment)
class Payment(models.Model):
    enrollment = models.OneToOneField(
        Enrollment, on_delete=models.CASCADE, related_name="payment"
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(
        max_length=50, choices=PaymentMethod.choices, default=PaymentMethod.BKASH
    )
    transaction_id = models.CharField(max_length=255, unique=True)
    status = models.CharField(
        max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING
    )
    payment_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.enrollment.student.full_name} - {self.enrollment.course.title} - {self.status}"
