import re
from payment.models import Enrollment
from rest_framework.permissions import BasePermission


class IsAdminOrStaff(BasePermission):
    """
    Custom permission to only allow access for admin and staff users.
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.user.role in ["admin", "staff"]:  # Customize as needed
            return True
        return False


class IsStudent(BasePermission):
    """
    Custom permission to only allow access for student users.
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated or request.user.role != "student":
            return False
        enrollment_id=view.kwargs.get("enrollment_id")

        if enrollment_id:
            # Check if student is enrolled with successful payment
            return Enrollment.objects.filter(
                student=request.user, id=enrollment_id, payment_status="success"
            ).exists()

        return False


class IsInstructor(BasePermission):
    """
    Custom permission to only allow access for instructor users.
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.user.role == "instructor":  # Customize as needed
            return True
        return False
