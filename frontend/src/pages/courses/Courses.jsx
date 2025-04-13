import Category from "@/components/shared/Category";
import CourseCard from "@/components/shared/CourseCard";
import { useLazyGetAllCourseswithoutcategoryQuery } from "@/features/course/courseApi";
import { useEffect } from "react";

const Courses = () => {
  const [trigger, { data, isLoading, isError }] =
    useLazyGetAllCourseswithoutcategoryQuery();

  useEffect(() => {
    trigger();
  }, [trigger]);

  const courses = data?.courses || [];

  return (
    <div className="max-w-7xl container mx-auto py-6">
      <div className="py-10">
      {isLoading ? (
        <div className="text-center text-gray-500">Loading courses...</div>
      ) : isError ? (
        <div className="text-center text-red-500">Failed to load courses</div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
      </div>

      <div className="shadow-sm py-6">
        <p className="md:text-3xl  text-xl text-center">ক্র্যাশ কোর্স</p>
        <Category />
      </div>
    </div>
  );
};

export default Courses;
