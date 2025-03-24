import React from "react";
import BoothItem from "./BoothItem";
import ClickableBoothItem from "./ClickableBoothItem";
import { Booth } from "./BoothZone";

interface VisitedBoothsProps {
  booths: Booth[];
  clickable?: boolean;
  onBoothToggle?: (name: string, isVisited: boolean) => void;
}

export default function VisitedBooths({
  booths,
  clickable = false,
  onBoothToggle,
}: VisitedBoothsProps) {
  const visitedBooths = booths.filter((booth) => booth.visited);

  if (visitedBooths.length === 0) {
    return null;
  }

  const handleBoothToggle = (name: string, isVisited: boolean) => {
    if (onBoothToggle) {
      onBoothToggle(name, isVisited);
    }
  };

  return (
    <div className="bg-white mb-6 rounded-[10px] border border-[#7D7D7D]">
      <div className="p-4">
        <div className="border border-[#7D7D7D] mt-2 rounded-sm">
          <div className="bg-[#FD2929] text-white px-4 py-3 rounded-t-xs">
            <h2 className="text-lg font-medium  ">Visited Booth</h2>
          </div>
          {!clickable &&
            visitedBooths.map((booth) => (
              <BoothItem key={booth.name} name={booth.name} logo={booth.logo} />
            ))}
          {clickable &&
            visitedBooths.map((booth) => (
              <ClickableBoothItem
                key={booth.name}
                name={booth.name}
                logo={booth.logo}
                onToggle={handleBoothToggle}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
