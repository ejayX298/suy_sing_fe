"use client";

import Image from "next/image";
import { useState } from "react";
// import { useBooths } from "@/context/BoothsContext";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function DoubleZoneDisplay({
  totalVisitCount,
  boothData,
}: {
  totalVisitCount: number;
  boothData: any;
}) {
  const [showInfo] = useState(false);

  const getTotalVisited = () => {
    let totalVisitedDoubleZone = totalVisitCount;

    if (totalVisitCount > 20) {
      totalVisitedDoubleZone = 20;
    }

    return totalVisitedDoubleZone;
  };
  return (
    <div className=" pt-10 pb-4">
      <div
        className="px-4 py-4 rounded-md mb-4"
        style={{
          boxShadow: "0px 0px 12.8px 9px #FFA643CC",
          border: "3px solid #FFA643",
        }}
      >
        <div className="flex justify-center mb-2 relative">
          <div className="bg-[#B6E056] -mt-9 border rounded-md py-2 px-6 font-bold text-sm flex items-center justify-center">
            Double Zone
         {/*    <button
              onClick={() => setShowInfo(!showInfo)}
              className="inline-flex items-center justify-center ml-1 bg-[#0920B0] text-[#B6E056] rounded-full w-4 h-4"
            >
              <span className="font-bold text-xs leading-none">i</span>
            </button> */}
          </div>
          {showInfo && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white border-2 border-[#F78B1E] rounded-lg p-4 shadow-lg w-80">
              <p className="text-sm text-center">
                Get double the reward! Earn 2 points every time you scan a booth
                in the Double Zone!
              </p>
            </div>
          )}
        </div>

        <div className="text-sm  mb-4 text-center max-w-xs mx-auto">
          Locate the Double Zone Booths in the Tent and scan any 20 booths
          within this area.
          <div className="font-bold mt-1">
            {getTotalVisited()} / 20 Booths Scanned
          </div>
        </div>

        {/* 3 rows x 7 columns */}
        <div className="flex justify-center gap-2 mb-2">
          {[...Array(7)].map((_, i) => (
            <DoubleZoneCard
              key={`double-row1-${i}`}
              boothIndex={i}
              boothData={boothData}
            />
          ))}
        </div>

        <div className="flex justify-center gap-2 mb-2">
          {[...Array(7)].map((_, i) => (
            <DoubleZoneCard
              key={`double-row2-${i}`}
              boothIndex={i + 7}
              boothData={boothData}
            />
          ))}
        </div>

        <div className="flex justify-center gap-2">
          {[...Array(7)].map((_, i) => (
            <DoubleZoneCard
              key={`double-row3-${i}`}
              boothIndex={i + 14}
              boothData={boothData}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DoubleZoneCard(
  /* eslint-disable @typescript-eslint/no-explicit-any */
  { boothIndex, boothData }: { boothIndex: number; boothData: any },
) {
  // const { doubleZoneBooths } = useBooths();
  const booth = boothData[boothIndex];

  return (
    <div
      className={`border ${
        booth ? "border-red-500" : "border-[#0F1030]"
      } aspect-square w-[50px] h-[50px] flex items-center justify-center relative bg-white`}
    >
      {booth && (
        <div className="w-full h-full flex items-center justify-center p-1">
          {booth.image ? (
            <Image
              src={booth.image}
              alt={booth.boothCode}
              width={50}
              height={50}
              style={{ objectFit: "contain" }}
            />
          ) : (
            <div className="text-xs text-center font-semibold">
              {booth.name}
            </div>
          )}
          <div className="absolute top-0 right-0 bg-red-500 text-white text-[8px] px-1 rounded-bl">
            x2
          </div>
        </div>
      )}
    </div>
  );
}
