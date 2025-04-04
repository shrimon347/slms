import { Button } from "@/components/ui/button";
import { useLazyGetQuizResultQuery } from "@/features/course/courseApi";
import { ArrowRight, Award, CheckCircle2, Clock } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";

const QuizResult = () => {
  const navigate = useNavigate();
  const { courseId, moduleId, quizId } = useParams();
  // Lazy query to fetch quiz result
  const [triggerGetQuizResult, { data: quizResultData, isLoading, error }] =
    useLazyGetQuizResultQuery();

  useEffect(() => {
    if (courseId && moduleId && quizId) {
      const payload = {
        enrollments_id: courseId,
        module_id: moduleId,
        quiz_result_id: quizId,
      };

      triggerGetQuizResult(payload).unwrap();
    }
  }, [courseId, moduleId, quizId, triggerGetQuizResult]);

  // Handle navigation back to the module
  const handleReturnToModule = () => {
    navigate(`/dashboard/my-courses/${courseId}`);
  };

  // If data is still loading or there's an error, show a fallback UI
  if (isLoading) {
    return <div className="text-center">Loading quiz results...</div>;
  }

  if (error || !quizResultData?.quiz_result) {
    return (
      <div className="text-center text-red-500">
        Error fetching quiz results.
      </div>
    );
  }

  // Extract quiz result and quiz details
  const { quiz_result } = quizResultData;

  const { obtained_marks, total_marks, quiz } = quiz_result;

  const wrongAnswers = total_marks - obtained_marks;
  const score = `${((obtained_marks / total_marks) * 100).toFixed(2)}%`;
  const totalTime = `${Math.floor(quiz.time_limit / 60)}:${(
    quiz.time_limit % 60
  )
    .toString()
    .padStart(2, "0")} মিনিট`;

  return (
    <div className="flex flex-col items-center p-4 md:p-8 gap-6 w-full md:w-[856px] bg-white rounded-2xl shadow-md m-auto mt-10">
      {/* Trophy Icon */}
      <img
        src="https://cdn.ostad.app/public/upload/2023-06-07T10-38-05.174Z-trophy1.png"
        alt="Trophy"
        className="w-[60px] md:w-[120px]"
      />

      {/* Completion Message */}
      <h1 className="text-h5 md:text-h2 text-ostad-success-100 font-bold">
        কুইজ শেষ হয়েছে
      </h1>

      {/* Horizontal Divider */}
      <div className="w-full h-[1px] bg-gray-300"></div>

      {/* Quiz Details */}
      <div className="flex flex-col items-center py-4 gap-4 w-full">
        {/* Quiz Title and Date */}
        <div className="flex flex-col items-center gap-2 w-full">
          <p className="text-sm md:text-base text-gray-600">
            {new Date().toLocaleDateString("bn-BD", { dateStyle: "long" })}
          </p>
          <p className="text-lg md:text-xl font-semibold text-gray-900">
            {quiz.title}
          </p>
        </div>

        {/* Mobile View */}
        <div className="flex flex-col md:hidden gap-4 w-full">
          {/* Quiz Stats Card */}
          <div className="flex flex-col p-4 gap-2 w-full bg-white rounded-lg border border-gray-200">
            <div className="flex justify-center mb-2">
              <Award className="w-9 h-9 text-ostad-blue-100" />
            </div>
            <div className="flex justify-between">
              <p className="text-sm">মোট প্রশ্ন সংখ্যা</p>
              <p className="text-sm text-ostad-blue-100">{total_marks}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm">ভুল উত্তর সংখ্যা</p>
              <p className="text-sm text-red-500">{wrongAnswers}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm">সঠিক উত্তর সংখ্যা</p>
              <p className="text-sm text-green-500">{obtained_marks}</p>
            </div>
          </div>

          {/* Time Stats Card */}
          <div className="flex flex-col p-4 gap-2 w-full bg-white rounded-lg border border-gray-200">
            <div className="flex justify-center mb-2">
              <Clock className="w-9 h-9 text-ostad-blue-100" />
            </div>
            <div className="flex justify-between">
              <p className="text-sm">পরীক্ষার সময়</p>
              <p className="text-sm text-ostad-blue-100">{totalTime}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm">মোট স্কোর</p>
              <p className="text-sm text-green-500">{score}</p>
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex gap-4 w-full">
          {/* Quiz Stats Card */}
          <div className="flex flex-col p-4 gap-2 w-1/2 bg-white rounded-lg border border-gray-200">
            <div className="flex justify-center mb-2">
              <Award className="w-9 h-9 text-ostad-blue-100" />
            </div>
            <div className="flex justify-between">
              <p className="text-sm">মোট প্রশ্ন সংখ্যা</p>
              <p className="text-sm text-ostad-blue-100">{total_marks}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm">ভুল উত্তর সংখ্যা</p>
              <p className="text-sm text-red-500">{wrongAnswers}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm">সঠিক উত্তর সংখ্যা</p>
              <p className="text-sm text-green-500">{obtained_marks}</p>
            </div>
          </div>

          {/* Time Stats Card */}
          <div className="flex flex-col p-4 gap-2 w-1/2 bg-white rounded-lg border border-gray-200">
            <div className="flex justify-center mb-2">
              <Clock className="w-9 h-9 text-ostad-blue-100" />
            </div>
            <div className="flex justify-between">
              <p className="text-sm">পরীক্ষার সময়</p>
              <p className="text-sm text-ostad-blue-100">{totalTime}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm">মোট স্কোর</p>
              <p className="text-sm text-green-500">{score}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 justify-between w-full">
        <Link
          to={`/dashboard/my-courses/${courseId}/modules/${moduleId}/quizes/${quizId}/checked/answer`}
        >
          <Button variant="outline" className="w-full cursor-pointer md:w-auto">
            <CheckCircle2 className="mr-2 h-4 w-4" /> Check Answers
          </Button>
        </Link>
        <Button
          className="w-full md:w-auto cursor-pointer"
          onClick={handleReturnToModule}
        >
          মডিউলে ফিরে যান
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default QuizResult;
