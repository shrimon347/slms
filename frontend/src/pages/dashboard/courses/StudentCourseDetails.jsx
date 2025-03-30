import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLazyGetEnrolledCourseModuleQuery } from "@/features/course/courseApi";
import { CirclePlay, Clock3Icon, NotepadText, VideoIcon } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router";

const CourseDetails = () => {
  const { courseId } = useParams();
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
          <div className="w-full  p-5 border hover:border-black rounded-md overflow-y-auto ">
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
                              <Link className="flex items-center gap-1 bg-zinc-200 hover:bg-zinc-400 hover:text-white p-2 rounded-sm"><CirclePlay className="w-5" /> Class Recording</Link>
                            </div>
                          </li>
                        ))}
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
