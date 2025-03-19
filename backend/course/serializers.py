from django.utils.text import slugify
from rest_framework import serializers

from .models import Course, CourseCategory, Lesson, Module
from .services import (
    course_category_service,
    course_service,
    lesson_service,
    module_service,
)


class CourseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseCategory
        fields = ["id", "name", "description"]

    def create(self, validated_data):
        """Create a new course category using the service."""
        service = course_category_service()
        return service.create_category(**validated_data)

    def update(self, instance, validated_data):
        """Update an existing course category."""
        service = course_category_service()
        return service.update_category(instance.id, **validated_data)


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ["id", "title", "content", "duration", "order"]

    def create(self, validated_data):
        return lesson_service().create_lesson(**validated_data)

    def update(self, instance, validated_data):
        return lesson_service().update_lesson(instance.id, **validated_data)


class ModuleSerializer(serializers.ModelSerializer):
    lessons = serializers.SerializerMethodField()  # Lazy load only related lessons

    class Meta:
        model = Module
        fields = ["id", "title", "description", "order", "lessons"]

    def get_lessons(self, obj):
        """Return only related lessons for this module"""
        lessons = obj.lessons.all()  # This will return only related lessons
        return LessonSerializer(lessons, many=True).data

    def create(self, validated_data):
        return module_service().create_module(**validated_data)

    def update(self, instance, validated_data):
        return module_service().update_module(instance.id, **validated_data)
    
class ModuleExcludedLessonsSerializer(serializers.ModelSerializer):
    """Serializer for Modules without Lessons"""

    class Meta:
        model = Module
        fields = [
            "title",
            "description",
            "order"
        ]

class CourseDetailSerializer(serializers.ModelSerializer):
    """Serializer for Course with related data"""

    category = serializers.CharField(source="category.name")  # Get category name instead of ID
    modules = ModuleExcludedLessonsSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "category",
            "title",
            "description",
            "course_image_url",
            "price",
            "duration",
            "batch",
            "remaining_seat",
            "start_date",
            "end_date",
            "slug",
            "demo_url",
            "created_at",
            "updated_at",
            "time_remaining",
            "modules",
        ] 


class CourseCreateUpdateSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=CourseCategory.objects.all(), source="category", write_only=True
    )
    category_name = serializers.CharField(
        write_only=True, required=False
    )  # For custom category name

    modules = serializers.SerializerMethodField()  # Lazy loading related modules

    class Meta:
        model = Course
        fields = [
            "id",
            "category",
            "category_id",
            "category_name",
            "title",
            "description",
            "price",
            "duration",
            "demo_url",
            "start_date",
            "end_date",
            "slug",
            "created_at",
            "updated_at",
            "modules",
        ]
        read_only_fields = ["slug", "created_at", "updated_at"]

    def get_modules(self, obj):
        """Return modules as an object, with lessons inside"""
        modules_data = {}
        for module in obj.modules.all():
            modules_data[module.title] = {
                "lessons": LessonSerializer(module.lessons.all(), many=True).data
            }
        return modules_data

    def create(self, validated_data):
        """Create a new course and handle category creation if necessary"""
        category_name = validated_data.get("category_name", None)
        if category_name:
            # Check if category exists case-insensitively, if not create it
            category, created = CourseCategory.objects.get_or_create(
                name__iexact=category_name
            )
            validated_data["category"] = category

        validated_data["slug"] = slugify(validated_data["title"])
        return course_service().create_course(
            category_id=validated_data.pop("category_id", None), **validated_data
        )

    def update(self, instance, validated_data):
        """Update an existing course, and handle category update if necessary"""
        category_name = validated_data.get("category_name", None)
        if category_name:
            # Check if category exists case-insensitively, if not create it
            category, created = CourseCategory.objects.get_or_create(
                name__iexact=category_name
            )
            validated_data["category"] = category

        validated_data["slug"] = slugify(validated_data.get("title", instance.title))
        return course_service().update_course(
            instance.id,
            category_id=validated_data.pop("category_id", None),
            **validated_data
        )


class CourseListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = fields = [
            "id",
            "title",
            "remaining_seat",
            "time_remaining",
            "start_date",
            "end_date",
            "batch",
            "slug",
            "course_image_url",
        ]
