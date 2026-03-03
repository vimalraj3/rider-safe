import { z } from "zod";

export const CustomFieldTypeEnum = z.enum(["text", "phone", "multiline"]);

export const customFieldSchema = z.object({
  id: z.string(),
  label: z
    .string()
    .min(1, "Label is required")
    .max(50, "Label cannot exceed 50 characters")
    .trim(),
  value: z
    .string()
    .min(1, "Value is required")
    .max(200, "Value cannot exceed 200 characters")
    .trim()
    .refine(
      (val) => !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(val),
      {
        message: "Invalid characters detected",
      },
    ),
  type: CustomFieldTypeEnum,
  isVisible: z.boolean(),
});

export const emergencyContactSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required").max(50, "Name too long").trim(),
  relation: z
    .string()
    .min(1, "Relation is required")
    .max(30, "Relation too long")
    .trim(),
  phone: z
    .string()
    .min(5, "Phone number too short")
    .max(20, "Phone number too long")
    .trim(),
});

export const profileFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name too long")
    .trim(),
  bloodGroup: z
    .string()
    .min(1, "Blood group is required")
    .max(10, "Invalid blood group")
    .trim(),
  medicalNotes: z.string().max(500, "Medical notes too long").trim().optional(),
  qrSlug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(30, "Slug too long")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
  theme: z.enum(["light", "dark", "system"]),
  emergencyContacts: z
    .array(emergencyContactSchema)
    .max(5, "Maximum 5 emergency contacts allowed"),
  customFields: z
    .array(customFieldSchema)
    .max(10, "Maximum 10 custom fields allowed"),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
export type CustomField = z.infer<typeof customFieldSchema>;
export type EmergencyContact = z.infer<typeof emergencyContactSchema>;
