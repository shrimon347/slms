import Banner from "@/components/home/Banner";
import Category from "@/components/shared/Category";
import { Card, CardContent } from "@/components/ui/card";
import CountUp from "react-countup";


const stats = [
  {
    value: 100,
    suffix: "+",
    label: "জব প্লেসমেন্ট",
    bg: "bg-green-200",
  },
  {
    value: 1500,
    suffix: "+",
    label: "লার্নার",
    bg: "bg-blue-200",
  },
  {
    value: 83,
    suffix: "%",
    label: "কোর্স কমপ্লিশন রেট",
    bg: "bg-red-200",
  },
  {
    value: 28,
    suffix: "",
    label: "লাইভ কোর্স",
    bg: "bg-yellow-200",
  },
];
const courseBenefits = [
  {
    icon: "https://cdn.ostad.app/public/upload/2024-12-29T10-01-51.572Z-Briefcase (1).png",
    title: "জবের জন্য ডেডিকেটেড জব প্লেসমেন্ট টিম",
  },
  {
    icon: "https://cdn.ostad.app/public/upload/2024-12-29T10-02-46.620Z-CV Resume template profile.png",
    title: "সিভি বিল্ডার ও এক্সপার্ট সিভি রিভিউ",
  },
  {
    icon: "https://cdn.ostad.app/public/upload/2024-12-29T10-03-44.885Z-Support.png",
    title: "১৮ ঘন্টা লাইভ সাপোর্ট নির্দিষ্ট কোর্সে",
  },
  {
    icon: "https://cdn.ostad.app/public/upload/2024-12-29T10-04-09.402Z-Vip pro batch.png",
    title: "প্রো ব্যাচে স্পেশাল সিভি ও জব সাপোর্ট",
  },
  {
    icon: "https://cdn.ostad.app/public/upload/2024-04-20T08-43-25.151Z-Icons.svg",
    title: "লাইভ টেস্টে নিজেকে যাচাইয়ের সুযোগ",
  },
  {
    icon: "https://cdn.ostad.app/public/upload/2024-12-29T10-06-00.655Z-Problem solve.png",
    title: "দিনে ৩ টি পর্যন্ত সাপোর্ট ক্লাস নির্দিষ্ট কোর্সে",
  },
];

const Home = () => {
  return (
    <div className="container max-w-7xl mx-auto p-4">
      <Banner />
      <div className="shadow-sm py-6">
        <Category />
      </div>
      <section className="w-full py-10">
        <div className="w-full px-4 mx-auto sm:max-w-[540px] md:max-w-[720px] lg:max-w-[1150px]">
          <div className="flex flex-col items-center gap-1">
            <p className="text-xl md:text-3xl text-black text-center">
              কি কি পাচ্ছেন লাইভ কোর্সে
            </p>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-[6px] md:gap-8 lg:gap-0 mt-4 w-full">
              {courseBenefits.map((item, index) => (
                <Card
                  key={index}
                  className={`flex flex-col items-center justify-start p-3 gap-2 text-center bg-white border rounded-none shadow-sm ${
                    index === 0 || index === 3 ? "lg:border-r" : ""
                  } ${index < 3 ? "lg:border-b" : ""} ${
                    index === 2 || index === 5 ? "lg:border-l" : ""
                  }`}
                >
                  <CardContent className="flex flex-col items-center gap-2 p-0">
                    <img
                      src={item.icon}
                      alt={item.title}
                      className="w-8 md:w-[50px]"
                    />
                    <p className="text-button md:text-h5 text-ostad-black-60">
                      {item.title}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
      <div className="pt-10 md:pt-16">
      <div className="w-full px-4 mx-auto sm:max-w-[540px] md:max-w-[720px] lg:max-w-[1150px] xl:max-w-[1150px]">
        <div className="grid grid-cols-2 md:flex w-full gap-4 items-center rounded-none md:rounded-xl py-0 md:py-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`${stat.bg} py-3 md:py-6 px-6 md:px-8 flex flex-col items-start justify-center rounded-md gap-0.5 md:gap-2 w-full`}
            >
              <p className="text-xl md:text-3xl text-black-700 font-bold">
                <CountUp
                  start={0}
                  end={stat.value}
                  duration={2}
                  separator=","
                />
                {stat.suffix}
              </p>
              <p className="text-ostad-black-70 text-body-b2 md:text-body-b1 whitespace-nowrap">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Home;
