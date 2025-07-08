import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers"; // 👈 este es un Client Component
import { ThemeProvider } from "@/components/theme-provider";
import { UnloadHandler } from "@/components/unload-handler";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChatFriends - Mensajería en tiempo real",
  description: "Aplicación de chat en tiempo real para comunicación instantánea",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <UnloadHandler />
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
