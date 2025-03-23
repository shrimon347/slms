import Banner from "@/components/home/Banner";
import Category from "@/components/shared/Category";
import CourseCard from "@/components/shared/CourseCard";

const Home = () => {
  return (
    <div className="container max-w-7xl mx-auto p-4">
      <Banner />
      <div className="shadow-sm py-6">
        <Category />
      </div>
    </div>
  );
};

export default Home;
