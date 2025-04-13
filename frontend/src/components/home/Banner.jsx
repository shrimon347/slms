import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useGetBannerdataQuery } from "@/features/course/courseApi";
import Autoplay from "embla-carousel-autoplay";

import { Link } from "react-router";

const Banner = () => {
  const { data, isLoading, isError } = useGetBannerdataQuery();

  if (isLoading) {
    return <div className="h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center">Loading...</div>;
  }

  if (isError || !data?.banners?.length) {
    return <div className="h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center text-red-500">Failed to load banners.</div>;
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
      className="w-full py-6 relative"
    >
      <CarouselContent>
        {data.banners.map((banner, index) => (
          <CarouselItem key={index}>
            <div
              className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-cover bg-center"
              style={{
                backgroundImage: `url('${banner.banner_image_url}')`,
              }}
            >
              <div className="absolute inset-0 bg-black opacity-50"></div>
              <div className="relative z-10 flex h-full items-center justify-center text-center text-white p-4 sm:p-8">
                <div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
                    {banner.title}
                  </h2>
                  <p className="text-sm sm:text-lg md:text-xl mb-4 sm:mb-6">
                    {banner.sub_title}
                  </p>
                  <Link to={banner.link}>
                    <button className="bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-lg hover:bg-blue-700 transition">
                      Learn More
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Show navigation only on larger screens */}
      <div className="hidden sm:block">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  );
};

export default Banner;
