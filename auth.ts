import prisma from "@/prisma/db";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { pages } from "@/app/config/pages";

const MAX_ATTEMPTS = 10;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes lockout duration

export const { auth, handlers, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Username...",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      authorize: async (credentials, req) => {
        const username = credentials?.username as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!username || !password) {
          throw new Error("Invalid username or password.");
        }

        const user = await prisma.user.findUnique({
          where: { username },
        });

        if (!user) {
          throw new Error("Invalid username or password.");
        }

        if (user.lockoutUntil && user.lockoutUntil > new Date()) {
          throw new Error("Account is locked. Try again later.");
        }

        const match = await bcrypt.compare(password, user.password);

        if (match) {
          await prisma.user.update({
            where: { username },
            data: {
              failedAttempts: 0,
              lockoutUntil: null,
            },
          });

          return {
            id: user.id.toString(),
            name: user.name,
            username: user.username,
            role: user.role,
          };
        } else {
          const failedAttempts = user.failedAttempts + 1;

          if (failedAttempts >= MAX_ATTEMPTS) {
            await prisma.user.update({
              where: { username },
              data: {
                failedAttempts,
                lockoutUntil: new Date(Date.now() + LOCKOUT_DURATION),
              },
            });
            throw new Error(
              "Account is locked due to too many failed attempts. Try again later."
            );
          } else {
            await prisma.user.update({
              where: { username },
              data: { failedAttempts },
            });
            throw new Error("Invalid password");
          }
        }
      },
    }),
  ],
  pages,
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role || "USER";
        session.user.id = token.id;
      }
      return session;
    },
  },
});
