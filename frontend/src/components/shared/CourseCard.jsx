import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users } from "lucide-react";

const CourseCard = () => {
  return (
    <Card className="w-72 shadow-none rounded-xl overflow-hidden mx-auto">
      <div className="relative w-full h-36"></div>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Badge>Batch 10</Badge>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>9 Seats Left</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>1 Day Left</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold">
          Full Stack Web Development with JavaScript (MERN)
        </h3>
        <Button className="w-full mt-4" variant="secondary">
          See Details →
        </Button>
      </CardContent>
    </Card>
  );
};
export default CourseCard;
