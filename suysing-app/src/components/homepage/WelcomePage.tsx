"use client";

import Image from "next/image";
import React from "react";

interface WelcomePageProps {
  onContinue: () => void;
  onClose?: () => void;
}

export default function WelcomePage({ onContinue, onClose }: WelcomePageProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-none" onClick={onClose} />
      <div className="relative w-[90%] max-w-md p-6 bg-white border-[3px] border-[#F78B1E] rounded-lg shadow-md">
        <div className="flex items-center justify-center mb-4">
          <Image src="/images/confettii.svg" alt="Confetti" width={100} height={100} />
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">
          Hello JUAN01,
        </h2>
        <p className="text-center mb-6 text-lg">
          Welcome to your digital<br />
          Booth Hopping Card and Deal Forms!
        </p>

        <button
          onClick={onContinue}
          className="w-full py-3 bg-[#F78B1E] text-[#252740] rounded-lg text-lg font-medium hover:bg-[#E67D0E] transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
