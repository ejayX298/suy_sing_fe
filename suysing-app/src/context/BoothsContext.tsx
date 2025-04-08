"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { getInitialBooths } from "@/data/booths";

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
  handleVisitBooth: (id: string) => void;
  handleToggleBooth: (name: string, isVisited: boolean) => void;
}

// Create the context with a default empty value
const BoothsContext = createContext<BoothsContextType | undefined>(undefined);

// Provider component
export function BoothsProvider({ children }: { children: ReactNode }) {
  // Initialize state with empty array
  const [booths, setBooths] = useState<Booth[]>([]);

  useEffect(() => {
    setBooths(getInitialBooths());
  }, []); 

  // Calculate counts
  const visitedCount = booths.filter((booth) => booth.visited).length;
  const totalBooths = booths.length;

  // Function to handle visiting a booth (by id)
  const handleVisitBooth = (id: string) => {
    setBooths((prevBooths) => {
      return prevBooths.map((booth) => {
        if (booth.id === id) {
          return { ...booth, visited: true };
        }
        return booth;
      });
    });
  };

  // Function to toggle booth visited state (by name)
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
