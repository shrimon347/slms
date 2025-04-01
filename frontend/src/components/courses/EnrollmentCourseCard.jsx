import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCheck } from "lucide-react";
import { useNavigate } from "react-router";

const EnrollmentCourseCard = ({ course }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/dashboard/my-courses/${course.id}`);
  };

  return (
    <Card
      className="relative transition-all duration-200 flex flex-col md:flex-row h-full w-full p-0 md:p-1.5 items-center gap-0 md:gap-2 rounded-lg cursor-pointer border  hover:border-black bg-white shadow-none "
      onClick={handleCardClick}
    >
      {/* Course Image */}
      <CardHeader className="p-0">
        <img
          src={course?.course_image_url}
          alt={course?.course_title}
          className="w-full md:w-[175px] lg:w-[140px] xl:w-[175px] 2xl:w-[212px] rounded-lg aspect-video object-cover"
        />
      </CardHeader>

      {/* Course Content */}
      <CardContent className="flex flex-col gap-2 md:gap-1.5 items-start justify-between flex-1 self-stretch px-2 md:px-0 py-1 md:py-0">
        {/* Course Title */}
        <p className=" font-bold text-black">
          {course?.course_title}
        </p>

        {/* Status & Batch */}
        <div className="flex gap-1.5">
          <Badge
            className="flex py-0.5 px-1.5 justify-center items-center gap-1 rounded bg-slate-200"
            variant="secondary"
          >
            <CheckCheck size={12} /> {course?.status}
          </Badge>
          <Badge
            className="flex py-0.5 px-1.5 justify-center items-center gap-1 rounded bg-slate-200"
            variant="secondary"
          >
            Batch {course?.batch}
          </Badge>
        </div>

        {/* Progress */}
        <p className="text-xs sm:text-sm text-ostad-black-40 font-semibold">
          Progress: {course?.progress} %
        </p>
      </CardContent>
    </Card>
  );
};

export default EnrollmentCourseCard;
