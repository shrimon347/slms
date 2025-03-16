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
        if not request.user.is_authenticated:
            return False
        if request.user.role == "student":  # Customize as needed
            return True
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
