from django.core.exceptions import ValidationError
from useraccount.models import RoleChoices
from useraccount.repositories.user_repository import UserRepository


class UserService:
    """
    Service layer for user operations, managing user-related business logic.
    """

    @staticmethod
    def create_user(email, full_name, password, password2, **extra_fields):
        """Create a new user with validated fields."""
        if not password:
            raise ValueError("Password is required to create a user.")
        if password != password2:
            raise ValidationError("Passwords do not match.")

        # Check if the email already exists
        if UserRepository.get_user_by_email(email):
            raise ValidationError("Email already in use.")

        # Create the user via the repository
        user = UserRepository.create_user(
            email=email, full_name=full_name, password=password, **extra_fields
        )
        return user

    @staticmethod
    def create_superuser(email, password, **extra_fields):
        """Create a superuser with admin role."""
        extra_fields.setdefault("role", RoleChoices.ADMIN)

        if extra_fields.get("role") != RoleChoices.ADMIN:
            raise ValidationError("Superuser must have 'admin' role.")

        # Call the user creation with admin role
        user = UserService.create_user(
            email=email,
            full_name="Admin",
            password=password,
            password2=password,
            **extra_fields
        )

        # Ensure user has is_staff and is_superuser set to True
        user.is_staff = True
        user.is_superuser = True
        user.save()

        return user

    @staticmethod
    def update_user(id, **updated_fields):
        """Update a user's fields."""
        user = UserRepository.get_user_by_id(id)
        if not user:
            raise ValidationError("User not found.")

        # Dynamically update user fields
        user = UserRepository.update_user(user, **updated_fields)
        return user

    @staticmethod
    def update_user_password(id, new_password, old_password):
        """Update the user's password."""
        user = UserRepository.get_user_by_id(id)
        if not user:
            raise ValidationError("User not found.")

        if not user.check_password(old_password):
            raise ValidationError("Old password is incorrect.")

        user.set_password(new_password)
        user.save()
        return user

    @staticmethod
    def set_user_role(id, role):
        """Set the role of a user."""
        user = UserRepository.get_user_by_id(id)
        if not user:
            raise ValidationError("User not found.")

        # Ensure the role is valid
        if role not in RoleChoices.values:
            raise ValidationError("Invalid role.")

        user.role = role
        user.save()
        return user

    @staticmethod
    def delete_user(id):
        """Delete a user."""
        user = UserRepository.get_user_by_id(id)
        if not user:
            raise ValidationError("User not found.")

        UserRepository.delete_user(user)
        return user

    @staticmethod
    def activate_user(id):
        """Activate a user."""
        user = UserRepository.get_user_by_id(id)
        if not user:
            raise ValidationError("User not found.")

        user.is_active = True
        user.save()
        return user

    @staticmethod
    def deactivate_user(id):
        """Deactivate a user."""
        user = UserRepository.get_user_by_id(id)
        if not user:
            raise ValidationError("User not found.")

        user.is_active = False
        user.save()
        return user

    @staticmethod
    def list_all_users():
        """List all users."""
        return UserRepository.list_users()

    @staticmethod
    def filter_users(**filters):
        """Filter users based on given criteria."""
        return UserRepository.filter_users(**filters)
