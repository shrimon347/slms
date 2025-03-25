import random
from base64 import urlsafe_b64decode, urlsafe_b64encode

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.exceptions import ValidationError
from django.utils.encoding import DjangoUnicodeDecodeError, force_bytes, smart_str
from rest_framework import serializers
from useraccount.services.user_service import UserService
from useraccount.utils import Util
from useraccount.validators import validate_password_strength

from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "full_name",
            "email",
            "role",
            "date_of_birth",
            "contact_number",
            "profile_image_url",
        ]


class UserRegistrationSerializer(serializers.ModelSerializer):
    # We are writing this becoz we need confirm password field in our Registratin Request
    password2 = serializers.CharField(style={"input_type": "password"}, write_only=True)
    accept_terms = serializers.BooleanField()

    class Meta:
        model = User
        fields = [
            "full_name",
            "email",
            "password",
            "password2",
            "date_of_birth",
            "contact_number",
            "profile_picture",
            "accept_terms",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    # validate password and confirm password while registration
    def validate(self, attrs):
        password = attrs.get("password")
        password2 = attrs.get("password2")
        contact_number = attrs.get("contact_number")
        accept_terms = attrs.get("accept_terms")

        if not accept_terms:
            raise serializers.ValidationError(
                {"accept_terms": "You must accepted the terms & conditions"}
            )

        if password and password2 and password != password2:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )

        # Ensure that the password is provided
        if not password:
            raise serializers.ValidationError({"password": "Password is required."})

        # Apply custom password validation
        try:
            validate_password_strength(password)
        except ValidationError as e:
            raise serializers.ValidationError({"password": str(e)})

        # Validate contact number
        if not contact_number:
            raise serializers.ValidationError(
                {"contact_number": "Contact number is required."}
            )

        # Optionally, add more validation logic (e.g., check format for contact_number)
        if len(contact_number) < 10:
            raise serializers.ValidationError(
                {"contact_number": "Contact number should be at least 10 digits."}
            )

        return attrs

    def create(self, validated_data):
        """Create user, generate OTP, and send verification email."""
        otp = str(random.randint(100000, 999999))  # genrate otp
        validated_data["otp"] = otp
        validated_data["is_verified"] = False  # ensure new users are unverified

        """Use the service layer to create a user."""
        user = UserService.create_user(**validated_data)
        body = f"Your OTP for email verification is {otp}"
        data = {
            "subject": "Verify Your Email",
            "body": body,
            "to_email": user.email,
        }
        Util.send_email(data)
        return user


class UserOtpVerifySerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    otp = serializers.CharField(max_length=6)

    def validate(self, data):
        try:
            user = UserService.get_user_by_email(email=data["email"])
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found.")
        if user.otp != data["otp"]:
            raise serializers.ValidationError("Invalid OTP.")

        # Mark user as verified
        user.is_verified = True
        user.otp = None  # Clear OTP after verification
        user.save()
        return data


class ResendOtpSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)

    def validate(self, data):
        try:
            user = UserService.get_user_by_email(email=data["email"])
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found.")

        if user.is_verified:
            raise serializers.ValidationError("User is already verified.")
        return data

    def resend_otp(self, validated_data):
        try:
            user = UserService.get_user_by_email(email=validated_data["email"])
            new_otp = str(random.randint(100000, 999999))

            user.otp = new_otp
            user.save()
            body = f"Your OTP for email verification is {new_otp}"
            data = {
                "subject": "Verify Your Email",
                "body": body,
                "to_email": user.email,
            }
            Util.send_email(data)
            return user
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found.")


class UserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)

    class Meta:
        model = User
        fields = ["email", "password"]


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "full_name",
            "email",
            "date_of_birth",
            "contact_number",
            "profile_picture",
            "profile_image_url",
        ]
        read_only_fields = ["email", "id"]

    # validate data for update profile data
    def update(self, instance, validated_data):
        """
        Update the user profile with the provided data.
        This allows partial updates.
        """
        id = instance.id
        updated_user = UserService.update_user(id, **validated_data)
        return updated_user


class UserChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(
        max_length=255, style={"input_type": "password"}, write_only=True
    )
    password2 = serializers.CharField(
        max_length=255, style={"input_type": "password"}, write_only=True
    )

    class Meta:
        fields = ["password", "password2"]

    def validate(self, attrs):
        password = attrs.get("password")
        password2 = attrs.get("password2")
        user = self.context.get("user")
        if password != password2:
            raise serializers.ValidationError(
                "Password and Confirm Password doesn't match"
            )
        user.set_password(password)
        user.save()
        return attrs


class SendPasswordResetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)

    class Meta:
        fields = ["email"]

    def validate(self, attrs):
        email = attrs.get("email")
        if UserService.filter_users(email=email).exists():
            user = UserService.get_user_by_email(email=email)
            uid = smart_str(urlsafe_b64encode(force_bytes(user.id)))
            print("Encoded UID", uid)
            token = PasswordResetTokenGenerator().make_token(user)
            print("Password Reset Token", token)
            link = "http://localhost:5173/api/v1/user/reset/" + uid + "/" + token
            print("password reset link", link)
            # Send EMail
            body = "Click Following Link to Reset Your Password " + link
            data = {
                "subject": "Reset Your Password",
                "body": body,
                "to_email": user.email,
            }
            Util.send_email(data)
            return attrs
        else:
            raise serializers.ValidationError("You are not a Registered User")


class UserPasswordResetSerializer(serializers.Serializer):
    password = serializers.CharField(
        max_length=255, style={"input_type": "password"}, write_only=True
    )
    password2 = serializers.CharField(
        max_length=255, style={"input_type": "password"}, write_only=True
    )

    class Meta:
        fields = ["password", "password2"]

    def validate(self, attrs):

        password = attrs.get("password")
        password2 = attrs.get("password2")
        uid = self.context.get("uid")
        token = self.context.get("token")
        if password != password2:
            raise serializers.ValidationError(
                "Password and Confirm Password doesn't match"
            )
        try:
            # Decode the UID
            user_id = smart_str(urlsafe_b64decode(uid))
            user = UserService.get_user_by_id(user_id)

            # Check if user exists
            if not user:
                raise serializers.ValidationError({"uid": "Invalid user ID."})

            # Validate the token
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise serializers.ValidationError(
                    {"token": "Token is not valid or has expired."}
                )

            # Update user's password
            user.set_password(password)
            user.save()

        except DjangoUnicodeDecodeError:
            raise serializers.ValidationError({"uid": "Invalid UID format."})

        return attrs
