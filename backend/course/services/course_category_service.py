from course.repositories import CourseCategoryRepository

class CourseCategoryService:
    def __init__(self):
        self.repo = CourseCategoryRepository()

    def get_all_categories(self):
        """Get all categories."""
        return self.repo.get_all()

    def get_category_by_id(self, category_id: int):
        """Get a category by its ID."""
        return self.repo.get_by_id(category_id)

    def create_category(self, **data):
        """Create a new category."""
        return self.repo.create(**data)

    def update_category(self, category_id: int, **data):
        """Update an existing category."""
        return self.repo.update(category_id, **data)

    def delete_category(self, category_id: int):
        """Delete a category."""
        return self.repo.delete(category_id)
