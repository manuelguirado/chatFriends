
import GoogleProvider from "next-auth/providers/google";

export const authOptions  = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // otros providers si hay
   
  ],
 
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.sub;
      return session;
    },
    async jwt({ token, user }: { token: any; user?: any }) {
      // lógica personalizada si la necesitas
      return token;
    }
  },
  pages: {
    signIn: "/login",
    register: "/register",
    error: "/error/auth",
},
}