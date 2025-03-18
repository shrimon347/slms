from course.repositories import lesson_repository


class LessonService:
    def __init__(self):
        self.repo = lesson_repository()

    def get_lessons_by_module(self, module_id: int):
        """Get all lessons of a specific module."""
        return self.repo.get_all(module_id)

    def get_lesson_by_id(self, lesson_id: int):
        """Get a lesson by its ID."""
        return self.repo.get_by_id(lesson_id)

    def create_lesson(self, **data):
        """Create a new lesson."""
        return self.repo.create(**data)

    def update_lesson(self, lesson_id: int, **data):
        """Update an existing lesson."""
        return self.repo.update(lesson_id, **data)

    def delete_lesson(self, lesson_id: int):
        """Delete a lesson."""
        return self.repo.delete(lesson_id)
