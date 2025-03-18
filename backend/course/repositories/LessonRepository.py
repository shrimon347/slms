from course.models import Lesson


class LessonRepository:
    def get_by_id(self, lesson_id: int):
        """Retrieve a single lesson by ID."""
        try:
            return Lesson.objects.get(id=lesson_id)
        except Lesson.DoesNotExist:
            return None

    def get_all(self, module_id: int):
        """Retrieve all lessons for a specific module."""
        return Lesson.objects.filter(module_id=module_id)

    def create(self, **data):
        """Create a new lesson."""
        return Lesson.objects.create(**data)

    def update(self, lesson_id: int, **data):
        """Update an existing lesson."""
        try:
            lesson = Lesson.objects.get(id=lesson_id)
            for key, value in data.items():
                setattr(lesson, key, value)
            lesson.save()
            return lesson
        except Lesson.DoesNotExist:
            return None

    def delete(self, lesson_id: int):
        """Delete a lesson."""
        try:
            lesson = Lesson.objects.get(id=lesson_id)
            lesson.delete()
            return True
        except Lesson.DoesNotExist:
            return False
