"use client";

import Image from "next/image";


interface SuccessModalProps {
  onClose: () => void;
}

export default function SuccessModal({ onClose }: SuccessModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg px-6 py-14 max-w-md w-full mx-4 border-2 border-[#F78B1E]">
        <div className="text-center">
          <div className="mb-4">
            <Image
              src="/images/souvenir/success-icon.svg"
              alt="Success"
              width={78}
              height={78}
              className="mx-auto"
            />
          </div>
          
          <h2 className="text-4xl font-bold mb-2">Success!</h2>
          <p className="text-xl mb-4">
          Souvenir successfully claimed.
          </p>
          
          <button
            onClick={onClose}
            className="w-full bg-[#F78B1E] text-white font-semibold text-lg py-3 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
