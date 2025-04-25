"use client";

import React from "react";
import Image from "next/image";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  isDoublePoints?: boolean;
}

export default function SuccessModal({
  isOpen,
  onClose,
  message,
  isDoublePoints = false,
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50">
      <div className="bg-white rounded-lg px-6 py-8 max-w-sm w-full border-2 border-[#F78B1E]">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <Image
              src={isDoublePoints ? "/images/double-star.svg" : "/images/check.svg"}
              alt="Success"
              width={100}
              height={100}
            />
          </div>
          <p className="mb-6 text-[#343434] text-[20px]">{message}</p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#F78B1E] hover:bg-orange-600 text-black font-semibold rounded-md"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}