"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { getInitialBooths, doubleZoneBoothCodes } from "@/data/booths";

export interface Booth {
  id?: string;
  name: string;
  image?: string;
  boothCode: string;
  logo?: string;
  visited: boolean;
  width?: number;
  height?: number;
  isDoubleZone?: boolean;
  doubleZonePosition?: number;
}

interface BoothsContextType {
  booths: Booth[];
  setBooths: React.Dispatch<React.SetStateAction<Booth[]>>;
  visitedCount: number;
  totalBooths: number;
  doubleZoneBooths: Booth[];
  doubleZoneVisitedCount: number;
  handleVisitBooth: (id: string) => void;
  handleToggleBooth: (name: string, isVisited: boolean) => void;
}

const BoothsContext = createContext<BoothsContextType | undefined>(undefined);

export function BoothsProvider({ children }: { children: ReactNode }) {
  const [booths, setBooths] = useState<Booth[]>([]);
  const [doubleZoneBooths, setDoubleZoneBooths] = useState<Booth[]>(
    Array(22).fill(null)
  );

  useEffect(() => {
    const initialBooths = getInitialBooths();

    const updatedBooths = initialBooths.map((booth) => ({
      ...booth,
      isDoubleZone: doubleZoneBoothCodes.includes(booth.boothCode),
    }));

    setBooths(updatedBooths);
  }, []);

  const visitedCount = booths.filter((booth) => booth.visited).length;
  const totalBooths = booths.length;
  const doubleZoneVisitedCount = doubleZoneBooths.filter(
    (booth) => booth !== null
  ).length;

  const handleVisitBooth = (id: string) => {
    setBooths((prevBooths) => {
      const scannedBooth = prevBooths.find((booth) => booth.id === id);

      const updatedBooths = prevBooths.map((booth) => {
        if (booth.id === id) {
          return { ...booth, visited: true };
        }
        return booth;
      });

      if (scannedBooth && scannedBooth.isDoubleZone) {
        const alreadyInDoubleZone = doubleZoneBooths.some(
          (booth) => booth !== null && booth.id === scannedBooth.id
        );

        if (!alreadyInDoubleZone) {
          const emptySlotIndex = doubleZoneBooths.findIndex(
            (booth) => booth === null
          );

          if (emptySlotIndex !== -1) {
            const updatedDoubleZoneBooths = [...doubleZoneBooths];

            updatedDoubleZoneBooths[emptySlotIndex] = {
              ...scannedBooth,
              visited: true,
              doubleZonePosition: emptySlotIndex,
            };

            setDoubleZoneBooths(updatedDoubleZoneBooths);
          }
        }
      }

      return updatedBooths;
    });
  };

  const handleToggleBooth = (name: string, isVisited: boolean) => {
    setBooths((prevBooths) => {
      return prevBooths.map((booth) => {
        if (booth.name === name) {
          return { ...booth, visited: isVisited };
        }
        return booth;
      });
    });
  };

  return (
    <BoothsContext.Provider
      value={{
        booths,
        setBooths,
        visitedCount,
        totalBooths,
        doubleZoneBooths,
        doubleZoneVisitedCount,
        handleVisitBooth,
        handleToggleBooth,
      }}
    >
      {children}
    </BoothsContext.Provider>
  );
}

export function useBooths() {
  const context = useContext(BoothsContext);
  if (context === undefined) {
    throw new Error("useBooths must be used within a BoothsProvider");
  }
  return context;
}
