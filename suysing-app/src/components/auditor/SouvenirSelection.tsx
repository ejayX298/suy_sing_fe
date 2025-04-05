"use client";

import Image from "next/image";
import { useState } from "react";

interface Souvenir {
  id: string;
  name: string;
  image: string;
}

interface SouvenirSelectionProps {
  souvenirData : Souvenir[];
  onSelect: (souvenir: Souvenir) => void;
  onCancel: () => void;
  onContinue: (souvenir: Souvenir) => void;
}

// const SOUVENIRS: Souvenir[] = [
//   { id: "1", name: "Jisulife", image: "/images/souvenir/jisu.png" },
//   { id: "2", name: "Bag", image: "/images/souvenir/bag.png" },
//   { id: "3", name: "Massage Gun", image: "/images/souvenir/massage_gun.png" },
//   { id: "4", name: "Travel Organizer", image: "/images/souvenir/travel_organizer.png" },
//   { id: "5", name: "Suy Sing GC", image: "/images/souvenir/massage_gun.png" },
// ];



export default function SouvenirSelection({
  souvenirData,
  onSelect,
  onCancel,
  onContinue,
}: SouvenirSelectionProps) {
  const [selectedSouvenir, setSelectedSouvenir] = useState<Souvenir | null>(null);
  const SOUVENIRS = souvenirData;

  const handleSouvenirSelect = (souvenir: Souvenir) => {
    setSelectedSouvenir(souvenir);
    // Just store the selection, don't call onSelect yet
  };

  const handleProceed = () => {
    // Only call onSelect when Proceed is clicked and a souvenir is selected
    if (selectedSouvenir) {
      onSelect(selectedSouvenir);
      onContinue(selectedSouvenir);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="pb-6 text-center">
        <div className="mb-2">
          <Image
            src="/images/epic-journey.png"
            alt="Suy Sing Logo"
            width={150}
            height={50}
            className="mx-auto"
          />
        </div>
        <h1 className="text-4xl font-bold text-white mb-1">Select Souvenir</h1>
        <p className="text-white text-lg">
          Select the souvenir you wish to give to the customer.
        </p>
      </div>

      <div className="w-full px-4 pb-4 mx-auto max-w-4xl">
        {/* First row with 3 items */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {SOUVENIRS.slice(0, 3).map((souvenir) => (
            <div key={souvenir.id} className="rounded-lg overflow-hidden">
              <button
                className={`w-full flex flex-col items-center bg-white rounded-t-lg p-4 ${selectedSouvenir?.id === souvenir.id ? 'ring-2 ring-[#F78B1E]' : ''}`}
                onClick={() => handleSouvenirSelect(souvenir)}
              >
                <Image
                  src={souvenir.image}
                  alt={souvenir.name}
                  width={120}
                  height={120}
                  className="mb-2 object-contain h-32"
                />
              </button>
              <div className="bg-[#F78B1E] text-white py-2 text-center font-medium">
                {souvenir.name}
              </div>
            </div>
          ))}
        </div>
        
        {/* Second row with remaining items, centered */}
        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-2 gap-2 w-full max-w-lg">
            {SOUVENIRS.slice(3).map((souvenir) => (
              <div key={souvenir.id} className="rounded-lg overflow-hidden">
                <button
                  className={`w-full flex flex-col items-center bg-white rounded-t-lg p-4 ${selectedSouvenir?.id === souvenir.id ? 'ring-2 ring-[#F78B1E]' : ''}`}
                  onClick={() => handleSouvenirSelect(souvenir)}
                >
                  <Image
                    src={souvenir.image}
                    alt={souvenir.name}
                    width={120}
                    height={120}
                    className="mb-2 object-contain h-32"
                  />
                </button>
                <div className="bg-[#F78B1E] text-white py-2 text-center font-medium">
                  {souvenir.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onCancel}
            className="w-full rounded-lg bg-white py-4 text-lg font-semibold text-[#F78B1E] border-2 border-[#F78B1E]"
          >
            Cancel
          </button>
          <button
            onClick={handleProceed}
            className={`w-full rounded-lg py-4 text-lg font-semibold ${selectedSouvenir ? 'bg-[#F78B1E]' : 'bg-gray-400'}`}
            disabled={!selectedSouvenir}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
