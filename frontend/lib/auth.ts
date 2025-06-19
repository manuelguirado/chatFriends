import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { checkUserCredentials } from "@/lib/db/services/validateLogin";
import { NextAuthOptions } from "next-auth";

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
        if (!result) return null;

        const user = result.user as unknown as IUser;
        if (!user) return null;

        return {
          id: user._id.toString(),
          email: user.email || credentials.email,
          name: user.username || '',
        };
      },
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
  async session({ session, token }) {
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
    // Si tienes página propia para registro, solo hazla aparte sin ponerla aquí.
  },
};

export default authOptions;
