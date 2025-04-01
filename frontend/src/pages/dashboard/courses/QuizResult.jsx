import { Button } from "@/components/ui/button";
import { ArrowRight, Award, CheckCircle2, Clock } from "lucide-react";
import { useNavigate, useParams } from "react-router";

const QuizResult = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  // Mock data for quiz results (replace with actual data)
  const quizResults = {
    date: "২৪ জানু, ২০২৫",
    title: "Quiz Test",
    totalQuestions: 30,
    correctAnswers: 0,
    wrongAnswers: 30,
    totalTime: "২০:০০ মিনিট",
    timeTaken: "২০:০০ মিনিট",
    score: "০%",
  };

  const handleReturnToModule = () => {
    navigate(`/dashboard/my-courses/${courseId}`);
  };

  return (
    <div className="flex flex-col items-center p-4 md:p-8 gap-6 w-full md:w-[856px] bg-white rounded-2xl shadow-md m-auto mt-10 ">
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
            {quizResults.date}
          </p>
          <p className="text-lg md:text-xl font-semibold text-gray-900">
            {quizResults.title}
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
              <p className="text-sm text-ostad-blue-100">
                {quizResults.totalQuestions}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm">ভুল উত্তর সংখ্যা</p>
              <p className="text-sm text-red-500">{quizResults.wrongAnswers}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm">সঠিক উত্তর সংখ্যা</p>
              <p className="text-sm text-green-500">
                {quizResults.correctAnswers}
              </p>
            </div>
          </div>

          {/* Time Stats Card */}
          <div className="flex flex-col p-4 gap-2 w-full bg-white rounded-lg border border-gray-200">
            <div className="flex justify-center mb-2">
              <Clock className="w-9 h-9 text-ostad-blue-100" />
            </div>
            <div className="flex justify-between">
              <p className="text-sm">পরীক্ষার সময়</p>
              <p className="text-sm text-ostad-blue-100">
                {quizResults.totalTime}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm">সময় লেগেছে</p>
              <p className="text-sm text-yellow-500">{quizResults.timeTaken}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm">মোট স্কোর</p>
              <p className="text-sm text-green-500">{quizResults.score}</p>
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
              <p className="text-sm text-ostad-blue-100">
                {quizResults.totalQuestions}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm">ভুল উত্তর সংখ্যা</p>
              <p className="text-sm text-red-500">{quizResults.wrongAnswers}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm">সঠিক উত্তর সংখ্যা</p>
              <p className="text-sm text-green-500">
                {quizResults.correctAnswers}
              </p>
            </div>
          </div>

          {/* Time Stats Card */}
          <div className="flex flex-col p-4 gap-2 w-1/2 bg-white rounded-lg border border-gray-200">
            <div className="flex justify-center mb-2">
              <Clock className="w-9 h-9 text-ostad-blue-100" />
            </div>
            <div className="flex justify-between">
              <p className="text-sm">পরীক্ষার সময়</p>
              <p className="text-sm text-ostad-blue-100">
                {quizResults.totalTime}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm">সময় লেগেছে</p>
              <p className="text-sm text-yellow-500">{quizResults.timeTaken}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm">মোট স্কোর</p>
              <p className="text-sm text-green-500">{quizResults.score}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 justify-between w-full">
        <Button
          variant="outline"
          className="w-full md:w-auto"
          onClick={() => console.log("Check Answers")}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" /> Check Answers
        </Button>
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
