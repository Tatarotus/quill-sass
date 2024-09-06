import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "./lib/utils";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
<<<<<<< HEAD
import { Toaster } from "@/components/ui/toaster";
=======
>>>>>>> aeb3dfd1d9621167db90a6a11fc7b3a7450f328c

import "react-loading-skeleton/dist/skeleton.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quill - Give your PDF's superpowers",
  description: "A Modern fullstack Saas Plataform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body
          className={cn(
            "min-h-screen font-sans antialiased grainy",
            inter.className
          )}
        >
<<<<<<< HEAD
          <Toaster />
=======
>>>>>>> aeb3dfd1d9621167db90a6a11fc7b3a7450f328c
          <Navbar />
          {children}
        </body>
      </Providers>
    </html>
  );
}
