from base64 import urlsafe_b64decode, urlsafe_b64encode

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import DjangoUnicodeDecodeError, force_bytes, smart_str
from rest_framework import serializers
from useraccount.utils import Util
from useraccount.services.user_service import UserService

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
        ]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    # validate password and confirm password while registration
    def validate(self, attrs):
        password = attrs.get("password")
        password2 = attrs.get("password2")
        contact_number = attrs.get("contact_number")

        if password and password2 and password != password2:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )

        # Ensure that the password is provided
        if not password:
            raise serializers.ValidationError({"password": "Password is required."})

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
        """Use the service layer to create a user."""
        return UserService.create_user(**validated_data)


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
