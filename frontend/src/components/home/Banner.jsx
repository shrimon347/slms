import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const Banner = () => {
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
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div
              className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-cover bg-center"
              style={{
                backgroundImage: `url('https://via.placeholder.com/1500x600?text=Banner+${
                  index + 1
                }')`,
              }}
            >
              <div className="absolute inset-0 bg-black opacity-50"></div>{" "}
              {/* Overlay for text contrast */}
              <div className="relative z-10 flex h-full items-center justify-center text-center text-white p-4 sm:p-8">
                <div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
                    Hero Section {index + 1}
                  </h2>
                  <p className="text-sm sm:text-lg md:text-xl mb-4 sm:mb-6">
                    This is the description for Hero Section {index + 1}, which
                    describes the value proposition.
                  </p>
                  <button className="bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-lg hover:bg-blue-700 transition">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Hide navigation on small screens */}
      <div className="hidden sm:block">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  );
};

export default Banner;
