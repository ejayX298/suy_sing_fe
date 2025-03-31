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
          width={48}
          height={48}
        />
      </div>
      <h2 className="text-[34px] font-bold text-center mb-2 text-[#343434]">
        Thank you for voting!
      </h2>
      <p className="text-center text-[#343434] text-[14px] mb-6">
        You may claim your Suki Day Souvenir at the
        <br />
        <span className="font-bold">
          Tent Lobby from 2:30pm until 7:00pm.
        </span>
      </p>

      <button
        onClick={onContinue}
        className="w-full py-3 bg-[#F78B1E] rounded-lg text-lg text-[#343434] font-semibold"
      >
        Continue
      </button>
    </div>
  </div>
  );
}
