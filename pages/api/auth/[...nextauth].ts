import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../lib/prisma";

const clientId = process.env.GOOGLE_CLIENT_ID;
if (!clientId) {
  throw new Error(`Please add NEXT_PUBLIC_SUPABASE_URL to .env`);
}

const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (!clientSecret) {
  throw new Error(`Please add NEXT_PUBLIC_SUPABASE_URL to .env`);
}

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId,
      clientSecret,
    }),
  ],
});
