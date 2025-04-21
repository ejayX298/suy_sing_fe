"use client";

import Image from "next/image";
import React from "react";

interface DealFormInstructionPageProps {
  onClose: () => void;
}

export default function DealFormInstructionPage({
  onClose,
}: DealFormInstructionPageProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-none"
        onClick={onClose}
      />

      <div className="absolute bottom-24  left-[45%] sm:left-[39%] transform -translate-x-1/2 w-[80%] max-w-xs">
        <div className="relative bg-white rounded-xl shadow-lg p-4 border-[3px] border-[#F78B1E]">
          <div className="flex items-center justify-center mb-4">
            <Image
              src="/images/deal-form.svg"
              alt="Deal Form"
              width={60}
              height={60}
            />
          </div>

          <p className="text-center mb-6 text-sm">
            <span className="font-bold">Click on Deal Form </span>to avail
            exclusive Suki Day Deals! Available today 8:30am until 3:00pm
            tomorrow
          </p>

          <div className="absolute -bottom-7 left-1/3 transform -translate-x-1/2">
            <div className="relative">
              <div className=" border-l-[20px] border-l-transparent border-t-[28px] border-t-[#F78B1E] border-r-[20px] border-r-transparent"></div>
              <div
                className="absolute top-0 left-0  border-l-[20px] border-l-transparent border-t-[24px] border-t-white border-r-[20px] border-r-transparent"
                style={{ transform: "translateY(-2px)" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
