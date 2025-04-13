import React from "react";
import { useGetCoursesResourcesQuery } from "@/features/course/courseApi";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const CourseRecordings = ({ courses }) => {
  // Determine the defaultValue for the first course
  const defaultExpandedValue = courses.length > 0 ? `course-${courses[0].id}` : undefined;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Render Each Course as an Accordion Item */}
      <Accordion type="single" collapsible defaultValue={defaultExpandedValue} className="w-full">
        {courses.map((course) => (
          <AccordionItem key={course.id} value={`course-${course.id}`}>
            {/* Accordion Trigger (Course Title) */}
            <AccordionTrigger className="text-xl font-semibold">
              {course.course_title}
            </AccordionTrigger>

            {/* Accordion Content (Classes and Recordings) */}
            <AccordionContent>
              <CourseClasses courseId={course.id} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

// Helper Component to Fetch and Display Classes for a Course
const CourseClasses = ({ courseId }) => {
  const {
    data: classList = [],
    isLoading,
    isError,
    error,
  } = useGetCoursesResourcesQuery(courseId);

  // Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <p className="text-sm text-muted-foreground">Loading class recordings...</p>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="flex justify-center items-center h-32">
        <p className="text-sm text-red-500">
          Failed to load resources: {error?.message || "Unknown error"}
        </p>
      </div>
    );
  }

  // Empty State
  if (classList.length === 0) {
    return (
      <div className="flex justify-center items-center h-32">
        <p className="text-sm text-gray-500">No classes available for this course.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {classList.map((cls) => (
        <Card key={cls.id} className="shadow-sm">
          <CardHeader>
            <CardTitle>{cls.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {cls.recordings?.length > 0 ? (
              <div className="space-y-2">
                {cls.recordings.map((rec) => (
                  <div key={rec.id}>
                    <a
                      href={rec.video_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {rec.title}
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No recordings available for this class.
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CourseRecordings;