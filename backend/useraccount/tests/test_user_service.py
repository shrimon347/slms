import uuid
from unittest.mock import MagicMock, patch

from django.core.exceptions import ValidationError
from django.test import TestCase
from useraccount.models import RoleChoices, User
from useraccount.services.user_service import UserService


class UserServiceTestCase(TestCase):

    @patch("useraccount.services.user_service.UserRepository.create_user")
    def test_create_user(self, mock_create_user):
        # Setup mock
        mock_create_user.return_value = User(
            email="test@example.com", full_name="John Doe", role=RoleChoices.STUDENT
        )

        # Call the service method
        user = UserService.create_user(
            email="test@example.com",
            full_name="John Doe",
            password="password",
            password2="password",
        )

        # Assertions
        self.assertEqual(user.email, "test@example.com")
        self.assertEqual(user.full_name, "John Doe")
        self.assertEqual(user.role, RoleChoices.STUDENT)

    @patch("useraccount.services.user_service.UserRepository.create_user")
    def test_create_superuser(self, mock_create_user):
        # Setup mock for superuser creation
        mock_create_user.return_value = User(
            email="admin@example.com", full_name="Admin", role=RoleChoices.ADMIN
        )

        # Call the service method to create superuser
        superuser = UserService.create_superuser(
            email="admin@example.com", password="adminpassword"
        )

        # Assertions
        self.assertEqual(superuser.email, "admin@example.com")
        self.assertEqual(superuser.full_name, "Admin")
        self.assertEqual(superuser.role, RoleChoices.ADMIN)
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)

    @patch("useraccount.services.user_service.UserRepository.get_user_by_email")
    def test_get_user_by_email(self, mock_get_user_by_email):
        mock_user = MagicMock()
        mock_user.email = "test@example.com"
        mock_get_user_by_email.return_value = mock_user

        user = UserService.get_user_by_email("test@example.com")
        self.assertIsNotNone(user)
        self.assertEqual(user.email, "test@example.com")

    @patch("useraccount.services.user_service.UserRepository.get_user_by_email")
    def test_get_non_existent_user_by_email(self, mock_get_user_by_email):
        mock_get_user_by_email.return_value = None
        with self.assertRaises(ValidationError):  # Expecting a ValidationError
            UserService.get_user_by_email("nonexistent@example.com")

    @patch("useraccount.services.user_service.UserRepository.get_user_by_id")
    def test_get_user_by_id(self, mock_get_user_by_id):
        """Test retrieving a user by ID."""
        mock_user = MagicMock()
        mock_user.id = uuid.uuid4()  # Assign a unique UUID for the test
        mock_get_user_by_id.return_value = mock_user

        user = UserService.get_user_by_id(mock_user.id)

        # Assertions
        self.assertIsNotNone(user)  # Ensure a user is returned
        self.assertEqual(user.id, mock_user.id)  # Ensure IDs match

    @patch("useraccount.services.user_service.UserRepository.get_user_by_id")
    def test_get_non_existent_user_by_id(self, mock_get_user_by_id):
        """Test retrieving a non-existent user by ID raises ValidationError."""
        mock_get_user_by_id.return_value = None  # Simulate user not found
        non_existent_id = uuid.uuid4()  # Generate a random user ID

        with self.assertRaises(ValidationError):  # Expect a ValidationError
            UserService.get_user_by_id(non_existent_id)

    @patch("useraccount.services.user_service.UserRepository.update_user")
    @patch("useraccount.services.user_service.UserRepository.get_user_by_id")
    def test_update_user(self, mock_get_user, mock_update_user):
        # Create a mock user
        user = MagicMock()
        user.id = uuid.uuid4()  # Ensure the id is a valid UUID
        user.email = "test@example.com"
        user.full_name = "John Doe"  # Initial full_name

        # Mock the retrieval of the user
        mock_get_user.return_value = user

        # Mock the update action
        mock_update_user.return_value = user
        user.full_name = "Updated Name"  # Update full_name in the mock

        # Call the service method
        updated_user = UserService.update_user(id=user.id, full_name="Updated Name")

        # Assertions
        self.assertEqual(
            updated_user.full_name, "Updated Name"
        )  # Assert the updated name
        mock_get_user.assert_called_once_with(
            user.id
        )  # Ensure the correct user is fetched
        mock_update_user.assert_called_once_with(
            user, full_name="Updated Name"
        )  # Ensure the update was made

    @patch("useraccount.services.user_service.UserRepository.get_user_by_id")
    @patch("useraccount.services.user_service.UserRepository.update_user")
    def test_update_user_password(self, mock_update_user, mock_get_user):
        # Mock the retrieval of user and the password change
        user = MagicMock()
        user.check_password.return_value = True
        user.id = uuid.uuid4()  # Ensure the id is a valid UUID
        mock_get_user.return_value = user
        mock_update_user.return_value = user

        # Call the service method
        updated_user = UserService.update_user_password(
            id=user.id, new_password="newpassword123", old_password="password"
        )

        # Assertions
        user.set_password.assert_called_with("newpassword123")
        self.assertEqual(updated_user, user)

    @patch("useraccount.services.user_service.UserRepository.get_user_by_id")
    def test_set_user_role(self, mock_get_user):
        user = MagicMock()
        user.role = RoleChoices.STUDENT
        user.id = uuid.uuid4()  # Ensure the id is a valid UUID
        mock_get_user.return_value = user

        # Call the service method to set the role
        updated_user = UserService.set_user_role(id=user.id, role=RoleChoices.ADMIN)

        # Assertions
        self.assertEqual(updated_user.role, RoleChoices.ADMIN)

    @patch("useraccount.services.user_service.UserRepository.get_user_by_id")
    def test_set_invalid_user_role(self, mock_get_user):
        user = MagicMock()
        mock_get_user.return_value = user

        # Call the service method with an invalid role
        with self.assertRaises(ValidationError):
            UserService.set_user_role(id=user.id, role="invalid_role")

    @patch("useraccount.services.user_service.UserRepository.get_user_by_id")
    @patch("useraccount.services.user_service.UserRepository.delete_user")
    def test_delete_user(self, mock_delete_user, mock_get_user):
        user = MagicMock()
        user.id = uuid.uuid4()  # Ensure the id is a valid UUID
        mock_get_user.return_value = user

        # Call the service method
        deleted_user = UserService.delete_user(id=user.id)

        # Assertions
        mock_delete_user.assert_called_with(user)
        self.assertEqual(deleted_user, user)

    @patch("useraccount.services.user_service.UserRepository.get_user_by_id")
    def test_deactivate_user(self, mock_get_user):
        user = MagicMock()
        user.is_active = True
        user.id = uuid.uuid4()  # Ensure the id is a valid UUID
        mock_get_user.return_value = user

        # Call the service method to deactivate the user
        deactivated_user = UserService.deactivate_user(id=user.id)

        # Assertions
        self.assertFalse(deactivated_user.is_active)

    @patch("useraccount.services.user_service.UserRepository.get_user_by_id")
    def test_activate_user(self, mock_get_user):
        user = MagicMock()
        user.is_active = False
        user.id = uuid.uuid4()  # Ensure the id is a valid UUID
        mock_get_user.return_value = user

        # Call the service method to activate the user
        activated_user = UserService.activate_user(id=user.id)

        # Assertions
        self.assertTrue(activated_user.is_active)

    @patch("useraccount.services.user_service.UserRepository.list_users")
    def test_list_all_users(self, mock_list_users):
        mock_list_users.return_value = [
            MagicMock(email="user1@example.com", full_name="User One"),
            MagicMock(email="user2@example.com", full_name="User Two"),
        ]

        # Call the service method to list users
        users = UserService.list_all_users()

        # Assertions
        self.assertEqual(len(users), 2)
        self.assertEqual(users[0].email, "user1@example.com")
        self.assertEqual(users[1].email, "user2@example.com")

    @patch("useraccount.services.user_service.UserRepository.filter_users")
    def test_filter_users(self, mock_filter_users):
        mock_filter_users.return_value = [
            MagicMock(email="admin@example.com", role=RoleChoices.ADMIN)
        ]

        # Call the service method to filter users
        users = UserService.filter_users(role=RoleChoices.ADMIN)

        # Assertions
        self.assertEqual(len(users), 1)
        self.assertEqual(users[0].email, "admin@example.com")
        self.assertEqual(users[0].role, RoleChoices.ADMIN)
