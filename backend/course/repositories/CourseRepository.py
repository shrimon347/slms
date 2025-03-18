from course.models import Course


class CourseRepository:
    def get_by_id(self, course_id: int):
        """Retrieve a single course by ID."""
        try:
            return Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return None

    def get_all(self, category_id: int = None):
        """Retrieve all courses, optionally filtered by category."""
        if category_id:
            return Course.objects.filter(category_id=category_id)
        return Course.objects.all()

    def create(self, **data):
        """Create a new course."""
        return Course.objects.create(**data)

    def update(self, course_id: int, **data):
        """Update an existing course."""
        try:
            course = Course.objects.get(id=course_id)
            for key, value in data.items():
                setattr(course, key, value)
            course.save()
            return course
        except Course.DoesNotExist:
            return None

    def delete(self, course_id: int):
        """Delete a course."""
        try:
            course = Course.objects.get(id=course_id)
            course.delete()
            return True
        except Course.DoesNotExist:
            return False
