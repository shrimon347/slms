/* eslint-disable no-unused-vars */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useLazyGetUserProfileQuery,
  useUpdateUserPasswordMutation,
  useUpdateUserProfileMutation,
} from "@/features/auth/authApi";
import { updateUser } from "@/features/auth/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ImagePlus, } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { z } from "zod";

const Profile = () => {
  const passwordSchema = z
    .object({
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/[A-Z]/, {
          message: "Password must contain at least one uppercase letter.",
        })
        .regex(/[a-z]/, {
          message: "Password must contain at least one lowercase letter.",
        })
        .regex(/[0-9]/, {
          message: "Password must contain at least one number.",
        })
        .regex(/[^A-Za-z0-9]/, {
          message: "Password must contain at least one special character.",
        }),
      password2: z.string(),
    })
    .refine((data) => data.password === data.password2, {
      message: "Passwords do not match.",
      path: ["password2"],
    });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State to toggle password visibility
  const [isPassword2Visible, setIsPassword2Visible] = useState(false); // State to toggle confirm password visibility

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const togglePassword2Visibility = () => {
    setIsPassword2Visible((prevState) => !prevState);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });
  const [triggerGetUserProfile, { data: userProfile, isLoading, isError }] =
    useLazyGetUserProfileQuery();

  const [updateUserPassword, { isLoading: isPasswordUpdating, error }] =
    useUpdateUserPasswordMutation();

  const [
    updateUserProfile,
    { isLoading: isUpdating, isSuccess, error: updateError },
  ] = useUpdateUserProfileMutation();

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    contact_number: "",
    profile_picture: null,
  });

  // State to store the preview URL of the selected image
  const [imagePreview, setImagePreview] = useState(null);

  // Trigger the API call when the component mounts
  useEffect(() => {
    triggerGetUserProfile();
  }, [triggerGetUserProfile]);

  useEffect(() => {
    if (userProfile?.user) {
      const { full_name, date_of_birth, contact_number } = userProfile.user;
      setFormData((prev) => ({
        ...prev,
        full_name: full_name || "",
        date_of_birth: date_of_birth
          ? new Date(date_of_birth).toISOString().split("T")[0]
          : "",
        contact_number: contact_number || "",
      }));
    }
  }, [userProfile]);

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load profile.
      </div>
    );
  }

  const user = userProfile?.user;

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profile_picture" && files && files[0]) {
      setFormData((prev) => ({ ...prev, profile_picture: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("full_name", formData.full_name);
    formDataToSend.append("date_of_birth", formData.date_of_birth);
    formDataToSend.append("contact_number", formData.contact_number);

    if (formData.profile_picture) {
      formDataToSend.append("profile_picture", formData.profile_picture);
    }

    try {
      const response = await updateUserProfile(formDataToSend).unwrap();
      const updatedUser = response.user; // Assuming the backend returns { user: { ... } }
      dispatch(updateUser(updatedUser));
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("Failed to update profile.");
    }
  };

  // Handle form submission for password change
  const onSubmitPassword = async (data) => {
    try {
      const payload = {
        password: data.password,
        password2: data.password2,
      };
      await updateUserPassword(payload).unwrap();
      toast.success("Password updated successfully!");
      reset(); // Reset the form after successful submission
    } catch (err) {
      console.error("Failed to update password:", err);
      toast.error("Failed to update password.");
    }
  };

  return (
    <div className="p-4 md:p-14">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Section: Profile Picture and Personal Information */}
        <form onSubmit={handleSubmitProfile}>
          <div className="bg-white shadow-md rounded-lg p-6">
            {/* Profile Picture Upload */}
            <div className="flex items-center justify-center flex-col gap-3 mb-6">
              <img
                src={
                  imagePreview ||
                  user?.profile_image_url ||
                  "https://cdn.ostad.app/public/icons/user-3-line.svg"
                }
                alt="Profile"
                className="w-32 h-32 transition-all duration-300 ease-linear bg-gray-100 shadow-sm rounded-full object-cover"
              />
              <Label htmlFor="fileInput" className="cursor-pointer">
                <div className="flex py-2 px-4 justify-center items-center gap-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors">
                  <p className="uppercase text-sm text-gray-800 flex gap-2 items-center">
                    ছবি আপলোড করুন <ImagePlus />
                  </p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 25 24"
                    fill="none"
                  >
                    {/* SVG Content */}
                  </svg>
                </div>
                <input
                  id="fileInput"
                  className="hidden"
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp"
                  name="profile_picture"
                  onChange={handleInputChange}
                />
              </Label>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 gap-4">
              {/* Full Name Field */}
              <div className="flex flex-col gap-1">
                <Label className="text-sm font-medium text-gray-800">
                  পুরো নাম
                </Label>
                <Input
                  type="text"
                  name="full_name"
                  placeholder="পুরো নাম"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg focus:border-gray-400"
                />
              </div>

              {/* Date of Birth Field */}
              <div className="flex flex-col gap-1">
                <Label className="text-sm font-medium text-gray-800">
                  জন্ম তারিখ
                </Label>
                <Input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg focus:border-gray-400"
                />
              </div>

              {/* Primary Phone Number Field */}
              <div className="flex flex-col gap-1">
                <Label className="text-sm font-medium text-gray-800">
                  প্রাইমারী নাম্বার
                </Label>
                <Input
                  type="text"
                  name="contact_number"
                  placeholder="প্রাইমারী নাম্বার"
                  value={formData.contact_number}
                  onChange={handleInputChange}
                  readOnly
                  className="border border-gray-300 rounded-lg focus:border-gray-400 bg-gray-50"
                />
              </div>

              {/* Alternative Email Field */}
              <div className="flex flex-col gap-1">
                <Label className="text-sm font-medium text-gray-800">
                  ইমেইল{" "}
                  <span className="text-red-500 text-xs">
                    * (You can not change the email)
                  </span>
                </Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="অল্টারনেটিভ ইমেইল"
                  defaultValue={user?.email || ""}
                  readOnly
                  className="border border-gray-300 rounded-lg focus:border-gray-400 bg-gray-50"
                />
              </div>

              {/* Update Button */}
              <Button type="submit" disabled={isUpdating} className="mt-2">
                <div className="flex justify-center items-center gap-2">
                  <p>{isUpdating ? "Updating..." : "আপডেট"}</p>
                  <img
                    src="https://cdn.ostad.app/public/icons/check-line.svg"
                    alt="Check Icon"
                    className="w-4 h-4"
                  />
                </div>
              </Button>
            </div>
          </div>
        </form>

        {/* Right Section: Change Password */}
        <form onSubmit={handleSubmit(onSubmitPassword)}>
      <div className="bg-white shadow-md rounded-lg p-6 h-full">
        <h2 className="text-lg font-medium text-gray-800 mb-6">
          পাসওয়ার্ড পরিবর্তন করুন
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {/* New Password Field */}
          <div className="flex flex-col gap-1 relative">
            <Label className="text-sm font-medium text-gray-800">
              নতুন পাসওয়ার্ড দিন
            </Label>
            <Input
              type={isPasswordVisible ? "text" : "password"} // Toggle password visibility
              {...register("password")}
              placeholder="নতুন পাসওয়ার্ড দিন"
              className={`border border-gray-300 rounded-lg focus:border-gray-400 ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {/* Eye Icon */}
            <button
              type="button"
              className="absolute inset-y-0 top-5 right-0 pr-3 flex items-center text-gray-500"
              onClick={togglePasswordVisibility}
            >
              {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="flex flex-col gap-1 relative">
            <Label className="text-sm font-medium text-gray-800">
              পাসওয়ার্ড কনফার্ম করুন
            </Label>
            <Input
              type={isPassword2Visible ? "text" : "password"} // Toggle confirm password visibility
              {...register("password2")}
              placeholder="পাসওয়ার্ড কনফার্ম করুন"
              className={`border border-gray-300 rounded-lg focus:border-gray-400 ${
                errors.password2 ? "border-red-500" : ""
              }`}
            />
            {/* Eye Icon */}
            <button
              type="button"
              className="absolute inset-y-0 top-5 right-0 pr-3 flex items-center text-gray-500"
              onClick={togglePassword2Visibility}
            >
              {isPassword2Visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password2 && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password2.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isPasswordUpdating}
            className="mt-2 cursor-pointer"
          >
            <div className="flex justify-center items-center">
              <p>
                {isPasswordUpdating ? "Updating..." : "পাসওয়ার্ড সেট করি"}
              </p>
            </div>
          </Button>
        </div>
      </div>
    </form>
      </div>
    </div>
  );
};

export default Profile;
