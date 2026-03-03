"use server";

import { signIn } from "@/auth";

export async function loginWithEmail(formData: FormData) {
  const email = formData.get("email");
  if (!email || typeof email !== "string") {
    throw new Error("Invalid email address");
  }

  await signIn("nodemailer", { email, redirectTo: "/dashboard" });
}
