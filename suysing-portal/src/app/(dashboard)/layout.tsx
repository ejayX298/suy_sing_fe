"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useAuth } from "@/lib/hooks/useAuth";
import Swal from "sweetalert2";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Get page title based on pathname
  const getPageTitle = () => {
    switch (true) {
      case pathname === "/customer-activities":
        return "Customer Activities";
      case pathname === "/booth-activities":
        return "Booth Activities";
      case pathname === "/booth-hopping-report":
        return "Booth Hopping Report";
      case pathname === "/best-booth/best-booth-report":
        return "Best Booth Report";
      case pathname === "/best-booth/best-booth-winner-tally":
        return "Best Booth Winner Tally";
      case pathname === "/souvenir/souvenir-claim":
        return "Souvenir Claim";
      case pathname === "/souvenir/souvenir-availability":
        return "Souvenir Availability";
      case pathname === "/deal-forms":
        return "Deal Forms";
      case pathname === "/deal-ordered":
        return "Deals Ordered";
      case pathname === "/notification":
        return "Notifications";
      default:
        return "Dashboard";
    }
  };

  const checkForceLogout = () => {
    if (typeof window === "undefined") {
      return false;
    }

    const is_force_logout = localStorage.getItem("is_force_logout");

    if (is_force_logout == "true") {
      return Swal.fire({
        text: "Session expired",
        icon: "error",
        confirmButtonColor: "#193cb8",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          logout();
        }
      });
    }

    return false;
  };

  // Check authentication
  useEffect(() => {
    checkForceLogout();
    if (!isAuthenticated) {
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    if (typeof window !== "undefined") {
      document.cookie = `auth=; path=/;`;
    }
    return null;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getPageTitle()} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
