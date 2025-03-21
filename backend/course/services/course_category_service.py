from course.repositories.course_category_repository import CourseCategoryRepository


class CourseCategoryService:

    @staticmethod
    def get_all_categories():
        """Get all categories."""
        return CourseCategoryRepository.get_all_categories()

    @staticmethod
    def get_category_by_name(category_name: str):
        """Get a category by its ID."""
        return CourseCategoryRepository.get_categories_by_name(category_name)

    @staticmethod
    def create_category(**data):
        """Create a new category."""
        return CourseCategoryRepository.create(**data)

    @staticmethod
    def update_category(category_id: int, **data):
        """Update an existing category."""
        return CourseCategoryRepository.update(category_id, **data)

    @staticmethod
    def delete_category(category_id: int):
        """Delete a category."""
        return CourseCategoryRepository.delete(category_id)
