import CourseResources from "@/components/courses/CourseResources";
import { useGetEnrolledCourseQuery } from "@/features/course/courseApi";
import { useEffect } from "react";
import { toast } from "sonner";

const ResourcesPage = () => {
  const {
    data: courses = [],
    isLoading,
    isError,
  } = useGetEnrolledCourseQuery();
  // Error State
  useEffect(() => {
    if (isError) {
      toast.error("You don't Enroll any courses! Please Enroll Courses.");
    }
  }, [isError]);
  // Loading State
  if (isLoading) {
    return (
      <p className="text-center text-muted-foreground">Loading courses...</p>
    );
  }

  // Empty State
  if (courses.length === 0) {
    return (
      <p className="text-center text-gray-500 py-10">
        No courses enrolled yet.
      </p>
    );
  }

  return (
    <div className="p-6 space-y-10">
      {/* Pass All Enrolled Courses to CourseResources */}
      <CourseResources courses={courses} />
    </div>
  );
};

export default ResourcesPage;
