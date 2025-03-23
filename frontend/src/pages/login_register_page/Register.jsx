import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { z } from "zod";

const schema = z
  .object({
    full_name: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    contact_number: z
      .string()
      .regex(/^\d{10,15}$/, "Contact number must be 10-15 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    password2: z.string(),
    accept_terms: z
      .boolean()
      .refine((val) => val === true, "You must accept terms"),
  })
  .refine((data) => data.password === data.password2, {
    message: "Passwords must match",
    path: ["password2"],
  });

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Form Submitted", data);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/your-background-image.jpg')" }}
    >
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register("full_name")} placeholder="Full Name" />
          {errors.full_name && (
            <p className="text-red-500 text-sm">{errors.full_name.message}</p>
          )}

          <Input {...register("email")} placeholder="Email" type="email" />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <Input {...register("contact_number")} placeholder="Contact Number" />
          {errors.contact_number && (
            <p className="text-red-500 text-sm">
              {errors.contact_number.message}
            </p>
          )}

          <Input
            {...register("password")}
            placeholder="Password"
            type="password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          <Input
            {...register("password2")}
            placeholder="Confirm Password"
            type="password"
          />
          {errors.password2 && (
            <p className="text-red-500 text-sm">{errors.password2.message}</p>
          )}

          <div className="flex items-center">
            <Checkbox {...register("accept_terms")} id="terms" />
            <label htmlFor="terms" className="ml-2 text-sm">
              I accept the terms and conditions
            </label>
          </div>
          {errors.accept_terms && (
            <p className="text-red-500 text-sm">
              {errors.accept_terms.message}
            </p>
          )}

          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
        {/* You can add a register link or any additional action */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Have an account?{" "}
            <Link to={"/Login"} className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
