import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, InfoIcon, NotepadText, Timer } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";

const QuizzGuideline = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1); // Go back one step in the browser history
  };
  return (
    <div className="p-4 md:p-14">
      <Button onClick={handleBack} className="mb-4 cursor-pointer">
        <ArrowLeft /> Back
      </Button>
      <p className="text-3xl py-4 flex items-center gap-2 font-bold">
        <NotepadText /> Quiz{" "}
      </p>
      <Card className="mb-10 shadow-none border-black rounded-sm overflow-hidden py-0">
        <p className="text-xl flex justify-center items-center bg-zinc-200 py-2 font-bold">
          কুইজ
        </p>
        <CardContent className="flex p-5 justify-between items-center">
          <p className="flex items-center gap-2 font-bold">
            {" "}
            <NotepadText />
            Total Mark : 10
          </p>
          <p className="flex items-center gap-2 font-bold">
            {" "}
            <Timer /> Time: 10 Min
          </p>
        </CardContent>
      </Card>
      <Card className="shadow-none hover:border-black">
        <CardHeader>
          <InfoIcon size={38} className="mx-auto text-blue-500" />
          <div class="flex flex-col w-full gap-4 items-center">
            <div>
              <p>
                <strong>গাইডলাইনঃ</strong>
              </p>
              <p>
                ১। কুইজের সময় 10 মিনিট। আপনি একবার কুইজে অংশগ্রহণ করলে 10
                মিনিটের মধ্যেই কুইজটি শেষ করতে হবে।
              </p>
              <p>
                ২। কুইজ দেয়া যাবে ১ বার। ১ বারের বেশি কুইজে অংশগ্রহণ করা যাবে
                না।
              </p>
              <p>৩।ডেডলাইনের মধ্যে সাবমিট করতে না মারলে ৫০% মারক্স কাটা যাবে</p>
              <p>৪। নিশ্চিত হয়ে নিন, আপনার উত্তরগুলো সাবমিট হয়েছে কিনা।</p>
              <p>
                ৫। সবগুলো কোয়েশ্চনের উত্তর MCQ. কেবলমাত্র ১টি অপশনই পারবেন
                সিলেক্ট করতে।
              </p>
              <p>
                ৬। কুইজটি একবার শুরু করলে অবশ্যই সাবমিট করতে হবে, কেটে দেওয়া
                যাবে না
              </p>
              <p>ধন্যবাদ।</p>
              <p></p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <Link
            to={`/dashboard/my-courses/${courseId}/modules/${moduleId}/quizes/start`}
          >
            <Button className="cursor-pointer ">Start Quiz</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizzGuideline;
