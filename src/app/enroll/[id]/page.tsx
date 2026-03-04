import { PrismaClient } from "@prisma/client";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export default async function EnrollPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: qrId } = await params;

  if (!qrId) {
    notFound();
  }

  const mapping = await prisma.qrMapping.findUnique({
    where: { qrId },
  });

  // If QR doesn't exist in our DB at all
  if (!mapping) {
    notFound();
  }

  // If already linked to a profile, redirect to that profile
  if (mapping.slug) {
    redirect(`/r/${mapping.slug}`);
  }

  // The QR is valid and unclaimed. Check authentication.
  const session = await auth();

  if (!session?.user?.id) {
    // Redirect to login, but ensure they come back here
    redirect(`/api/auth/signin?callbackUrl=/enroll/${qrId}`);
  }

  // User is logged in.
  // Send them to dashboard with the enrollment intent.
  // We do not auto-claim the QR code here on a GET request to prevent accidental consumption.
  redirect(`/dashboard?enroll=${qrId}`);
}
