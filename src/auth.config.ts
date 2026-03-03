import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: { strategy: "jwt" },
  providers: [], // We configure providers in auth.ts to avoid Edge Runtime issues
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;
