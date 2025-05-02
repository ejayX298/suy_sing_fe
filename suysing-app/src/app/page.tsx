"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import BoothsProgress from "@/components/BoothsProgress";
import DoubleZoneDisplay from "@/components/DoubleZoneDisplay";
import { useBooths, Booth as BoothType } from "@/context/BoothsContext";
import { getInitialBooths } from "@/data/booths";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { boothVisitService } from "@/services/api";
import { useSearchParams, useRouter } from "next/navigation";

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

export default function Home() {
  const router = useRouter();
  const { booths, setBooths } = useBooths();

  const [initialBoothsList, setInitialBoothsList] = useState<Booth[]>();
  const [totalVisitCount, setTotalVisitCount] = useState(0);
  const [doubleZoneBooths, setDoubleZoneBooths] = useState<Booth[]>(
    Array(20).fill("")
  );
  const [remapBooth, setRemapBooth] = useState<Booth[]>([]);
  const [customerData, setCustomerData] = useState<{
    id: number;
    code: string;
    name: string;
    hasVoted?: number;
    isDoneVisit?: number;
    totalBoothVisited?: number;
    totalBooths?: number;
  } | null>(null);
  const [isRender, setIsRender] = useState(false);
  const [latestVisitedBoothCode, setLatestVisitedBoothCode] =
    useState<string>("");

  const searchParams = useSearchParams();
  const customer_hash_code = searchParams.get("cc");

  let stored_hash_code: string = "";
  if (typeof window !== "undefined") {
    stored_hash_code = localStorage.getItem("hash_code") || "";
  }

  const getCustomerRecord = async () => {
    try {
      const customerResult = await boothVisitService.getCustomerRecord();

      if (customerResult.success) {
        const mapCustomerData = {
          id: customerResult.results?.id,
          code: customerResult.results?.code,
          name: customerResult.results?.full_name,
          hasVoted: customerResult.results?.is_done_voting,
          isDoneVisit: customerResult.results?.is_done_visit,
          totalBooths: customerResult.results?.total_booths,
          totalBoothVisited: customerResult.results?.total_booth_visited,
        };

        setCustomerData(mapCustomerData);

        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  };

  const get_visited_booth_list = async () => {
    try {
      const boothResult = await boothVisitService.getVisitedBoothlist();
      console.log(boothResult);
      if (boothResult.success) {
        const doubleBoothsMap = boothResult.results.booths.filter(
          (booth: { is_double_zone: number }) => booth.is_double_zone == 1
        );

        const regularBoothsMap = boothResult.results.booths.filter(
          (booth: { is_double_zone: number }) => booth.is_double_zone == 0
        );

        // Get the latest visited booth (last item in the array)
        const allBooths = [...doubleBoothsMap, ...regularBoothsMap];
        if (allBooths.length > 0) {
          setLatestVisitedBoothCode(allBooths[allBooths.length - 1].code);
        }

        mapRegularBooths(regularBoothsMap);
        mapDoubleZone(doubleBoothsMap);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateCount = () => {
    setTotalVisitCount((prevTotalVisitCount) => {
      return prevTotalVisitCount + 1; // Increment by 1 based on the previous value
    });
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const mapRegularBooths = (regularBooths: any) => {
    const remapBooth = booths?.map((boothDefault) => {
      const findVisited = regularBooths.find(
        (regularBooth: { code: string }) =>
          regularBooth.code === boothDefault.boothCode
      );

      return {
        ...boothDefault,
        visited: findVisited ? true : false,
      };
    });
    setRemapBooth([...remapBooth]);
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const mapDoubleZone = (doubleBoothsMap: any) => {
    doubleBoothsMap.forEach(
      (
        item: { code: string; booth_id: string; name: string },
        index: number
      ) => {
        // find image if booth code already defined in initial booth list
        // const findDefaultBooth = initialBoothsList?.find(
        //   (defaultBooth) => defaultBooth.boothCode === item.code
        // );

        const mapItem = {
          boothCode: item.code,
          doubleZonePosition: index,
          height: 100,
          id: item.booth_id,
          // image : findDefaultBooth?.image ||  `/image/booths/${item.code}.png`,
          image: `/images/booths/${item.code}.png`,
          isDoubleZone: true,
          name: item.name,
          visited: true,
        };

        if (!doubleZoneBooths[index]) {
          doubleZoneBooths[index] = mapItem;
          updateCount();
        }
      }
    );

    setDoubleZoneBooths([...doubleZoneBooths]);
  };

  useEffect(() => {
    if (customer_hash_code && stored_hash_code) {
      if (customer_hash_code == stored_hash_code) {
        setIsRender(true);
      } else {
        router.push(`/unauthorized`);
      }
    } else {
      router.push(`/unauthorized`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (booths.length === 0) {
      setBooths(getInitialBooths());
      setInitialBoothsList(getInitialBooths());
    } else {
      setInitialBoothsList([...booths]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booths.length, setBooths]);

  useEffect(() => {
    if (!initialBoothsList) return;

    if (initialBoothsList.length > 0) {
      getCustomerRecord();
      get_visited_booth_list(); // Call with updated state
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialBoothsList]);

  if (!isRender) {
    return null;
  }

  // RenderBooth component
  const RenderBooth = ({ booth }: { booth: BoothType | undefined }) => {
    if (!booth) return null;

    const aspectClass = booth.overrideAspect
      ? "overflow-hidden"
      : "aspect-square";
    const overrideSizeClass = booth.overrideSize
      ? "overflow-hidden object-cover"
      : "";
    const isSuySing = booth.isSuySing ? "border-none" : "";

    // border style
    const getBorderStyle = () => {
      if (booth.boothCode === latestVisitedBoothCode) {
        return customerData?.isDoneVisit
          ? "border-[4px] border-red-500"
          : "border-[4px] border-red-500 animate-pulse";
      }
      if (booth.visited) {
        return "border-2 border-red-500";
      }
      return "border-[3px] border-blue-800";
    };
    return (
      <div key={booth.id} className="h-full">
        <div
          className={`block w-full h-full relative bg-white border-blue-800 border-[3px] rounded
          ${aspectClass}
          ${overrideSizeClass}
             ${getBorderStyle()}
          ${isSuySing}
        `}
        >
          <div
            className={`w-full h-full flex -webkit-flex justify-center -webkit-justify-center items-center -webkit-items-center 
              ${booth.visited ? "bg-white border-none" : "bg-gray-300"}`}
          >
            <Image
              src={booth.image || "/images/placeholder.png"}
              alt={booth.boothCode}
              width={booth.width || 100}
              height={booth.height || 100}
              style={{
                filter: booth.visited ? "none" : "grayscale(100%)",
              }}
              className="object-contain"
            />

            {booth.visited && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <Image
                    src="/images/checkmark.svg"
                    alt="Visited"
                    width={aspectClass === "overflow-hidden" ? 40 : 80}
                    height={aspectClass === "overflow-hidden" ? 40 : 80}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <main className="flex-1 py-2 px-4 overflow-hidden">
        {/* Booths Progress Section */}
        <BoothsProgress
          visited={customerData?.totalBoothVisited || 0}
          total={customerData?.totalBooths || 0}
          viewList=" Tap to view the list of visited and unvisited booths."
        />

        {/* Booths Grid */}
        <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden">
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={1.5}
            centerOnInit={true}
            limitToBounds={true}
            wheel={{ disabled: false, step: 0.05 }}
            pinch={{ disabled: false, step: 5 }}
            doubleClick={{ disabled: false, mode: "reset" }}
          >
            <TransformComponent
              wrapperStyle={{
                width: "100%",
                height: "100%",
                overflow: "visible",
              }}
              contentStyle={{ minHeight: "1100px", padding: "20px 0 200px 0" }}
            >
              <div className="relative w-full min-w-[1300px] h-full flex items-center justify-center">
                <div className="flex w-full h-[1240px] justify-center">
                  {/* Tent Area*/}
                  <div className="border-[3px] border-blue-800 rounded bg-white w-[550px] h-[1240px] flex flex-col self-center mr-32 overflow-y-auto">
                    <div className="bg-gray-400 w-full p-4 flex flex-col items-center justify-center mb-4">
                      <div className="flex flex-col items-center justify-center mb-4">
                        <h1 className="text-2xl font-bold mb-4 text-[#FFFFFF80]">
                          TENT AREA
                        </h1>
                        <Image
                          src="/images/gaming arena.png"
                          alt="Gaming Arena"
                          width={210}
                          height={210}
                        />
                      </div>
                    </div>

                    {/* Double Zone Section */}
                    <DoubleZoneDisplay
                      boothData={doubleZoneBooths}
                      totalVisitCount={totalVisitCount}
                    />

                    {/* Additional Boxes/Booths Below */}
                    <div className="px-6 w-full flex">
                      <div className="w-1/2 pr-2">
                        <div className="flex justify-between mb-3">
                          <div className=" w-[100px] h-[51px] text-xs font-semibold">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "RHEIN01"
                              )}
                            />
                          </div>
                          <div className=" mr-6 w-[100px] h-[51px] text-xs font-semibold">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "SUYEN02"
                              )}
                            />
                          </div>
                        </div>

                        <div className="flex justify-between mb-3">
                          <div className=" w-[100px] h-[51px]  text-xs font-semibold">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "FEDER04"
                              )}
                            />
                          </div>
                          <div className=" mr-6 w-[100px] h-[51px]  text-xs font-semibold">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "MEADJ01"
                              )}
                            />
                          </div>
                        </div>

                        <div className="flex justify-center mb-6">
                          <div className=" w-[100px] h-[51px]  text-xs font-semibold">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "UNICA01"
                              )}
                            />
                          </div>
                        </div>

                        <div className="flex justify-center mb-3">
                          <div className=" w-[100px] h-[51px]  text-xs font-semibold">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "VALIA04"
                              )}
                            />
                          </div>
                        </div>

                        <div className="flex justify-between mb-3">
                          <div className=" w-[100px] h-[51px]  text-xs font-semibold">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "JEVER01"
                              )}
                            />
                          </div>
                          <div className=" w-[100px] h-[51px]  text-xs font-semibold">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "LTHFO01"
                              )}
                            />
                          </div>
                        </div>

                        <div className="flex justify-between mb-3">
                          <div className=" w-[100px] h-[51px]  text-xs font-semibold">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "LESLI01"
                              )}
                            />
                          </div>
                          <div className=" w-[100px] h-[51px]  text-xs font-semibold">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "SCPGA01"
                              )}
                            />
                          </div>
                        </div>

                        <div className="flex justify-between mb-3">
                          <div className=" w-[100px] h-[51px]  text-xs font-semibold">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "SWEET05"
                              )}
                            />
                          </div>
                          <div className=" w-[100px] h-[51px]  text-xs font-semibold">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "UNIEL01"
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="w-1/2 pl-8">
                        <div className="flex justify-between mb-3">
                          <div className="w-[100px] h-[51px]  text-xs font-semibold">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "LAMOI01"
                              )}
                            />
                          </div>
                          <div className="w-[100px] h-[51px]  text-xs font-semibold">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "MONDI01"
                              )}
                            />
                          </div>
                        </div>

                        <div className="flex justify-between mb-3">
                          <div className="  w-[100px] h-[51px]  text-xs font-semibold">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "PHILU01"
                              )}
                            />
                          </div>
                          <div className=" w-[100px] h-[51px]  text-xs font-semibold">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "PERFE01"
                              )}
                            />
                          </div>
                        </div>

                        <div className="flex justify-center mb-6">
                          <div className=" w-[100px] h-[51px]  text-xs font-semibold">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "SEANL01"
                              )}
                            />
                          </div>
                        </div>

                        <div className=" h-[240px] ">
                          <RenderBooth
                            booth={remapBooth.find(
                              (b) => b.boothCode === "SUYSI01"
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 h-full flex flex-col">
                    <div className="bg-black/10 backdrop-blur-sm px-4 py-2">
                      <div className="border-2 border-blue-800 bg-slate-600 mb-6 py-10 px-4 w-full h-[300px] flex flex-col items-center justify-between">
                        <div className="flex w-full justify-center gap-40">
                          {[...Array(9)].map((_, tableIndex) => (
                            <div
                              key={`dining-table-${tableIndex}`}
                              className="relative"
                            >
                              <div className="w-[70px] h-[150px] bg-transparent border border-gray-300 relative">
                                {[...Array(4)].map((_, chairIndex) => (
                                  <div
                                    key={`left-chair-${tableIndex}-${chairIndex}`}
                                    className="absolute -left-[12px] mt-3 w-[12px] h-[24px] border border-gray-300"
                                    style={{ top: `${chairIndex * 30 + 5}px` }}
                                  ></div>
                                ))}

                                {[...Array(4)].map((_, chairIndex) => (
                                  <div
                                    key={`right-chair-${tableIndex}-${chairIndex}`}
                                    className="absolute -right-[12px] mt-3 w-[12px] h-[24px] border border-gray-300"
                                    style={{ top: `${chairIndex * 30 + 5}px` }}
                                  ></div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="text-white font-bold text-3xl mt-6">
                          DINING AREA
                        </div>
                      </div>

                      {/* Top Row */}
                      <div className="flex mb-2 justify-start w-full mt-12">
                        <div className="flex gap-0.5">
                          <div className="w-[163px] h-[80px] ">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "ECOSS04"
                              )}
                            />
                          </div>
                          <div className=" w-[80px] h-[80px] ">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "WELLM01"
                              )}
                            />
                          </div>

                          {/* 4th-5th combined */}
                          <div className="w-[163px] h-[80px] ">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "FOODS01"
                              )}
                            />
                          </div>

                          {/* 6th-8th are single */}
                          <div className="w-[80px] h-[80px] ">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "RFMCO01"
                              )}
                            />
                          </div>
                          <div className="w-[80px] h-[80px] ">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "MEGAP01"
                              )}
                            />
                          </div>
                          <div className="w-[80px] h-[80px] ">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "REPUB03"
                              )}
                            />
                          </div>
                        </div>

                        {/* DINING ENT label */}
                        <div className="flex flex-col items-center mx-2 -mt-5">
                          <div className="text-white w-[170px] h-[30px] flex items-center justify-center text-lg font-bold mb-1">
                            DINING ENTRANCE
                          </div>
                          <div className="flex justify-center">
                            <Image
                              src="/images/booths/arrow-up.svg"
                              alt="Arrow Up"
                              width={60}
                              height={60}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col items-center mx-2 -mt-10 ">
                          <h1 className="text-4xl text-[#FFFFFF80] font-bold mb-1">
                            MAIN HALL
                          </h1>

                          <div className="flex gap-0.5">
                            <div className="w-[249px] h-[80px]">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "ACSCH01"
                                )}
                              />
                            </div>

                            {/* 12th is single */}
                            <div className="w-[80px] h-[80px] ">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "REGEN01"
                                )}
                              />
                            </div>

                            {/* combined */}
                            <div className="w-[163px] h-[80px]">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "FIRST05"
                                )}
                              />
                            </div>
                          </div>
                        </div>
                        {/* DINING ENT label */}
                        <div className="flex flex-col items-center mx-2 -mt-5">
                          <div className="text-white w-[170px] h-[30px] flex items-center justify-center text-lg font-bold mb-1">
                            DINING ENTRANCE
                          </div>
                          <div className="flex justify-center">
                            <Image
                              src="/images/booths/arrow-up.svg"
                              alt="Arrow Up"
                              width={60}
                              height={60}
                            />
                          </div>
                        </div>

                        <div className="flex gap-0.5">
                          <div className="w-[80px] h-[80px] ">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "MONHE01"
                              )}
                            />
                          </div>
                          <div className="w-[80px] h-[80px] ">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "GENTL01"
                              )}
                            />
                          </div>

                          {/*two squares */}
                          <div className="w-[163px] h-[80px]">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "FEDER01"
                              )}
                            />
                          </div>

                          {/* single grid */}
                          <div className="w-[80px] h-[80px] ">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "PHILI11"
                              )}
                            />
                          </div>
                          <div className="w-[80px] h-[80px] ">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "FLYAC01"
                              )}
                            />
                          </div>
                          <div className="w-[80px] h-[80px] ">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "GINEB01"
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Middle Section */}
                    <div className="flex justify-center w-full mt-4">
                      <div className="flex gap-[60px] w-full">
                        {/* First booth */}
                        <div className="bg-black/10 backdrop-blur-sm px-4 py-2">
                          <div className="w-[164px] h-[251px] grid grid-cols-2 grid-rows-3 gap-0.5">
                            <div>
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "MAGIS01"
                                )}
                              />
                            </div>
                            <div>
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "SKINT01"
                                )}
                              />
                            </div>
                            <div className="">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "FIBER02"
                                )}
                              />
                            </div>
                            <div className="">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "COSME01"
                                )}
                              />
                            </div>
                            <div className=" col-span-2">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "AJINO01"
                                )}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Second booth */}
                        <div className="bg-black/10 backdrop-blur-sm px-4 py-2">
                          <div className="w-[164px] h-[251px] grid grid-cols-2 grid-rows-3 gap-0.5 ">
                            <div className="">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "LIWAY01"
                                )}
                              />
                            </div>
                            <div className="row-span-2">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "ABSOL01"
                                )}
                              />
                            </div>
                            <div className="">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "NABAT01"
                                )}
                              />
                            </div>

                            <div>
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "SANIT01"
                                )}
                              />
                            </div>
                            <div>
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "GREEN01"
                                )}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Third booth */}
                        {/* <div className="bg-black/10 backdrop-blur-sm px-4 py-2">
                          <div className="w-[164px] h-[251px] grid grid-cols-2 grid-rows-3 gap-0.5">
                            <div className="">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "LIWAY01"
                                )}
                              />
                            </div>
                            <div className="row-span-2">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "ABSOL01"
                                )}
                              />
                            </div>
                            <div className="">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "NABAT01"
                                )}
                              />
                            </div>
                            <div className="">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "SANIT01"
                                )}
                              />
                            </div>
                            <div className="">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "GREEN01"
                                )}
                              />
                            </div>
                          </div>
                        </div> */}

                        {/* Fourth booth - Nestle (single) */}
                        <div className="bg-black/10 backdrop-blur-sm px-4 py-2">
                          <div className="w-[164px] h-[251px] bg-white rounded">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "PEPSI02"
                              )}
                            />
                          </div>
                        </div>
                        <div className="bg-black/10 backdrop-blur-sm px-4 py-2">
                          <div className="w-[164px] h-[251px] bg-white rounded">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "NESTL01"
                              )}
                            />
                          </div>
                        </div>

                        <div className="bg-black/10 backdrop-blur-sm px-4 py-2">
                          <div className="w-[164px] h-[251px] bg-white  rounded">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "PROCT06"
                              )}
                            />
                          </div>
                        </div>

                        {/* Sixth booth  */}
                        <div className="bg-black/10 backdrop-blur-sm px-4 py-2">
                          <div className="w-[164px] h-[251px] grid grid-cols-2 grid-rows-3 gap-0.5">
                            <div className="col-span-2">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "EMPER01"
                                )}
                              />
                            </div>
                            <div className="col-span-2 row-span-2">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "NUTRI07"
                                )}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Seventh booth*/}
                        <div className="bg-black/10 backdrop-blur-sm px-4 py-2">
                          <div className="w-[164px] h-[251px]">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "MONDE01"
                              )}
                            />
                          </div>
                        </div>

                        {/* Eighth booth*/}
                        <div className="bg-black/10 backdrop-blur-sm px-4 py-2">
                          <div className="w-[164px] h-[251px]">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "ALASK01"
                              )}
                            />
                          </div>
                        </div>

                        {/* Ninth booth*/}
                        <div className="bg-black/10 backdrop-blur-sm px-4 py-2">
                          <div className="w-[164px] h-[251px] grid grid-cols-2 grid-rows-3 gap-0.5">
                            <div className=" col-span-2">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "JNTLC01"
                                )}
                              />
                            </div>
                            <div className="">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "INTER04"
                                )}
                              />
                            </div>
                            <div className="">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "ARCRE01"
                                )}
                              />
                            </div>

                            <div className="col-span-2">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "PMFTC01"
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="flex justify-center mb-5 mt-4 w-full">
                      <div className="flex gap-[60px] w-full">
                        <div className="bg-black/10 backdrop-blur-sm px-4 py-2">
                          <div className="w-[164px] h-[251px] bg-white  rounded">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "COCAC01"
                              )}
                            />
                          </div>
                        </div>
                        <div className="bg-black/10 backdrop-blur-sm px-4 py-2">
                          <div className="w-[164px] h-[251px] bg-white  rounded">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "UNIVE01"
                              )}
                            />
                          </div>
                        </div>
                        <div className="bg-black/10 backdrop-blur-sm px-4 py-2">
                          <div className="w-[164px] h-[251px] bg-white  rounded">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "MONDE03"
                              )}
                            />
                          </div>
                        </div>
                        <div className="bg-black/10 backdrop-blur-sm px-4 py-2">
                          <div className="w-[164px] h-[251px] bg-white  rounded">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "THEPU01"
                              )}
                            />
                          </div>
                        </div>
                        <div className="bg-black/10 backdrop-blur-sm px-4 py-2">
                          <div className="w-[164px] h-[251px] bg-white  rounded">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "UNILE01"
                              )}
                            />
                          </div>
                        </div>
                        <div className="bg-black/10 backdrop-blur-sm px-4 py-2">
                          <div className="w-[164px] h-[251px] bg-white  rounded">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "CENTU03"
                              )}
                            />
                          </div>
                        </div>
                        <div className="bg-black/10 backdrop-blur-sm px-4 py-2">
                          <div className="w-[164px] h-[251px] bg-white  rounded">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "COLGA01"
                              )}
                            />
                          </div>
                        </div>
                        <div className="bg-black/10 backdrop-blur-sm px-4 py-2">
                          <div className="w-[164px] h-[251px] bg-white  rounded">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "PEERL01"
                              )}
                            />
                          </div>
                        </div>
                        <div className="bg-black/10 backdrop-blur-sm px-4 py-2">
                          <div className="w-[164px] h-[251px] bg-white  rounded">
                            <RenderBooth
                              booth={remapBooth.find(
                                (b) => b.boothCode === "DELMO01"
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Entrance/Exit, CRs Section */}
                    <div className="flex justify-center pr-56 gap-[275px] w-full mt-5">
                      <div className="bg-[#FF9933] w-[250px] h-14 flex items-center justify-center text-sm font-bold border border-black rounded">
                        <Image
                          src="/images/booths/arrow.svg"
                          alt="Entrance/Exit"
                          width={49}
                          height={24}
                        />
                        <span className="ml-2">BOOTH ENTRANCE / EXIT</span>
                      </div>
                      <div className="bg-[#FF9933] w-[250px] h-14 flex items-center justify-center text-sm font-bold border border-black rounded">
                        <Image
                          src="/images/booths/arrow.svg"
                          alt="Entrance/Exit"
                          width={49}
                          height={24}
                        />
                        <span className="ml-2">BOOTH ENTRANCE / EXIT</span>
                      </div>
                      <div className="bg-[#FF9933] w-[250px] h-14 flex items-center justify-center text-sm font-bold border border-black rounded">
                        <Image
                          src="/images/booths/arrow.svg"
                          alt="Entrance/Exit"
                          width={49}
                          height={24}
                        />
                        <span className="ml-2">BOOTH ENTRANCE / EXIT</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TransformComponent>
          </TransformWrapper>
        </div>
      </main>
    </div>
  );
}
