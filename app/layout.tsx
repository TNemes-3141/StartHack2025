import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

import { primary_font } from "@/lib/fonts";
import { cn } from "@/lib/utils";


export const metadata: Metadata = {
  title: "Sixth Sense: AI investment advisor",
  description: "Manage your personal portfolio with ease - leverage our AI agent and adaptive dashboard to focus on what matters most.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn("antialiased", primary_font.className)}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
