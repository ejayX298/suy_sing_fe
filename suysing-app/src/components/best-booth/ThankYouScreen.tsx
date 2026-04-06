"use client";

import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

interface ThankYouScreenProps {
  storedHashcode: string;
  onContinue: () => void;
}

export default function ThankYouScreen({
  storedHashcode,
  onContinue,
}: ThankYouScreenProps) {
  const router = useRouter();

  const handleContinue = () => {
    onContinue();
    router.push(`/?cc=${storedHashcode}`);
  };

  return (
    <div className=" max-w-[22rem] mx-auto fixed inset-0 flex items-center justify-center z-50">
      <div className="px-4 py-10 bg-white rounded-lg shadow-md border border-black">
        <div className="flex items-center justify-center mb-2">
          <Image
            src="/images/submitted.svg"
            alt="Confetti"
            width={60}
            height={60}
          />
        </div>
        <h2 className="text-xl font-bold text-center mb-2 text-[#343434]">
          You have submitted your Best Booth votes.
        </h2>
        <p className="text-center  text-[#343434] mb-6">
          Claim your Souvenir at the Tent Lobby <br />
          from 2:30pm -7:00pm.
        </p>

        <button
          onClick={handleContinue}
          className="w-full py-3 bg-[#F78B1E] rounded-lg text-lg text-white font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
}
