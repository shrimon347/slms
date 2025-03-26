import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users } from "lucide-react";
import { DropdownMenuSeparator } from "../ui/dropdown-menu";

const CourseCard = () => {
  return (
    <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl shadow-none rounded-xl overflow-hidden mx-auto py-0 gap-4 hover:border-black">
      {/* Image Section - Ensures no gap from the top */}
      <div className="relative w-full h-40 sm:h-48 md:h-56">
        <img
          src="https://picsum.photos/200/300"
          alt="Course"
          className="w-full h-full object-cover"
        />
      </div>

      <CardContent className="px-4 pb-3">
        {/* Badge and Info */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge>Batch 10</Badge>

          {/* Seats Left */}
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>9 Seats Left</span>
          </div>

          {/* Time Left */}
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>1 Day Left</span>
          </div>
        </div>
        <DropdownMenuSeparator />

        {/* Course Title */}
        <h3 className="text-lg sm:text-xl font-semibold">
          Full Stack Web Development with JavaScript (MERN)
        </h3>

        {/* Button */}
        <Button className="w-full mt-4" variant="secondary">
          See Details →
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
