import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import Nodemailer from "next-auth/providers/nodemailer";
import { authConfig } from "./auth.config";

const prisma = new PrismaClient();

const providers = [
  Nodemailer({
    server: {
      host: process.env.EMAIL_SERVER_HOST || "smtp.zoho.in",
      port: Number(process.env.EMAIL_SERVER_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    },
    from: process.env.EMAIL_FROM || "noreply@ridersafe.com",
  }),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers,
});
