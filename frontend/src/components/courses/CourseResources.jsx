import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetCoursesResourcesQuery } from "@/features/course/courseApi";

const CourseResources = ({ courses }) => {
  // Determine the defaultValue for the first course
  const defaultExpandedValue =
    courses.length > 0 ? `course-${courses[0].id}` : undefined;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Render Each Course as an Accordion Item */}
      <Accordion
        type="single"
        collapsible
        defaultValue={defaultExpandedValue}
        className="w-full"
      >
        {courses.map((course) => (
          <AccordionItem key={course.id} value={`course-${course.id}`}>
            {/* Accordion Trigger (Course Title) */}
            <AccordionTrigger className="text-xl font-semibold">
              {course.course_title}
            </AccordionTrigger>

            {/* Accordion Content (Classes and Resources) */}
            <AccordionContent>
              <CourseClassResources courseId={course.id} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

// Helper Component to Fetch and Display Classes and Resources for a Course
const CourseClassResources = ({ courseId }) => {
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
        <p className="text-sm text-muted-foreground">Loading resources...</p>
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
        <p className="text-sm text-gray-500">
          No classes available for this course.
        </p>
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
            {cls.resources?.length > 0 ? (
              <div className="space-y-2">
                {cls.resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center space-x-2"
                  >
                    <span className="text-sm">{resource.title}</span>
                    <a
                      href={resource.file_url}
                      download
                      target="_blank"
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No resources available for this class.
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CourseResources;
