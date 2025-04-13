import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Clock, Users } from "lucide-react";
import { Link } from "react-router";

const CourseCard = ({ course }) => {
  return (
    <Card
      className="relative shadow-none py-0 flex w-full flex-col gap-0 rounded-lg bg-white overflow-hidden h-full border border-gray-300  hover:outline-1 hover:outline-gray-400 hover:border-black"
      title={course?.title || "Course Title"}
    >
      {/* Image Section */}
      <div className="w-full h-auto aspect-video overflow-hidden">
        <img
          src={
            course?.course_image_url ||
            "https://cdn.ostad.app/course/cover/2024-12-19T15-48-52.487Z-Full-Stack-Web-Development-with-Python,-Django-&React.jpg"
          }
          alt={course?.title || "Course"}
          className="w-full h-auto aspect-video object-cover"
        />
      </div>

      {/* Info Bar */}
      <div className="flex flex-wrap p-2 justify-start items-center self-stretch border-y border-gray-200 gap-2 bg-gray-100">
        {/* Batch Info */}
        <div className="hidden sm:block">
          <Badge className="w-fit flex items-center text-[10px] font-bold gap-1 py-1 px-2 rounded bg-gray-200 text-gray-600">
             {course?.batch || "N/A"} Batch
          </Badge>
        </div>

        {/* Seats Left */}
        <div className="flex items-center gap-1 py-1 px-2 rounded  bg-gray-200 text-gray-600">
          <Users className="w-3 h-3" />
          <p className="text-[12px] ">{course?.remaining_seat + "Seats Left" || "N/A"} </p>
        </div>

        {/* Time Left */}
        <div className="flex items-center gap-1 py-1 px-2 rounded bg-gray-200 text-gray-600">
          <Clock className="w-3 h-3" />
          <p className="text-[12px]">{course?.time_remaining === "Course Started" ? course?.time_remaining : course?.time_remaining + "Days Left"  || "N/A"}</p>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="flex flex-col w-full justify-between gap-1 grow px-2 pt-2 pb-0 md:px-4 md:py-3">
        {/* Course Title */}
        <h3 className="text-base font-bold md:text-lg line-clamp-3 text-gray-800">
          {course?.title || "Course Title"}
        </h3>

        {/* Button */}
        <div className="w-full">
          {/* Mobile Button */}
          <div className="w-full sm:hidden">
            <Link to={`/courses/${course.slug}`}>
            <Button
              className="group w-full flex gap-2 justify-center items-center transition-all duration-200 active:scale-[98%] h-8 px-3 py-2 cursor-pointer rounded bg-gray-200 hover:bg-gray-300 active:bg-gray-400"
            >
              <p className="uppercase whitespace-nowrap transition-all duration-200 text-xs text-gray-800">
                See Details
              </p>
              <ArrowRight className="w-5 h-5 min-w-[20px] text-black invert brightness-0" />
            </Button>
            </Link>
          </div>

          {/* Desktop Button */}
          <div className="w-full hidden sm:block">
            <Link to={`/courses/${course.slug}`}>
            <Button
              className="group w-full flex gap-2 justify-center items-center transition-all duration-200 active:scale-[98%] h-10 px-6 py-2 cursor-pointer rounded-md bg-black hover:bg-gray-900 active:bg-gray-700"
            >
              <p className="uppercase whitespace-nowrap transition-all duration-200 text-sm text-white">
                See Details
              </p>
              <ArrowRight className="w-5 h-5 min-w-[20px]" />
            </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;