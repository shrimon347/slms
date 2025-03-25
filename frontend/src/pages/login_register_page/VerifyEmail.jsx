import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  useResendOtpMutation,
  useVerifyEmailMutation,
} from "@/features/auth/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

// Zod Schema for OTP Validation
const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [resendOtp] = useResendOtpMutation();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  // Handle Form Submission
  const onSubmit = async (data) => {
    try {
      // Extract the email from state
      const email = location.state?.email;
      console.log(email);

      if (!email) {
        throw new Error("Email not found. Please try again.");
      }

      // Prepare the payload for the backend
      const verificationData = {
        otp: data.pin,
        email: email,
      };

      // Call the backend API to verify the email
      await verifyEmail(verificationData).unwrap();

      // Show success notification
      toast.success("Email verified successfully!");

      // Redirect to the login page
      navigate("/login");
    } catch (error) {
      console.error("Verification error:", error);

      // Show error notification
      toast.error(
        error?.data?.errors?.non_field_errors[0] ||
          "Failed to verify email. Please try again."
      );
    }
  };
  // Handle Resend OTP
  const handleResendOtp = async () => {
    try {
      // Extract the email from state
      const email = location.state?.email;

      if (!email) {
        throw new Error("Email not found. Please try again.");
      }

      // Prepare the payload for the backend
      const resendData = {
        email: email,
      };

      // Call the backend API to resend the OTP
      await resendOtp(resendData).unwrap();

      toast.promise(
        resendOtp(resendData).unwrap(), // Promise returned by resendOtp
        {
          loading: "Sending OTP...", // Loading state
          success: "OTP resent successfully!", // Success state
          error: (error) =>
            error?.data?.message || "Failed to resend OTP. Please try again.", // Error state
        }
      );
    } catch (error) {
      console.error("Resend OTP error:", error);

      // Show error notification
      toast.error(
        error?.data?.message || "Failed to resend OTP. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md space-y-6">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Verify Your Account
        </h2>

        {/* Subtitle */}
        <p className="text-center text-gray-600">
          Please enter the 6-digit OTP sent to your email.
        </p>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* OTP Input Field */}
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700 text-center">
                    One-Time Password (OTP)
                  </FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="flex justify-center mx-auto">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="w-12 h-12 text-center text-xl font-bold border-gray-300 focus:border-primary focus:ring-primary"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription className="text-center text-gray-500">
                    Enter the 6-digit OTP sent to your email.
                  </FormDescription>
                  <FormMessage className="text-center text-red-500" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
        </Form>

        {/* Resend OTP Link */}
        <p className="text-center text-sm text-gray-600">
          Didn't receive the OTP?{" "}
          <Button
            variant="link"
            className="text-primary hover:underline p-0 h-auto cursor-pointer"
            onClick={handleResendOtp}
          >
            Resend OTP
          </Button>
        </p>
      </div>
    </div>
  );
};
export default VerifyEmail;
