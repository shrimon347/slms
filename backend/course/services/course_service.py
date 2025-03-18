from course.repositories import course_repository


class CourseService:
    def __init__(self):
        self.repo = course_repository()

    def get_all_courses(self, category_id: int = None):
        """Get all courses, optionally filtered by category."""
        return self.repo.get_all(category_id)

    def get_course_by_id(self, course_id: int):
        """Get a course by its ID."""
        return self.repo.get_by_id(course_id)

    def create_course(self, **data):
        """Create a new course."""
        return self.repo.create(**data)

    def update_course(self, course_id: int, **data):
        """Update an existing course."""
        return self.repo.update(course_id, **data)

    def delete_course(self, course_id: int):
        """Delete a course."""
        return self.repo.delete(course_id)
