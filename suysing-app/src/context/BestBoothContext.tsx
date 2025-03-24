"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface BoothVote {
  name: string;
  logo: string;
}

interface BestBoothContextType {
  blueBoothVote: BoothVote | null;
  orangeBoothVote: BoothVote | null;
  redBoothVote: BoothVote | null;
  setBlueBoothVote: (booth: BoothVote | null) => void;
  setOrangeBoothVote: (booth: BoothVote | null) => void;
  setRedBoothVote: (booth: BoothVote | null) => void;
  resetVotes: () => void;
}

const BestBoothContext = createContext<BestBoothContextType | undefined>(undefined);

export const BestBoothProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [blueBoothVote, setBlueBoothVote] = useState<BoothVote | null>(null);
  const [orangeBoothVote, setOrangeBoothVote] = useState<BoothVote | null>(null);
  const [redBoothVote, setRedBoothVote] = useState<BoothVote | null>(null);

  const resetVotes = () => {
    setBlueBoothVote(null);
    setOrangeBoothVote(null);
    setRedBoothVote(null);
  };

  return (
    <BestBoothContext.Provider
      value={{
        blueBoothVote,
        orangeBoothVote,
        redBoothVote,
        setBlueBoothVote,
        setOrangeBoothVote,
        setRedBoothVote,
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
