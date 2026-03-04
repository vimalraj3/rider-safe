"use server";

import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import {
  profileFormSchema,
  ProfileFormValues,
} from "@/lib/validations/profile";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function saveProfile(
  data: ProfileFormValues,
  enrollQrId?: string,
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Validate the input again on the server
    const validatedData = profileFormSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        success: false,
        error: "Invalid form data",
        errors: validatedData.error.flatten(),
      };
    }

    const {
      fullName,
      bloodGroup,
      medicalNotes,
      qrSlug,
      theme,
      emergencyContacts,
      customFields,
    } = validatedData.data;

    // Ensure custom fields are cast correctly for Prisma JSON field
    // Zod already sanitizes <script> tags for us and does limit checking
    const payload = {
      fullName,
      bloodGroup,
      medicalNotes,
      qrSlug,
      theme,
      emergencyContacts: emergencyContacts as any,
      customFields: customFields as any,
    };

    const existingProfile = await prisma.riderProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (existingProfile) {
      // Check slug collision if slug changed
      if (existingProfile.qrSlug !== qrSlug) {
        const slugExists = await prisma.riderProfile.findUnique({
          where: { qrSlug },
        });
        if (slugExists) {
          return { success: false, error: "Custom QR link is already taken" };
        }
      }

      await prisma.riderProfile.update({
        where: { userId: session.user.id },
        data: payload,
      });
    } else {
      // Create new
      const slugExists = await prisma.riderProfile.findUnique({
        where: { qrSlug },
      });
      if (slugExists) {
        return { success: false, error: "Custom QR link is already taken" };
      }

      await prisma.riderProfile.create({
        data: {
          userId: session.user.id,
          ...payload,
        },
      });
    }

    // Link enrolled QR code if provided
    if (enrollQrId) {
      const qrMapping = await prisma.qrMapping.findUnique({
        where: { qrId: enrollQrId },
      });

      if (qrMapping && !qrMapping.slug) {
        await prisma.qrMapping.update({
          where: { qrId: enrollQrId },
          data: { slug: qrSlug },
        });
        console.log(`Linked QR ID ${enrollQrId} to slug ${qrSlug}`);
      }
    }

    revalidatePath("/dashboard");
    revalidatePath(`/admin`);
    revalidatePath(`/r/${qrSlug}`);

    return {
      success: true,
      message: "Profile saved successfully",
      slug: qrSlug,
    };
  } catch (error) {
    console.error("Save profile error:", error);
    return {
      success: false,
      error: "Internal server error while saving profile",
    };
  }
}

export async function getProfile() {
  try {
    const session = await auth();
    if (!session?.user?.id) return null;

    const profile = await prisma.riderProfile.findUnique({
      where: { userId: session.user.id },
    });

    return profile;
  } catch (e) {
    console.error("Failed to get profile", e);
    return null;
  }
}
