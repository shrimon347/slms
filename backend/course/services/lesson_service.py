from course.repositories.lesson_repository import LessonRepository


class LessonService:
    @staticmethod
    def get_lessons_by_module(module_id: int):
        """Get all lessons of a specific module."""
        return LessonRepository.get_all(module_id)

    @staticmethod
    def get_lesson_by_id(lesson_id: int):
        """Get a lesson by its ID."""
        return LessonRepository.get_lesson_by_id(lesson_id)

    @staticmethod
    def create_lesson(**data):
        """Create a new lesson."""
        return LessonRepository.create(**data)

    @staticmethod
    def update_lesson(lesson_id: int, **data):
        """Update an existing lesson."""
        return LessonRepository.update(lesson_id, **data)

    @staticmethod
    def delete_lesson(lesson_id: int):
        """Delete a lesson."""
        return LessonRepository.delete(lesson_id)
