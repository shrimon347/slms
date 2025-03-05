from django.core.exceptions import ObjectDoesNotExist
from useraccount.models import User

class UserRepository:
    """
    Repository layer for User model, handling database operations.
    """

    @staticmethod
    def get_user_by_id(user_id):
        """Retrieve a user by their UUID."""
        try:
            return User.objects.get(user_id=user_id)
        except ObjectDoesNotExist:
            return None

    @staticmethod
    def get_user_by_email(email):
        """Retrieve a user by their email."""
        try:
            return User.objects.get(email=email)
        except ObjectDoesNotExist:
            return None

    @staticmethod
    def create_user(email, full_name, password, **extra_fields):
        """Create a new user with hashed password."""
        user = User.objects.create_user(
            email=email, full_name=full_name, password=password, **extra_fields
        )
        return user

    @staticmethod
    def update_user(user, **updated_fields):
        """Update user fields dynamically."""
        for field, value in updated_fields.items():
            setattr(user, field, value)
        user.save()
        return user

    @staticmethod
    def delete_user(user):
        """Delete a user from the database."""
        user.delete()

    @staticmethod
    def list_users():
        """Retrieve all users."""
        return User.objects.all()

    @staticmethod
    def filter_users(**filters):
        """Filter users based on given criteria."""
        return User.objects.filter(**filters)
