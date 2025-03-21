from course.models import CourseCategory


class CourseCategoryRepository:
    @staticmethod
    def get_categories_by_id(category_id: int):
        """Retrieve a single category by ID."""
        try:
            return CourseCategory.objects.get(id=category_id)
        except CourseCategory.DoesNotExist:
            return None

    @staticmethod
    def get_categories_by_name(category_name: str):
        """Retrieve a single category by ID."""
        try:
            return CourseCategory.objects.get(name=category_name)
        except CourseCategory.DoesNotExist:
            return None

    @staticmethod
    def get_all_categories():
        """Retrieve all categories."""
        return CourseCategory.objects.all()

    @staticmethod
    def create(**data):
        """Create a new course category."""
        return CourseCategory.objects.create(**data)

    @staticmethod
    def update(category_id: int, **data):
        """Update an existing category."""
        try:
            category = CourseCategory.objects.get(id=category_id)
            for key, value in data.items():
                setattr(category, key, value)
            category.save()
            return category
        except CourseCategory.DoesNotExist:
            return None

    @staticmethod
    def delete(category_id: int):
        """Delete a course category."""
        try:
            category = CourseCategory.objects.get(id=category_id)
            category.delete()
            return True
        except CourseCategory.DoesNotExist:
            return False
