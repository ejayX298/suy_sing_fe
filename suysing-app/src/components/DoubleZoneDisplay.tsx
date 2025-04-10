"use client";

import React, {useState, useEffect} from "react";
import Image from "next/image";
import { useBooths } from "@/context/BoothsContext";

export default function DoubleZoneDisplay({ totalVisitCount, boothData} : { totalVisitCount: number, boothData : any }) {

  return (
    <div className="px-4 py-2">
      <div className="border-2 border-dashed border-red-500 p-4 rounded-md mb-4">
        <div className="flex justify-center mb-2">
          <div className="bg-[#B6E056] text-[#0920B0] border-[#0920B0] border rounded-full py-1 px-4 font-bold text-sm flex items-center justify-center">
            Double Zone
            <div className="inline-flex items-center justify-center ml-1 bg-[#0920B0] text-[#B6E056] rounded-full w-4 h-4">
              <span className="font-bold text-xs leading-none">i</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-blue-800 mb-4 text-center max-w-xs mx-auto">
          Locate the Double Zone Booths in the Tent and scan any 22 booths
          within this area.
          <div className="font-bold mt-1">
            {totalVisitCount} / 22 Booths Scanned
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-4">
          {[...Array(6)].map((_, i) => (
            <DoubleZoneCard key={`double-row1-${i}`} boothIndex={i} boothData={boothData}/>
          ))}
        </div>

        <div className="flex justify-center gap-4 mb-4">
          {[...Array(6)].map((_, i) => (
            <DoubleZoneCard key={`double-row2-${i}`} boothIndex={i + 6} boothData={boothData}/>
          ))}
        </div>

        <div className="flex justify-center gap-4 mb-4">
          {[...Array(6)].map((_, i) => (
            <DoubleZoneCard key={`double-row3-${i}`} boothIndex={i + 12} boothData={boothData}/>
          ))}
        </div>

        <div className="flex justify-center gap-10">
          {[...Array(4)].map((_, i) => (
            <DoubleZoneCard key={`double-row4-${i}`} boothIndex={i + 18} boothData={boothData}/>
          ))}
        </div>
      </div>
    </div>
  );
}

function DoubleZoneCard(
  { boothIndex, boothData }: { boothIndex: number, boothData : any },
  ) {
  const { doubleZoneBooths } = useBooths();
  const booth = boothData[boothIndex];

  return (
    <div
      className={`border-2 ${
        booth ? "border-red-500" : "border-blue-800"
      } aspect-square w-[60px] h-[60px] flex items-center justify-center relative bg-white`}
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
