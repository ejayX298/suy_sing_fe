"use client";

import Image from "next/image";
import React from "react";

interface IntroScreenProps {
  onContinue: () => void;
}

export default function IntroScreen({ onContinue }: IntroScreenProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div className="relative w-[90%] max-w-md p-6 bg-white border border-[#F78B1E] rounded-lg shadow-md">
        <div className="flex items-center justify-center mb-4">
          <Image src="/images/star.svg" alt="Award" width={55} height={78} />
        </div>
        <h2 className="text-[28px] font-bold text-[#343434] text-center mb-2">
          Vote for your Best Booths!
        </h2>
        <p className="text-center text-[#343434] mb-6">
          Submit 1 best booth vote for each color group.
        </p>

        <button
          onClick={onContinue}
          className="w-full py-3 bg-[#F78B1E] text-[#252740] rounded-lg text-lg font-medium hover:bg-[#E67D0E] transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
