/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { PhoneCall, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import {
  useCheckoutPaymentMutation,
  useLazyGetChekoutCoursesDetailsQuery,
} from "@/features/course/courseApi";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth"; 

const CourseCheckout = () => {
  const [searchParams] = useSearchParams();
  const courseSlug = searchParams.get("course");

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [transactionId, setTransactionId] = useState("");

  const [triggerGetCheckoutCourseDetails, { data: courseDetails, error, isLoading }] =
    useLazyGetChekoutCoursesDetailsQuery();

  const [checkoutPayment] = useCheckoutPaymentMutation();

  useEffect(() => {
    if (courseSlug) {
      triggerGetCheckoutCourseDetails(courseSlug);
    }
  }, [courseSlug, triggerGetCheckoutCourseDetails]);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load course details.");
    }
  }, [error]);

  const handlePayment = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to complete the payment.");
      navigate("/login");
      return;
    }

    if (!transactionId.trim()) {
      return toast.error("Please enter your transaction ID.");
    }

    try {
      await checkoutPayment({
        courseSlug,
        payload: {
          amount: courseDetails?.price,
          transaction_id: transactionId,
          payment_method: paymentMethod,
        },
      }).unwrap();

      toast.success("Payment successful! The course will be activated within 24 hours.");
      setTransactionId("");

      // Refresh the course details to get updated enrollment status
      triggerGetCheckoutCourseDetails(courseSlug);
    } catch (err) {
      toast.error("Payment failed. Please try again.");
    }
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (!courseDetails) return <div className="text-center py-10">No course details found.</div>;

  const isPending = courseDetails?.enrollment_status === "pending";

  return (
    <div className="bg-gray-50 p-4 font-sans min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6 bg-gray-100 rounded-md p-10">
        <div className="border-b-2 border-gray-300">
          <h1 className="text-2xl font-bold py-5">কমপ্লিট পেমেন্ট</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left */}
          <div className="space-y-6 order-2 lg:order-1">
            <div className="shadow-lg border border-gray-200 rounded-md p-6">
              <div className="flex gap-4">
                <img
                  src={courseDetails?.course_image_url || ""}
                  className="w-32 aspect-video rounded object-cover"
                  alt="Course"
                />
                <h2 className="text-xl font-semibold">{courseDetails?.title}</h2>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">পেমেন্ট ডিটেইলস</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>কোর্সের মূল্য</span>
                    <span>৳ {courseDetails?.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ডিসকাউন্ট</span>
                    <span>- ৳ ০</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold text-base">
                    <span>টোটাল পেমেন্ট</span>
                    <span>৳ {courseDetails?.price}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-600 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
              <PhoneCall className="text-yellow-600 w-5 h-5" />
              <span>
                প্রয়োজনে{" "}
                <a href="tel:+8801999967713" className="text-yellow-700 font-medium">
                  কল করুন +8801999967713
                </a>{" "}
                (সকাল ১০টা থেকে রাত ১০টা)
              </span>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-4 order-1 lg:order-2">
            <div className="shadow-lg border border-gray-200 rounded-md p-6 space-y-4">
              <h3 className="text-lg font-medium">পেমেন্টের মাধ্যম</h3>

              {["bkash", "nagad", "bank"].map((method) => (
                <div key={method} className="flex items-center gap-3">
                  <input
                    type="radio"
                    id={method}
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled={isPending}
                  />
                  <label
                    htmlFor={method}
                    className={`flex items-center gap-4 border p-3 rounded-md w-full cursor-pointer ${paymentMethod === method ? "border-yellow-400" : "border-gray-300"} ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <img
                      src={
                        method === "bkash"
                          ? "https://cdn.ostad.app/public/gateway/bkash-payment.png"
                          : method === "nagad"
                          ? "https://cdn.ostad.app/public/upload/2024-04-23T05-07-00.461Z-nagad.png"
                          : "https://cdn.ostad.app/public/upload/2024-04-24T04-58-50.968Z-mastercard.png"
                      }
                      className="h-10"
                      alt={method}
                    />
                    <span className="capitalize">{method}</span>
                  </label>
                </div>
              ))}

              <div className="py-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Id
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Transaction ID"
                  disabled={isPending}
                />

                {paymentMethod === "bkash" && (
                  <p className="text-sm text-gray-600 mt-2">
                    Send to Bkash: <strong>01644981475</strong>
                  </p>
                )}
                {paymentMethod === "nagad" && (
                  <p className="text-sm text-gray-600 mt-2">
                    Send to Nagad: <strong>01644981475</strong>
                  </p>
                )}
                {paymentMethod === "bank" && (
                  <p className="text-sm text-gray-600 mt-2">
                    Bank A/C: <strong>2345-5643-5667</strong>
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white shadow-md p-4 rounded-md flex flex-col items-center lg:items-start space-y-3">
              <div className="flex justify-between w-full">
                <span className="text-sm text-gray-600">টোটাল পেমেন্ট:</span>
                <span className="text-xl font-semibold text-gray-900">৳ {courseDetails?.price}</span>
              </div>

              <Button
                onClick={handlePayment}
                className="w-full cursor-pointer text-white rounded-md h-12 text-base flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={isPending}
              >
                {isPending ? "পেমেন্ট প্রসেসিং..." : "পেমেন্ট সম্পন্ন করি"}
                <ArrowRight />
              </Button>

              {isPending && (
                <div className="text-sm text-yellow-600 mt-2 font-medium">
                  পেমেন্ট রিকোয়েস্ট গ্রহণ করা হয়েছে। কোর্সটি ২৪ ঘণ্টার মধ্যে অ্যাক্টিভেট হবে। স্ট্যাটাস: <strong>Pending</strong>
                </div>
              )}

              <div className="flex items-center text-xs mx-auto py-3 text-gray-400">
                <Lock className="w-4 h-4 mr-1" />
                সিকিউরড পেমেন্ট
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCheckout;
