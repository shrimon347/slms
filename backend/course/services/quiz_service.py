from course.repositories.quiz_repository import quizRepository


class QuizService:
    @staticmethod
    def get_quiz_by_module(module_id: int):
        """Get all quiz of a specific module."""
        return quizRepository.get_all(module_id)

    @staticmethod
    def get_quiz_by_id(quiz_id: int):
        """Get a quiz by its ID."""
        return quizRepository.get_quiz_by_id(quiz_id)

    @staticmethod
    def create_quiz(**data):
        """Create a new quiz."""
        return quizRepository.create(**data)

    @staticmethod
    def update_quiz(quiz_id: int, **data):
        """Update an existing quiz."""
        return quizRepository.update(quiz_id, **data)

    @staticmethod
    def delete_quiz(quiz_id: int):
        """Delete a quiz."""
        return quizRepository.delete(quiz_id)
