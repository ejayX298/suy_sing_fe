import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { BoothsProvider } from "@/context/BoothsContext";
import { NavigationWrapper } from "@/components/NavigationWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Suy Sing - Epic Journey",
  description: "Suy Sing Suki 2025 Event Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans relative `}>
        <div className="absolute inset-0 -z-10 w-full h-full">
          <Image
            src="/images/bg-mobile.webp"
            alt="Background"
            fill
            priority
            objectFit="cover"
            className="object-cover"
          />
        </div>
        <BoothsProvider>
          <Suspense fallback={<p>Loading...</p>}>
            {children}
            <NavigationWrapper />
          </Suspense>
        </BoothsProvider>
      </body>
    </html>
  );
}
