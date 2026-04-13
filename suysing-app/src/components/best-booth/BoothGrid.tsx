"use client";

import React from "react";
import Image from "next/image";
import BoothCard from "./BoothCard";
import { useBestBooth } from "@/context/BestBoothContext";
import { ColorBooth } from "@/data/colorBooths";

interface BoothGridProps {
  booths: ColorBooth[];
  color: "blue" | "orange" | "red" | "green";
  onVote?: () => void;
}

const getColorName = (color: string): string => {
  const colorMap: Record<string, string> = {
    blue: "Blue Booth",
    orange: "Orange Booth",
    red: "Red Booth",
    green: "Green Booth",
  };
  return colorMap[color] || "";
};

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
    <div className="bg-white rounded-lg border border-black p-4 mb-4 mx-4">
      <div className="flex justify-center mb-4">
        <Image
          src="/images/vote-summary.svg"
          alt="Vote Summary"
          width={72}
          height={38}
          priority
        />
      </div>
      <h1 className="text-[20px] font-bold text-center mb-6 leading-10 ">
        Vote for your best
        {getColorName(color)}
      </h1>

      <div className="grid grid-cols-3 gap-3">
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
    </div>
  );
}
