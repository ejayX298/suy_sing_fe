"use client";

import Image from "next/image";

interface ThankYouScreenProps {
  onContinue: () => void;
}

export default function ThankYouScreen({ onContinue }: ThankYouScreenProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="px-4 py-10 bg-white rounded-lg shadow-md border-2 border-[#F78B1E]">
        <div className="flex items-center justify-center ">
          <Image
            src="/images/confetti.svg"
            alt="Confetti"
            width={100}
            height={100}
          />
        </div>
        <h2 className="text-[34px] max-w-lg font-bold text-center mb-2 text-[#343434]">
          Thank you for voting! Please return the tablet to the Suy Sing
          representative
        </h2>

        <button
          onClick={onContinue}
          className="w-full py-3 bg-[#F78B1E] rounded-lg text-lg text-[#343434] font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
}
