"use client";

import Image from "next/image";
import React,  { useState, useEffect } from "react";


interface CustomerData {
  id: number;
  code: string;
  full_name: string;
  hasVoted?: number;
  isDoneVisit?: number;
  totalBoothVisited?: number;
  totalBooths?: number;
}

interface WelcomePageProps {
  customer_data : CustomerData;
  onContinue: () => void;
  onClose?: () => void;
}

export default function WelcomePage({ customer_data, onContinue, onClose }: WelcomePageProps) {
  const [customerData, setCustomerData] = useState<{
    id: number;
    code: string;
    full_name: string;
    hasVoted?: number;
    isDoneVisit?: number;
    totalBoothVisited?: number;
    totalBooths?: number;
  } | null>(null);

  useEffect(() => {
    if(customer_data){
      setCustomerData(customer_data)
    }
  }, [customer_data]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-none" onClick={onClose} />
      <div className="relative w-[90%] max-w-md p-6 bg-white border-[2px] border-[#0F1030] rounded-lg shadow-md">
        <div className="flex items-center justify-center mb-4">
          <Image src="/images/confettii.svg" alt="Confetti" width={100} height={100} />
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">
          Hello {customerData?.full_name  || ""}
        </h2>
        <p className="text-center mb-6 text-lg">
          Welcome to your digital<br />
          Booth Hopping Card and Deal Forms!
        </p>

        <button
          onClick={onContinue}
          className="w-full py-2 bg-[#F78B1E] text-white rounded-lg font-medium hover:bg-[#E67D0E] transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
