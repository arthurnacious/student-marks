import NextAuth, { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { accounts, sessions, users, verificationTokens } from "@/db/schema";

export const providers = [GithubProvider];
export const basePath = "/api/auth";

const authOptions: NextAuthConfig = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  basePath,
  providers,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // token.role = user.role;
      }
      return token;
    },
    async session({ session, token, user }) {
      const dbUser = await db.query.users.findFirst({
        where: eq(users.email, user.email),
      });
      return {
        ...session,
        user: {
          ...session.user,
          role: dbUser?.role ?? "student",
        },
      };
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
