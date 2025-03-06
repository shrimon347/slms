from rest_framework import serializers

from useraccount.services.user_service import UserService

from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "full_name",
            "email",
            "role",
            "date_of_birth",
            "contact_number",
            "profile_image_url", 
        )

class UserRegistrationSerializer(serializers.ModelSerializer):
     # We are writing this becoz we need confirm password field in our Registratin Request
    password2 = serializers.CharField(style={'input_type':'password'}, write_only=True)
    contact_number = serializers.CharField(required=True)
    class Meta:
        model = User
        fields = (
            "full_name",
            "email",
            "password",
            "password2",
            "date_of_birth",
            "contact_number",
            "profile_picture"
        )
        extra_kwargs = {
            "password": {"write_only": True},
        }

        #validate password and confirm password while registration
        def validate(self, attrs):
            password = attrs.get("password")
            password2 = attrs.get("password2")
            contact_number = attrs.get("contact_number")
            
            if password and password2 and password != password2:
                raise serializers.ValidationError({"password": "Password fields didn't match."})
            
              # Validate contact number
            if not contact_number:
                raise serializers.ValidationError({"contact_number": "Contact number is required."})
            
            # Optionally, add more validation logic (e.g., check format for contact_number)
            if len(contact_number) < 10:
                raise serializers.ValidationError({"contact_number": "Contact number should be at least 10 digits."})


            return attrs
        def create(self, validated_data):
            """Use the service layer to create a user."""
            validated_data.pop("password2")
            return UserService.create_user(**validated_data)
        
class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("email", "password")