import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CourseCard from "./CourseCard";

const categories = [
  {
    id: "web",
    name: "Web & App Development",
    courses: 31,
    workshops: 5,
    icon: "💻",
  },
  {
    id: "product",
    name: "Product Management & Design",
    courses: 8,
    workshops: 2,
    icon: "📢",
  },
  {
    id: "business",
    name: "Business & Marketing",
    courses: 6,
    workshops: 0,
    icon: "📊",
  },
  {
    id: "data",
    name: "Data Engineering",
    courses: 5,
    workshops: 1,
    icon: "📈",
  },
  {
    id: "data tuku",
    name: "Data Engineering 2",
    courses: 5,
    workshops: 1,
    icon: "📈",
  },
  {
    id: "creatives",
    name: "Creative and craft",
    courses: 5,
    workshops: 1,
    icon: "🎨",
  },
];

const Category = () => {
  const [activeTab, setActiveTab] = useState("web");
  const scrollRef = useRef(null);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(true);

  useEffect(() => {
    if (scrollRef.current) {
      const currentScrollRef = scrollRef.current;
      const handleScroll = () => {
        setShowLeftBtn(currentScrollRef.scrollLeft > 0);
        setShowRightBtn(
          currentScrollRef.scrollLeft + currentScrollRef.clientWidth <
            currentScrollRef.scrollWidth
        );
      };
      currentScrollRef.addEventListener("scroll", handleScroll);
      return () => currentScrollRef.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const scroll = (direction) => {
    if (!scrollEnabled) {
      setScrollEnabled(true);
    }
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="relative">
        {showLeftBtn && scrollEnabled && (
          <Button
            onClick={() => scroll("left")}
            className="absolute z-10 top-2 bg-white text-black shadow-lg hover:bg-yellow-100 rounded-full p-5"
          >
            <ChevronLeft />
          </Button>
        )}
        <div
          ref={scrollRef}
          className={`flex space-x-4 ${
            scrollEnabled ? "overflow-x-auto" : "overflow-hidden"
          } no-scrollbar`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => (
            <Button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-4 py-2 rounded-sm h-[60px] ${
                activeTab === cat.id
                  ? "bg-black text-white"
                  : "bg-gray-50 border text-black hover:bg-gray-100"
              }`}
            >
              {cat.icon} {cat.name}
            </Button>
          ))}
        </div>
        {showRightBtn && (
          <Button
            onClick={() => scroll("right")}
            className="absolute top-2 p-5 rounded-full right-0 z-10 bg-white text-black shadow-lg hover:bg-yellow-100"
          >
            <ChevronRight />
          </Button>
        )}
      </div>
      <Tabs value={activeTab} className="mt-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
        {categories.map((cat) => (
            <TabsContent key={cat.id} value={cat.id}>
              <CourseCard />
            </TabsContent>
        ))}
		</div>
      </Tabs>
    </div>
  );
};
export default Category;
