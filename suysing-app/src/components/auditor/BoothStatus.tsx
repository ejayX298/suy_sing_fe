"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface BoothStatusProps {
  isComplete: boolean;
  visitedCount: number;
  totalBooths: number;
  onViewUnvisited: () => void;
  onClose: () => void;
}

export default function BoothStatus({
  isComplete,
  visitedCount,
  totalBooths,
  onViewUnvisited,
  onClose,
}: BoothStatusProps) {
  const router = useRouter();
  return (
    <div className="rounded-lg border-2 mx-auto max-w-xl border-[#F78B1E] bg-white p-6 shadow-lg text-center">
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
                width={100}
                height={100}
                className="mx-auto"
              />
            </div>
            <h2 className="text-3xl font-bold">Incomplete <span className="sm:block">Booth Hopping</span></h2>
            <p className="mt-2">
              This customer has visited {visitedCount} out of {totalBooths} booths.
            </p>
            <p className="mt-1">
              Please visit all {totalBooths} booths to claim souvenir.
            </p>
          </>
        )}
      </div>
     
      <button
        onClick={onViewUnvisited}
        className="w-full rounded-lg font-semibold bg-[#F78B1E] px-4 py-3  hover:bg-orange-500"
      >
        View Unvisited Booth
      </button>
      
      {!isComplete && (
        <>
          <button
            onClick={() => router.push('/auditor/booth-vote')}
            className="w-full mt-3 rounded-lg font-semibold bg-[#F78B1E] px-4 py-3  hover:bg-orange-500"
          >
            Override
          </button>
          <button
            onClick={onClose}
            className="w-full mt-3 rounded-lg border border-[#F78B1E] px-4 py-3 text-[#F78B1E] font-semibold hover:bg-gray-100"
          >
            Close
          </button>
        </>
      )}
    </div>
  );
}
