// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";


const handler = NextAuth(authOptions);

// Exportamos así, sin llamarlo como función
export { handler as GET, handler as POST };

