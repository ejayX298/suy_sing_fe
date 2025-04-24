"use client";

import Image from "next/image";
import React from "react";

interface BestBoothInstructionPageProps {
  onClose: () => void;
}

export default function BestBoothInstructionPage({ onClose }: BestBoothInstructionPageProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-none" />
      
      <div className="absolute bottom-24 right-[11.9rem] sm:right-[39%] transform translate-x-1/2 w-[80%] max-w-xs">
        <div className="relative bg-white rounded-xl shadow-lg p-4 border-[3px] border-[#F78B1E]">
          <div className="flex items-center justify-center mb-4">
            <Image src="/images/best-booth.svg" alt="Best Booth" width={60} height={60} />
          </div>
          
          <p className="text-center mb-6 text-sm">
            <span className="font-bold">Vote for your Best Booths! </span> <br />Submit 1 best booth vote for each color group.
          </p>
          
          <div className="absolute -bottom-7 left-[14rem] transform -translate-x-1/2">
            <div className="relative">
              <div className="w-0 h-0 border-l-[20px] border-l-transparent border-t-[28px] border-t-[#F78B1E] border-r-[20px] border-r-transparent"></div>
              <div className="absolute top-0 left-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[24px] border-t-white border-r-[20px] border-r-transparent" style={{ transform: 'translateY(-2px)' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
