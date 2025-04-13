import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useLazyGetEnrolledModuleLessonsQuery } from "@/features/course/courseApi";
import { ArrowLeft, VideoIcon } from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";

const IFRAME_SANDBOX_ATTRIBUTES =
  "allow-scripts allow-same-origin allow-presentation allow-popups";

const CourseModuleLessonVideo = () => {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const lessonId = searchParams.get("play");
  const iframeRef = useRef(null);

  const [trigger, { data: moduleData, isLoading, isError, error }] =
    useLazyGetEnrolledModuleLessonsQuery();

  const [currentLesson, setCurrentLesson] = useState(null);

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (courseId) {
      trigger(courseId);
    }
  }, [courseId, trigger]);

  const allLessons = useMemo(() => {
    if (!moduleData?.modules) return [];
    return moduleData.modules.flatMap((module) =>
      module.lessons.map((lesson) => ({ ...lesson, moduleId: module.id }))
    );
  }, [moduleData]);

  useEffect(() => {
    if (!allLessons.length) return;

    const parsedLessonId = parseInt(lessonId);
    const foundLesson = !isNaN(parsedLessonId)
      ? allLessons.find((l) => l.id === parsedLessonId)
      : null;

    setCurrentLesson(foundLesson || allLessons[0]);
  }, [allLessons, lessonId]);

  useEffect(() => {
    if (!iframeRef.current || !currentLesson) return;

    const iframe = iframeRef.current;
    iframe.setAttribute("loading", "lazy");
    iframe.setAttribute("title", currentLesson.title);
    iframe.setAttribute("sandbox", IFRAME_SANDBOX_ATTRIBUTES);
    iframe.setAttribute("src", currentLesson.content);

    return () => {
      if (iframe) {
        iframe.setAttribute("src", "about:blank");
      }
    };
  }, [currentLesson]);

  const handleLessonSelect = useCallback((lesson) => {
    setCurrentLesson(lesson);
  }, []);

  const defaultExpandedValue = useMemo(() => {
    return moduleData?.modules?.length
      ? `module-${moduleData.modules[0].id}`
      : undefined;
  }, [moduleData]);

  if (isLoading) return <LoadingSkeleton />;
  if (isError) return <ErrorDisplay message={error?.message} />;
  if (!moduleData?.modules?.length)
    return <EmptyState message="No modules found" />;

  return (
    <div className="p-4 md:p-14">
      <Button onClick={handleBack} className="mb-4 cursor-pointer">
        <ArrowLeft /> Back
      </Button>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side: Video Player */}
        <div className="w-full md:w-2/3">
          {currentLesson ? (
            <>
              <h2 className="text-xl font-bold mb-4">{currentLesson.title}</h2>
              <div className="relative w-full aspect-video">
                <iframe
                  ref={iframeRef}
                  className="w-full h-full border rounded-md"
                  allowFullScreen
                ></iframe>
              </div>
            </>
          ) : (
            <EmptyState message="Select a lesson to start" />
          )}
        </div>

        {/* Right Side: Modules and Lessons List */}
        <div className="w-full md:w-1/3 bg-zinc-200 p-3 rounded-md">
          <h3 className="text-lg font-bold mb-4">Modules</h3>
          <Accordion
            type="single"
            collapsible
            defaultValue={defaultExpandedValue}
            className="w-full bg-zinc-100 p-3 rounded-md"
          >
            {moduleData.modules.map((module) => (
              <ModuleAccordionItem
                key={module.id}
                module={module}
                currentLessonId={currentLesson?.id}
                onLessonSelect={handleLessonSelect}
              />
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

const ModuleAccordionItem = React.memo(
  ({ module, currentLessonId, onLessonSelect }) => (
    <AccordionItem value={`module-${module.id}`}>
      <AccordionTrigger className="hover:no-underline">
        <div className="">
          <span className="font-bold">Module {module.order} - </span>
          <span className="font-bold">{module.title}</span>
          <div className="flex items-center gap-2 text-red-500">
            <VideoIcon />
            {module.lessons.length} Class Recordings
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <ul>
          {module.lessons.map((lesson) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              isActive={lesson.id === currentLessonId}
              onSelect={() => onLessonSelect(lesson)}
            />
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  )
);

const LessonItem = React.memo(({ lesson, isActive, onSelect }) => (
  <li
    className={`p-2 cursor-pointer border mb-5 transition-colors hover:border-black rounded-sm px-4 py-2 ${
      isActive ? "bg-zinc-200 border-black" : "hover:bg-gray-100"
    }`}
    onClick={onSelect}
  >
    {lesson.title}
  </li>
));

const LoadingSkeleton = () => (
  <div className="p-4 md:p-14">
    <div className="animate-pulse flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-2/3">
        <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
        <div className="aspect-video bg-gray-200 rounded"></div>
      </div>
      <div className="w-full md:w-1/3">
        <div className="h-6 bg-gray-200 rounded mb-4 w-1/4"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ErrorDisplay = ({ message = "Unknown error" }) => (
  <div className="p-4 text-red-500 bg-red-50 rounded-md">
    <p>Error: {message}</p>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="p-4 text-gray-500 bg-gray-50 rounded-md text-center">
    <p>{message}</p>
  </div>
);

export default React.memo(CourseModuleLessonVideo);
