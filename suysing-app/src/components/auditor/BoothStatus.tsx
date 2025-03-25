"use client";

import Image from "next/image";

interface BoothStatusProps {
  isComplete: boolean;
  visitedCount: number;
  totalBooths: number;
  onViewUnvisited: () => void;
  onClaimSouvenir: () => void;
  onClose: () => void;
}

export default function BoothStatus({
  isComplete,
  visitedCount,
  totalBooths,
  onViewUnvisited,
  onClaimSouvenir,
  onClose,
}: BoothStatusProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-lg text-center">
      <div className="mb-6">
        {isComplete ? (
          <>
            <Image
              src="/images/check-icon.svg"
              alt="Complete"
              width={64}
              height={64}
              className="mx-auto mb-2"
            />
            <h2 className="text-xl font-semibold">Booth Visit Completed</h2>
            <p className="text-gray-600 mt-2">Ready to claim souvenir</p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4">
              <Image
                src="/images/booth.svg"
                alt="Incomplete"
                width={80}
                height={80}
                className="mx-auto"
              />
            </div>
            <h2 className="text-xl font-semibold">Incomplete Visited Booths</h2>
            <p className="text-gray-600 mt-2">
              This customer has visited {visitedCount} out of {totalBooths} booths.
            </p>
            <p className="text-gray-600 mt-1">
              Please visit all {totalBooths} booths to claim souvenir.
            </p>
          </>
        )}
      </div>
     
      <button
        onClick={isComplete ? onClaimSouvenir : onViewUnvisited}
        className="w-full rounded-lg bg-orange-500 px-4 py-3 text-white hover:bg-orange-600"
      >
        {isComplete ? "Claim Souvenir" : "View Unvisited Booth"}
      </button>
      
      {!isComplete && (
        <button
          onClick={onClose}
          className="w-full mt-3 rounded-lg border border-gray-300 px-4 py-3 text-gray-700 hover:bg-gray-100"
        >
          Close
        </button>
      )}
    </div>
  );
}
