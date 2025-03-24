import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNavigation from "@/components/BottomNavigation";
import Image from "next/image";
import { BoothsProvider } from "@/context/BoothsContext";

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
            src="/images/background-image.png"
            alt="Background"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
        <BoothsProvider>
          {children}
          <BottomNavigation />
        </BoothsProvider>
      </body>
    </html>
  );
}
