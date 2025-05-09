import uuid

from django.conf import settings
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models

from .validators import *


class RoleChoices(models.TextChoices):
    STUDENT = "student", "Student"
    INSTRUCTOR = "instructor", "Instructor"
    ADMIN = "admin", "Admin"


class CustomUserManager(BaseUserManager):
    def create_user(
        self, email, full_name=None, password=None, password2=None, **extra_fields
    ):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, **extra_fields)
        # Hash the password before saving the user
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        # Set role to 'ADMIN' for superuser
        extra_fields.setdefault("role", RoleChoices.ADMIN)
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(
            email, full_name="Admin", password=password, **extra_fields
        )


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    full_name = models.CharField(max_length=255, validators=[validate_full_name])
    email = models.EmailField(unique=True, validators=[validate_email])
    role = models.CharField(
        max_length=10,
        choices=RoleChoices.choices,
        default=RoleChoices.STUDENT,
        validators=[validate_role],
    )
    date_of_birth = models.DateField(
        null=True, blank=True, validators=[validate_date_of_birth]
    )
    contact_number = models.CharField(
        max_length=20,
        unique=True,
        validators=[validate_contact_number],
    )
    profile_picture = models.ImageField(
        upload_to="uploads/avatars",
        null=True,
        blank=True,
        validators=[validate_profile_picture],
    )
    accept_terms = models.BooleanField(default=False, validators=[accept_terms_check])
    otp = models.CharField(
        max_length=6, blank=True, null=True
    )  # OTP for email verification
    is_verified = models.BooleanField(default=False)  # Email verification flag
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Required for AbstractBaseUser
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    def profile_image_url(self):
        if self.profile_picture:
            return f"{settings.WEBSITE_URL}{self.profile_picture.url}"
        else:
            return ""


class Instructor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="instructor_profile")
    bio = models.TextField(blank=True, null=True)
    expertise = models.CharField(max_length=255, blank=True)
    linkedin = models.URLField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if self.user.role != RoleChoices.INSTRUCTOR:
            raise ValidationError("Assigned user must have role 'instructor'.")

    def save(self, *args, **kwargs):
        self.full_clean() 
        super().save(*args, **kwargs)

    def __str__(self):
        return self.user.full_name
