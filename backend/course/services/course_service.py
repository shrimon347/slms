from course.repositories.course_repository import CourseRepository


class CourseService:
    @staticmethod
    def get_all_courses():
        """Get all courses, optionally filtered by category."""
        return CourseRepository.get_all_courses()

    @staticmethod
    def get_all_courses_by_category_name(category_name: str):
        """Get all courses, optionally filtered by category."""
        return CourseRepository.get_courses_by_category_name(category_name)

    @staticmethod
    def get_course_by_id(course_id: int):
        """Get a course by its ID."""
        return CourseRepository.get_courses_by_id(course_id)

    @staticmethod
    def get_course_by_slug(slug):
        """Get a course by its ID."""
        return CourseRepository.get_courses_by_slug(slug)

    @staticmethod
    def create_course(**data):
        """Create a new course."""
        return CourseRepository.create(**data)

    @staticmethod
    def update_course(course_id: int, **data):
        """Update an existing course."""
        return CourseRepository.update(course_id, **data)

    @staticmethod
    def delete_course(course_id: int):
        """Delete a course."""
        return CourseRepository.delete(course_id)
