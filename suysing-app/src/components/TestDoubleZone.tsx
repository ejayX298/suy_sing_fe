"use client";

import React from "react";
import { useBooths } from "@/context/BoothsContext";
import { doubleZoneBoothCodes } from "@/data/booths";

export default function TestDoubleZone() {
  const { booths, handleVisitBooth, doubleZoneVisitedCount } = useBooths();

  const findRandomDoubleZoneBooth = () => {
    const doubleZoneBooths = booths.filter(
      (booth) => booth.isDoubleZone && !booth.visited
    );

    if (doubleZoneBooths.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * doubleZoneBooths.length);
    return doubleZoneBooths[randomIndex];
  };

  const handleTestScan = () => {
    const boothToScan = findRandomDoubleZoneBooth();

    if (boothToScan && boothToScan.id) {
      handleVisitBooth(boothToScan.id);
    }
  };

  const handleScanSpecificBooth = (boothCode: string) => {
    const booth = booths.find((b) => b.boothCode === boothCode);
    if (booth && booth.id) {
      handleVisitBooth(booth.id);
    }
  };

  const sampleBoothCodes = doubleZoneBoothCodes.slice(0, 5);

  return (
    <div className="bg-white p-4 rounded-md shadow-md mb-4">
      <h3 className="text-lg font-bold text-blue-800 mb-2">Test Double Zone</h3>

      <div className="mb-4">
        <p className="text-sm mb-2">
          Scanned {doubleZoneVisitedCount} of 22 double zone booths
        </p>

        <button
          onClick={handleTestScan}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          disabled={doubleZoneVisitedCount >= 22}
        >
          Scan Random Double Zone Booth
        </button>
      </div>

      <div className="border-t pt-2">
        <p className="text-sm font-medium mb-2">Quick Test Specific Booths:</p>
        <div className="flex flex-wrap gap-2">
          {sampleBoothCodes.map((code) => (
            <button
              key={code}
              onClick={() => handleScanSpecificBooth(code)}
              className="bg-gray-200 text-xs px-2 py-1 rounded hover:bg-gray-300"
            >
              {code}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
