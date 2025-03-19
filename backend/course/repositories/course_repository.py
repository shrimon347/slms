from course.models import Course, CourseCategory


class CourseRepository:
    @staticmethod
    def get_all_courses():
        """Retrieve a all course by ID."""
        return Course.objects.all()

    @staticmethod
    def get_courses_by_category_id(category_id):
        """Retrieve courses by category ID."""
        return Course.objects.filter(category__id=category_id)

    @staticmethod
    def get_courses_by_slug(slug):
        """Retrieve a course by its slug."""
        return Course.objects.get(slug=slug)

    @staticmethod
    def get_courses_by_category_name(category_name):
        category = CourseCategory.objects.filter(name__iexact=category_name).first()
        if category:
            return Course.objects.filter(category=category)
        return Course.objects.none()

    @staticmethod
    def create(**data):
        """Create a new course."""
        return Course.objects.create(**data)

    @staticmethod
    def update(course_id: int, **data):
        """Update an existing course."""
        try:
            course = Course.objects.get(id=course_id)
            for key, value in data.items():
                setattr(course, key, value)
            course.save()
            return course
        except Course.DoesNotExist:
            return None

    @staticmethod
    def delete(course_id: int):
        """Delete a course."""
        try:
            course = Course.objects.get(id=course_id)
            course.delete()
            return True
        except Course.DoesNotExist:
            return False
