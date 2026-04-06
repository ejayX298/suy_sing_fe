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

  const boldPrefixes = ["Great Job!", "Nice!", "Double points!"];
  const matchedPrefix = boldPrefixes.find((prefix) =>
    message.startsWith(prefix),
  );
  const messageContent = matchedPrefix ? (
    <>
      <span className="font-bold text-xl">
        {matchedPrefix} <br />
      </span>
      {message.slice(matchedPrefix.length)}
    </>
  ) : (
    message
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50">
      <div className="bg-white rounded-lg px-6 py-8 max-w-sm w-full border-2 border-black">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <Image
              src={
                isDoublePoints ? "/images/double-star.svg" : "/images/star.svg"
              }
              alt="Success"
              width={100}
              height={100}
            />
          </div>
          <p className="mb-6 text-[#343434] text-[20px]">{messageContent}</p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#F78B1E] hover:bg-orange-600 text-white font-semibold rounded-md"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
