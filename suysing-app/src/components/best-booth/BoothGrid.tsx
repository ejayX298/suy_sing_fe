"use client";

import React from "react";
import BoothCard from "./BoothCard";
import { useBestBooth } from "@/context/BestBoothContext";

interface Booth {
  name: string;
  logo: string;
}

interface BoothGridProps {
  booths: Booth[];
  color: "blue" | "orange" | "red";
}

export default function BoothGrid({ booths, color }: BoothGridProps) {
  const {
    blueBoothVote,
    orangeBoothVote,
    redBoothVote,
    setBlueBoothVote,
    setOrangeBoothVote,
    setRedBoothVote,
  } = useBestBooth();

  const selectedBooth =
    color === "blue"
      ? blueBoothVote
      : color === "orange"
      ? orangeBoothVote
      : redBoothVote;

  const handleVote = (booth: Booth) => {
    if (color === "blue") {
      setBlueBoothVote(selectedBooth?.logo === booth.logo ? null : booth);
    } else if (color === "orange") {
      setOrangeBoothVote(selectedBooth?.logo === booth.logo ? null : booth);
    } else {
      setRedBoothVote(selectedBooth?.logo === booth.logo ? null : booth);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-3 px-4 pb-4 max-w-xl sm:max-w-3xl mx-auto">
      {booths.map((booth) => (
        <BoothCard
          key={booth.logo}
          logo={booth.logo}
          name={booth.name}
          color={color}
          selected={selectedBooth?.logo === booth.logo}
          onClick={() => handleVote(booth)}
        />
      ))}
    </div>
  );
}
