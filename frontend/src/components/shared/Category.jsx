import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  BarChart2,
  Brain,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Code,
  Database,
  Paintbrush,
  Shield,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import CourseCard from "./CourseCard";
import { useGetAllCategoryQuery, useLazyGetAllCoursesQuery } from "@/features/course/courseApi";

// Mapping of category names to Lucide icons
const categoryIcons = {
  "Web & App Development": <Code size={20} />,
  "Product Management & Design": <BarChart2 size={20} />,
  "Business & Marketing": <Briefcase size={20} />,
  "Data Engineering": <Database size={20} />,
  "Creatives": <Paintbrush size={20} />,
  "Cyber Security": <Shield size={20} />,
  "Artificial Intelligence": <Brain size={20} />,
};

const Category = () => {
  const [activeTab, setActiveTab] = useState(null);
  const scrollRef = useRef(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(false);

  // Fetch categories from the API
  const { data, isLoading, isError } = useGetAllCategoryQuery();
  const [fetchCourses, { data: courseData, isFetching }] = useLazyGetAllCoursesQuery();

  // Memoize categories
  const categories = useMemo(() => data?.category || [], [data]);

  // Function to check scroll visibility
  const checkScrollVisibility = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      
      // Determine if scrolling is possible
      const isScrollable = scrollWidth > clientWidth;
      
      // Check left scroll button visibility
      setShowLeftBtn(isScrollable && scrollLeft > 0);
      
      // Check right scroll button visibility
      setShowRightBtn(isScrollable && scrollLeft + clientWidth < scrollWidth);
    }
  };

  // Initial and dynamic scroll visibility check
  useEffect(() => {
    // Check visibility after categories are loaded
    const timeoutId = setTimeout(checkScrollVisibility, 300);

    if (scrollRef.current) {
      const currentScrollRef = scrollRef.current;

      // Add scroll event listener
      currentScrollRef.addEventListener("scroll", checkScrollVisibility);

      // Add resize event listener to recheck visibility on window resize
      window.addEventListener("resize", checkScrollVisibility);

      // Cleanup
      return () => {
        clearTimeout(timeoutId);
        currentScrollRef.removeEventListener("scroll", checkScrollVisibility);
        window.removeEventListener("resize", checkScrollVisibility);
      };
    }
  }, [categories]);

  useEffect(() => {
    if (categories.length > 0) {
      setActiveTab(categories[0].id); // Set first category as active
      fetchCourses(encodeURIComponent(categories[0].name)); // Fetch courses for first category
    }
  }, [categories, fetchCourses]);

  const handleTabChange = (category) => {
    setActiveTab(category.id);
    fetchCourses(encodeURIComponent(category.name)); // Fetch courses for selected category
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
      
      // Recheck scroll visibility after scrolling
      setTimeout(checkScrollVisibility, 300);
    }
  };

  if (isLoading) return <p>Loading categories...</p>;
  if (isError) return <p>Error loading categories.</p>;
  if (!Array.isArray(categories) || categories.length === 0) return <p>No categories available.</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="relative">
        {/* Left Scroll Button */}
        {showLeftBtn && (
          <Button
            onClick={() => scroll("left")}
            className="absolute z-10 top-2 left-0 bg-white text-black shadow-lg hover:bg-yellow-100 rounded-full p-5"
          >
            <ChevronLeft />
          </Button>
        )}

        {/* Categories List */}
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto no-scrollbar"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {categories.map((cat) => (
            <Button
              key={cat.id}
              onClick={() => handleTabChange(cat)}
              className={`px-4 py-2 rounded-sm h-[60px] flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === cat.id
                  ? "bg-black text-white"
                  : "bg-gray-50 border text-black hover:bg-gray-100"
              }`}
            >
              {categoryIcons[cat.name.trim()] || <Code size={20} />}
              <span>{cat.name}</span>
            </Button>
          ))}
        </div>

        {/* Right Scroll Button */}
        {showRightBtn && (
          <Button
            onClick={() => scroll("right")}
            className="absolute top-2 p-5 rounded-full right-0 z-10 bg-white text-black shadow-lg hover:bg-yellow-100"
          >
            <ChevronRight />
          </Button>
        )}
      </div>

      {/* Tabs Content */}
      <Tabs value={String(activeTab)} className="mt-6">
        <TabsContent key={activeTab} value={String(activeTab)}>
          {isFetching ? (
            <p>Loading courses...</p>
          ) : courseData?.courses?.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {courseData.courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <p>No courses available for this category.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Category;