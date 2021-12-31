import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../lib/prisma";

const secret = process.env.SECRET;
if (!secret) {
  throw new Error(`Please add SECRET to .env`);
}

const clientId = process.env.GOOGLE_CLIENT_ID;
if (!clientId) {
  throw new Error(`Please add GOOGLE_CLIENT_ID to .env`);
}

const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (!clientSecret) {
  throw new Error(`Please add GOOGLE_CLIENT_SECRET to .env`);
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
    };
  }
}

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId,
      clientSecret,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
  secret,
});
