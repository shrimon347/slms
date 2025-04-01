import EnrollmentCourseCard from "@/components/courses/EnrollmentCourseCard";
import { useGetEnrolledCourseQuery } from "@/features/course/courseApi";

const StudentCourses = () => {
  const {
    data: courses,
    isLoading,
    isError,
    error,
  } = useGetEnrolledCourseQuery();

  return (
    <div className="p-4 md:p-14">
      {/* Header */}
      <h1 className="text-h4 font-semibold text-ostad-black-100 mb-6">
        My Courses
      </h1>

      {/* Loading State */}
      {isLoading && <p className="text-center text-gray-500">Loading...</p>}

      {/* Error State */}
      {isError && (
        <p className="text-red-500 text-center">
          Failed to load courses: {error?.message || "Unknown error"}
        </p>
      )}

      {/* Courses Grid */}
      {courses?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-2 md:gap-6 w-full">
          {/* Render a card for each course */}
          {courses.map((course) => (
            <EnrollmentCourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        // No Courses Found
        <p className="text-center text-gray-500">No courses found.</p>
      )}
    </div>
  );
};

export default StudentCourses;
