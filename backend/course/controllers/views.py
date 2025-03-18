from course.renderers import UserRenderer
from course.serializers import CourseListSerializer
from course.services.course_service import CourseService
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from useraccount.permissions import IsAdminOrStaff


class CourseListView(APIView):
    """
    retrieve all courses.
    """

    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated, IsAdminOrStaff]

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

