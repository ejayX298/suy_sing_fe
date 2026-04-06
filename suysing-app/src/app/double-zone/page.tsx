"use client";

import BoothZone from "@/components/BoothZone";
import { useState } from "react";
import { x2ZoneBooths as initialX2Booths } from "@/data/booths";
import Image from "next/image";

interface x2BoothInterface {
  name: string;
  logo: string;
  visited: boolean;
  position?: number;
  image?: string;
  boothCode?: string;
}

export default function DoubleZonePage() {
  const [x2Booths] = useState<x2BoothInterface[]>((initialX2Booths));

  // const handleBoothToggle = (name: string, isVisited: boolean) => {
  //   setX2Booths((prev) =>
  //     prev.map((booth) =>
  //       booth.name === name ? { ...booth, visited: isVisited } : booth
  //     )
  //   );
  // };

  const visitedCount = x2Booths.filter((booth) => booth.visited).length;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 px-4 py-6">
        <div className="bg-white p-6 mb-6 rounded-lg shadow-md">
          <div className="flex flex-row items-center justify-between">
            <div>
              <h2 className="text-[#4E4E4E] text-xl font-bold">Double Zone</h2>
              <div className="text-[#4E4E4E] font-bold">
                Visited: {visitedCount} / {x2Booths.length}
              </div>
              <p className="text-[#4E4E4E]">
                Visit booths in this zone to earn double points!
              </p>
            </div>
            <div className="relative w-64 h-14 md:h-16">
              <Image
                src="/images/new-logo.webp"
                alt="Double Zone"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </div>

        <BoothZone
          title="Double Point Zone"
          booths={x2Booths}
          progress={`${visitedCount}/${x2Booths.length}`}
          // clickable={true}
          // onBoothToggle={handleBoothToggle}
        />
      </main>
    </div>
  );
}
