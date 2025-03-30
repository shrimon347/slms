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
    <div className="p-4 md:p-15">
      <h1 className="text-2xl font-bold mb-6">My Courses</h1>
      {isLoading ? (
        <p>Loading...</p> // Show a loading indicator while fetching data
      ) : isError ? (
        <p className="text-red-500">
          Failed to load courses: {error?.message || "Unknown error"}
        </p> // Error message
      ) : courses?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Render a card for each course */}
          {courses.map((course) => (
            <EnrollmentCourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <p>No courses found.</p>
      )}
    </div>
  );
};

export default StudentCourses;
