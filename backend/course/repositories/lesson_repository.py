from course.models import Lesson


class LessonRepository:
    @staticmethod
    def get_lesson_by_id(lesson_id: int):
        """Retrieve a single lesson by ID."""
        try:
            return Lesson.objects.get(id=lesson_id)
        except Lesson.DoesNotExist:
            return None

    @staticmethod
    def get_lesson_all(module_id: int):
        """Retrieve all lessons for a specific module."""
        return Lesson.objects.filter(module_id=module_id)

    @staticmethod
    def create(**data):
        """Create a new lesson."""
        return Lesson.objects.create(**data)

    @staticmethod
    def update(lesson_id: int, **data):
        """Update an existing lesson."""
        try:
            lesson = Lesson.objects.get(id=lesson_id)
            for key, value in data.items():
                setattr(lesson, key, value)
            lesson.save()
            return lesson
        except Lesson.DoesNotExist:
            return None

    @staticmethod
    def delete(lesson_id: int):
        """Delete a lesson."""
        try:
            lesson = Lesson.objects.get(id=lesson_id)
            lesson.delete()
            return True
        except Lesson.DoesNotExist:
            return False
