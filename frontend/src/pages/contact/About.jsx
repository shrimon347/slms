import React from "react";

function About() {
  return (
    <div className="flex flex-col mb-10 md:mb-[108px]">
      {/* Hero Section */}
      <div className="pt-6 pb-20 md:py-20 bg-white w-full">
        <div className="w-full px-4 mx-auto max-w-[1150px]">
          <div className="flex flex-col md:flex-row w-full items-center gap-6 justify-between">
            <div className="flex order-2 md:order-1 max-w-1/2 flex-col items-start gap-4 flex-1">
              <div className="flex flex-col gap-1 items-start flex-1">
                <p className="text-center md:text-start w-full text-green-600 text-sm font-medium">
                শিখো সম্পর্কে
                </p>
                <p className="text-2xl md:text-4xl text-center md:text-left font-bold text-gray-900">
                  বাংলাদেশের সবচেয়ে বড় স্কিল ডেভেলপমেন্ট প্ল্যাটফর্ম
                </p>
              </div>
              <p className="text-center md:text-start text-base text-gray-800">
                শিখো স্কিল ডেভেলপমেন্টের জন্য বাংলাদেশের সর্বপ্রথম লাইভ-স্ট্রিমিং, ইন্টারেকটিভ এডুকেশন প্ল্যাটফর্ম। আমরা শুধুমাত্র স্কিল্ড হতেই হেল্প করি না, জব পেতেও হেল্প করি।
              </p>
            </div>
            <img
              className="w-full md:w-[38%] order-1 md:order-2 object-contain"
              src="https://cdn.ostad.app/public/upload/2024-09-01T12-16-44.254Z-Untitled%20design%20(1).png"
              alt="Ostad Hero"
            />
          </div>
        </div>
      </div>

      {/* Mission & Achievements */}
      <div className="w-full px-4 mx-auto max-w-[1150px]">
        <div className="flex flex-col justify-center items-center gap-8">
          <div className="py-8 md:py-10 flex flex-col md:flex-row gap-4 justify-between items-end w-full">
            <div className="flex flex-col items-start order-2 md:order-1 gap-4 flex-1">
              <div className="flex flex-col items-start gap-1">
                <p className="w-full text-center md:text-start text-green-600 text-sm font-medium">
                  আমাদের মিশন এবং সাফল্য
                </p>
                <p className="text-2xl md:text-4xl text-center md:text-start font-bold text-gray-900">
                  একনজরে শিখোের সাফল্যসমুহ
                </p>
              </div>
              <div className="w-full grid grid-cols-2 gap-4">
                <div className="bg-green-100 text-gray-700 rounded-md w-full p-4 flex flex-col justify-center items-start">
                  <p className="text-2xl md:text-4xl font-bold">১৫,০০০+</p>
                  <p className="text-sm md:text-base">গ্র্যাজুয়েট</p>
                </div>
                <div className="bg-blue-100 text-gray-700 rounded-md w-full p-4 flex flex-col justify-center items-start">
                  <p className="text-2xl md:text-4xl font-bold">১,২৫,০০০+</p>
                  <p className="text-sm md:text-base">ইউজার</p>
                </div>
                <div className="bg-yellow-100 text-gray-700 rounded-md w-full p-4 flex flex-col justify-center items-start">
                  <p className="text-2xl md:text-4xl font-bold">৯০+</p>
                  <p className="text-sm md:text-base">কোর্স কমপ্লিশন রেট</p>
                </div>
                <div className="bg-orange-100 text-gray-700 rounded-md w-full p-4 flex flex-col justify-center items-start">
                  <p className="text-2xl md:text-4xl font-bold">৭,০০০+</p>
                  <p className="text-sm md:text-base">জব প্লেসমেন্ট</p>
                </div>
              </div>
            </div>
            <img
              className="w-full md:w-[500px] aspect-video object-cover order-1 md:order-2"
              src="https://cdn.ostad.app/public/upload/2024-08-15T08-17-58.210Z-36efeba3-7ae3-4f35-9a54-9674e362c2d3%202.png"
              alt="Achievements"
            />
          </div>

          {/* Story */}
          <div className="flex flex-col md:flex-row items-center gap-4 bg-blue-600 rounded-lg p-4 w-full">
            <img
              className="w-full md:w-[432px] aspect-video object-cover"
              src="https://cdn.ostad.app/public/upload/2024-09-03T11-00-21.968Z-IMG_1842%20(2).jpg"
              alt="Story"
            />
            <div className="flex flex-col gap-1 items-start justify-center">
              <p className="text-2xl md:text-4xl text-white font-bold text-center md:text-start w-full">
                আমাদের গল্প
              </p>
              <p className="text-sm md:text-base text-white text-center md:text-start">
                Ostad is the first live-streaming, interactive education platform for skill development in Bangladesh. We not only help people to get upskilled but also help them to get a job. We are doing this through our Weekly streak-based live learning curriculum, in-app-web weekly assessment test, and live classes from the top 1% of industry experts. Here every student is vetted in a way that, after completing our 6-Months program, each graduate gets job-ready & showcased in Talent portals with a solid report card. Our partner companies can hire them very easily from there.
              </p>
            </div>
          </div>

          {/* Team */}
          <div className="flex flex-col gap-4 w-full">
            <p className="text-2xl md:text-4xl font-bold text-gray-900 text-center w-full">
              আমাদের টিম
            </p>
            <img
              className="w-full aspect-video object-cover rounded-lg"
              src="https://cdn.ostad.app/public/upload/2024-09-03T10-28-18.970Z-WhatsApp%20Image%202024-09-03%20at%201.40.00%20PM%20(1).jpeg"
              alt="Team"
            />
          </div>

          {/* Values */}
          <div className="flex flex-col gap-4 w-full">
            <p className="text-2xl md:text-4xl font-bold text-gray-900 text-center w-full">
              আমাদের মূল্যবোধ
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {[
                {
                  title: "সততা",
                  description: "প্রতিটি সিদ্ধান্তে সততা বজায় রাখা",
                  bg: "bg-purple-700 text-white",
                },
                {
                  title: "সৃজনশীলতা",
                  description: "অগ্রগতির জন্য সাহসী উদ্ভাবন।",
                  bg: "bg-yellow-200 text-gray-900",
                },
                {
                  title: "দ্বায়িত্ববোধ",
                  description: "আমাদের কাজ এবং এর ফলাফলের দায়িত্ব নেওয়া।",
                  bg: "bg-red-600 text-white",
                },
                {
                  title: "কর্মসম্পাদন",
                  description: "নির্ভুলতা ও উদ্দেশ্য নিয়ে কাজ সম্পন্ন করা।",
                  bg: "bg-green-700 text-white col-span-1 md:col-span-2",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`${item.bg} flex flex-row md:flex-col items-center justify-center gap-4 p-4 rounded-lg border border-gray-300`}
                >
                  <img
                    src="https://cdn.ostad.app/public/upload/2024-08-15T09-48-54.632Z-Fast%20download%20turbo.png"
                    className="w-10 h-10"
                    alt="icon"
                  />
                  <div className="flex flex-col gap-1">
                    <p className="text-lg font-bold">{item.title}</p>
                    <p className="text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
