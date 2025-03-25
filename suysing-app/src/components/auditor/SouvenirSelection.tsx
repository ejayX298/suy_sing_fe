"use client";

import Image from "next/image";

interface Souvenir {
  id: string;
  name: string;
  image: string;
}

interface SouvenirSelectionProps {
  onSelect: (souvenir: Souvenir) => void;
  onCancel: () => void;
}

const SOUVENIRS: Souvenir[] = [
  { id: "1", name: "Backpack", image: "/images/backpack.png" },
  { id: "2", name: "Tumbler", image: "/images/tumbler.png" },
  { id: "3", name: "Sling Bag", image: "/images/sling-bag.png" },
  { id: "4", name: "Organizer", image: "/images/organizer.png" },
];

export default function SouvenirSelection({
  onSelect,
  onCancel,
}: SouvenirSelectionProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-center text-xl font-semibold">Select Souvenir</h2>
      <p className="mb-4 text-center text-gray-600">
        Select the souvenir you want to get from this system.
      </p>

      <div className="mb-6 grid grid-cols-2 gap-4">
        {SOUVENIRS.map((souvenir) => (
          <button
            key={souvenir.id}
            className="flex flex-col items-center rounded-lg border p-4 hover:border-orange-500"
            onClick={() => onSelect(souvenir)}
          >
            <Image
              src={souvenir.image}
              alt={souvenir.name}
              width={80}
              height={80}
              className="mb-2"
            />
            <span className="text-sm font-medium">{souvenir.name}</span>
          </button>
        ))}
      </div>

      <button
        onClick={onCancel}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
      >
        Cancel
      </button>
    </div>
  );
}
