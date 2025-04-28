"use client";

import { usePathname } from "next/navigation";
import BottomNavigation from "./BottomNavigation";

export function NavigationWrapper() {
  const pathname = usePathname();

  if (pathname?.startsWith("/auditor")) {
    return null;
  }

  return <BottomNavigation />;
}
