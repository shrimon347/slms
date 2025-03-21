from course.renderers import CourseRenderer
from course.serializers import (
    CourseDetailSerializer,
    CourseEnrollmentSerializer,
    CourseListSerializer,
)
from course.services.course_service import CourseService
from django.core.exceptions import ObjectDoesNotExist
from payment.services.enrollment_service import EnrollmentService
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from useraccount.permissions import IsAdminOrStaff, IsStudent
from useraccount.renderers import UserRenderer


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
    retrieve single courses details.
    """

    renderer_classes = [CourseRenderer]
    permission_classes = [AllowAny]

    def get(self, request, slug):
        try:
            course = CourseService.get_course_by_slug(slug)
            serializer = CourseDetailSerializer(course)
            data = serializer.data
            return Response({"course": data}, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response(
                {"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            # Log the exception for debugging purposes
            # logger.error(f"An error occurred: {str(e)}")
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
        serializer = CourseEnrollmentSerializer(course)
        return Response({'course-enroll': serializer.data}, status=status.HTTP_200_OK)
