"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CustomerContextType {
  customerHashCode: string;
  setCustomerHashCode: (code: string) => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customerHashCode, setCustomerHashCode] = useState("");

  // Sync with localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("hash_code") || "";
      setCustomerHashCode(stored);
    }
  }, []);

  // Listen for localStorage changes (for cross-tab sync)
  useEffect(() => {
    const handleStorageChange = () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("hash_code") || "";
        setCustomerHashCode(stored);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <CustomerContext.Provider value={{ customerHashCode, setCustomerHashCode }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (!context) {
    return { customerHashCode: "", setCustomerHashCode: () => {} };
  }
  return context;
}
