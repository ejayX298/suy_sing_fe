"use client";

import React, { useRef } from "react";
import AuthCode from "react-auth-code-input";

interface ManualCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (value: string) => void;
}

export default function ManualCodeModal({
  isOpen,
  onClose,
  onSubmit,
  onChange,
}: ManualCodeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleCloseModal = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50"
      onClick={handleCloseModal}
    >
      <div
        className="bg-white rounded-lg px-6 py-14 max-w-sm w-full border-[3px] border-[#F78B1E]"
        ref={modalRef}
      >
        <div className="flex flex-col w-full items-center">
          <h3 className="text-start text-sm mb-4 text-[#343434] w-full">
            Enter Booth Code
          </h3>
          <form
            onSubmit={onSubmit}
            className="w-full flex flex-col items-center"
          >
            <AuthCode
              allowedCharacters="numeric"
              onChange={onChange}
              length={4}
              containerClassName="flex space-x-2 mb-6"
              inputClassName="size-19 text-2xl text-center border border-gray-400 rounded-md focus:outline-none focus:border-[#F78B1E]"
            />
            <button
              type="submit"
              className="w-full py-3 mb-3 bg-[#F78B1E] hover:bg-orange-600 text-[#252740] font-semibold rounded-md"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 border border-[#F78B1E] text-[#F78B1E] hover:bg-orange-50 font-semibold rounded-md"
            >
              Back
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
