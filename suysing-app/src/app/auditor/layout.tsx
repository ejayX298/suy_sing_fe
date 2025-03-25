"use client";

import { BestBoothProvider } from "@/context/BestBoothContext";

export default function AuditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BestBoothProvider>{children}</BestBoothProvider>;
}
