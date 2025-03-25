import os
import re
from datetime import date

from django.core.exceptions import ValidationError
from PIL import Image


# Full Name Validator
def validate_full_name(value):
    if not value:
        raise ValidationError("Full Name is required.")
    if (
        len(value.split()) < 1
    ):  # Ensure at least two words in the name (e.g., First Name + Last Name)
        raise ValidationError("Full Name must contain at least One words.")
    if not all(
        word.isalpha() for word in value.split()
    ):  # Ensure each part of the name contains only letters
        raise ValidationError("Full Name must contain only letters.")
    return value


# Email Validator
def validate_email(value):
    if not value:
        raise ValidationError("Email is required.")
    if not re.match(r"[^@]+@[^@]+\.[^@]+", value):
        raise ValidationError("Enter a valid email address.")
    return value


def validate_password_strength(password):
    """
    Validate that the password meets minimum security requirements.
    """
    if len(password) < 8:
        raise ValidationError("Password must be at least 8 characters long.")

    if not re.search(r"[A-Z]", password):
        raise ValidationError("Password must contain at least one uppercase letter.")

    if not re.search(r"[a-z]", password):
        raise ValidationError("Password must contain at least one lowercase letter.")

    if not re.search(r"[0-9]", password):
        raise ValidationError("Password must contain at least one number.")

    if not re.search(r"[^A-Za-z0-9]", password):
        raise ValidationError("Password must contain at least one special character.")


# Role Validator
def validate_role(value):
    from .models import RoleChoices

    if value not in [choice[0] for choice in RoleChoices.choices]:
        raise ValidationError(
            f"Invalid role. Choose from {', '.join([choice[1] for choice in RoleChoices.choices])}."
        )
    return value


# Date of Birth Validator
def validate_date_of_birth(value):
    if value:
        today = date.today()
        age = (
            today.year
            - value.year
            - ((today.month, today.day) < (value.month, value.day))
        )  # Age calculation with respect to birthdate
        if age < 8:
            raise ValidationError("User must be at least 8 years old.")
        # Ensure date of birth is not set to an invalid "zero" date (like '0000-00-00')
        if value.year == 0 or value.month == 0 or value.day == 0:
            raise ValidationError("Invalid date of birth.")
    return value


# Contact Number Validator
def validate_contact_number(value):
    if value and not re.match(r"^\+?[0-9]\d{1,14}$", value):
        raise ValidationError("Enter a valid contact number(0-9).")
    return value


# accept_terms validator
def accept_terms_check(value):
    if value not in ["True", "False"]:
        return ValidationError(
            "Invalid value for accept_terms, must be 'True' or 'False'."
        )
    return value


# Profile Picture Validator (size check)
def validate_profile_picture(value):
    """
    Securely validate profile picture uploads:
    - Ensure max size of 2MB
    - Allow only specific image types
    - Verify file integrity using Pillow (PIL)
    """

    allowed_extensions = {"jpeg", "jpg", "png", "gif", "bmp"}

    # Validate file size (must be ≤ 2MB)
    if value.size > 2 * 1024 * 1024:  # 2MB limit
        raise ValidationError("Profile picture size must be less than 2MB.")

    # Restrict Large Resolutions (Prevent DoS attacks)
    if img.width > 4096 or img.height > 4096:
        raise ValidationError("Image resolution must not exceed 4096x4096 pixels.")
    # Get file extension
    file_extension = os.path.splitext(value.name)[1].lower().replace(".", "")

    # Ensure the extension is allowed
    if file_extension not in allowed_extensions:
        raise ValidationError(
            "Only image files (JPEG, JPG, PNG, GIF, BMP) are allowed."
        )

    # Verify image integrity using Pillow (PIL)
    try:
        img = Image.open(value)
        img.verify()  # Ensures it's a valid image file
        img = Image.open(value)  # Reopen for additional validation
        img.load()  # Fully load image to detect corrupt files
    except Exception:
        raise ValidationError("Invalid or corrupted image file.")

    return value
