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
