from unittest.mock import patch
from django.core.management import call_command
from django.db.utils import OperationalError
from django.test import SimpleTestCase


@patch('core.management.commands.wait_for_db.Command.check')
class CommandTests(SimpleTestCase):
    """Test custom Django management commands."""

    def test_wait_for_db_when_ready(self, patched_check):
        """Test that the command runs successfully when the database is available."""
        patched_check.return_value = True

        call_command('wait_for_db')

        # Verify check was called once with the expected argument
        patched_check.assert_called_once_with(databases=['default'])

    @patch('time.sleep')
    def test_wait_for_db_retries_on_error(self, patched_sleep, patched_check):
        """Test that the command retries when the database is unavailable."""
        patched_check.side_effect = [OperationalError] * 5 + [True]

        call_command('wait_for_db')

        # Assert check was called 6 times (5 retries and then success)
        self.assertEqual(patched_check.call_count, 6)
        
        # Ensure the check was called with the correct argument
        patched_check.assert_called_with(databases=['default'])

        # Verify that time.sleep was called during retries
        patched_sleep.assert_called()
