"use client";

import Image from "next/image";

interface BoothHoppingCompleteProps {
  navigateToSouvenir: () => void;
}

export default function BoothHoppingComplete({
  navigateToSouvenir,
}: BoothHoppingCompleteProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50">
        <div className="rounded-lg border-2 mx-auto max-w-xl border-[#F78B1E] bg-white p-6 shadow-lg text-center">
          <div className="mb-6">
                <div className="mx-auto mb-4">
                <Image
                  src="/images/trophy.svg"
                  alt="Success"
                  width={100}
                  height={100}
                  className="mx-auto"
                />
                </div>
                <h2 className="text-3xl font-bold">Booth Hopping Complete</h2>
                <p className="mt-2">
                  Click &apos;Next&apos; to select souvenir
                </p>
          </div>
        
          <button
            onClick={navigateToSouvenir}
            className="w-full rounded-lg font-semibold bg-[#F78B1E] px-4 py-3  hover:bg-orange-500"
          >
          Next
          </button>
        </div>
    </div>
  );
}
