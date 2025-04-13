import { useEffect, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useLazyGetCoursesDetailsQuery } from "@/features/course/courseApi";
import { ArrowRight, Flower, RadioTower } from "lucide-react";
import { Link, useParams } from "react-router";

const faqData = [
  {
    question: "1. আমি কি ভিডিওগুলো ডাউনলোড করতে পারবো?",
    answer: "হ্যা, ওস্তাদের অ্যাপে আপনি ভিডিও ডাউনলোড করে রাখতে পারবেন।",
  },
  {
    question: "2. আমি কি মোবাইল দিয়ে জয়েন করতে পারবো?",
    answer:
      "মোবাইল দিয়ে লাইভ ক্লাসে জয়েন করতে পারবেন কিন্তু প্র্যাকটিস করতে পারবেন না",
  },
  {
    question: "3. আমার কি ভিডিওগুলোর লাইফটাইম এক্সেস থাকবে?",
    answer: "জ্বি, ভিডিও এবং রিসোর্সের লাইফ টাইম এক্সেস পাচ্ছেন।",
  },
  {
    question: "4. লাইভ ক্লাস কোথায় হবে ?",
    answer:
      "লাইভ ক্লাসে আপনি একটি সিঙ্গেল ক্লিকে জয়েন করে ফেলতে পারবেন ওস্তাদ প্ল্যাটফর্ম থেকেই।",
  },
  {
    question: "5. এসেসমেন্ট কিভাবে হবে? ",
    answer:
      "প্রতি সপ্তাহে থাকবে একটি করে কুইজ এবং এক্সাম উইকে থাকবে এসাইনমেন্ট এবং কুইজ।",
  },
  {
    question: "6. দেশের বাইরে থেকে কিভাবে পেমেন্ট করবো? ",
    answer:
      "ওস্তাদের ইন্টারন্যাশনাল পেমেন্ট গেটওয়ের (Stripe) মাধ্যমে আপনি ক্রেডিট কিংবা ডেবিট কার্ড দিয়ে পে করতে পারবেন।",
  },
  {
    question: "7. লাইভ ক্লাসের রেকর্ডিং থাকবে? ",
    answer: "জ্বী, পাবেন লাইভ ক্লাস রেকর্ডিং এর লাইফ টাইম এক্সেস।",
  },
  {
    question: "8. প্র্যাকটিস করতে গিয়ে সমস্যায় পড়লে সাপোর্ট পাবো কোথায়?",
    answer:
      "যেকোনো সমস্যায় দুইবেলা সাপোর্ট ক্লাসে স্ক্রিন শেয়ার করে সাপোর্ট নিবেন দক্ষ সাবজেক্ট ম্যাটার এক্সপার্টদের থেকে।",
  },
];

const CourseDetails = () => {
  const { slug } = useParams();
  // Fetch course details using the lazy query
  const [triggerGetCourseDetails, { data: courseData, isLoading, isError }] =
    useLazyGetCoursesDetailsQuery();

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Trigger the API call when the component mounts or slug changes
  useEffect(() => {
    if (slug) {
      triggerGetCourseDetails(slug);
    }
  }, [slug, triggerGetCourseDetails]);

  // Handle loading state
  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  // Handle error state
  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load course details.
      </div>
    );
  }

  // Extract course data
  const course = courseData?.course;

  // Render the course details
  return (
    <div className="w-full px-[15px] mx-auto sm:max-w-[540px] md:max-w-[720px] lg:max-w-[1150px] xl:max-w-[1150px]">
      <div className="py-4 md:!pt-20 md:!pb-10 px-0 gap-2 md:!gap-10 flex flex-col z-[20] h-fit">
        {/* Course Header Section */}
        <div className="hidden md:!flex w-full gap-4">
          <div className="w-[55%] flex flex-col justify-end items-start gap-4 flex-1">
            <div className="flex flex-col items-start gap-2 self-stretch">
              <div className="flex py-1 px-3 items-center gap-1 rounded-2xl bg-ostad-error-20">
                <img
                  src="https://cdn.ostad.app/public/upload/2024-05-13T11-13-35.024Z-LiveClass-line.svg"
                  alt="Live Class Icon"
                />
                <p className="text-nav-menu text-ostad-error-100">লাইভ কোর্স</p>
              </div>
              <div className="flex flex-col items-center gap-3 self-stretch">
                <div className="flex flex-col items-start gap-2 self-stretch">
                  <h1 className="relative text-h4 md:!text-h3 text-center md:!text-start text-ostad-black-100">
                    {course?.title}
                  </h1>
                  <div className="flex items-center justify-center text-ostad-success-90 gap-2">
                    <div className="flex items-center gap-1">
                      <p className="text-body-b2 text-ostad-success-90 md:!text-nav-menu">
                        4.9
                      </p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                      >
                        <path
                          d="M8.99725 13.695L3.7075 16.656L4.88875 10.71L0.4375 6.594L6.45775 5.88L8.99725 0.375L11.5367 5.88L17.557 6.594L13.1057 10.71L14.287 16.656L8.99725 13.695ZM8.99725 11.976L12.1825 13.7587L11.4707 10.179L14.1505 7.70025L10.5257 7.2705L8.99725 3.95625L7.46875 7.27125L3.844 7.70025L6.52375 10.179L5.812 13.7587L8.99725 11.976Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                    <p className="underline cursor-pointer text-caption text-ostad-black-40">
                      (293 Ratings)
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-body-b2 text-ostad-black-60 text-center md:!text-start md:!text-ostad-black-40">
                {course?.description}
              </p>
            </div>
            <div className="flex flex-row w-full">
              <div className="flex gap-3">
                <div>
                  {course?.enrollment_status === null ? (
                    <Link to={`/purchase/checkout?course=${course?.slug}`}>
                      <Button
                        id="btn-join-live-batch"
                        type="button"
                        className=" bg-black cursor-pointer"
                      >
                        <div className="flex justify-center items-center gap-2">
                          <p className="whitespace-nowrap false">
                            ব্যাচে ভর্তি হোন
                          </p>
                          <div className="flex justify-center items-center">
                            <ArrowRight />
                          </div>
                        </div>
                      </Button>
                    </Link>
                  ) : (
                    <Link to={`/dashboard/my-courses/`}>
                      <Button className="cursor-pointer">কোর্স যাই</Button>
                    </Link>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-5 items-center">
                  <p className="text-h3 px-5 text-ostad-black-100">{`৳${course?.price}`}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[45%] h-full">
            <div className="relative">
              <div className="relative cursor-pointer group">
                <div className="absolute top-0 z-[5] w-full flex gap-2 rounded-tl border-b !border-ostad-black-60 rounded-tr-[14px] py-1 px-2 bg-[rgba(16,24,40,0.20)] backdrop-blur-[2.5px] overflow-hidden">
                  <img
                    className="min-w-8"
                    src="https://cdn.ostad.app/public/upload/2024-02-06T10-08-49.464Z-VideosORANF.png"
                    alt="Demo Class Icon"
                  />
                  <p className="text-subtitle-s2 text-white">
                    ক্লিক করে দেখে নিন কোর্সের ডেমো ক্লাস
                  </p>
                </div>
                <img
                  src={course?.course_image_url}
                  alt="Course Image"
                  className="w-full aspect-video object-cover transition-all duration-200 group-hover:brightness-[0.8] ease-out rounded-md shadow-lg border"
                />
                <div className="absolute inset-0 flex items-center justify-center group-hover:scale-100 scale-[0.9] transition-all duration-200 ease-out rounded-2xl">
                  <div className="bg-ostad-black-100/10 flex items-center justify-center rounded-full size-28">
                    <div className="flex items-center justify-center bg-gradient-to-b from-primary/30 to-primary shadow-md rounded-full size-20 transition-all ease-out duration-200 relative group-hover:scale-[1.2] scale-100">
                      <img
                        className="size-[72px] text-white fill-white group-hover:scale-105 scale-100 transition-transform duration-200 ease-out"
                        src="https://cdn.ostad.app/public/upload/2023-11-15T10-15-34.164Z-play-icon.svg"
                        alt="Play Icon"
                        style={{
                          filter:
                            "drop-shadow(rgba(0, 0, 0, 0.07) 0px 4px 3px) drop-shadow(rgba(0, 0, 0, 0.06) 0px 2px 2px)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Footer Section */}
        <div className="w-full bg-ostad-black-bg flex justify-between items-center gap-2 md:!gap-4 p-2 md:!px-3 md:!py-2 rounded">
          <div className="max-w-fit md:!max-w-[132px] min-w-fit md:!min-w-[132px]">
            <div className="flex flex-col gap-1">
              <p className="text-caption1 text-ostad-black-60">ব্যাচ শুরু</p>
              <div className="hidden md:!block">
                <div
                  className="flex flex-wrap justify-center items-center bg-inherit rounded-[4px] w-fit gap-2 text-center"
                  style={{
                    backgroundColor: "rgb(243, 244, 247)",
                    color: "rgb(71, 84, 103)",
                    padding: "3px 6px",
                    borderRadius: "4px",
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                    border: "0px solid rgb(102, 112, 133)",
                  }}
                >
                  <p
                    className="font-medium text-center leading-[19px] tracking-[0.02em] flex justify-center items-center text-[11px]"
                    style={{
                      fontSize: "14px",
                      margin: "0px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {new Date(course?.start_date).toLocaleDateString("bn-BD", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <p className="block md:!hidden text-caption1 md:!text-body-b2 text-ostad-black-60">
                {new Date(course?.start_date).toLocaleDateString("bn-BD", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>
          </div>
          <div className="w-[1px] self-stretch bg-ostad-black-opac"></div>
          <div className="max-w-fit hidden md:!block">
            <div className="flex gap-2 items-center">
              <div className="text-ostad-yellow-110">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.36198 0.666504V1.99984H10.362V0.666504H11.6953V1.99984H14.362C14.5388 1.99984 14.7084 2.07008 14.8334 2.1951C14.9584 2.32012 15.0286 2.48969 15.0286 2.6665V13.3332C15.0286 13.51 14.9584 13.6796 14.8334 13.8046C14.7084 13.9296 14.5388 13.9998 14.362 13.9998H2.36198C2.18517 13.9998 2.0156 13.9296 1.89057 13.8046C1.76555 13.6796 1.69531 13.51 1.69531 13.3332V2.6665C1.69531 2.48969 1.76555 2.32012 1.89057 2.1951C2.0156 2.07008 2.18517 1.99984 2.36198 1.99984H5.02865V0.666504H6.36198ZM13.6953 6.6665H3.02865V12.6665H13.6953V6.6665ZM10.386 7.42384L11.3286 8.3665L8.02865 11.6665L5.67131 9.30917L6.61531 8.3665L8.02931 9.78117L10.3866 7.42384H10.386ZM5.02865 3.33317H3.02865V5.33317H13.6953V3.33317H11.6953V3.99984H10.362V3.33317H6.36198V3.99984H5.02865V3.33317Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <p className="text-caption1 text-ostad-black-60">লাইভ ক্লাস</p>
            </div>
            <p className="md:!text-body-b2 text-overline text-ostad-black-60">
              রাত ৯:০০- ১০:৩০ (<span>শুক্র,</span>
              <span>রবি</span>)
            </p>
          </div>
          <div className="hidden lg:!block w-[1px] self-stretch bg-ostad-black-opac"></div>
          <div className="hidden lg:!block max-w-[132px] min-w-[132px]">
            <div className="flex gap-2 items-center">
              <img
                src="https://cdn.ostad.app/public/upload/2024-05-13T09-03-53.409Z-_chair.svg"
                alt="Remaining Seats Icon"
              />
              <p className="text-caption1 text-ostad-black-60">সিট বাকি</p>
            </div>
            <p className="text-body-b2 md:!text-button text-ostad-black-60">{`${course?.remaining_seat} টি`}</p>
          </div>
          <div className="hidden lg:!block w-[1px] self-stretch bg-ostad-black-opac"></div>
          <div className="max-w-fit md:!max-w-[132px] min-w-fit md:!min-w-[132px]">
            <div className="flex gap-1 md:!gap-2 items-center">
              <img
                className="w-4"
                src="https://cdn.ostad.app/public/upload/2023-11-25T10-38-35.495Z-Line.svg"
                alt="Batch Icon"
              />
              <p className="text-caption1 md:!text-body-b2 text-ostad-black-60">
                ভর্তি চলছে
              </p>
            </div>
            <p className="text-caption md:!text-subtitle-s2 text-ostad-black-60">{`${course?.batch} Batch`}</p>
          </div>
        </div>
      </div>
      <div>
        <p className="text-3xl text-center font-bold">কোর্সের কারিকুলাম</p>
        <div className="flex items-center justify-center py-5 gap-4">
          <div className="flex items-center">
            <Flower className="px-1" /> {course?.modules?.length} মডিউল
          </div>
          <div className="flex items-center">
            <RadioTower className="px-1" /> {course?.modules?.length * 2} লাইভ
            ক্লাস
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <p className="text-caption md:!text-body-b1 text-ostad-black-70">
            ক্লাস নিবেনঃ
          </p>
          {course?.instructors?.map((instructor) => (
            <div
              key={instructor.id}
              className="flex items-center gap-1 py-[3px] pl-1 pr-2 rounded-full bg-white"
            >
              <img
                src={instructor.profile_image}
                alt={instructor.full_name}
                className="w-4 h-4 rounded-full"
              />
              <p className="text-caption md:!text-body-b2 text-ostad-black-40">
                {instructor.full_name}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div
        id="studyplans"
        className="flex flex-col items-center justify-center p-6"
      >
        {/* Accordion for Course Modules */}
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="module-0"
        >
          {" "}
          {/* Set defaultValue here */}
          {course?.modules?.map((module, index) => (
            <AccordionItem
              key={index}
              value={`module-${index}`} // Each AccordionItem has its unique value
              className="mb-4 border rounded-lg shadow-md"
            >
              {/* Module Header */}
              <AccordionTrigger className="flex items-center gap-3 p-4 bg-ostad-black-bg hover:bg-ostad-black-opac-2 transition-colors">
                {/* Module Title */}
                <p className="text-black font-bold text-2xl leading-[118.7%] line-clamp-2">
                  {module.order}. {module.title}
                </p>
              </AccordionTrigger>

              {/* Module Content */}
              <AccordionContent className="p-4 text-ostad-black-60">
                {/* Module Description */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: module.description.replace(/\n/g, "<br>"),
                  }}
                ></div>

                {/* Additional Metadata (Optional) */}
                <div className="flex flex-wrap gap-3 mt-4">
                  {/* Live Classes */}
                  <div className="flex items-center gap-1 bg-inherit rounded-[4px] px-2 py-1 text-sm">
                    <img
                      src="https://cdn.ostad.app/public/upload/2023-11-06T07-33-41.592Z-LiveClass-line.png"
                      alt="Live Class Icon"
                      className="w-4 h-4"
                    />
                    <p className="font-medium text-ostad-black-60">
                      2 live class
                    </p>
                  </div>

                  {/* Assignments */}
                  <div className="flex items-center gap-1 bg-inherit rounded-[4px] px-2 py-1 text-sm">
                    <img
                      src="https://cdn.ostad.app/public/icons/draft-line.svg"
                      alt="Assignment Icon"
                      className="w-4 h-4"
                    />
                    <p className="font-medium text-ostad-black-60">
                      1 Assignment
                    </p>
                  </div>

                  {/* Tests */}
                  <div className="flex items-center gap-1 bg-inherit rounded-[4px] px-2 py-1 text-sm">
                    <img
                      src="https://cdn.ostad.app/public/upload/2023-11-06T07-39-06.172Z-board.png"
                      alt="Test Icon"
                      className="w-4 h-4"
                    />
                    <p className="font-medium text-ostad-black-60">1 Test</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <section className="py-10 md:pt-16 md:pb-[92px] bg-white">
        <div className="w-full px-4 mx-auto sm:max-w-[540px] md:max-w-[720px] lg:max-w-[1150px] xl:max-w-[1150px]">
          <div className="flex flex-col items-center justify-center gap-3 md:gap-6">
            {/* Title */}
            <p className="text-3xl md:text-5xl font-bold text-gray-900 text-center">
              যেসব ট্যুলস ও টেকনোলোজি শিখবেন
            </p>
            {/* Tools Grid */}
            <div className="w-full md:w-[54%] grid grid-cols-3 md:grid-cols-4 gap-4">
              {/* C# */}
              <div className="flex flex-col items-center justify-center gap-3 p-6 rounded bg-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <img
                  className="w-8 h-8"
                  src="https://cdn.ostad.app/public/upload/2024-09-22T10-27-25.815Z-download (18).png"
                  alt="C# Logo"
                />
                <p className="text-sm text-gray-700 text-center">C#</p>
              </div>
              {/* OOP */}
              <div className="flex flex-col items-center justify-center gap-3 p-6 rounded bg-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <img
                  className="w-8 h-8"
                  src="https://cdn.ostad.app/public/upload/2024-09-22T10-28-10.536Z-download (19).png"
                  alt="OOP Logo"
                />
                <p className="text-sm text-gray-700 text-center">OOP</p>
              </div>
              {/* RestAPI */}
              <div className="flex flex-col items-center justify-center gap-3 p-6 rounded bg-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <img
                  className="w-8 h-8"
                  src="https://cdn.ostad.app/public/upload/2024-01-03T07-00-36.703Z-6733834.png"
                  alt="RestAPI Logo"
                />
                <p className="text-sm text-gray-700 text-center">RestAPI</p>
              </div>
              {/* VS Code */}
              <div className="flex flex-col items-center justify-center gap-3 p-6 rounded bg-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <img
                  className="w-8 h-8"
                  src="https://cdn.ostad.app/public/upload/2023-11-04T07-29-29.411Z-visual-studio.png"
                  alt="VS Code Logo"
                />
                <p className="text-sm text-gray-700 text-center">VS Code</p>
              </div>
              {/* Visual Studio */}
              <div className="flex flex-col items-center justify-center gap-3 p-6 rounded bg-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <img
                  className="w-8 h-8"
                  src="https://cdn.ostad.app/public/upload/2024-09-22T10-34-59.768Z-download (4).jpeg"
                  alt="Visual Studio Logo"
                />
                <p className="text-sm text-gray-700 text-center">
                  Visual Studio
                </p>
              </div>
              {/* Git & GitHub */}
              <div className="flex flex-col items-center justify-center gap-3 p-6 rounded bg-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <img
                  className="w-8 h-8"
                  src="https://cdn.ostad.app/public/upload/2023-11-04T07-29-58.367Z-code.png"
                  alt="Git & GitHub Logo"
                />
                <p className="text-sm text-gray-700 text-center">
                  Git & GitHub
                </p>
              </div>
              {/* Razor Engine */}
              <div className="flex flex-col items-center justify-center gap-3 p-6 rounded bg-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <img
                  className="w-8 h-8"
                  src="https://cdn.ostad.app/public/upload/2024-09-22T10-29-19.020Z-download (21).png"
                  alt="Razor Engine Logo"
                />
                <p className="text-sm text-gray-700 text-center">
                  Razor Engine
                </p>
              </div>
              {/* MVC Architecture */}
              <div className="flex flex-col items-center justify-center gap-3 p-6 rounded bg-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <img
                  className="w-8 h-8"
                  src="https://cdn.ostad.app/public/upload/2024-09-22T10-29-54.572Z-download (20).png"
                  alt="MVC Architecture Logo"
                />
                <p className="text-sm text-gray-700 text-center">
                  MVC Architecture
                </p>
              </div>
              {/* IIS (Windows) */}
              <div className="flex flex-col items-center justify-center gap-3 p-6 rounded bg-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <img
                  className="w-8 h-8"
                  src="https://cdn.ostad.app/public/upload/2024-09-22T10-30-34.722Z-download (22).png"
                  alt="IIS (Windows) Logo"
                />
                <p className="text-sm text-gray-700 text-center">
                  IIS (Windows)
                </p>
              </div>
              {/* Bootstrap */}
              <div className="flex flex-col items-center justify-center gap-3 p-6 rounded bg-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <img
                  className="w-8 h-8"
                  src="https://cdn.ostad.app/public/upload/2024-09-22T10-31-06.281Z-download (6).jpeg"
                  alt="Bootstrap Logo"
                />
                <p className="text-sm text-gray-700 text-center">Bootstrap</p>
              </div>
              {/* jQuery */}
              <div className="flex flex-col items-center justify-center gap-3 p-6 rounded bg-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <img
                  className="w-8 h-8"
                  src="https://cdn.ostad.app/public/upload/2024-09-22T10-31-44.028Z-download (24).png"
                  alt="jQuery Logo"
                />
                <p className="text-sm text-gray-700 text-center">jQuery</p>
              </div>
              {/* MSSQL */}
              <div className="flex flex-col items-center justify-center gap-3 p-6 rounded bg-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <img
                  className="w-8 h-8"
                  src="https://cdn.ostad.app/public/upload/2024-09-22T10-32-15.083Z-download (25).png"
                  alt="MSSQL Logo"
                />
                <p className="text-sm text-gray-700 text-center">MSSQL</p>
              </div>
            </div>
          </div>
        </div>
        <div className="py-8 md:!py-14 px-0 flex flex-col gap-5">
          <div className="w-full px-[15px] mx-auto sm:max-w-[540px] md:max-w-[720px] lg:max-w-[1150px] xl:max-w-[1150px]">
            <div className="flex flex-col gap-5">
              {/* Title */}
              <h1 className="md:text-3xl text-xl text-center font-bold ">
                কী কী <span className="text-ostad-yellow-100">থাকতে</span> হবে
              </h1>
              {/* Requirements Grid */}
              <div className="!grid grid-cols-2 md:!grid-cols-3 gap-3 md:!gap-6 h-auto">
                {/* Laptop/Desktop Requirement */}
                <div className="flex p-2 md:!p-6 flex-col items-center md:!items-start gap-4 flex-1 rounded-xl bg-ostad-black-opac">
                  <div className="flex p-3 justify-center items-center gap-2 rounded bg-ostad-black-opac-2">
                    <img
                      className="w-10"
                      src="https://cdn.ostad.app/public/upload/2023-11-04T08-40-03.645Z-laptop.png"
                      alt="Laptop Icon"
                    />
                  </div>
                  <p className="text-subtitle-s1 text-ostad-black-80">
                    ল্যাপটপ/ডেস্কটপ (মিনিমাম ৮ জিবি র‍্যাম)
                  </p>
                </div>
                {/* Internet Connection Requirement */}
                <div className="flex p-2 md:!p-6 flex-col items-center md:!items-start gap-4 flex-1 rounded-xl bg-ostad-black-opac">
                  <div className="flex p-3 justify-center items-center gap-2 rounded bg-ostad-black-opac-2">
                    <img
                      className="w-10"
                      src="https://cdn.ostad.app/public/upload/2023-11-04T08-40-54.789Z-freelance.png"
                      alt="Internet Icon"
                    />
                  </div>
                  <p className="text-subtitle-s1 text-ostad-black-80">
                    ভালো ইন্টারনেট কানেকশন
                  </p>
                </div>
                {/* Programming Fundamentals Requirement */}
                <div className="flex p-2 md:!p-6 flex-col items-center md:!items-start gap-4 flex-1 rounded-xl bg-ostad-black-opac">
                  <div className="flex p-3 justify-center items-center gap-2 rounded bg-ostad-black-opac-2">
                    <img
                      className="w-10"
                      src="https://cdn.ostad.app/public/upload/2024-01-09T06-09-37.588Z-programming.png"
                      alt="Programming Icon"
                    />
                  </div>
                  <p className="text-subtitle-s1 text-ostad-black-80">
                    প্রোগ্রামিং ফান্ডামেন্টালস জানা থাকলে ভালো
                  </p>
                </div>
                {/* Processor Requirement */}
                <div className="flex p-2 md:!p-6 flex-col items-center md:!items-start gap-4 flex-1 rounded-xl bg-ostad-black-opac">
                  <div className="flex p-3 justify-center items-center gap-2 rounded bg-ostad-black-opac-2">
                    <img
                      className="w-10"
                      src="https://cdn.ostad.app/public/upload/2024-01-09T06-10-29.889Z-technology.png"
                      alt="Processor Icon"
                    />
                  </div>
                  <p className="text-subtitle-s1 text-ostad-black-80">
                    মিনিমাম Core i3 প্রসেসর
                  </p>
                </div>
                {/* SSD Requirement */}
                <div className="flex p-2 md:!p-6 flex-col items-center md:!items-start gap-4 flex-1 rounded-xl bg-ostad-black-opac">
                  <div className="flex p-3 justify-center items-center gap-2 rounded bg-ostad-black-opac-2">
                    <img
                      className="w-10"
                      src="https://cdn.ostad.app/public/upload/2024-01-09T06-11-01.940Z-ssd.png"
                      alt="SSD Icon"
                    />
                  </div>
                  <p className="text-subtitle-s1 text-ostad-black-80">
                    ২৫৬ জিবি এসএসডি
                  </p>
                </div>
                {/* Perseverance Requirement */}
                <div className="flex p-2 md:!p-6 flex-col items-center md:!items-start gap-4 flex-1 rounded-xl bg-ostad-black-opac">
                  <div className="flex p-3 justify-center items-center gap-2 rounded bg-ostad-black-opac-2">
                    <img
                      className="w-10"
                      src="https://cdn.ostad.app/public/upload/2023-11-04T08-41-05.911Z-perseverance.png"
                      alt="Perseverance Icon"
                    />
                  </div>
                  <p className="text-subtitle-s1 text-ostad-black-80">
                    লেগে থাকার মানসিকতা
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="py-6 md:pb-12">
          <div className="relative">
            <h1 className="text-xl md:text-3xl text-black text-center">
              প্রায়ই জিজ্ঞেস করা{" "}
              <span className="text-ostad-yellow-110">প্রশ্ন</span>
            </h1>
          </div>
          <div className="w-full px-[15px] mx-auto sm:max-w-[540px] md:max-w-[720px] lg:max-w-[1150px] xl:max-w-[1150px]">
            <div className="mx-auto mt-8 md:mt-12 w-full md:w-2/3">
              <div className="flex flex-col justify-center items-center">
                <ul className="w-full bg-transparent">
                  {faqData.map((faq, index) => (
                    <li
                      key={index}
                      onClick={() => toggleFAQ(index)}
                      className="w-full flex-1 cursor-pointer list-none overflow-hidden border border-transparent mb-2 rounded-[6px] shadow-[0_0_0_1px_rgba(0,0,0,0.05)] bg-white px-4 py-4 transition-all"
                    >
                      <div className="flex flex-row justify-between items-center text-ostad-black-90">
                        <p className="font-semibold text-base leading-[27px]">
                          {faq.question}
                        </p>
                        <img
                          src="https://cdn.ostad.app/public/upload/2023-11-15T06-41-25.085Z-arrow-down-s-line.svg"
                          className={`transition-transform duration-200 ${
                            activeIndex === index ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                      <div
                        className={`overflow-hidden transition-all ease-in-out duration-200 text-[16px] leading-6 text-ostad-black-90 ${
                          activeIndex === index ? "mt-2 max-h-40" : "max-h-0"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{faq.answer}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetails;
