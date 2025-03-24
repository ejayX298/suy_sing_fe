"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import BoothsProgress from "@/components/BoothsProgress";
import { useBooths, Booth as BoothType } from "@/context/BoothsContext";
import { getInitialBooths } from "@/data/booths";

export default function Home() {
  const { booths, setBooths, visitedCount, totalBooths, handleVisitBooth } =
    useBooths();

  useEffect(() => {
    if (booths.length === 0) {
      setBooths(getInitialBooths());
    }
  }, [booths.length, setBooths]);

  // RenderBooth component
  const RenderBooth = ({ booth }: { booth: BoothType | undefined }) => {
    if (!booth) return null;

    return (
      <div key={booth.id} className="h-full ">
        <button
          onClick={() => booth.id && handleVisitBooth(booth.id)}
          className={`block w-full h-full relative aspect-square ${
            booth.visited ? "border-2 border-red-500 " : ""
          }`}
        >
          <div
            className={`w-full h-full flex items-center justify-center p-2 rounded
              ${
                booth.visited ? "bg-white border-none" : "bg-gray-300"
              } border border-blue-500`}
          >
            <Image
              src={booth.image || "/images/placeholder.png"}
              alt={booth.name}
              width={booth.width || 100}
              height={booth.height || 100}
              style={{
                objectFit: "contain",
                filter: booth.visited ? "none" : "grayscale(100%)",
              }}
            />

            {booth.visited && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <Image
                    src="/images/checkmark.svg"
                    alt="Visited"
                    width={80}
                    height={80}
                  />
                </div>
              </div>
            )}
          </div>
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 px-4 py-6 overflow-y-auto pb-16">
        {/* Booths Progress Section */}
        <BoothsProgress
          visited={visitedCount}
          total={totalBooths}
          viewList=" Tap to view the list of visited and unvisited booths."
        />

        {/* Booths Grid */}
        <div className="grid grid-cols-3 gap-1 relative mt-4">
          <div className="col-span-1 flex flex-col gap-1">
            {/* Double Zone */}
            <div className="relative">
              <div
                className={`bg-[#FFFFFF] border-2 border-dashed border-[#FF3838] p-1 rounded h-full flex flex-col justify-start items-center`}
              >
                <div className="w-full text-center bg-[#B6E056] text-[#0920B0] border-[#0920B0] border rounded-full -mt-4 py-0.5 mb-2 font-bold text-[12px] flex items-center justify-center">
                  Double Zone
                  <div className=" inline-flex items-center justify-center ml-1 bg-[#0920B0] text-[#B6E056] rounded-full w-3 h-3">
                    <span className="font-bold text-[8px] leading-none">i</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1 w-full h-full">
                  {[...Array(8)].map((_, i) => {
                    // Find a visited booth that belongs to double zone
                    const doubleZoneBooth = booths.find(
                      (booth) =>
                        booth.isDoubleZone &&
                        booth.visited &&
                        booth.doubleZonePosition === i
                    );

                    return doubleZoneBooth ? (
                      <div
                        key={`double-${i}`}
                        className="bg-white border-2 border-red-500 rounded aspect-square relative flex items-center justify-center"
                      >
                        <Image
                          src={
                            doubleZoneBooth.image || "/images/placeholder.png"
                          }
                          alt={doubleZoneBooth.name}
                          width={doubleZoneBooth.width || 100}
                          height={doubleZoneBooth.height || 100}
                          style={{ objectFit: "contain" }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-red-500 rounded-full p-1">
                            <Image
                              src="/images/checkmark.png"
                              alt="Visited"
                              width={15}
                              height={15}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={`double-${i}`}
                        className="bg-white border border-[#0920B0] rounded aspect-square"
                      ></div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1 ">
              {/* Ma Ling */}
              <RenderBooth booth={booths.find((b) => b.id === "maling")} />

              {/* CDO */}
              <RenderBooth booth={booths.find((b) => b.id === "cdo")} />

              {/* BENCH */}
              <RenderBooth booth={booths.find((b) => b.id === "bench")} />

              {/* VITAKERATIN */}
              <RenderBooth booth={booths.find((b) => b.id === "vitakeratin")} />

              {/* Perla */}
              <RenderBooth booth={booths.find((b) => b.id === "perla")} />

              {/* NATURE'S SPRING */}
              <RenderBooth
                booth={booths.find((b) => b.id === "natures-spring")}
              />

              {/* EMPERADOR */}
              <RenderBooth booth={booths.find((b) => b.id === "emperador")} />

              {/* RC */}
              <RenderBooth booth={booths.find((b) => b.id === "rc")} />

              {/* Nestlé */}
              <RenderBooth booth={booths.find((b) => b.id === "nestle")} />

              {/* Monde Nissin */}
              <RenderBooth
                booth={booths.find((b) => b.id === "monde-nissin")}
              />

              {/* Colgate */}
              <RenderBooth booth={booths.find((b) => b.id === "colgate")} />

              {/* SELECTA */}
              <RenderBooth booth={booths.find((b) => b.id === "selecta")} />
            </div>
          </div>

          <div className="col-span-1 flex flex-col gap-1 mt-6">
            <div className="grid grid-rows-[2fr_1fr] gap-1">
              {/* SPAM takes 3/5 of the height */}
              <div className="w-full h-full">
                <RenderBooth booth={booths.find((b) => b.id === "spam")} />
              </div>

              {/* Universal Robina and Rebisco take 2/5 of the height */}
              <div className="grid grid-cols-2 gap-1 w-full h-full">
                <div className="w-full h-full">
                  <RenderBooth
                    booth={booths.find((b) => b.id === "universal-robina")}
                  />
                </div>
                <div className="w-full h-full">
                  <RenderBooth booth={booths.find((b) => b.id === "rebisco")} />
                </div>
              </div>
            </div>

            <div>
              <RenderBooth booth={booths.find((b) => b.id === "nutriasia")} />
            </div>

            <div>
              <RenderBooth booth={booths.find((b) => b.id === "ginebra")} />
            </div>

            <div>
              <RenderBooth booth={booths.find((b) => b.id === "hapee")} />
            </div>

            <div>
              <RenderBooth booth={booths.find((b) => b.id === "baygon")} />
            </div>
          </div>

          <div className="col-span-1 flex flex-col gap-1  mt-6">
            <div>
              <RenderBooth booth={booths.find((b) => b.id === "pepsi")} />
            </div>

            <div>
              <RenderBooth booth={booths.find((b) => b.id === "silver-swan")} />
            </div>

            <div>
              <RenderBooth booth={booths.find((b) => b.id === "pringles")} />
            </div>

            <div>
              <RenderBooth booth={booths.find((b) => b.id === "mega")} />
            </div>

            <div>
              <RenderBooth booth={booths.find((b) => b.id === "mrgulaman")} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
