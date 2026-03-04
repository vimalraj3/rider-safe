"use server";

import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

// Helper to check if current user is admin
export async function checkIsAdmin() {
  const session = await auth();
  if (!session?.user?.email) {
    return false;
  }

  const adminEmails =
    process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()) ||
    [];
  return adminEmails.includes(session.user.email.toLowerCase());
}

export async function generateQrCodes(count: number) {
  try {
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
      return { success: false, error: "Unauthorized access" };
    }

    if (count <= 0 || count > 100) {
      return { success: false, error: "Please enter a valid amount (1-100)" };
    }

    const newMappings = [];
    for (let i = 0; i < count; i++) {
      newMappings.push({
        qrId: nanoid(10),
      });
    }

    await prisma.qrMapping.createMany({
      data: newMappings,
    });

    revalidatePath("/admin");
    return {
      success: true,
      count,
      message: `Successfully generated ${count} QR codes.`,
    };
  } catch (error) {
    console.error("Generate QR error:", error);
    return { success: false, error: "Failed to generate QR codes" };
  }
}

export async function getQrMappings() {
  try {
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
      return [];
    }

    return await prisma.qrMapping.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Get QR mappings error:", error);
    return [];
  }
}
