"use client";

import Image from "next/image";
import React from "react";
import { useBestBooth } from "@/context/BestBoothContext";
import { ColorBooth } from "@/data/colorBooths";

interface VoteSummaryProps {
  onSubmit: () => void;
  onCancel: () => void;
}

export default function VoteSummary({ onSubmit, onCancel }: VoteSummaryProps) {
  const { blueBoothVote, orangeBoothVote, redBoothVote, greenBoothVote } = useBestBooth();

  const handleCancel = () => {
    onCancel();
  };

  const renderBoothVote = (vote: ColorBooth | null, color: string) => {
    if (!vote)
      return (
        <div
          className={`h-24 w-full border-2 border-dashed flex items-center justify-center ${color}`}
        >
          <span className="text-gray-400">No selection</span>
        </div>
      );

    return (
      <div className={`rounded-lg overflow-hidden border-3 ${color}`}>
        <div className="bg-white w-full flex justify-center items-center h-[119px] sm:h-32">
          <Image
            src={vote.image}
            alt={vote.boothCode}
            width={80}
            height={50}
            className="object-contain sm:w-32"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="px-4 py-10 bg-white w-full max-w-sm mb-16 rounded-lg shadow-md border-2 border-[#F78B1E]">
        <div className="flex items-center justify-center mb-2">
          <Image src="/images/vote-summary.svg" alt="Star" width={60} height={60} />
        </div>
        <h2 className="text-[20px] font-bold text-center">Summary of Votes</h2>
        <p className="text-center mb-4 text-sm">
          Review your votes before submitting
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <p className="font-bold mb-2 text-center">Blue Booth</p>
            {renderBoothVote(blueBoothVote, "border-blue-600")}
          </div>
          <div>
            <p className="font-bold mb-2 text-center">Orange Booth</p>
            {renderBoothVote(orangeBoothVote, "border-orange-500")}
          </div>
          <div>
            <p className="font-bold mb-2 text-center">Red Booth</p>
            {renderBoothVote(redBoothVote, "border-red-600")}
          </div>
          <div>
            <p className="font-bold mb-2 text-center">Green Booth</p>
            {renderBoothVote(greenBoothVote, "border-green-500")}
          </div>
        </div>

        <button
          onClick={onSubmit}
          className="w-full py-2 bg-[#F78B1E] rounded-lg text-white font-medium"
        >
          Submit
        </button>
        <button
          onClick={handleCancel}
          className="w-full py-2 bg-[#FFEBD4] border-2 border-[#F78B1E] text-[#F78B1E] rounded-lg font-medium mt-2"
        >
        Cancel
        </button>
      </div>
    </div>
  );
}
