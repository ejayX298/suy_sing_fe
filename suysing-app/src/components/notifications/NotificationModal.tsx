"use client";

import Image from "next/image";
import React from "react";

interface NotificationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  buttonLabel?: string;
  onNext: () => void;
  onClose?: () => void;
  iconSrc?: string;
}

export default function NotificationModal({
  isOpen,
  title,
  message,
  buttonLabel = "Next",
  onNext,
  onClose,
  iconSrc = "/images/confetti.svg",
}: NotificationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-[90%] max-w-md p-6 bg-white border-[2px] border-[#0F1030] rounded-lg shadow-md">
        <div className="flex items-center justify-center mb-4">
          <Image src={iconSrc} alt="Notification" width={90} height={90} />
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">{title}</h2>
        <p className="text-center mb-6 text-lg">{message}</p>
        <button
          onClick={onNext}
          className="w-full py-3 bg-[#F78B1E] text-[#252740] rounded-lg text-lg font-medium hover:bg-[#E67D0E] transition-colors"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
