"use client";

import React from "react";
import { useBooths } from "@/context/BoothsContext";
//import { doubleZoneBoothCodes } from "@/data/booths";

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
    </div>
  );
}
