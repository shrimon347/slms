/* eslint-disable no-unused-vars */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useLazyGetEnrolledModuleQuizzesQuery,
  useQuizSubmitMutation,
} from "@/features/course/courseApi";
import { LucideTimer } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

const QuizzDetails = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();

  // Quiz submission mutation
  const [
    quizSubmit,
    { isLoading: isSubmitting, isSuccess, error: submitError },
  ] = useQuizSubmitMutation();

  // State for quiz data and selected options
  const [quizData, setQuizData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);

  // Fetch quiz data using useLazyGetEnrolledModuleQuizzesQuery
  const [trigger, { data, isLoading, error }] =
    useLazyGetEnrolledModuleQuizzesQuery();

  useEffect(() => {
    if (courseId && moduleId) {
      trigger({ enrollments_id: courseId, module_id: moduleId });
    }
  }, [courseId, moduleId, trigger]);

  useEffect(() => {
    if (data) {
      console.log("API Response:", data);

      // Extract the first quiz from the 'quizzes' array
      const firstQuiz = data.quizzes[0];
      console.log(firstQuiz);

      if (firstQuiz) {
        setQuizData(firstQuiz); // Set quiz data once it's fetched

        // Check if the quiz has already been submitted
        if (firstQuiz.result?.submitted === true) {
          navigate(
            `/dashboard/my-courses/${courseId}/modules/${moduleId}/quizes/${firstQuiz.result.quiz_result_id}/result`
          );
        }

        // Restore timer from localStorage or set to quiz's time limit
        const storedTimeLeft = localStorage.getItem(
          `quizTimer-${courseId}-${moduleId}`
        );
        const lastActiveTime = localStorage.getItem(
          `quizLastActiveTime-${courseId}-${moduleId}`
        );

        if (storedTimeLeft && lastActiveTime) {
          const elapsedTime = Math.floor((Date.now() - lastActiveTime) / 1000); // Calculate elapsed time
          const updatedTimeLeft = Math.max(
            parseInt(storedTimeLeft, 10) - elapsedTime,
            0
          ); // Ensure timeLeft doesn't go below 0
          setTimeLeft(updatedTimeLeft);
        } else {
          setTimeLeft(firstQuiz.time_limit); // Initialize with quiz's time limit
        }

        // Store the current timestamp as the last active time
        localStorage.setItem(
          `quizLastActiveTime-${courseId}-${moduleId}`,
          Date.now()
        );
      }
    }
  }, [data, courseId, moduleId,navigate]);

  // Handle quiz submission
  const handleSubmit = useCallback(async () => {
    // Format selectedOptions to include all questions, even unanswered ones
    const formattedSelectedOptions = {};
    quizData.questions.forEach((question) => {
      const selectedOptionOrder = selectedOptions[question.id];
      formattedSelectedOptions[question.id] = selectedOptionOrder || undefined; // Use undefined for unanswered questions
    });

    // Prepare the payload
    const payload = {
      quiz_id: quizData.id,
      selected_options: formattedSelectedOptions,
    };

    try {
      const response = await quizSubmit(payload).unwrap();
      console.log("Quiz submitted successfully!", response);

      // Extract the quiz_result_id from the response
      const { quiz_result_id } = response;

      // Clear the timer and last active time from localStorage
      localStorage.removeItem(`quizTimer-${courseId}-${moduleId}`);
      localStorage.removeItem(`quizLastActiveTime-${courseId}-${moduleId}`);

      // Navigate to the result page
      navigate(
        `/dashboard/my-courses/${courseId}/modules/${moduleId}/quizes/${quiz_result_id}/result`
      );
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  }, [navigate, quizData, selectedOptions, courseId, moduleId, quizSubmit]);

  // Timer logic
  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 1) {
            clearInterval(timer);
            handleSubmit(); // Auto-submit when timer reaches zero
            return 0;
          }

          // Persist the timer and last active time in localStorage
          localStorage.setItem(
            `quizTimer-${courseId}-${moduleId}`,
            prevTime - 1
          );
          localStorage.setItem(
            `quizLastActiveTime-${courseId}-${moduleId}`,
            Date.now()
          );
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer); // Cleanup interval on component unmount or manual submission
    }
  }, [timeLeft, handleSubmit, courseId, moduleId]);

  // Handle option selection
  const handleOptionSelect = (questionId, optionOrder) => {
    setSelectedOptions((prevOptions) => {
      if (prevOptions[questionId] === optionOrder) {
        // Deselect the option if it's already selected
        const newOptions = { ...prevOptions };
        delete newOptions[questionId]; // Remove the question ID if deselected
        return newOptions;
      }
      return {
        ...prevOptions,
        [questionId]: optionOrder, // Add or update the selected option
      };
    });
  };

  // Safeguard against undefined quizData or quizData.questions
  if (isLoading) return <p>Loading quiz...</p>;
  if (error) return <p>Error loading quiz.</p>;

  // If the quiz has already been submitted, show a message and a "View Results" button
  if (quizData?.submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Quiz Already Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You have already attempted this quiz. View your results:</p>
            <Button
              onClick={() =>
                navigate(
                  `/dashboard/my-courses/${courseId}/modules/${moduleId}/quizes/${quizData.quiz_result_id}/result`
                )
              }
              className="mt-4"
            >
              View Results
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quizData || !Array.isArray(quizData.questions))
    return <p>No quiz data available.</p>;

  // Count answered questions
  const answeredQuestionsCount = Object.keys(selectedOptions).length;

  return (
    <div className="flex flex-col items-center p-4 md:p-14 relative">
      {/* Fixed Timer and Answered Questions Counter */}
      <div className="fixed right-10 top-14 md:!top-[72px] flex justify-end max-w-[inherit] py-2 px-4 z-[5] transition-all duration-[600ms] ease-linear">
        <div className="flex items-center gap-4">
          {/* Timer */}
          <div className="flex flex-wrap justify-center items-center p-2 rounded-[4px] w-fit gap-2 text-center bg-slate-200">
            <LucideTimer />
            <p className="font-medium text-center leading-[19px] tracking-[0.02em] flex justify-center items-center text-[15px]">
              {Math.floor(timeLeft / 60)}m:
              {(timeLeft % 60).toString().padStart(2, "0")}s
            </p>
          </div>

          {/* Answered Questions Counter */}
          <div className="flex flex-wrap justify-center items-center rounded-[4px] w-fit gap-2 text-center bg-slate-200 p-1">
            <p className="font-medium text-center leading-[19px] tracking-[0.02em] flex justify-center items-center text-[11px]">
              {answeredQuestionsCount}/{quizData.questions.length} Questions
              Answered
            </p>
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      <Card className="w-full mt-20">
        <CardHeader>
          <CardTitle className="font-bold text-2xl">{quizData.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {quizData.questions.map((question, index) => (
            <div key={question.id}>
              <div className="flex gap-4">
                <h3 className="font-semibold">{index + 1}.</h3>
                <div>
                  <p className="font-bold">{question.question_text}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 mt-2">
                {question.options.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-center gap-4 py-4 px-6 rounded-md cursor-pointer ${
                      selectedOptions[question.id] === option.order
                        ? "bg-black text-white"
                        : "border hover:border-black"
                    }`}
                    onClick={() =>
                      handleOptionSelect(question.id, option.order)
                    } // Make the whole container clickable
                  >
                    <div
                      className={`min-w-8 min-h-8 flex justify-center items-center rounded-full font-bold ${
                        selectedOptions[question.id] === option.order
                          ? "text-white bg-black"
                          : "text-black bg-gray-200"
                      }`}
                    >
                      <p className="text-sm">{option.order}</p>
                    </div>
                    <label className="flex-grow cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        checked={selectedOptions[question.id] === option.order}
                        onChange={() => {}}
                        onClick={() =>
                          handleOptionSelect(question.id, option.order)
                        }
                        className="hidden"
                      />
                      <span className="ml-2">{option.option_text}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || timeLeft === 0}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizzDetails;
