"use client";

import Image from "next/image";
import React from "react";

interface VoteBestBoothModalProps {
  customerHasVoted: boolean;
  onVote: () => void;
}

export default function VoteBestBoothModal({
  customerHasVoted,
  onVote,
}: VoteBestBoothModalProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="mb-4">
        <Image
          src="/images/bestbooth.svg"
          alt="Vote for Best Booth"
          width={100}
          height={100}
          className="mx-auto"
        />
      </div>
      <h2 className="text-xl font-semibold mb-2">Vote for Best Booth</h2>
      <p className="text-gray-600 text-sm mb-4">
        {customerHasVoted
          ? "This customer has already voted for the best booth."
          : "This customer has not yet voted for the best booth. Please cast vote to claim souvenir."}
      </p>
      <button
        onClick={onVote}
        className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600"
      >
        Vote for Best Booth
      </button>
    </div>
  );
}
