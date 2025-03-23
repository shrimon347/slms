import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

// You can customize the button with your preferred UI library or just use basic HTML and TailwindCSS.
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
      className="w-full py-6"
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div
              className="relative p-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://via.placeholder.com/1500x600?text=Banner+${
                  index + 1
                }')`,
              }}
            >
              <div className="absolute inset-0 bg-black opacity-50"></div>{" "}
              {/* Overlay for text contrast */}
              <div className="relative z-10 flex h-full items-center justify-center text-center text-white p-8">
                <div>
                  <h2 className="text-5xl font-bold mb-4">
                    Hero Section {index + 1}
                  </h2>
                  <p className="text-xl mb-6">
                    This is the description for Hero Section {index + 1}, which
                    describes the value proposition.
                  </p>
                  <button className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
export default Banner;
