"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { SocketProvider } from "@/contexts/SocketContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SocketProvider>
        {children}
      </SocketProvider>
    </SessionProvider>
  );
}
