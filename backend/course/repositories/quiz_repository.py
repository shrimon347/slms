from course.models import Option, MCQQuestion, Quiz


class QuizRepository:
    @staticmethod
    def get_quiz_by_id(quiz_id):
        return Quiz.objects.get(id=quiz_id)

    @staticmethod
    def get_questions_for_quiz(quiz):
        return quiz.questions.all()

    @staticmethod
    def get_Options_for_question(question):
        return question.Options.all()
    
    @staticmethod
    def get_quiz_with_details(quiz_id):
        """Fetch a quiz with all its questions and options."""
        return (
            Quiz.objects.filter(id=quiz_id)
            .prefetch_related("questions__options")  # Prefetch related questions and options
            .first()
        )
    
    @staticmethod
    def get_quizzes_for_course(course):
        """Fetch all quizzes for a course."""
        return Quiz.objects.filter(module__course=course).select_related("module").prefetch_related("questions__options")

    @staticmethod
    def create_mcq_question(quiz, question_text, correct_option_index):
        return MCQQuestion.objects.create(
            quiz=quiz,
            question_text=question_text,
            correct_option_index=correct_option_index,
        )

    @staticmethod
    def update_mcq_question(question, question_text, correct_option_index):
        question.question_text = question_text
        question.correct_O
        ption_index = correct_option_index
        question.save()
        return question

    @staticmethod
    def delete_mcq_question(question):
        question.delete()

    @staticmethod
    def create_Option(question, option_text, order, is_correct):
        return Option.objects.create(
            question=question,
            option_text=option_text,
            order=order,
            is_correct=is_correct,
        )

    @staticmethod
    def delete_Option(Option):
        Option.delete()
