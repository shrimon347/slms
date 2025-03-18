from course.models import CourseCategory


class CourseCategoryRepository:
    def get_by_id(self, category_id: int):
        """Retrieve a single category by ID."""
        try:
            return CourseCategory.objects.get(id=category_id)
        except CourseCategory.DoesNotExist:
            return None

    def get_all(self):
        """Retrieve all categories."""
        return CourseCategory.objects.all()

    def create(self, **data):
        """Create a new course category."""
        return CourseCategory.objects.create(**data)

    def update(self, category_id: int, **data):
        """Update an existing category."""
        try:
            category = CourseCategory.objects.get(id=category_id)
            for key, value in data.items():
                setattr(category, key, value)
            category.save()
            return category
        except CourseCategory.DoesNotExist:
            return None

    def delete(self, category_id: int):
        """Delete a course category."""
        try:
            category = CourseCategory.objects.get(id=category_id)
            category.delete()
            return True
        except CourseCategory.DoesNotExist:
            return False
