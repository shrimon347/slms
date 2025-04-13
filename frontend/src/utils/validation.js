import * as z from "zod";

// Full Name Validation
export const fullNameSchema = z
  .string()
  .min(1, { message: "Full Name is required." })
  .regex(/^[A-Za-z\s]+$/, { message: "Full Name must contain only letters." });

// Email Validation
export const emailSchema = z
  .string()
  .email({ message: "Enter a valid email address." });

// Password Validation
export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter.",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter.",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number." })
  .regex(/[^A-Za-z0-9]/, {
    message: "Password must contain at least one special character.",
  });

// Role Validation
export const roleSchema = z.enum(["student", "teacher", "admin"], {
  message: "Invalid role. Choose from student, teacher, or admin.",
});

// Date of Birth Validation
export const dateOfBirthSchema = z.string().refine(
  (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const hasBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());

    return age > 8 || (age === 8 && hasBirthdayPassed);
  },
  { message: "User must be at least 8 years old." }
);

// Contact Number Validation
export const contactNumberSchema = z.string().regex(/^\+?[0-9]\d{1,14}$/, {
  message: "Enter a valid contact number (0-9).",
});

// Profile Picture Validation (File Upload)
export const profilePictureSchema = z
  .any()
  .refine(
    (file) => {
      if (!file) return false;
      return ["image/jpeg", "image/png", "image/gif", "image/bmp"].includes(
        file.type
      );
    },
    { message: "Only JPEG, PNG, GIF, BMP image files are allowed." }
  )
  .refine((file) => file.size <= 2 * 1024 * 1024, {
    message: "Profile picture must be less than 2MB.",
  });

// Register Schema
export const registerSchema = z
  .object({
    full_name: fullNameSchema,
    email: emailSchema,
    password: passwordSchema,
    password2: z
      .string()
      .min(8, { message: "Password confirmation is required." }),
    contact_number: contactNumberSchema,
    accept_terms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })
  .superRefine(({ password, password2 }, ctx) => {
    if (password !== password2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password2"],
        message: "Passwords do not match.",
      });
    }
  });
