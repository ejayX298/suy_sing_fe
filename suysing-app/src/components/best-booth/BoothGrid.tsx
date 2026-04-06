"use client";

import React from "react";
import BoothCard from "./BoothCard";
import { useBestBooth } from "@/context/BestBoothContext";
import { ColorBooth } from "@/data/colorBooths";

interface BoothGridProps {
  booths: ColorBooth[];
  color: "blue" | "orange" | "red" | "green";
  onVote?: () => void;
}

export default function BoothGrid({ booths, color, onVote }: BoothGridProps) {
  const {
    blueBoothVote,
    orangeBoothVote,
    redBoothVote,
    greenBoothVote,
    setBlueBoothVote,
    setOrangeBoothVote,
    setRedBoothVote,
    setGreenBoothVote,
  } = useBestBooth();

  const selectedBooth =
    color === "blue"
      ? blueBoothVote
      : color === "orange"
      ? orangeBoothVote
      : color === "green"
      ? greenBoothVote
      : redBoothVote;

  const handleVote = (booth: ColorBooth) => {
    const isDeselect = selectedBooth?.id === booth.id;
    if (color === "blue") {
      setBlueBoothVote(isDeselect ? null : booth);
    } else if (color === "orange") {
      setOrangeBoothVote(isDeselect ? null : booth);
    } else if (color === "green") {
      setGreenBoothVote(isDeselect ? null : booth);
    } else {
      setRedBoothVote(isDeselect ? null : booth);
    }
    if (!isDeselect && onVote) {
      onVote();
    }
  };

  return (
    <div className="grid grid-cols-3 gap-3 px-4 pb-4 max-w-xl sm:max-w-3xl mx-auto">
      {booths.map((booth) => (
        <BoothCard
          key={booth.id}
          booth={booth}
          color={color}
          onClick={() => handleVote(booth)}
          isSelected={selectedBooth?.id === booth.id}
        />
      ))}
    </div>
  );
}
