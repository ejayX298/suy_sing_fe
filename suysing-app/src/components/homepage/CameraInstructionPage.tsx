"use client";

import Image from "next/image";
import React from "react";

interface CameraInstructionPageProps {
  onClose: () => void;
}

export default function CameraInstructionPage({
  onClose,
}: CameraInstructionPageProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-none" />

      <div className="absolute bottom-32 ml-1 left-1/2 transform -translate-x-1/2 w-full max-w-xs">
        <div className="relative bg-white rounded-xl shadow-lg p-4 border-[3px] border-[#F78B1E]">
          <div className="flex items-center justify-center mb-4">
            <Image
              src="/images/camera.svg"
              alt="Camera"
              width={60}
              height={60}
            />
          </div>

          <p className="text-center mb-6">
            <span className="font-bold">Scan the QR codes </span>found in the
            booths and complete your Booth Hopping Card to redeem your Suki Day
            souvenir.
          </p>

          <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <div className="w-0 h-0 border-l-[20px] border-l-transparent border-t-[28px] border-t-[#F78B1E] border-r-[20px] border-r-transparent"></div>
              <div
                className="absolute top-0 left-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[24px] border-t-white border-r-[20px] border-r-transparent"
                style={{ transform: "translateY(-2px)" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
