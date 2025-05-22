import type React from "react";
import { Providers } from "./providers";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { UnloadHandler } from "@/components/unload-handler";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChatFriends - Mensajería en tiempo real",
  description:
    "Aplicación de chat en tiempo real para comunicación instantánea",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
