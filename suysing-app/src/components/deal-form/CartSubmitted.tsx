import React from "react";
import Image from "next/image";

interface CartSubmittedProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSubmitted({ isOpen, onClose }: CartSubmittedProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-md ">
      <div className="bg-white py-6 border-2 border-[#F78B1E] rounded-lg w-11/12 max-w-md flex flex-col items-center overflow-hidden shadow-xl">
        {/* Thank you image */}
        <div className="mb-2">
          <Image
            src="/images/thankyou.svg"
            alt="Deal Submitted"
            width={150}
            height={150}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col w-full px-8 py-2 pb-0">
          <h2 className="text-3xl sm:text-[34px] font-bold text-center text-black">
            Deal Form Submitted
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm text-center mb-2">
            Please check your email for confirmation.
          </p>
        </div>
        <div className="w-full px-8 py-4">
          <button
            onClick={onClose}
            className="w-full bg-[#F78B1E] text-black font-bold py-2 px-4 rounded-md"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
