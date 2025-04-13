import CertificateViewer from "@/components/courses/CertificateViewer";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLazyGetEnrolledCourseModuleQuery } from "@/features/course/courseApi";
import {
  CirclePlay,
  Clock3Icon,
  DownloadIcon,
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

  return (
    <div className="p-4 md:p-14">
      <h1 className="text-2xl font-bold mb-4">{course?.title}</h1>
      <p className="text-gray-600 mb-6">{course?.description}</p>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="certificate">Certificate</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full">
              <div className="w-full p-5 border hover:border-black rounded-md overflow-y-auto">
                {course?.modules?.map((module, index) => (
                  <Accordion type="single" collapsible key={module.id}>
                    <AccordionItem value={`item-${index + 1}`}>
                      <AccordionTrigger className="hover:no-underline cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex gap-4 items-center">
                            <div className="bg-green-500 rounded-sm h-15 items-center justify-center text-white flex flex-col w-auto p-2">
                              Module
                              <span className="text-lg">{module.order}</span>
                            </div>
                            <div>
                              <p className="text-lg font-bold">
                                {module.title}
                              </p>
                              <div className="flex gap-6">
                                <div className="flex items-center gap-2">
                                  <VideoIcon />
                                  {module.lessons.length} Class Recordings
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
                        <div
                          dangerouslySetInnerHTML={{
                            __html: module.description.replace(/\n/g, "<br>"),
                          }}
                          className="p-3"
                        ></div>
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
                                    <Clock3Icon className="w-4" />{" "}
                                    {lesson.duration} mins
                                  </p>
                                </div>
                                <div>
                                  <Link
                                    to={`/dashboard/my-courses/${courseId}/recordings?play=${lesson.id}`}
                                    className="flex items-center gap-1 bg-zinc-200 hover:bg-zinc-400 hover:text-white p-2 rounded-sm"
                                  >
                                    <CirclePlay className="w-5" /> Class
                                    Recording
                                  </Link>
                                </div>
                              </li>
                            ))}
                          </ul>

                          {/* Quiz Section */}
                          <ul>
                            <li className="bg-zinc-100 mb-5 border hover:border-black rounded-sm px-4 py-2 flex justify-between items-center">
                              <div>
                                <p className="font-bold">
                                  {module?.quiz?.title}
                                </p>
                                <p className="flex items-center gap-2 py-2 text-red-500">
                                  <Clock3Icon className="w-4" />
                                  {Math.floor(
                                    module?.quiz?.time_limit / 60
                                  )}{" "}
                                  min {module?.quiz?.time_limit % 60} s
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
                                      <ul className="list-disc pl-5 mb-4 py-3">
                                        <li>
                                          আপনি এই কুইজ আর দেয়ার সুযোগ পাবেন না।
                                        </li>
                                        <li>
                                          মাঝখানে ডিসকানেক্ট হলে, টাইম ফিরে
                                          পাবেন না।
                                        </li>
                                        <li>অন্য ডিভাইসে কুইজ করতে পারবেন।</li>
                                        <li>
                                          সময়মতো সাবমিট না করলে, অটো সাবমিট
                                          হবে।
                                        </li>
                                      </ul>
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="flex justify-end">
                                    <Link
                                      to={`/dashboard/my-courses/${courseId}/modules/${module.id}/quizes/guidelines`}
                                    >
                                      <Button className="cursor-pointer">I Agree, Continue</Button>
                                    </Link>
                                  </div>
                                </DialogContent>
                              </Dialog>

                              <div>
                                {module?.quiz_result?.submitted ? (
                                  <>
                                    <p className="p-2 text-green-600 font-bold">
                                      Marks Obtained:{" "}
                                      {module.quiz_result.obtained_marks} /{" "}
                                      {module.quiz_result.total_marks}
                                    </p>
                                    <Link
                                      to={`/dashboard/my-courses/${courseId}/modules/${module.id}/quizes/${module.quiz_result.id}/result`}
                                    >
                                      <Button className="w-full cursor-pointer">
                                        <NotepadText className="w-5" /> View
                                        Result
                                      </Button>
                                    </Link>
                                  </>
                                ) : (
                                  <>
                                    <p className="p-2 text-green-600 font-bold">
                                      Total Questions:{" "}
                                      {module?.quiz?.total_questions}
                                    </p>
                                    <Button
                                      onClick={() => setIsOpen(true)}
                                      className="w-full cursor-pointer"
                                    >
                                      <NotepadText className="w-5" /> Take A
                                      Quiz
                                    </Button>
                                  </>
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

            {/* Right Column: Add relevant info here */}
            <div className="w-full md:w-1/3 bg-gray-200 p-4 rounded-md h-fit space-y-4">
              {/* Private Group Join Section */}
              <div className="w-full flex flex-col gap-3 p-4 border rounded-lg bg-white">
                <p className="text-sm font-medium">প্রাইভেট গ্রুপে যোগ দিন</p>
                <div className="w-full grid grid-cols-2 gap-2">
                  {/* WhatsApp Join */}
                  <div className="w-full bg-green-50 hover:bg-green-100 text-green-700 rounded-md">
                    <Button
                      variant="ghost"
                      className="w-full h-10 px-6 text-sm text-[#101828] hover:bg-[#EAECF0] flex justify-center items-center gap-2"
                    >
                      <span>জয়েন</span>
                      <img
                        src="https://cdn.ostad.app/public/upload/2023-12-02T06-03-49.246Z-whatsapp-line.svg"
                        alt="WhatsApp"
                        className="w-[19px] h-[19px]"
                      />
                    </Button>
                  </div>

                  {/* Facebook Join */}
                  <div className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md">
                    <Button
                      variant="ghost"
                      className="w-full h-10 px-6 text-sm text-[#101828] hover:bg-[#EAECF0] flex justify-center items-center gap-2"
                    >
                      <span>জয়েন</span>
                      <img
                        src="https://cdn.ostad.app/public/upload/2023-12-02T06-03-13.686Z-facebook-circle-line.svg"
                        alt="Facebook"
                        className="w-[19px] h-[19px]"
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Certificate Tab */}
        <TabsContent value="certificate">
          <div className="w-full bg-white border rounded-md p-4">
            <h2 className="text-xl font-semibold mb-4">
              Course Completion Certificate
            </h2>

            {course?.certificate_issued ? (
              <>
                {/* Pass the certUrl to CertificateViewer component */}
                <CertificateViewer enrollmentId={course?.enrollment_id} />
              </>
            ) : (
              <div className="text-red-600 font-semibold">
                Certificate not issued yet. You will be able to download it
                after completing the course.
                <Button className="mt-4" disabled>
                  <DownloadIcon className="w-4" /> Download Certificate
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseDetails;
