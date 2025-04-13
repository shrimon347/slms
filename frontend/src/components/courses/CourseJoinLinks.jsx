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

const CourseJoinLinks = ({ courses }) => {
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

            {/* Accordion Content (Classes and Join Links) */}
            <AccordionContent>
              <CourseClassJoinLinks courseId={course.id} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

// Helper Component to Fetch and Display Classes and Join Links for a Course
const CourseClassJoinLinks = ({ courseId }) => {
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
        <p className="text-sm text-muted-foreground">Loading classes...</p>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="flex justify-center items-center h-32">
        <p className="text-sm text-red-500">
          Failed to load classes: {error?.message || "Unknown error"}
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
      {classList.map((cls) => {
        const classDate = new Date(cls.date); 
        const now = new Date(); 

        // Define a buffer time (e.g., ±5 minutes)
        const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
        const startTime = new Date(classDate.getTime() - bufferTime); // Start of live window
        const endTime = new Date(classDate.getTime() + bufferTime); // End of live window

        // Determine the status of the class
        const isPast = now > endTime; // Class date is in the past
        const isFuture = now < startTime; // Class date is in the future
        const isLive = !isPast && !isFuture && cls.join_link; // Class is live within the buffer time
        console.log("isline",isLive);
        console.log("clas",classDate);
        

        return (
          <Card key={cls.id} className="shadow-sm">
            <CardHeader>
              <CardTitle>{cls.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLive ? (
                // Show the join link if the class is live
                <a
                  href={cls.join_link}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                  Join Class
                </a>
              ) : isPast ? (
                // Show a message if the class has ended
                <p className="text-sm text-gray-500">Live class session has ended. The class recoding will provide you.</p>
              ) : (
                // Show a message if the class is scheduled for the future
                <p className="text-sm text-gray-500">
                  No class scheduled at this time. When the class starts, the join link will appear here.
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CourseJoinLinks;