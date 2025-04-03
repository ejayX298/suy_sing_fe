"use client";

import Image from "next/image";

interface MissingCardProps {
  onViewUnvisited: () => void;
}

export default function MissingCard({
  onViewUnvisited,
}: MissingCardProps) {
  return (
    <div className="rounded-lg border-2 mx-auto max-w-xl border-[#F78B1E] bg-white px-6 py-14 shadow-lg text-center">
      <div className="mb-6">
            <div className="mx-auto mb-4">
            <Image
              src="/images/question-mark.svg"
              alt="Question Mark"
              width={100}
              height={100}
              className="mx-auto"
            />
            </div>
            
            <p className="mt-2 text-xl">
             This card is reported missing
            </p>
      </div>
     
      <button
        onClick={onViewUnvisited}
        className="w-full rounded-lg font-semibold bg-[#F78B1E] px-4 py-3  hover:bg-orange-500"
      >
       Close
      </button>
    </div>
  );
}
