"use client";

import React, { useRef } from "react";

interface ManualCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  value: string;
  onChange: (value: string) => void;
}

export default function ManualCodeModal({
  isOpen,
  onClose,
  onSubmit,
  value,
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
        <div className="flex flex-col w-full">
          <h3 className="text-start text-sm mb-2 text-[#343434]">
            Enter Booth Code
          </h3>
          <form onSubmit={onSubmit} className="w-full">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="mb-2 w-full border border-gray-600 text-[#343434] rounded px-3 py-4 focus:outline-none focus:border-gray-800"
            />
            <button
              type="submit"
              className="w-full py-3 mt-3 bg-[#F78B1E] hover:bg-orange-600 text-[#252740] font-semibold rounded-md"
            >
              Next
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}