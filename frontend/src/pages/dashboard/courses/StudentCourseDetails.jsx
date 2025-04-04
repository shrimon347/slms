import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLazyGetEnrolledCourseModuleQuery } from "@/features/course/courseApi";
import {
  CirclePlay,
  Clock3Icon,
  NotepadText,
  TriangleAlert,
  VideoIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

const CourseDetails = () => {
  const { courseId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [trigger, { data: courseData, isLoading, isError, error }] =
    useLazyGetEnrolledCourseModuleQuery();

  useEffect(() => {
    if (courseId) {
      trigger(courseId);
    }
  }, [courseId, trigger]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error?.message || "Unknown error"}</p>;

  const course = courseData?.course_enroll;
  const totalLessons = course?.modules.reduce(
    (total, module) => total + module.lessons.length,
    0
  );

  return (
    <div className="p-4 md:p-14">
      {/* Course Title and Description */}
      <h1 className="text-2xl font-bold mb-4">{course?.title}</h1>
      <p className="text-gray-600 mb-6">{course?.description}</p>

      {/* Flex Layout for Responsive Design */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column: Modules List */}
        <div className="w-full">
          <div className="w-full p-5 border hover:border-black rounded-md overflow-y-auto">
            {course?.modules?.map((module, index) => (
              <Accordion type="single" collapsible key={module.id}>
                <AccordionItem value={`item-${index + 1}`}>
                  <AccordionTrigger className="hover:no-underline cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4 items-center">
                        <div className="bg-green-500 rounded-sm h-15 items-center justify-center text-white flex flex-col w-auto p-2">
                          Module<span className="text-lg"> {module.order}</span>
                        </div>
                        <div>
                          <p className="text-lg font-bold">{module.title}</p>
                          <div className="flex gap-6">
                            <div className="flex items-center gap-2">
                              <VideoIcon />
                              {totalLessons} Class Recordings
                            </div>
                            <div className="flex items-center gap-2">
                              <NotepadText /> 1 Quiz
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div>
                      <p>{module.description}</p>
                    </div>
                    <div className="bg-zinc-200 mt-10 p-4 rounded-sm">
                      <ul>
                        {module.lessons.map((lesson) => (
                          <li
                            key={lesson.id}
                            className="bg-zinc-100 mb-5 border hover:border-black rounded-sm px-4 py-2 flex justify-between items-center"
                          >
                            <div>
                              <p className="font-bold">{lesson.title}</p>
                              <p className="flex items-center gap-2 py-2">
                                <Clock3Icon className="w-4" /> {lesson.duration}{" "}
                                mins
                              </p>
                            </div>
                            <div>
                              <Link
                                to={`/dashboard/my-courses/${courseId}/recordings?play=${lesson.id}`}
                                className="flex items-center gap-1 bg-zinc-200 hover:bg-zinc-400 hover:text-white p-2 rounded-sm"
                              >
                                <CirclePlay className="w-5" /> Class Recording
                              </Link>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <ul>
                        <li className="bg-zinc-100 mb-5 border hover:border-black rounded-sm px-4 py-2 flex justify-between items-center">
                          <div>
                            <p className="font-bold">{module.quiz.title}</p>
                            <p className="flex items-center gap-2 py-2 text-red-500">
                              <Clock3Icon className="w-4" />
                              {Math.floor(module.quiz.time_limit / 60)} min{" "}
                              {module.quiz.time_limit % 60} s{" "}
                            </p>
                          </div>
                          <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle className="items-center flex flex-col gap-4">
                                  <TriangleAlert
                                    size={48}
                                    className="text-red-500"
                                  />
                                  সাবধান!! কুইজ এর নিয়মাবলী জেনে নিই।
                                </DialogTitle>
                                <DialogDescription asChild>
                                  {/* Removed <p> and directly used <ul> */}
                                  <ul className="list-disc pl-5 mb-4 py-3">
                                    <li>
                                      আপনি এই কুইজ আর দেয়ার সুযোগ পাবেন না।
                                      তাই, আপনার ইন্টারনেট কানেকশন এবং
                                      ইলেক্ট্রিসিটি ঠিকঠাক আছে কিনা যাচাই করে
                                      নিন।
                                    </li>
                                    <li>
                                      কুইজের মাঝখানে কোনো কারনে ডিসকানেক্ট হয়ে
                                      গেলে আবার লগইন করে কুইজ শুরু করতে পারবেন।
                                      আপনার টাইম কোনো কারনে লস হলে সেটা আপনাকে
                                      আর দেয়া হবে না।
                                    </li>
                                    <li>
                                      আপনার ডিভাইসে সমস্যা হলে অন্য ডিভাইস থেকে
                                      টেস্টে জয়েন করতে পারবেন।
                                    </li>
                                    <li>
                                      আপনি সঠিক সময়ে কুইজ সাবমিট না করতে পারলে
                                      আপনার কুইজ অটো সাবমিট হয়ে যাবে। আপনি আর
                                      এই কুইজ দেয়ার সুযোগ পাবেন না।
                                    </li>
                                  </ul>
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex justify-end">
                                <Link
                                  to={`/dashboard/my-courses/${courseId}/modules/${module.id}/quizes/guidelines`}
                                >
                                  <Button className="cursor-pointer">
                                    {" "}
                                    I Agree, Continue
                                  </Button>
                                </Link>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <div>
                            {/* Conditionally display total marks or obtained marks / total marks */}
                            {module?.quiz_result &&
                            module?.quiz_result?.submitted ? (
                              <p className="p-2 text-green-600 font-bold">
                                Marks Obtained:{" "}
                                {module?.quiz_result.obtained_marks} /{" "}
                                {module?.quiz_result.total_marks}
                              </p>
                            ) : (
                              <p className="p-2 text-green-600 font-bold">
                                Total Questions: {module.quiz.total_questions}
                              </p>
                            )}

                            {/* Conditionally render the button */}
                            {module?.quiz_result &&
                            module?.quiz_result.submitted ? (
                              <Link to={`/dashboard/my-courses/${courseId}/modules/${module.id}/quizes/${module.quiz_result.id}/result`}>
                                <Button className="w-full cursor-pointer">
                                  <NotepadText className="w-5" /> View Result
                                </Button>
                              </Link>
                            ) : (
                              <Button
                                onClick={() => setIsOpen(true)}
                                className="w-full cursor-pointer"
                              >
                                <NotepadText className="w-5" /> Take A Quiz
                              </Button>
                            )}
                          </div>
                        </li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </div>

        {/* Right Column: Extra Info (Remains Fixed) */}
        <div className="w-full md:w-1/3 bg-gray-200 p-4 rounded-md h-[200px]">
          <p>Right Column Content</p>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
