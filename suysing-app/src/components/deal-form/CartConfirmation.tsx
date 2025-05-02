import React from "react";
import Image from "next/image";

interface CartConfirmationProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function CartConfirmation({
  isOpen,
  onConfirm,
  onCancel,
}: CartConfirmationProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-md">
      <div className="bg-white py-6 border-2 border-[#F78B1E] rounded-lg w-11/12 max-w-md flex flex-col items-center overflow-hidden shadow-xl">
        {/* Question mark image */}
        <div className="mb-2 ">
          <Image
            src="/images/question-markv2.svg"
            alt="Confirm Submission"
            width={150}
            height={150}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col w-full px-8 py-2 pb-0">
          <h2 className="text-3xl sm:text-[34px] font-bold text-center text-black">
            Are you sure you want to submit this active cart?
          </h2>
          <p className="text-gray-600 text-sm text-center mb-2">
            Submitted orders cannot be edited anymore. For additional orders,
            create and submit a new cart.
          </p>
        </div>
        <div className="w-full px-8 py-4 flex flex-col gap-4">
          <button
            onClick={onConfirm}
            className="w-full bg-[#F78B1E] py-3 text-black font-bold text-center rounded-md text-lg"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="w-full py-1 bg-white border-2 border-[#F78B1E] text-[#F78B1E] rounded-lg text-lg font-medium"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
