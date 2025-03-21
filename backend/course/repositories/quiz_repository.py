from course.models import Quiz


class quizRepository:
    @staticmethod
    def get_quiz_by_id(quiz_id: int):
        """Retrieve a single quiz by ID."""
        try:
            return Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            return None

    @staticmethod
    def get_quiz_all(module_id: int):
        """Retrieve all quizs for a specific module."""
        return Quiz.objects.filter(module_id=module_id)

    @staticmethod
    def create(**data):
        """Create a new quiz."""
        return Quiz.objects.create(**data)

    @staticmethod
    def update(quiz_id: int, **data):
        """Update an existing quiz."""
        try:
            quiz = Quiz.objects.get(id=quiz_id)
            for key, value in data.items():
                setattr(quiz, key, value)
            quiz.save()
            return quiz
        except Quiz.DoesNotExist:
            return None

    @staticmethod
    def delete(quiz_id: int):
        """Delete a quiz."""
        try:
            quiz = Quiz.objects.get(id=quiz_id)
            quiz.delete()
            return True
        except Quiz.DoesNotExist:
            return False
