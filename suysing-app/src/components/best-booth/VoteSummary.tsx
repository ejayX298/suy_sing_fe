"use client";

import Image from "next/image";
import React from "react";
import { useBestBooth, BoothVote } from "@/context/BestBoothContext";

interface VoteSummaryProps {
  onSubmit: () => void;
}

export default function VoteSummary({ onSubmit }: VoteSummaryProps) {
  const { blueBoothVote, orangeBoothVote, redBoothVote } = useBestBooth();

  const renderBoothVote = (vote: BoothVote | null, color: string) => {
    if (!vote)
      return (
        <div
          className={`h-24 w-full border-2 border-dashed flex items-center justify-center ${color}`}
        >
          <span className="text-gray-400">No selection</span>
        </div>
      );

    const bgColor =
      color === "border-blue-600"
        ? "bg-blue-600"
        : color === "border-orange-500"
        ? "bg-orange-500"
        : "bg-red-600";

    return (
      <div className={`rounded-lg overflow-hidden border-2  ${color}`}>
        <div className="bg-white p-2 h-16 flex items-center justify-center ">
          <Image
            src={`/images/${vote.logo}.png`}
            alt={vote.name}
            width={80}
            height={50}
            className="object-contain max-h-[50px]"
          />
        </div>
        <div className={`${bgColor} text-white text-center py-1`}>
          {vote.name}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="px-4 py-10 bg-white rounded-lg shadow-md border-2 border-[#F78B1E]">
      <div className="flex items-center justify-center mb-2">
        <Image src="/images/star.svg" alt="Star" width={60} height={60} />
      </div>
      <h2 className="text-[34px] font-bold text-center text-[#343434]">
        Summary of Votes
      </h2>
      <p className="text-center text-[#343434] mb-4 text-[14px]">
        Review your votes before submitting
      </p>

      <div className="grid grid-cols-3 gap-4 mb-6 text-[14px] text-[#343434] ">
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
      </div>

      <button
        onClick={onSubmit}
        className="w-full py-3 bg-[#F78B1E] text-[#343434] rounded-lg text-lg font-medium"
      >
        Submit
      </button>
    </div>
    </div>
  );
}
