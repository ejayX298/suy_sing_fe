"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ColorBooth } from "@/data/colorBooths";

interface BestBoothContextType {
  blueBoothVote: ColorBooth | null;
  orangeBoothVote: ColorBooth | null;
  redBoothVote: ColorBooth | null;
  greenBoothVote: ColorBooth | null;
  setBlueBoothVote: (booth: ColorBooth | null) => void;
  setOrangeBoothVote: (booth: ColorBooth | null) => void;
  setRedBoothVote: (booth: ColorBooth | null) => void;
  setGreenBoothVote: (booth: ColorBooth | null) => void;
  resetVotes: () => void;
}

const BestBoothContext = createContext<BestBoothContextType | undefined>(
  undefined
);

export const BestBoothProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [blueBoothVote, setBlueBoothVote] = useState<ColorBooth | null>(null);
  const [orangeBoothVote, setOrangeBoothVote] = useState<ColorBooth | null>(
    null
  );
  const [redBoothVote, setRedBoothVote] = useState<ColorBooth | null>(null);
  const [greenBoothVote, setGreenBoothVote] = useState<ColorBooth | null>(null);

  const resetVotes = () => {
    setBlueBoothVote(null);
    setOrangeBoothVote(null);
    setRedBoothVote(null);
    setGreenBoothVote(null);
  };

  return (
    <BestBoothContext.Provider
      value={{
        blueBoothVote,
        orangeBoothVote,
        redBoothVote,
        greenBoothVote,
        setBlueBoothVote,
        setOrangeBoothVote,
        setRedBoothVote,
        setGreenBoothVote,
        resetVotes,
      }}
    >
      {children}
    </BestBoothContext.Provider>
  );
};

export const useBestBooth = (): BestBoothContextType => {
  const context = useContext(BestBoothContext);
  if (context === undefined) {
    throw new Error("useBestBooth must be used within a BestBoothProvider");
  }
  return context;
};
