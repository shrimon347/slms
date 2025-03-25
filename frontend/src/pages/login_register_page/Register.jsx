/* eslint-disable no-unused-vars */
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useRegisterMutation } from "@/features/auth/authApi";
import { registerSchema } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react"; // Assuming you're using Lucide icons
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [email, setEmail] = useState(""); // Store the registered email

  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form setup with react-hook-form and Zod validation
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const response = await registerUser(data).unwrap();
      setEmail(data.email); // Store email in state
      toast.success("Registration successful! Please verify your email.");
      // Redirect to verify email page with email
      navigate("/verify-email/", { state: { email: data.email } });
    } catch (error) {
      if (error?.data?.errors) {
        const errorEntries = Object.entries(error.data.errors);

        if (errorEntries.length > 1) {
          toast.error("Please check the form fields.");
        } else {
          toast.error(errorEntries[0][1][0]);
        }

        // Set field-specific errors in React Hook Form
        errorEntries.forEach(([field, messages]) => {
          setError(field, { type: "server", message: messages[0] });
        });
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name Field */}
          <Input {...register("full_name")} placeholder="Full Name" />
          {errors.full_name && (
            <p className="text-red-500 text-sm">{errors.full_name.message}</p>
          )}

          {/* Email Field */}
          <Input {...register("email")} placeholder="Email" type="email" />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          {/* Contact Number Field */}
          <Input {...register("contact_number")} placeholder="Contact Number" />
          {errors.contact_number && (
            <p className="text-red-500 text-sm">
              {errors.contact_number.message}
            </p>
          )}

          {/* Password Field with Eye Icon */}
          <div className="relative">
            <Input
              {...register("password")}
              placeholder="Password"
              type={showPassword ? "text" : "password"}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          {/* Confirm Password Field with Eye Icon */}
          <div className="relative">
            <Input
              {...register("password2")}
              placeholder="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOffIcon size={20} />
              ) : (
                <EyeIcon size={20} />
              )}
            </button>
          </div>
          {errors.password2 && (
            <p className="text-red-500">{errors.password2.message}</p>
          )}

          {/* Terms and Conditions Checkbox */}
          <div className="flex items-center">
            <Controller
              name="accept_terms"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="terms"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              )}
            />
            <label htmlFor="terms" className="ml-2 text-sm">
              I accept the terms and conditions
            </label>
          </div>
          {errors.accept_terms && (
            <p className="text-red-500">{errors.accept_terms.message}</p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
