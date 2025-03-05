from rest_framework import serializers
from .models import User

class   UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "user_id", "full_name", "email", "role", "date_of_birth", 
            "contact_number","profile_image_url",
            "created_at", "updated_at", "is_active", "is_staff"
        )