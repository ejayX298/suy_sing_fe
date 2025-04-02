"use client";

import Image from "next/image";

interface BoothHoppingCompleteProps {
  onViewUnvisited: () => void;
}

export default function BoothHoppingComplete({
  onViewUnvisited,
}: BoothHoppingCompleteProps) {
  return (
    <div className="rounded-lg border-2 mx-auto max-w-xl border-[#F78B1E] bg-white p-6 shadow-lg text-center">
      <div className="mb-6">
            <div className="mx-auto mb-4">
            <Image
              src="/images/souvenir/success-icon.svg"
              alt="Success"
              width={100}
              height={100}
              className="mx-auto"
            />
            </div>
            <h2 className="text-3xl font-bold">Booth Hopping Complete</h2>
            <p className="mt-2">
              Click Next to select souvenir
            </p>
      </div>
     
      <button
        onClick={onViewUnvisited}
        className="w-full rounded-lg font-semibold bg-[#F78B1E] px-4 py-3  hover:bg-orange-500"
      >
       Next
      </button>
    </div>
  );
}
