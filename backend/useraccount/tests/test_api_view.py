from base64 import urlsafe_b64encode

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.urls import reverse
from django.utils.encoding import force_bytes, smart_str
from rest_framework import status
from rest_framework.test import APITestCase
from useraccount.models import User


class UserRegistrationTestCase(APITestCase):

    def setUp(self):
        # This is where you create the user for the tests
        self.user_data = {
            "full_name": "Test User",
            "email": "testuser@example.com",
            "password": "TestPassword@123",
            "password2": "TestPassword@123",
            "date_of_birth": "2000-01-01",
            "contact_number": "1234567890",
            "profile_picture": None,
            "is_verified": True,
            "accept_terms": True
        }

    def test_user_registration_success(self):
        url = reverse("register")  # Adjust the name of the URL in your project
        response = self.client.post(url, self.user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("success", response.data)
        self.assertEqual(
            response.data["success"],
            "User registered successfully. Please verify your email. An OTP sent your email.",
        )

    def test_user_registration_password_mismatch(self):
        self.user_data["password2"] = "DifferentPassword"
        url = reverse("register")
        response = self.client.post(url, self.user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)
        self.assertEqual(response.data["password"][0], "Password fields didn't match.")

    def test_user_login_successful(self):
        # First, create the user to ensure the login will work
        user = User.objects.create_user(
            email="testuser@example.com",
            password="TestPassword@123",
            full_name="Test User",
            contact_number="1234567890",
            date_of_birth="2000-01-01",
            is_verified=True,
        )

        url = reverse("login")
        data = {"email": "testuser@example.com", "password": "TestPassword@123"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)
        self.assertEqual(response.data["message"], "Login SuccessFull")

    def test_user_login_failed(self):
        url = reverse("login")  # Adjust the name of the URL in your project
        data = {"email": "wrongemail@example.com", "password": "wrongpassword123"}

        # Simulate the failed login attempt
        response = self.client.post(url, data, format="json")

        # Assert that the response code is 400 (Bad Request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Check that the 'errors' key is present in the response
        self.assertIn("errors", response.data)

        # Check the error message is inside a list
        self.assertEqual(
            response.data["errors"], "User with this email does not exist."
        )

    def test_user_otp_verification_success(self):
        user = User.objects.create_user(
            email="testuser@example.com",
            password="TestPassword123",
            full_name="Test User",
            contact_number="1234567890",
            date_of_birth="2000-01-01",
        )
        # Send OTP email (simulate it in your code, or you can mock the email sending)
        user.otp = "123456"
        user.save()
        url = reverse("verify-email")  # Adjust URL as per your project
        data = {
            "email": "testuser@example.com",
            "otp": "123456",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Email verified successfully.")

    def test_user_otp_verification_invalid(self):
        user = User.objects.create_user(
            email="testuser@example.com",
            password="TestPassword123",
            full_name="Test User",
            contact_number="1234567890",
            date_of_birth="2000-01-01",
        )
        # Simulate sending OTP email
        user.otp = "123456"
        user.save()

        # Make the request to verify the OTP
        url = reverse("verify-email")
        data = {
            "email": "testuser@example.com",
            "otp": "654321",  # Incorrect OTP
        }
        response = self.client.post(url, data, format="json")

        # Assert the response code is 400 (Bad Request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Check for the 'non_field_errors' key in the response
        self.assertIn("non_field_errors", response.data)

        # Assert the error message is as expected
        self.assertEqual(response.data["non_field_errors"][0], "Invalid OTP.")


class UserProfileTestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="testuser@example.com",
            password="TestPassword123",
            full_name="Test User",
            contact_number="1234567890",
            date_of_birth="2000-01-01",
        )
        self.client.force_authenticate(user=self.user)

    def test_user_profile_view(self):
        url = reverse("profile")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"]["email"], self.user.email)

    def test_user_profile_update(self):
        url = reverse("profile")
        data = {"full_name": "Updated User"}
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"]["full_name"], "Updated User")


class UserChangePasswordTestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="testuser@example.com",
            password="TestPassword123",
            full_name="Test User",
            contact_number="1234567890",
            date_of_birth="2000-01-01",
        )
        self.client.force_authenticate(user=self.user)

    def test_password_change(self):
        url = reverse("changepassword")
        data = {"password": "NewPassword123", "password2": "NewPassword123"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("NewPassword123"))


class SendPasswordResetEmailTestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="testuser@example.com",
            password="TestPassword123",
            full_name="Test User",
            contact_number="1234567890",
            date_of_birth="2000-01-01",
        )

    def test_send_password_reset_email(self):
        url = reverse("send-reset-password-email")
        data = {"email": "testuser@example.com"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["message"],
            "Password Reset link sent. Please check your email.",
        )


class UserPasswordResetTestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="testuser@example.com",
            password="TestPassword123",
            full_name="Test User",
            contact_number="1234567890",
            date_of_birth="2000-01-01",
        )
        self.client.force_authenticate(user=self.user)
        # Simulate generating reset link
        self.uid = smart_str(urlsafe_b64encode(force_bytes(self.user.id)))
        self.token = PasswordResetTokenGenerator().make_token(self.user)

    def test_user_password_reset(self):
        url = reverse("reset-password", kwargs={"uid": self.uid, "token": self.token})
        data = {"password": "NewPassword123", "password2": "NewPassword123"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("NewPassword123"))
