import uuid

from django.forms import ValidationError
from django.utils.text import slugify
from rest_framework import serializers

from .models import (
    Option,
    Course,
    CourseCategory,
    Lesson,
    MCQQuestion,
    Module,
    Quiz,
    StudentProgress,
)
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

class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ["id", "title", "total_questions", "passing_score", "time_limit"]

class ModuleSerializer(serializers.ModelSerializer):
    lessons = serializers.SerializerMethodField()  # Lazy load only related lessons
    quiz = QuizSerializer(read_only=True)

    class Meta:
        model = Module
        fields = ["id", "title", "description", "order", "lessons", "quiz"]

    def get_lessons(self, obj):
        """Return only related lessons for this module"""
        lessons = obj.lessons.all().order_by(
            "order"
        )  # This will return only related lessons
        return LessonSerializer(lessons, many=True).data

    def create(self, validated_data):
        return module_service().create_module(**validated_data)

    def update(self, instance, validated_data):
        return module_service().update_module(instance.id, **validated_data)


class ModuleExcludedLessonsSerializer(serializers.ModelSerializer):
    """Serializer for Modules without Lessons"""

    class Meta:
        model = Module
        fields = ["title", "description", "order"]


class CourseDetailSerializer(serializers.ModelSerializer):
    """Serializer for Course with related data"""

    category = serializers.CharField(
        source="category.name"
    )  # Get category name instead of ID
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


from django.utils.text import slugify
from rest_framework import serializers

from .models import Course, CourseCategory


class CourseCreateUpdateSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        write_only=True, required=True
    )  # To handle category creation if it doesn't exist

    class Meta:
        model = Course
        fields = [
            "id",
            "category_name",  # To create or retrieve category by name
            "title",
            "description",
            "price",
            "duration",
            "batch",
            "remaining_seat",
            "start_date",
            "end_date",
            "slug",  # Slug for the course, auto-generated if not provided
            "demo_url",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["slug", "created_at", "updated_at"]

    def create(self, validated_data):
        """Create a new course and handle category creation."""
        category_name = validated_data.pop("category_name", None)

        # Ensure the category exists or create it
        category, created = CourseCategory.objects.get_or_create(
            name__iexact=category_name, defaults={"name": category_name}
        )
        validated_data["category"] = category

        validated_data["slug"] = slugify(
            validated_data["title"]
        )  # Ensure a slug is created
        return Course.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """Update an existing course, and handle category update if necessary."""
        category_name = validated_data.pop("category_name", None)

        if category_name:
            category, created = CourseCategory.objects.get_or_create(
                name__iexact=category_name, defaults={"name": category_name}
            )
            validated_data["category"] = category

        new_slug = slugify(validated_data.get("title", instance.title))

        # Check if the new slug already exists (and not for the current instance)
        if Course.objects.filter(slug=new_slug).exclude(id=instance.id).exists():
            raise ValidationError(
                "The slug generated from the title is already in use. Please change the title."
            )

        # Assign the new slug
        validated_data["slug"] = new_slug

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


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


class CourseEnrollmentSerializer(serializers.ModelSerializer):
    modules = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ["id", "title", "description", "modules"]

    def get_modules(self, course):
        """Only return modules related to the enrolled student's course"""
        modules = course.modules.prefetch_related("lessons").all()
        return ModuleSerializer(modules, many=True).data

class EnrollmentModuleLessonSerializer(serializers.ModelSerializer):
    lessons = serializers.SerializerMethodField()

    class Meta:
        model = Module
        fields = ["id", "title", "lessons", "order"]  # Include only module ID, title, and lessons

    def get_lessons(self, module):
        """Return only the lessons related to this module."""
        lessons = module.lessons.all().order_by("order")  # Fetch lessons in order
        return LessonSerializer(lessons, many=True).data


class CourseProgressSerializer(serializers.ModelSerializer):
    lesson_id = serializers.CharField(source="lesson.id", read_only=True)
    quiz_id = serializers.CharField(source="quiz.id", read_only=True)

    class Meta:
        model = Course
        fields = ["id", "title", "progress"]


class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ["id", "option_text", "order", "is_correct"]


class MCQQuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)

    class Meta:
        model = MCQQuestion
        fields = ["id", "question_text", "correct_option_index", "options"]


class QuizSerializer(serializers.ModelSerializer):
    questions = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = ["id", "title", "total_questions", "passing_score", "time_limit", "questions"]

    def get_questions(self, quiz):
        """Return all questions with their options."""
        questions = quiz.questions.prefetch_related("options").all()
        return MCQQuestionSerializer(questions, many=True).data

