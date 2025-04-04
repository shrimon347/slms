import uuid

from django.forms import ValidationError
from django.utils.text import slugify
from rest_framework import serializers
from useraccount.models import User

from .models import (
    Course,
    CourseCategory,
    Lesson,
    MCQQuestion,
    Module,
    Option,
    Quiz,
    QuizResult,
)
from .services import course_category_service, lesson_service, module_service


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


class QuizResultForEnrollment(serializers.ModelSerializer):
    class Meta:
        model = QuizResult
        fields = ["id","obtained_marks", "total_marks", "submitted", "submission_time"]


class QuizSerializer(serializers.ModelSerializer):

    class Meta:
        model = Quiz
        fields = ["id", "title", "total_questions", "passing_score", "time_limit"]


class ModuleSerializer(serializers.ModelSerializer):
    lessons = serializers.SerializerMethodField()  # Lazy load only related lessons
    quiz = QuizSerializer(read_only=True)
    quiz_result = serializers.SerializerMethodField()

    class Meta:
        model = Module
        fields = [
            "id",
            "title",
            "description",
            "order",
            "lessons",
            "quiz",
            "quiz_result",
        ]

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

    def get_quiz_result(self, module):
        user_email = self.context.get("user_email")
        if not user_email:
            return None  # Return None if no user email is present

        # Fetch the user object from the database using the email
        try:
            user = User.objects.get(email=user_email)
        except User.DoesNotExist:
            return None  # Return None if the user does not exist

        # Fetch the quiz result for the current user and module's quiz
        quiz_result = QuizResult.objects.filter(student=user, quiz=module.quiz).first()

        # Serialize the quiz result if it exists, otherwise return None
        return QuizResultForEnrollment(quiz_result).data if quiz_result else None


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
        user = self.context.get("user")
        modules = course.modules.prefetch_related("lessons").all()
        context = {"user_email": user.email} if user and user.is_authenticated else {}
        serialized_data = ModuleSerializer(modules, many=True, context=context).data
        return serialized_data


class EnrollmentModuleLessonSerializer(serializers.ModelSerializer):
    lessons = serializers.SerializerMethodField()

    class Meta:
        model = Module
        fields = [
            "id",
            "title",
            "lessons",
            "order",
        ]  # Include only module ID, title, and lessons

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


class QuizDetailSerializer(serializers.ModelSerializer):
    questions = serializers.SerializerMethodField()
    result = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = [
            "id",
            "title",
            "total_questions",
            "passing_score",
            "time_limit",
            "questions",
            "result"
        ]

    def get_questions(self, quiz):
        """Return all questions with their options."""
        questions = quiz.questions.prefetch_related("options").all()
        return MCQQuestionSerializer(questions, many=True).data
    def get_result(self, quiz):
        """
        Return the quiz result for the current user if the quiz has been submitted.
        """
        user = self.context.get("user")  # Get the current user from the context
        # print(user)
        if not user or not user.is_authenticated:
            return None 
        try:
            # Fetch the quiz result for the user and quiz
            quiz_result = QuizResult.objects.get(
                student=user, quiz=quiz, submitted=True
            )
            return {
                "quiz_result_id": quiz_result.id,
                "submitted": quiz_result.submitted,
            }
        except QuizResult.DoesNotExist:
            return None 


class QuizResultSerializer(serializers.Serializer):
    quiz_id = serializers.IntegerField(required=True)
    selected_options = serializers.DictField(
        child=serializers.IntegerField(), required=True
    )
    id = serializers.IntegerField(read_only=True)

    def validate_quiz_id(self, value):
        """Ensure the quiz ID exists."""
        if not Quiz.objects.filter(id=value).exists():
            raise serializers.ValidationError("Invalid quiz ID.")
        return value

    def validate_selected_options(self, value):
        """Ensure selected options are valid."""
        if not isinstance(value, dict):
            raise serializers.ValidationError("Selected options must be a dictionary.")

        # Ensure all question IDs exist in the quiz
        quiz_id = self.initial_data.get("quiz_id")
        quiz_questions = MCQQuestion.objects.filter(quiz_id=quiz_id).values_list(
            "id", flat=True
        )

        for question_id in value.keys():
            if int(question_id) not in quiz_questions:
                raise serializers.ValidationError(f"Invalid question ID: {question_id}")

        return value


class QuizResultShowSerializer(serializers.ModelSerializer):
    quiz = QuizDetailSerializer(read_only=True)  

    class Meta:
        model = QuizResult
        fields = [
            "obtained_marks",
            "total_marks",
            "submitted",
            "submission_time",
            "selected_options",
            "quiz",  
        ]
