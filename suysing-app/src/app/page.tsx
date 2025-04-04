"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import BoothsProgress from "@/components/BoothsProgress";
import { useBooths, Booth as BoothType } from "@/context/BoothsContext";
import { getInitialBooths } from "@/data/booths";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

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
          className={`block w-full h-full relative aspect-square bg-white border border-blue-800 rounded ${
            booth.visited ? "border-2 border-red-500 " : ""
          }`}
        >
          <div
            className={`w-full h-full flex items-center justify-center p-2 rounded
              ${
                booth.visited ? "bg-white border-none" : "bg-gray-300"
              }`}
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
    <div className="flex flex-col min-h-screen overflow-hidden">
      <main className="flex-1 px-0 py-0 overflow-hidden">
        {/* Booths Progress Section */}
        <BoothsProgress
          visited={visitedCount}
          total={totalBooths}
          viewList=" Tap to view the list of visited and unvisited booths."
        />

        {/* Booths Grid */}
        <TransformWrapper initialScale={1} minScale={0.3} maxScale={5} initialPositionX={50} initialPositionY={0} centerOnInit={true}>
          <TransformComponent wrapperStyle={{ width: '100vw', height: 'calc(100vh - 80px)', overflow: 'hidden' }}>
            <div className="relative w-full min-w-[1200px] h-full flex items-center justify-center px-2 py-4">
              <div className="flex w-full h-[900px] justify-center">
                {/* Tent Area */}
                <div className="border-2 border-dashed border-blue-800 rounded bg-white p-2 w-[300px] h-[650px] inline-flex items-center justify-center self-center mr-8">
                  <div className="text-black font-bold text-lg text-center">TENT AREA</div>
                </div>
                
                <div className="flex-1 h-full flex flex-col justify-start items-center py-2">
                {/* Dining Area */}
                <div className="border-2 border-blue-800 bg-slate-600 mb-6 py-10 px-4 w-full h-[400px] flex flex-col items-center justify-between">
                  <div className="flex w-full justify-center gap-20">
                    {[...Array(9)].map((_, tableIndex) => (
                      <div key={`dining-table-${tableIndex}`} className="relative">
                        {/* Table */}
                        <div className="w-[50px] h-[120px] bg-transparent border border-gray-300 relative">
                          {/* Chairs - Left Side */}
                          {[...Array(4)].map((_, chairIndex) => (
                            <div 
                              key={`left-chair-${tableIndex}-${chairIndex}`} 
                              className="absolute -left-[12px] w-[10px] h-[18px] border border-gray-300"
                              style={{ top: `${chairIndex * 30 + 5}px` }}
                            ></div>
                          ))}
                          
                          {/* Chairs - Right Side */}
                          {[...Array(4)].map((_, chairIndex) => (
                            <div 
                              key={`right-chair-${tableIndex}-${chairIndex}`} 
                              className="absolute -right-[12px] w-[10px] h-[18px] border border-gray-300"
                              style={{ top: `${chairIndex * 30 + 5}px` }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-white font-bold text-3xl mt-6">DINING AREA</div>
                </div>
                
                {/* Top Row */}
                <div className="flex mb-2 justify-center w-full mt-12">
                  <div className="flex gap-0.5">
                    <div className="w-[80px] h-[80px] ">
                      <RenderBooth booth={booths.find((b) => b.id === "rebisco")} />
                    </div>
                    <div className="w-[80px] h-[80px] ">
                      <RenderBooth booth={booths.find((b) => b.id === "rebisco")} />
                    </div>
                    <div className=" w-[80px] h-[80px] ">
                      <RenderBooth booth={booths.find((b) => b.id === "wellmade")} />
                    </div>
                    
                    {/* 4th-5th combined */}
                    <div className="w-[163px] h-[80px] ">
                      <RenderBooth booth={booths.find((b) => b.id === "cdo")} />
                    </div>
                    
                    {/* 6th-8th are single */}
                    <div className="w-[80px] h-[80px] ">
                      <RenderBooth booth={booths.find((b) => b.id === "selecta")} />
                    </div>
                    <div className="w-[80px] h-[80px] ">
                      <RenderBooth booth={booths.find((b) => b.id === "mega")} />
                    </div>
                    <div className="w-[80px] h-[80px] ">
                      <RenderBooth booth={booths.find((b) => b.id === "rebisco")} />
                    </div>
                  </div>
                  
                  {/* DINING ENT label */}
                  <div className="flex flex-col items-center mx-2 -mt-5">
                    <div className="w-[150px] h-[30px] flex items-center justify-center text-lg font-bold mb-1">DINING ENT</div>
                  </div>
                  
                  <div className="flex gap-0.5">
                    {/* 9th-11th combined */}
                    <div className="w-[249px] h-[80px]">
                      <RenderBooth booth={booths.find((b) => b.id === "pride")} />
                    </div>
                    
                    {/* 12th is single */}
                    <div className="w-[80px] h-[80px] ">
                      <RenderBooth booth={booths.find((b) => b.id === "regen")} />
                    </div>
                    
                    {/* combined */}
                    <div className="w-[163px] h-[80px]">
                      <RenderBooth booth={booths.find((b) => b.id === "silver-swan")} />
                    </div>
                  </div>
                  
                  {/* DINING ENT label */}
                  <div className="flex flex-col items-center mx-2 -mt-5">
                    <div className="w-[150px] h-[30px] flex items-center justify-center text-lg font-bold mb-1">DINING ENT</div>
                  </div>
                  
                  <div className="flex gap-0.5">
                    {/* Two single squares */}
                    <div className="w-[80px] h-[80px] ">
                      <RenderBooth booth={booths.find((b) => b.id === "baygon")} />
                    </div>
                    <div className="w-[80px] h-[80px] ">
                      <RenderBooth booth={booths.find((b) => b.id === "wings")} />
                    </div>
                    
                    {/*two squares */}
                    <div className="w-[163px] h-[80px]">
                      <RenderBooth booth={booths.find((b) => b.id === "maling")} />
                    </div>
                    
                    {/* single grid */}
                    <div className="w-[80px] h-[80px] ">
                      <RenderBooth booth={booths.find((b) => b.id === "natures-spring")} />
                    </div>
                    <div className="w-[80px] h-[80px] ">
                      <RenderBooth booth={booths.find((b) => b.id === "natures-spring")} />
                    </div>
                    <div className="w-[80px] h-[80px] ">
                      <RenderBooth booth={booths.find((b) => b.id === "natures-spring")} />
                    </div>
                    <div className="w-[80px] h-[80px] ">
                      <RenderBooth booth={booths.find((b) => b.id === "ginebra")} />
                    </div>
                  </div>
                </div>
                
                {/* Middle Section */}
                <div className="flex justify-center w-full mt-4">
                  <div className="flex gap-15 w-full">
                    {/* First booth */}
                    <div className="w-[164px] h-[251px] grid grid-cols-2 grid-rows-3 gap-0.5">
                      <div className="col-span-2">
                        <RenderBooth booth={booths.find((b) => b.id === "modess")} />
                      </div>
                      <div className="">
                        <RenderBooth booth={booths.find((b) => b.id === "nestle")} />
                      </div>
                      <div className="">
                        <RenderBooth booth={booths.find((b) => b.id === "nestle")} />
                      </div>
                      <div className=" col-span-2">
                        <RenderBooth booth={booths.find((b) => b.id === "pmftc")} />
                      </div>
                    </div>
                    
                    {/* Second booth */}
                    <div className="w-[164px] h-[251px] grid grid-cols-2 grid-rows-3 gap-0.5">
                      <div className="">
                        <RenderBooth booth={booths.find((b) => b.id === "kojie-san")} />
                      </div>
                      <div className="">
                        <RenderBooth booth={booths.find((b) => b.id === "keratin")} />
                      </div>
                      <div className="">
                        <RenderBooth booth={booths.find((b) => b.id === "happy")} />
                      </div>
                      <div className="">
                        <RenderBooth booth={booths.find((b) => b.id === "silka")} />
                      </div>
                      <div className="col-span-2">
                        <RenderBooth booth={booths.find((b) => b.id === "ajinomoto")} />
                      </div>
                    </div>
                    
                    {/* Third booth */}
                    <div className="w-[164px] h-[251px] grid grid-cols-2 grid-rows-3 gap-0.5">
                      <div className="">
                        <RenderBooth booth={booths.find((b) => b.id === "oishi-white")} />
                      </div>
                      <div className="row-span-2">
                        <RenderBooth booth={booths.find((b) => b.id === "asia-brewery")} />
                      </div>
                      <div className="">
                        <RenderBooth booth={booths.find((b) => b.id === "nabati")} />
                      </div>
                      <div className="">
                        <RenderBooth booth={booths.find((b) => b.id === "sanit01")} />
                      </div>
                      <div className="">
                        <RenderBooth booth={booths.find((b) => b.id === "green-cross")} />
                      </div>
                    </div>
                    
                    {/* Fourth booth - Nestle (single) */}
                    <div className="w-[164px] h-[251px] bg-white">
                      <RenderBooth booth={booths.find((b) => b.id === "nestle")} />
                    </div>
                    
                    {/* Fifth booth - P&G (single) */}
                    <div className="w-[164px] h-[251px] bg-white">
                      <RenderBooth booth={booths.find((b) => b.id === "p&g")} />
                    </div>
                    
                    {/* Sixth booth - Emperador/Century (2x3 grid) */}
                    <div className="w-[164px] h-[251px] grid grid-cols-2 grid-rows-3 gap-0.5">
                      <div className="col-span-2">
                        <RenderBooth booth={booths.find((b) => b.id === "emperador")} />
                      </div>
                      <div className="col-span-2 row-span-2">
                        <RenderBooth booth={booths.find((b) => b.id === "nutraria")} />
                      </div>
                      
                    </div>
                    
                    {/* Seventh booth - Monde Nissin (single) */}
                    <div className="w-[164px] h-[251px]">
                      <RenderBooth booth={booths.find((b) => b.id === "monde-nissin")} />
                    </div>
                    
                    {/* Eighth booth - Alaska (single) */}
                    <div className="w-[164px] h-[251px]">
                      <RenderBooth booth={booths.find((b) => b.id === "alaska")} />
                    </div>
                    
                    {/* Ninth booth - INTER04/ECOSS04 (2x3 grid) */}
                    <div className="w-[164px] h-[251px] grid grid-cols-2 grid-rows-3 gap-0.5">
                      <div className="">
                        <RenderBooth booth={booths.find((b) => b.id === "bioderm")} />
                      </div>
                      <div className="">
                        <RenderBooth booth={booths.find((b) => b.id === "alaska")} />
                      </div>
                      <div className="">
                        <RenderBooth booth={booths.find((b) => b.id === "champion")} />
                      </div>
                      <div className="row-span-2">
                        <RenderBooth booth={booths.find((b) => b.id === "pepsi")} />
                      </div>
                      <div className="">
                        <RenderBooth booth={booths.find((b) => b.id === "rc-cola")} />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bottom Section */}  
                <div className="flex justify-center mb-5 mt-4 w-full">
                  <div className="flex gap-15 w-full">
                    <div className="w-[164px] h-[251px] bg-white">
                      <RenderBooth booth={booths.find((b) => b.id === "coca-cola")} />
                    </div>
                    <div className="w-[164px] h-[251px] bg-white">
                      <RenderBooth booth={booths.find((b) => b.id === "universal-robina-red")} />
                    </div>
                    <div className="w-[164px] h-[251px] bg-white">
                      <RenderBooth booth={booths.find((b) => b.id === "mondelez")} />
                    </div>
                    <div className="w-[164px] h-[251px] bg-white">
                      <RenderBooth booth={booths.find((b) => b.id === "san-miguel")} />
                    </div>
                    <div className="w-[164px] h-[251px] bg-white">
                      <RenderBooth booth={booths.find((b) => b.id === "unilever")} />
                    </div>
                    <div className="w-[164px] h-[251px] bg-white">
                      <RenderBooth booth={booths.find((b) => b.id === "century")} />
                    </div>
                    <div className="w-[164px] h-[251px] bg-white">
                      <RenderBooth booth={booths.find((b) => b.id === "palmolive")} />
                    </div>
                    <div className="w-[164px] h-[251px] bg-white">
                      <RenderBooth booth={booths.find((b) => b.id === "champion")} />
                    </div>
                    <div className="w-[164px] h-[251px] bg-white">
                      <RenderBooth booth={booths.find((b) => b.id === "delmonte")} />
                    </div>
                  </div>
                </div>
                
                {/* Entrance/Exit, CRs Section */}
                <div className="flex justify-center pr-56 gap-[275px] w-full mt-5">
                  <div className="bg-[#FF9933] w-[187px] h-14 flex items-center justify-center text-sm font-bold border border-black rounded">
                    <Image src="/images/main-hall/arrow.svg" alt="Entrance/Exit" width={49} height={24} />
                    <span className="ml-2">ENTRANCE / EXIT</span>
                  </div>
                  <div className="bg-[#FF9933] w-[187px] h-14 flex items-center justify-center text-sm font-bold border border-black rounded">
                    <Image src="/images/main-hall/arrow.svg" alt="Entrance/Exit" width={49} height={24} />
                    <span className="ml-2">ENTRANCE / EXIT</span>
                  </div>
                  <div className="bg-[#FF9933] w-[187px] h-14 flex items-center justify-center text-sm font-bold border border-black rounded">
                    <Image src="/images/main-hall/arrow.svg" alt="Entrance/Exit" width={49} height={24} />
                    <span className="ml-2">ENTRANCE / EXIT</span>
                  </div>
                </div>
                
                <div className="flex justify-center gap-[210px] pr-[230px] mt-1 w-full">
                  <div className="bg-[#3399FF] w-64 h-12 flex items-center justify-center text-[9px] font-bold border border-black rounded">
                    <Image src="/images/main-hall/men.svg" alt="Men's CR" width={13} height={32} />
                    <span className="ml-2">MEN&apos;S CR</span>
                  </div>
                  <div className="bg-[#FF66CC] w-64 h-12 flex items-center justify-center text-[9px] font-bold border border-black rounded">
                    <Image src="/images/main-hall/woman.svg" alt="Women's CR" width={16} height={32} />
                    <span className="ml-2">WOMEN&apos;S CR</span>
                  </div>
                </div>
                
                {/* <div className="absolute left-4 top-[120px] w-[120px]">
                  <div className="bg-[#FFFFFF] border-2 border-dashed border-[#FF3838] p-1 rounded h-full flex flex-col justify-start items-center">
                    <div className="w-full text-center bg-[#B6E056] text-[#0920B0] border-[#0920B0] border rounded-full -mt-4 py-0.5 mb-2 font-bold text-[12px] flex items-center justify-center">
                      Double Zone
                      <div className="inline-flex items-center justify-center ml-1 bg-[#0920B0] text-[#B6E056] rounded-full w-3 h-3">
                        <span className="font-bold text-lg leading-none">i</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1 w-full">
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
                              src={doubleZoneBooth.image || "/images/placeholder.png"}
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
                </div> */}
                </div>
              </div>
            </div>
          </TransformComponent>
        </TransformWrapper>
      </main>
    </div>
  );
}
