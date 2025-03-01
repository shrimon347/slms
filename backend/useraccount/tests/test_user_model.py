"""
Tests for the custom User model.
"""

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError
from django.test import TestCase
from django.conf import settings

User = get_user_model()


class UserModelTest(TestCase):
    def test_create_user(self):
        """Test creating a user with required fields."""
        user = User.objects.create_user(
            full_name="John Doe",
            email="john@example.com",
            password="testpassword"
        )
        self.assertEqual(user.full_name, "John Doe")
        self.assertEqual(user.email, "john@example.com")
        self.assertEqual(user.role, "student")  # Default role
        self.assertIsNotNone(user.user_id)  # UUID field
        self.assertIsNone(user.date_of_birth)
        self.assertIsNone(user.contact_number)
        self.assertIsNone(user.profile_picture.name)
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertTrue(user.check_password("testpassword"))

    def test_create_superuser(self):
        """Test creating a superuser."""
        admin_user = User.objects.create_superuser(
            full_name="Admin User",
            email="admin@example.com",
            password="adminpassword"
        )
        self.assertEqual(admin_user.full_name, "Admin User")
        self.assertEqual(admin_user.email, "admin@example.com")
        self.assertEqual(admin_user.role, "student")  # Default role
        self.assertTrue(admin_user.is_active)
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)
        self.assertTrue(admin_user.check_password("adminpassword"))

    def test_email_unique(self):
        """Test that email must be unique."""
        User.objects.create_user(
            full_name="John Doe",
            email="john@example.com",
            password="testpassword"
        )
        with self.assertRaises(IntegrityError):
            User.objects.create_user(
                full_name="Jane Doe",
                email="john@example.com",  # Duplicate email
                password="anotherpassword"
            )

    def test_contact_number_unique(self):
        """Test that contact number must be unique."""
        User.objects.create_user(
            full_name="John Doe",
            email="john@example.com",
            contact_number="1234567890",
            password="testpassword"
        )
        with self.assertRaises(IntegrityError):
            User.objects.create_user(
                full_name="Jane Doe",
                email="jane@example.com",
                contact_number="1234567890",  # Duplicate contact number
                password="anotherpassword"
            )

    def test_invalid_role(self):
        """Test that invalid roles raise a ValidationError."""
        with self.assertRaises(ValidationError):
            user = User(
                full_name="Invalid Role",
                email="invalid@example.com",
                role="guest"  # Invalid role
            )
            user.full_clean()  # Triggers validation

    def test_profile_image_url(self):
        """Test the profile_image_url method."""
        user = User.objects.create_user(
            full_name="John Doe",
            email="john@example.com",
            password="testpassword"
        )
        # No profile picture
        self.assertEqual(user.profile_image_url(), "")

        # With profile picture
        user.profile_picture = "uploads/avatars/test.jpg"
        user.save()
        expected_url = f"{settings.WEBSITE_URL}/media/uploads/avatars/test.jpg"
        self.assertEqual(user.profile_image_url(), expected_url)

    def test_string_representation(self):
        """Test the string representation of the user."""
        user = User.objects.create_user(
            full_name="John Doe",
            email="john@example.com",
            password="testpassword"
        )
        self.assertEqual(str(user), "john@example.com")

    def test_default_values(self):
        """Test default values for fields."""
        user = User.objects.create_user(
            full_name="John Doe",
            email="john@example.com",
            password="testpassword"
        )
        self.assertEqual(user.role, "student")  # Default role
        self.assertTrue(user.is_active)  # Default is_active
        self.assertFalse(user.is_staff)  # Default is_staff