import type { Metadata } from "next";
import "./globals.css";
import Providers from "./provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "SusSale",
  description: "Don't Miss any price drop on any product.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
