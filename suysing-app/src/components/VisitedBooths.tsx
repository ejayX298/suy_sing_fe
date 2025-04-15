import React from "react";
import BoothItem from "./BoothItem";
import { Booth } from "./BoothZone";

interface VisitedBoothsProps {
  booths: Booth[];
}

export default function VisitedBooths({
  booths,
}: VisitedBoothsProps) {
  // const visitedBooths = booths.filter((booth) => booth.visited);
  const visitedBooths = booths
  if (visitedBooths.length === 0) {
    return null;
  }

  return (
    <div className="bg-white mb-6 rounded-[10px] border border-[#7D7D7D]">
      <div className="p-4">
        <div className="border border-[#7D7D7D] mt-2 rounded-sm">
          <div className="bg-[#FD2929] text-white px-4 py-3 rounded-t-xs">
            <h2 className="text-lg font-medium  ">Visited Booth</h2>
          </div>
          {visitedBooths.map((booth) => (
            <BoothItem
              key={booth.name}
              boothCode={booth.boothCode}
              name={booth.name}
              image={booth.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
