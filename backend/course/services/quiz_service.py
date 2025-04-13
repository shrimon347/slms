from course.models import Module, Quiz, QuizResult, StudentProgress
from course.repositories.quiz_repository import QuizRepository
from django.db import transaction
from django.forms import ValidationError
from django.utils import timezone
from payment.models import Enrollment
from payment.services.enrollment_service import EnrollmentService


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
    def get_quiz_with_details(quiz_id):
        """Get a quiz with all its questions and options."""
        return QuizRepository.get_quiz_with_details(quiz_id)

    @staticmethod
    def get_quizzes_for_enrolled_course_module(enrollment_id, module_id, user):
        """
        Fetch quizzes for a specific module in a course where the user is enrolled.
        """
        try:
            # Ensure the user is enrolled in the course
            enrollment = Enrollment.objects.get(id=enrollment_id, student=user)

            # Ensure the module belongs to the course
            module = Module.objects.get(id=module_id, course=enrollment.course)

            # Fetch quizzes associated with the module
            quizzes = Quiz.objects.filter(module=module)
            return quizzes

        except Enrollment.DoesNotExist:
            raise ValueError("You are not enrolled in this course.")

        except Module.DoesNotExist:
            raise ValueError("The specified module does not exist in this course.")

        except Exception as e:
            raise e

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

    @staticmethod
    def submit_quiz(user, quiz_id, selected_options):
        quiz = QuizRepository.get_quiz_by_id(quiz_id)
        if not quiz:
            raise ValidationError("Quiz not found.")

        questions = QuizRepository.get_questions_with_options(quiz)
        existing_attempt = QuizResult.objects.filter(
            student=user, quiz=quiz, submitted=True
        ).exists()
        if existing_attempt:
            raise ValidationError("You have already submitted this quiz")
        obtained_marks = 0
        total_marks = questions.count()
        result_data = {}

        for question in questions:
            selected_option_order = selected_options.get(str(question.id))
            if selected_option_order is None:
                result_data[question.id] = {
                    "is_correct": False,
                    "correct_option": question.correct_option_index,
                }
                continue

            correct_option = question.options.filter(
                order=selected_option_order, is_correct=True
            ).first()
            if correct_option:
                obtained_marks += 1
                result_data[question.id] = {
                    "is_correct": True,
                    "correct_option": question.correct_option_index,
                }
            else:
                result_data[question.id] = {
                    "is_correct": False,
                    "correct_option": question.correct_option_index,
                }

        with transaction.atomic():
            quiz_result = QuizRepository.save_quiz_result(
                student=user,
                quiz=quiz,
                selected_options=selected_options,
                obtained_marks=obtained_marks,
                total_marks=total_marks,
                submitted=True,
            )

            student_progress, created = StudentProgress.objects.get_or_create(
                student=user,
                quiz=quiz,
                defaults={"completed": True, "completed_at": timezone.now()},
            )
            if not created:
                student_progress.completed = True
                student_progress.completed_at = timezone.now()
                student_progress.save()

            EnrollmentService.complete_quiz(user, quiz)

        return {
            "obtained_marks": obtained_marks,
            "total_marks": total_marks,
            "result_data": result_data,
            "quiz_result_id": quiz_result.id,
            "submitted": quiz_result.submitted,
        }
