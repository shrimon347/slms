/* eslint-disable no-unused-vars */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForgotUserResetPasswordMutation } from "@/features/auth/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

const resetSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    password2: z.string(),
  })
  .refine((data) => data.password === data.password2, {
    message: "Passwords must match",
    path: ["password2"],
  });

const ResetPasswordForm = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useForgotUserResetPasswordMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data) => {
    try {
      await resetPassword({ uid, token, ...data }).unwrap();
      toast.success("Password reset successful! You can now login.");
      navigate("/login");
    } catch (err) {
      toast.error("Failed to reset password. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full space-y-4">
        <h2 className="text-xl font-bold text-center">Reset Your Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Password Field */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              {...register("password")}
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

          {/* Confirm Password Field */}
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("password2")}
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
            <p className="text-red-500 text-sm">{errors.password2.message}</p>
          )}

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
