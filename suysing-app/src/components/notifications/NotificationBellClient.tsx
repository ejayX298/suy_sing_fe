"use client";

import NotificationBell from "@/components/notifications/NotificationBell";
import { useCustomer } from "@/context/CustomerContext";
import { useSearchParams } from "next/navigation";

export default function NotificationBellClient() {
  const { customerHashCode } = useCustomer();
  const searchParams = useSearchParams();

  // Use hash code from context or fall back to URL param
  const hashCode = customerHashCode || searchParams.get("cc") || "";

  if (!hashCode) return null;

  return <NotificationBell customerHashCode={hashCode} />;
}
