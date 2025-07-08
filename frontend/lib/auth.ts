import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { checkUserCredentials } from "@/lib/db/services/validateLogin";
import { NextAuthOptions } from "next-auth";
import { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

interface IUser {
  _id: { toString(): string };
  email: string;
  username: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
   async authorize(credentials) {
  if (!credentials?.email || !credentials?.password) return null;

  const result = await checkUserCredentials(credentials.email, credentials.password);


  if (!result?.success || !result.user) return null;

  // ✅ Extraemos el usuario real correctamente
  const realUser = result.user.user; // 👈 esto es el objeto del usuario

  return {
    id: realUser._id.toString(),
    email: realUser.email,
    name: realUser.username,
  };
}

    }),
  ],

callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.name = user.name;
    }
    return token;
  },
  async session({ session, token }: { session: Session, token: any }) {
    if (token?.id && session.user) {
      session.user.id = token.id;
      session.user.name = token.name || session.user.name;
    }
    return session;
  },
},


  pages: {
    signIn: "/login",
    error: "/error/auth",
   
  },
};

export default authOptions;
