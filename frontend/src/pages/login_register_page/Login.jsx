import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/features/auth/authApi";
import { setUserCredentials } from "@/features/auth/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

// Define the schema for login validation
const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation(); // Mutation hook for login

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // Call the login API with the credentials
      const response = await login(data).unwrap();
      console.log(response);
      
      const { user,token } = response;
      const access = token.access
      const refresh = token.refresh

      // Dispatch the action to set user credentials in Redux
      dispatch(setUserCredentials({ user, access, refresh }));

      // Show success notification
      toast.success("Login successful!");

      // Redirect to the dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.data?.message || "Failed to login. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/your-background-image.jpg')" }}
    >
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email input */}
          <Input
            {...register("email")}
            placeholder="Email"
            type="email"
            className="border p-2 rounded-md w-full"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          {/* Password input */}
          <Input
            {...register("password")}
            placeholder="Password"
            type="password"
            className="border p-2 rounded-md w-full"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          {/* Submit button */}
          <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* Register link */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
