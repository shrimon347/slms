from django.shortcuts import get_object_or_404
from course.models import Bannerdata, CourseClass, Lesson, MCQQuestion, Module, Option, Quiz, QuizResult
from course.renderers import CourseRenderer
from course.serializers import (
    BannerdataSerializer,
    CourseCategorySerializer,
    CourseClassSerializer,
    CourseCreateUpdateSerializer,
    CourseDetailSerializer,
    CourseEnrollmentSerializer,
    CourseListSerializer,
    EnrollmentModuleLessonSerializer,
    MCQQuestionSerializer,
    QuizDetailSerializer,
    QuizResultSerializer,
    QuizResultShowSerializer,
    QuizSerializer,
)
from course.services.course_category_service import CourseCategoryService
from course.services.course_service import CourseService
from course.services.lesson_service import LessonService
from course.services.quiz_service import QuizService
from course.services.student_progress_service import StudentProgressService
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from payment.models import Enrollment
from payment.services.enrollment_service import EnrollmentService
from rest_framework import status
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from useraccount.permissions import IsAdminOrStaff, IsStudent
from useraccount.renderers import UserRenderer


class CourseCategoryListView(APIView):
    """
    category list view
    """

    renderer_classes = [UserRenderer]
    permission_classes = [AllowAny]

    def get(self, request):
        allCategory = CourseCategoryService.get_all_categories()
        if not allCategory:
            return Response(
                {"error": "Course Category not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = CourseCategorySerializer(allCategory, many=True)
        category = serializer.data
        return Response({"category": category}, status=status.HTTP_200_OK)


class CourseCreateUpdateAPIView(APIView):
    """
    API View to handle Course Creation, Update, and Deletion.
    """

    permission_classes = [IsAuthenticated, IsAdminOrStaff]
    renderer_classes = [UserRenderer]

    def post(self, request):
        """Create a new course."""
        serializer = CourseCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            course = serializer.save()
            return Response(
                {"message": "Course created successfully!", "course": serializer.data},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, course_id):
        """Update an existing course."""
        try:
            course = CourseService.get_course_by_id(course_id)
        except course.DoesNotExist:
            return Response(
                {"error": "Course not found."}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = CourseCreateUpdateSerializer(
            course, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Course updated successfully!", "course": serializer.data}
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, course_id):
        """Delete an existing course."""
        try:
            course = CourseService.get_course_by_id(course_id)
            course.delete()
            return Response(
                {"message": "Course deleted successfully!"},
                status=status.HTTP_204_NO_CONTENT,
            )
        except course.DoesNotExist:
            return Response(
                {"error": "Course not found."}, status=status.HTTP_404_NOT_FOUND
            )


class CourseListView(APIView):
    """
    retrieve all courses.
    """

    renderer_classes = [CourseRenderer]
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            category_name = request.query_params.get("category", None)

            if category_name:
                courses = CourseService.get_all_courses_by_category_name(category_name)
            else:
                courses = CourseService.get_all_courses()

            serializer = CourseListSerializer(courses, many=True)
            courses = serializer.data
            return Response({"courses": courses}, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response(
                {"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            # Log the exception for debugging purposes
            # logger.error(f"An error occurred: {str(e)}")
            return Response(
                {"error": "An internal server error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class CourseDetailView(APIView):
    """
    Retrieve single course details.
    """

    renderer_classes = [CourseRenderer]
    permission_classes = [AllowAny]

    def get(self, request, slug):
        try:
            course = CourseService.get_course_by_slug(slug)
            serializer = CourseDetailSerializer(course, context={"request": request})
            data = serializer.data
            return Response({"course": data}, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response(
                {"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class CourseEnrollmentModuleLessonView(APIView):
    """
    course all module and lessons are shows
    """

    permission_classes = [IsAuthenticated, IsStudent]
    renderer_classes = [UserRenderer]

    def get(self, request, enrollment_id):
        course = EnrollmentService.get_enrolled_course(enrollment_id, request.user)

        if not course:
            return Response(
                {"error": "Enrollment not found."}, status=status.HTTP_404_NOT_FOUND
            )

        # Serialize the course with modules and lessons
        serializer = CourseEnrollmentSerializer(course, context={"user": request.user})
        return Response({"course_enroll": serializer.data}, status=status.HTTP_200_OK)


class EnrollmentCourseLessonView(APIView):
    """
    Enrollemnt course all module and lesson without quiz
    """

    permission_classes = [IsAuthenticated, IsStudent]
    renderer_classes = [UserRenderer]

    def get(self, request, enrollment_id):
        enrollment = EnrollmentService.get_enrollment_details(enrollment_id)

        if not enrollment:
            return Response(
                {"error": "Enrollment not found."}, status=status.HTTP_404_NOT_FOUND
            )

        course = enrollment.course
        modules = course.modules.prefetch_related("lessons").all()
        serializer = EnrollmentModuleLessonSerializer(modules, many=True)
        return Response({"modules": serializer.data}, status=status.HTTP_200_OK)


class CompleteLessonAPIView(APIView):
    """
    Complete the lesson and update progress.
    """

    permission_classes = [IsAuthenticated, IsStudent]
    renderer_classes = [UserRenderer]

    def post(self, request, lesson_id, enrollment_id):
        try:
            # Ensure the student is enrolled with the provided enrollment_id
            if not Enrollment.objects.filter(
                student=request.user, id=enrollment_id, payment_status="success"
            ).exists():
                return Response(
                    {
                        "error": "You must be enrolled in the course to complete this lesson."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Get the lesson by ID
            lesson = LessonService.get_lesson_by_id(lesson_id)

            # Mark the lesson as completed
            StudentProgressService.complete_lesson(request.user, lesson)

            return Response(
                {
                    "message": "Lesson completed!",
                },
                status=status.HTTP_200_OK,
            )
        except Lesson.DoesNotExist:
            return Response(
                {"error": "Lesson not found!"}, status=status.HTTP_404_NOT_FOUND
            )


class MCQQuestionAPIView(APIView):

    def post(self, request, quiz_id):
        try:
            # Check if the quiz exists
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            raise NotFound(detail="Quiz not found")

        # Get the data from the request
        question_text = request.data.get("question_text")
        correct_option_index = request.data.get("correct_option_index")
        Options_data = request.data.get("Options")

        if not question_text or not correct_option_index or len(Options_data) != 4:
            raise ValidationError(
                "Each question must have a question text, a correct Option index, and exactly 4 Options."
            )

        # Create the question and Options in a transaction to ensure atomicity
        try:
            with transaction.atomic():
                # Create the MCQ Question first, which will have an ID after saving
                question = MCQQuestion.objects.create(
                    quiz=quiz,
                    question_text=question_text,
                    correct_option_index=correct_option_index,
                )

                # Now create the related Options after the question is saved and has an ID
                for idx, (option_text, is_correct) in enumerate(Options_data):
                    Option.objects.create(
                        question=question,
                        option_text=option_text,
                        order=idx + 1,
                        is_correct=is_correct,
                    )

            # Serialize and return the newly created question and Options
            serializer = MCQQuestionSerializer(question)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            raise ValidationError(f"Error creating question: {str(e)}")

    def put(self, request, question_id):
        try:
            # Check if the question exists
            question = MCQQuestion.objects.get(id=question_id)
        except MCQQuestion.DoesNotExist:
            raise NotFound(detail="Question not found")

        # Get the data from the request
        question_text = request.data.get("question_text")
        correct_option_index = request.data.get("correct_option_index")
        Options_data = request.data.get("Options")

        if not question_text or not correct_option_index or len(Options_data) != 4:
            raise ValidationError(
                "Each question must have a question text, a correct Option index, and exactly 4 Options."
            )

        # Update the question and Options in a transaction to ensure atomicity
        try:
            with transaction.atomic():
                # Update the question itself
                question.question_text = question_text
                question.correct_option_index = correct_option_index
                question.save()

                # Update the Options
                for idx, (option_text, is_correct) in enumerate(Options_data):
                    Option = question.Options.get(order=idx + 1)
                    Option.option_text = option_text
                    Option.is_correct = is_correct
                    Option.save()

            # Serialize and return the updated question and Options
            serializer = MCQQuestionSerializer(question)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            raise ValidationError(f"Error updating question: {str(e)}")

    def delete(self, request, question_id):
        try:
            # Check if the question exists
            question = MCQQuestion.objects.get(id=question_id)
        except MCQQuestion.DoesNotExist:
            raise NotFound(detail="Question not found")

        # Delete the question and related Options in a transaction to ensure atomicity
        try:
            with transaction.atomic():
                question.Options.all().delete()  # Delete all Options associated with the question
                question.delete()  # Delete the question itself
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            raise ValidationError(f"Error deleting question: {str(e)}")

    def get(self, request, quiz_id):
        try:
            # Check if the quiz exists
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            raise NotFound(detail="Quiz not found")

        # Get all questions for the quiz
        questions = quiz.questions.all()
        serializer = MCQQuestionSerializer(questions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class QuizCreateAPIView(APIView):

    def post(self, request):
        module_id = request.data.get("module_id")
        title = request.data.get("title")
        total_questions = request.data.get("total_questions")
        passing_score = request.data.get("passing_score")
        time_limit = request.data.get("time_limit", 10 * 60)  # Default to 10 minutes

        # Validate module existence
        try:
            module = Module.objects.get(id=module_id)
        except Module.DoesNotExist:
            return Response(
                {"detail": "Module not found."}, status=status.HTTP_400_BAD_REQUEST
            )

        quiz = Quiz.objects.create(
            module=module,
            title=title,
            total_questions=total_questions,
            passing_score=passing_score,
            time_limit=time_limit,
        )

        serializer = QuizDetailSerializer(quiz)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class QuizListAPIView(APIView):

    def get(self, request):
        quizzes = Quiz.objects.all()
        serializer = QuizDetailSerializer(quizzes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class EnrolledCourseQuizView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request, enrollment_id, module_id):
        """Get quizzes for a course in which the user is enrolled."""
        try:
            # Fetch quizzes for the specific module using the service layer
            quizzes = QuizService.get_quizzes_for_enrolled_course_module(
                enrollment_id, module_id, request.user
            )
            # Serialize the quizzes
            serializer = QuizDetailSerializer(
                quizzes, many=True, context={"user": request.user}
            )

            quizzes = serializer.data
            return Response({"quizzes": quizzes}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(
                {"error": "An unexpected error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class QuizUpdateAPIView(APIView):

    def put(self, request, quiz_id):
        try:
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            return Response(
                {"detail": "Quiz not found."}, status=status.HTTP_404_NOT_FOUND
            )

        quiz.title = request.data.get("title", quiz.title)
        quiz.total_questions = request.data.get("total_questions", quiz.total_questions)
        quiz.passing_score = request.data.get("passing_score", quiz.passing_score)
        quiz.time_limit = request.data.get("time_limit", quiz.time_limit)

        quiz.save()
        serializer = QuizDetailSerializer(quiz)
        return Response(serializer.data, status=status.HTTP_200_OK)


class QuizDeleteAPIView(APIView):

    def delete(self, request, quiz_id):
        try:
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            return Response(
                {"detail": "Quiz not found."}, status=status.HTTP_404_NOT_FOUND
            )

        quiz.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class SubmitQuiz(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user

        # Validate the incoming data using the serializer
        serializer = QuizResultSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )

        # Extract validated data
        quiz_id = serializer.validated_data["quiz_id"]
        selected_options = serializer.validated_data["selected_options"]

        try:
            # Call the service layer to handle quiz submission
            result = QuizService.submit_quiz(user, quiz_id, selected_options)
            # Return the response
            return Response(
                {
                    "success": True,
                    "message": "Quiz submitted successfully",
                    "quiz_result_id": result["quiz_result_id"],
                    "submitted": result["submitted"],
                },
                status=status.HTTP_200_OK,
            )
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class QuizResultDetailView(APIView):
    permission_classes = [
        IsAuthenticated,
        IsStudent,
    ]  # Ensure only authenticated users can access

    def get(self, request, enrollment_id, module_id, quiz_result_id, *args, **kwargs):
        """
        Retrieve a specific QuizResult for the authenticated user.
        The `enrollment_id` and `module_id` are required to validate permissions.
        """
        try:
            quiz_result = (
                QuizResult.objects.select_related("quiz")
                .prefetch_related("quiz__questions__options")
                .get(
                    id=quiz_result_id,
                    student=request.user,
                    quiz__module_id=module_id,  # Ensure the quiz belongs to the specified module
                    quiz__module__course__enrollments__id=enrollment_id,  # Ensure the user is enrolled in the course
                )
            )
        except QuizResult.DoesNotExist:
            raise NotFound(
                "Quiz result not found or you do not have permission to view it."
            )

        # Serialize the QuizResult object
        serializer = QuizResultShowSerializer(
            quiz_result,
        )

        # Return the serialized data as a response
        return Response({"quiz_result": serializer.data}, status=status.HTTP_200_OK)

class EnrollmentClassContentView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request, enrollment_id):
        # Get enrollment for the current user
        enrollment = get_object_or_404(Enrollment, id=enrollment_id, student=request.user)

        # Get all course classes related to the enrolled course
        classes = CourseClass.objects.filter(course=enrollment.course).prefetch_related('recordings', 'resources')

        serializer = CourseClassSerializer(classes, many=True)
        return Response(serializer.data)
    
class BannerdataListAPIView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        banners = Bannerdata.objects.all()
        serializer = BannerdataSerializer(banners, many=True, context={"request": request})
        return Response({"banners": serializer.data}, status=status.HTTP_200_OK)