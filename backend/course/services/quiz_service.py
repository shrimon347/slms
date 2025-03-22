from course.repositories.quiz_repository import QuizRepository


class QuizService:
    @staticmethod
    def get_quiz_by_module(module_id: int):
        """Get all quiz of a specific module."""
        return QuizRepository.get_all(module_id)

    @staticmethod
    def get_quiz_by_id(quiz_id: int):
        """Get a quiz by its ID."""
        return QuizRepository.get_quiz_by_id(quiz_id)

    @staticmethod
    def create_quiz(**data):
        """Create a new quiz."""
        return QuizRepository.create(**data)

    @staticmethod
    def update_quiz(quiz_id: int, **data):
        """Update an existing quiz."""
        return QuizRepository.update(quiz_id, **data)

    @staticmethod
    def delete_quiz(quiz_id: int):
        """Delete a quiz."""
        return QuizRepository.delete(quiz_id)

    @staticmethod
    def create_question(quiz, question_text, correct_option_index, Options_data):
        # Create MCQ Question
        question = QuizRepository.create_mcq_question(
            quiz, question_text, correct_option_index
        )

        # Add Options
        for idx, (option_text, is_correct) in enumerate(Options_data):
            QuizRepository.create_Option(question, option_text, idx + 1, is_correct)
        return question

    @staticmethod
    def update_question(question, question_text, correct_option_index, Options_data):
        # Update question
        QuizRepository.update_mcq_question(
            question, question_text, correct_option_index
        )

        # Update Options
        for idx, (option_text, is_correct) in enumerate(Options_data):
            Option = QuizRepository.get_Options_for_question(question).get(
                order=idx + 1
            )
            Option.option_text = option_text
            Option.is_correct = is_correct
            Option.save()

        return question

    @staticmethod
    def delete_question(question):
        QuizRepository.delete_mcq_question(question)

    @staticmethod
    def delete_Option(Option):
        QuizRepository.delete_Option(Option)
