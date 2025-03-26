import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCheck } from "lucide-react";
import { useNavigate } from "react-router";

const EnrollmentCourseCard = ({ course }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/dashboard/my-courses/${course.id}`);
  };

  return (
    <Card
      className="bg-zinc-100 text-white rounded-sm  shadow-none cursor-pointer hover:border-black py-3 flex flex-col md:flex-row items-center gap-1"
      onClick={handleCardClick}
    >
      <CardHeader className="px-3">
        <img
          src={course?.course_image_url}
          alt={course?.course_title}
          className="rounded-lg object-cover w-full md:w-[520px] aspect-video"
        />
      </CardHeader>

      {/* Text Content */}
      <CardContent className="w-full">
        {/* Course Title */}
        <CardTitle className="text-gray-600 text-sm sm:text-md">
          {course?.course_title}
        </CardTitle>

        {/* Status & Batch */}
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge
            className="bg-slate-100 flex items-center gap-1"
            variant="secondary"
          >
            <CheckCheck size={14} /> {course?.status}
          </Badge>
          <Badge variant="secondary" className="bg-slate-200">
            Batch {course?.batch}
          </Badge>
        </div>

        {/* Course Progress */}
        <p className="text-slate-500 py-3 text-xs sm:text-sm font-medium">
          Progress: {course?.progress}%
        </p>
      </CardContent>
    </Card>
  );
};

export default EnrollmentCourseCard;
