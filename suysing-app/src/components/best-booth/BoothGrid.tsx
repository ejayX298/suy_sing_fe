"use client";

import React from "react";
import BoothCard from "./BoothCard";
import { useBestBooth } from "@/context/BestBoothContext";
import { ColorBooth } from "@/data/colorBooths";

interface BoothGridProps {
  booths: ColorBooth[];
  color: "blue" | "orange" | "red";
  onVote?: () => void;
}

export default function BoothGrid({ booths, color, onVote }: BoothGridProps) {
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

  const handleVote = (booth: ColorBooth) => {
    if (color === "blue") {
      setBlueBoothVote(selectedBooth?.id === booth.id ? null : booth);
      if (selectedBooth?.id !== booth.id && onVote) {
        onVote();
      }
    } else if (color === "orange") {
      setOrangeBoothVote(selectedBooth?.id === booth.id ? null : booth);
      if (selectedBooth?.id !== booth.id && onVote) {
        onVote();
      }
    } else {
      setRedBoothVote(selectedBooth?.id === booth.id ? null : booth);
      if (selectedBooth?.id !== booth.id && onVote) {
        onVote();
      }
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
