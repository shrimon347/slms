import re
from django.core.exceptions import ValidationError
from datetime import date


# Full Name Validator
def validate_full_name(value):
    if not value:
        raise ValidationError("Full Name is required.")
    if len(value.split()) < 2:  # Ensure at least two words in the name (e.g., First Name + Last Name)
        raise ValidationError("Full Name must contain at least two letters.")
    if not all(word.isalpha() for word in value.split()):  # Ensure each part of the name contains only letters
        raise ValidationError("Full Name must contain only letters.")
    return value


# Email Validator
def validate_email(value):
    if not value:
        raise ValidationError("Email is required.")
    if not re.match(r"[^@]+@[^@]+\.[^@]+", value):
        raise ValidationError("Enter a valid email address.")
    return value


# Role Validator
def validate_role(value):
    from .models import RoleChoices
    if value not in [choice[0] for choice in RoleChoices.choices]:
        raise ValidationError(f"Invalid role. Choose from {', '.join([choice[1] for choice in RoleChoices.choices])}.")
    return value


# Date of Birth Validator
def validate_date_of_birth(value):
    if value:
        today = date.today()
        age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))  # Age calculation with respect to birthdate
        if age < 8:
            raise ValidationError("User must be at least 8 years old.")
        # Ensure date of birth is not set to an invalid "zero" date (like '0000-00-00')
        if value.year == 0 or value.month == 0 or value.day == 0:
            raise ValidationError("Invalid date of birth.")
    return value


# Contact Number Validator
def validate_contact_number(value):
    if value and not re.match(r"^\+?[1-9]\d{1,14}$", value):
        raise ValidationError("Enter a valid contact number.")
    return value


# Profile Picture Validator (size check)
def validate_profile_picture(value):
    if value:
        # Validate that the profile picture size is no greater than 2MB
        if value.size > 2 * 1024 * 1024:  # 2MB limit
            raise ValidationError("Profile picture size must be less than 2MB.")
    return value
