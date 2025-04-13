import { Button } from "@/components/ui/button";
import { useLazyGetQuizResultQuery } from "@/features/course/courseApi";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

const QuizCheckAnswer = () => {
  const { courseId, moduleId, quizId } = useParams();
  const navigate = useNavigate();
  const [triggerQuizResult, { data, isLoading, error }] =
    useLazyGetQuizResultQuery();

  // Fetch quiz result when the component mounts
  useEffect(() => {
    if (quizId) {
      triggerQuizResult({
        enrollments_id: courseId,
        module_id: moduleId,
        quiz_result_id: quizId,
      });
    }
  }, [quizId, triggerQuizResult, courseId, moduleId]);

  // Handle loading state
  if (isLoading) return <p>Loading quiz result...</p>;

  // Handle error state
  if (error) return <p>Error loading quiz result.</p>;

  // Destructure quiz result data
  const {
    obtained_marks = 0,
    total_marks = 0,
    selected_options = {},
    quiz = {},
  } = data?.quiz_result || {};

  const { title = "", questions = [] } = quiz;
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="p-4 md:p-14 bg-slate-100">
      <div className="flex flex-col justify-center items-start pt-6 gap-4 w-full bg-white p-4 rounded-md border">
        <Button onClick={handleBack} className="mb-4 cursor-pointer">
          <ArrowLeft /> Back
        </Button>
        {/* Quiz Header */}
        <div className="flex flex-col gap-6 w-full">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-gray-600">
            Obtained Marks: {obtained_marks}/{total_marks}
          </p>
        </div>

        {/* Questions List */}
        <div className="flex flex-col gap-6 w-full">
          {questions.map((question, index) => {
            const userSelectedOptionOrder = selected_options[question.id];

            return (
              <div key={question.id} className="flex flex-col gap-4 w-full">
                {/* Question Number and Text */}
                <div className="flex gap-3 w-full">
                  <h3 className="font-semibold">{index + 1}.</h3>
                  <div className="">
                    <p>
                      <strong>{question.question_text}</strong>
                    </p>
                  </div>
                </div>

                {/* Options */}
                {question.options.map((option) => {
                  const isSelected = option.order === userSelectedOptionOrder;
                  const isCorrect = option.is_correct;

                  return (
                    <div
                      key={option.id}
                      className={`flex flex-row items-center justify-between py-4 px-6 gap-4 w-full rounded-md ${
                        isSelected && isCorrect
                          ? "bg-green-100 border-[2px] !border-green-500"
                          : isSelected && !isCorrect
                          ? "bg-red-100 border-[2px] !border-red-500"
                          : isCorrect
                          ? "bg-green-100 border-[2px] !border-green-500"
                          : "border !border-gray-300 bg-white"
                      }`}
                    >
                      {/* Option Marker */}
                      <div className="flex items-center gap-4">
                        <div
                          className={`min-w-8 min-h-8 flex justify-center items-center rounded-full ${
                            isSelected && isCorrect
                              ? "bg-green-500 text-white"
                              : isSelected && !isCorrect
                              ? "bg-red-500 text-white"
                              : isCorrect
                              ? "bg-green-500 text-white"
                              : "bg-gray-300"
                          }`}
                        >
                          <p className="subtitle-s2">{option.order}</p>
                        </div>
                        <div>
                          <p>{option.option_text}</p>
                        </div>
                      </div>

                      {/* Correct/Wrong Indicator */}
                      {isSelected && isCorrect && (
                        <img
                          src="https://cdn.ostad.app/public/upload/2023-02-02T09-19-59.254Z-Group9.svg"
                          alt="Correct"
                        />
                      )}
                      {isSelected && !isCorrect && (
                        <img
                          src="https://cdn.ostad.app/public/upload/2023-02-02T13-09-24.005Z-Group10.svg"
                          alt="Wrong"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizCheckAnswer;
