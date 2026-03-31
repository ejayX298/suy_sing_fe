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
import { getActiveBoothStyle } from "@/lib/booth-styles";

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
  activeGradientColor?: string;
  activeAccentColor?: string;
}

export default function Home() {
  const router = useRouter();
  const { booths, setBooths } = useBooths();

  const [initialBoothsList, setInitialBoothsList] = useState<Booth[]>();
  const [totalVisitCount, setTotalVisitCount] = useState(0);
  const [doubleZoneBooths, setDoubleZoneBooths] = useState<Booth[]>(
    Array(20).fill(""),
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
          (booth: { is_double_zone: number }) => booth.is_double_zone == 1,
        );

        const regularBoothsMap = boothResult.results.booths.filter(
          (booth: { is_double_zone: number }) => booth.is_double_zone == 0,
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
          regularBooth.code === boothDefault.boothCode,
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
        index: number,
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
      },
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

    const activeStyle = getActiveBoothStyle(booth, booth.visited);

    // border style (only used when no custom active style)
    const getBorderStyle = () => {
      if (activeStyle) return "";
      if (booth.boothCode === latestVisitedBoothCode) {
        return customerData?.isDoneVisit
          ? "border-[4px] border-red-500"
          : "border-[4px] border-red-500 animate-pulse";
      }
      if (booth.visited) {
        return "border-2 border-red-500";
      }
      return "";
    };
    return (
      <div key={booth.id} className="h-full">
        <div
          className={`block w-full h-full relative bg-white rounded
          ${aspectClass}
          ${overrideSizeClass}
             ${getBorderStyle()}
          ${isSuySing}
        `}
          style={
            activeStyle || {
              boxShadow:
                "0px 3.92px 6.46px 3.92px #00000059, 2.94px 3.92px 0px 0px #0F1030",
            }
          }
        >
          <div
            className={`w-full h-full flex -webkit-flex justify-center -webkit-justify-center items-center -webkit-items-center rounded
              ${booth.visited ? "border-none" : "bg-gray-300"}`}
            style={
              activeStyle
                ? {
                    background: `linear-gradient(180deg, #FFFFFF 0%, ${booth.activeGradientColor} 100%)`,
                  }
                : booth.visited
                  ? { backgroundColor: "white" }
                  : undefined
            }
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

            {booth.visited && !activeStyle && (
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
    <div
      className="flex flex-col min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/bg-mobile.webp')" }}
    >
      <main className="flex-1 py-3 px-4 overflow-hidden">
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
              <div
                className="relative w-full min-w-[1500px] h-full flex items-center justify-center bg-auto bg-center  p-8"
                style={{ backgroundImage: "url('/images/bg-booth.webp')" }}
              >
                <div className="w-full border border-black rounded-xl  overflow-hidden">
                  <div className="flex w-full h-[1500px] justify-center">
                    {/* Tent Area */}
                    <div className="w-[650px] h-[1500px] flex flex-col self-center mr-14  relative">
                      {/* Row 1: Header + Double Zone */}
                      <div className="bg-white pt-14 pb-4 mb-4">
                        <div className="pl-18 pr-6">
                          <div
                            className="bg-gray-200 w-full p-4 flex items-center justify-center gap-3"
                            style={{ boxShadow: "4px 4px 0px 0px black" }}
                          >
                            <Image
                              src="/images/dice.svg"
                              alt="Dice"
                              width={40}
                              height={40}
                            />
                            <h1 className="text-lg font-bold text-gray-800">
                              GAMING HUB & CUSTOMER LOUNGE
                            </h1>
                          </div>

                          {/* Double Zone Section */}
                          <DoubleZoneDisplay
                            boothData={doubleZoneBooths}
                            totalVisitCount={totalVisitCount}
                          />
                        </div>
                      </div>

                      {/* Row 2: First 2 booths */}
                      <div className="bg-white py-5 mb-4">
                        <div className="pl-18 pr-6">
                          <div className="flex gap-4 justify-start">
                            <div className="w-[96px] h-[57px]">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "MONDI01",
                                )}
                              />
                            </div>
                            <div className="w-[96px] h-[57px]">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "GYMBO01",
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Row 3: 4x2 = 8 booths */}
                      <div className="bg-white py-5 mb-4">
                        <div className="pl-18 pr-6">
                          <div className="flex gap-4 mb-4">
                            <div className="w-[96px] h-[57px]">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "VALIA04",
                                )}
                              />
                            </div>
                            <div className="w-[96px] h-[57px]">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "SCPGA01",
                                )}
                              />
                            </div>
                            <div className="w-[96px] h-[57px]">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "SWEET05",
                                )}
                              />
                            </div>
                            <div className="w-[96px] h-[57px]">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "UNICA01",
                                )}
                              />
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <div className="w-[96px] h-[57px]">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "LESLI01",
                                )}
                              />
                            </div>
                            <div className="w-[96px] h-[57px]">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "SEANL01",
                                )}
                              />
                            </div>
                            <div className="w-[96px] h-[57px]">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "MEGAS01",
                                )}
                              />
                            </div>
                            <div className="w-[96px] h-[57px]">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "LAMOI01",
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Row 4: 4x2 = 8 booths */}
                      <div className="bg-white py-5 mb-4">
                        <div className="pl-18 pr-6">
                          <div className="flex gap-4 mb-4">
                            <div className="w-[96px] h-[57px]">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "PHILU01",
                                )}
                              />
                            </div>
                            <div className="w-[96px] h-[57px]">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "LTHFO01",
                                )}
                              />
                            </div>
                            <div className="w-[96px] h-[57px]">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "UNIEL01",
                                )}
                              />
                            </div>
                            <div className="w-[96px] h-[57px]">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "SUYEN02",
                                )}
                              />
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <div className="w-[96px] h-[57px]">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "JEVER01",
                                )}
                              />
                            </div>
                            <div className="w-[96px] h-[57px]">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "FEDER04",
                                )}
                              />
                            </div>
                            <div className="w-[96px] h-[57px]">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "MEADJ01",
                                )}
                              />
                            </div>
                            <div className="w-[96px] h-[57px]">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "RHEIN01",
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Row 5: 3 cols - last 2 double size */}
                      <div className="bg-white py-5 mb-4">
                        <div className="pl-18 pr-6">
                          <div className="flex gap-4 mb-4">
                            <div className="h-[88px] w-[96px]">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "PHILI11",
                                )}
                              />
                            </div>
                            <div className="h-[88px] w-[96px]">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "FIBER02",
                                )}
                              />
                            </div>
                            <div className="h-[88px] w-[206px]">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "EMPER01",
                                )}
                              />
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <div className="h-[88px] w-[96px]">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "MAGIS01",
                                )}
                              />
                            </div>
                            <div className="h-[88px] w-[96px]">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "ARCRE01",
                                )}
                              />
                            </div>
                            <div className="h-[88px] w-[206px]">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "ECOSS04",
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Row 6: SSCC BOOTH (CENTER) */}
                      <div className="bg-white py-5 flex-1 flex flex-col items-center justify-center">
                        <div
                          className="w-[280px] h-[130px] border border-black rounded flex items-center justify-center bg-white"
                          style={{ boxShadow: "4px 4px 0px 0px black" }}
                        >
                          <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-800">
                              SSCC BOOTH
                            </h3>
                            <h3 className="text-xl font-bold text-gray-800">
                              (CENTER)
                            </h3>
                          </div>
                        </div>
                        <div className="mt-8">
                          <h2 className="text-2xl font-bold text-[#0F1030]">
                            TENT AREA
                          </h2>
                        </div>
                      </div>

                      {/* LINKWAY labels */}
                      <div className="absolute right-[-40px] top-[500px] flex flex-col items-center gap-1 text-black">
                        <span
                          className="text-md font-bold tracking-widest"
                          style={{ writingMode: "vertical-rl" }}
                        >
                          LINKWAY
                        </span>
                        <span className="text-md font-bold">↓↑</span>
                      </div>
                      <div className="absolute right-[-48px] bottom-[100px] flex flex-col items-center gap-1 text-black">
                        <span
                          className="text-md font-bold tracking-widest"
                          style={{ writingMode: "vertical-rl" }}
                        >
                          LINKWAY
                        </span>
                        <span className="text-md font-bold">↓↑</span>
                      </div>

                      {/* TENT AREA label */}
                    </div>
                    <div className="flex-1 min-w-0 h-full flex flex-col">
                      <div className="px-10 pt-28 pb-2 bg-white">
                        <div className="mr-10">
                          <div
                            className="mb-6 w-full flex flex-col items-center"
                            style={{
                              background:
                                "linear-gradient(180deg, rgba(255, 255, 255, 0.5) -59.28%, rgba(255, 255, 255, 0.15) 100%)",
                              border: "1px solid #0F1030",
                              boxShadow:
                                "3px 4px 0px #0F1030, 0px 4px 6px 4px rgba(0, 0, 0, 0.35)",
                              borderRadius: "8px",
                              padding: "20px 16px 12px",
                            }}
                          >
                            {/* Row 1 */}
                            <div className="flex w-full justify-center gap-16 mt-10 mb-14">
                              {[...Array(12)].map((_, i) => (
                                <Image
                                  key={`dining-row1-${i}`}
                                  src="/images/chair-table.svg"
                                  alt=""
                                  width={95}
                                  height={112}
                                />
                              ))}
                            </div>
                            {/* Row 2 */}
                            <div className="flex w-full justify-center gap-16">
                              {[...Array(12)].map((_, i) => (
                                <Image
                                  key={`dining-row2-${i}`}
                                  src="/images/chair-table.svg"
                                  alt=""
                                  width={95}
                                  height={112}
                                />
                              ))}
                            </div>
                            {/* Label */}
                            <div className="flex items-center gap-2 mt-20 mb-4">
                              <Image
                                src="/images/dining-area.svg"
                                alt=""
                                width={54}
                                height={37}
                              />
                              <span className="text-[#0F1030] font-bold text-xl tracking-wide">
                                DINNING AREA
                              </span>
                            </div>
                          </div>

                          {/* Top Row */}
                          <div className="flex mb-2 justify-start w-full mt-34 ">
                            <div className="flex gap-4">
                              <div className="w-[96px] h-[88px] ">
                                <RenderBooth
                                  booth={remapBooth.find(
                                    (b) => b.boothCode === "SKINT01",
                                  )}
                                />
                              </div>
                              <div className="w-[96px] h-[88px] ">
                                <RenderBooth
                                  booth={remapBooth.find(
                                    (b) => b.boothCode === "COSME01",
                                  )}
                                />
                              </div>

                              {/* 4th-5th combined */}
                              <div className="w-[96px] h-[88px] ">
                                <RenderBooth
                                  booth={remapBooth.find(
                                    (b) => b.boothCode === "GOLDR01",
                                  )}
                                />
                              </div>

                              <div className="w-[96px] h-[88px] ">
                                <RenderBooth
                                  booth={remapBooth.find(
                                    (b) => b.boothCode === "FEDER01A",
                                  )}
                                />
                              </div>
                              {/* 6th-8th are single */}
                              <div className="w-[96px] h-[88px] ">
                                <RenderBooth
                                  booth={remapBooth.find(
                                    (b) => b.boothCode === "MEGAP01",
                                  )}
                                />
                              </div>
                              <div className="w-[192px] h-[88px] ">
                                <RenderBooth
                                  booth={remapBooth.find(
                                    (b) => b.boothCode === "FEDER01",
                                  )}
                                />
                              </div>
                              <div className="w-[96px] h-[88px] ">
                                <RenderBooth
                                  booth={remapBooth.find(
                                    (b) => b.boothCode === "SANIT01",
                                  )}
                                />
                              </div>
                            </div>

                            {/* DINING ENT label */}
                            <div className="flex flex-col items-center mx-2 -mt-10">
                              <div className="text-black w-[170px] h-[30px] flex items-center justify-center text-2xl font-bold mb-1">
                                DINNING AREA
                              </div>
                              <div className="flex justify-center">
                                <Image
                                  src="/images/diningArea-arrow.svg"
                                  alt="Arrow Up"
                                  width={75}
                                  height={75}
                                />
                              </div>
                            </div>
                            <div className="flex flex-col items-center mx-2 -mt-10 ">
                              <h1 className="text-4xl text-[#FFFFFF80] font-bold mb-1">
                                MAIN HALL
                              </h1>

                              <div className="flex gap-4">
                                <div className="w-[96px] h-[88px]">
                                  <RenderBooth
                                    booth={remapBooth.find(
                                      (b) => b.boothCode === "WLFOO01",
                                    )}
                                  />
                                </div>

                                {/* 12th is single */}
                                <div className="w-[96px] h-[88px] ">
                                  <RenderBooth
                                    booth={remapBooth.find(
                                      (b) => b.boothCode === "FLYAC01",
                                    )}
                                  />
                                </div>

                                <div className="w-[96px] h-[88px]">
                                  <RenderBooth
                                    booth={remapBooth.find(
                                      (b) => b.boothCode === "RFMCO01",
                                    )}
                                  />
                                </div>
                                <div className="w-[192px] h-[88px]">
                                  <RenderBooth
                                    booth={remapBooth.find(
                                      (b) => b.boothCode === "FIRST05",
                                    )}
                                  />
                                </div>
                                <div className="w-[96px] h-[88px]">
                                  <RenderBooth
                                    booth={remapBooth.find(
                                      (b) => b.boothCode === "REGEN01",
                                    )}
                                  />
                                </div>
                                <div className="w-[96px] h-[88px]">
                                  <RenderBooth
                                    booth={remapBooth.find(
                                      (b) => b.boothCode === "LIWAY01",
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                            {/* DINING ENT label */}
                            <div className="flex flex-col items-center mx-2 -mt-10">
                              <div className="text-black w-[170px] h-[30px] flex items-center justify-center text-2xl font-bold mb-1">
                                DINING AREA
                              </div>
                              <div className="flex justify-center">
                                <Image
                                  src="/images/diningArea-arrow.svg"
                                  alt="Arrow Up"
                                  width={75}
                                  height={75}
                                />
                              </div>
                            </div>

                            <div className="flex gap-4">
                              <div className="w-[96px] h-[88px] ">
                                <RenderBooth
                                  booth={remapBooth.find(
                                    (b) => b.boothCode === "MONHE01",
                                  )}
                                />
                              </div>
                              <div className="w-[192px] h-[88px] ">
                                <RenderBooth
                                  booth={remapBooth.find(
                                    (b) => b.boothCode === "JNTLC01",
                                  )}
                                />
                              </div>

                              {/*two squares */}
                              <div className="w-[96px] h-[88px]">
                                <RenderBooth
                                  booth={remapBooth.find(
                                    (b) => b.boothCode === "WELLM01",
                                  )}
                                />
                              </div>

                              {/* single grid */}
                              <div className="w-[96px] h-[88px] ">
                                <RenderBooth
                                  booth={remapBooth.find(
                                    (b) => b.boothCode === "INTER04",
                                  )}
                                />
                              </div>
                              <div className="w-[96px] h-[88px] ">
                                <RenderBooth
                                  booth={remapBooth.find(
                                    (b) => b.boothCode === "NABAT01",
                                  )}
                                />
                              </div>
                              <div className="w-[96px] h-[88px] ">
                                <RenderBooth
                                  booth={remapBooth.find(
                                    (b) => b.boothCode === "THECO01",
                                  )}
                                />
                              </div>
                              <div className="w-[96px] h-[88px] ">
                                <RenderBooth
                                  booth={remapBooth.find(
                                    (b) => b.boothCode === "GINEB01",
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Middle Section */}
                      <div className="flex justify-center w-full mt-4">
                        <div className="flex gap-[60px] w-full ">
                          {/* First booth */}
                          <div className="px-10 py-3 bg-white ">
                            <div className="w-[206px] h-[269px] grid grid-cols-2 grid-rows-3 gap-4">
                              <div className="col-span-2">
                                <RenderBooth
                                  booth={remapBooth.find(
                                    (b) => b.boothCode === "REBIS01",
                                  )}
                                />
                              </div>

                              <div className="row-span-2">
                                <RenderBooth
                                  booth={remapBooth.find(
                                    (b) => b.boothCode === "PMFTC01",
                                  )}
                                />
                              </div>
                              <div className="row-span-2">
                                <RenderBooth
                                  booth={remapBooth.find(
                                    (b) => b.boothCode === "ABSOL01",
                                  )}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Second booth */}
                          <div className="px-8 py-3 bg-white">
                            <div className="w-[206px] h-[269px] grid grid-cols-2 grid-rows-3 gap-4 ">
                              <div className="">
                                <RenderBooth
                                  booth={remapBooth.find(
                                    (b) => b.boothCode === "AJINO01",
                                  )}
                                />
                              </div>

                              <div className="">
                                <RenderBooth
                                  booth={remapBooth.find(
                                    (b) => b.boothCode === "GREEN01",
                                  )}
                                />
                              </div>

                              <div className="row-span-2 col-span-2">
                                <RenderBooth
                                  booth={remapBooth.find(
                                    (b) => b.boothCode === "ACSCH01",
                                  )}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Third booth */}
                          {/* <div className="px-4 py-2 bg-white">
                          <div className="w-[164px] h-[269px] grid grid-cols-2 grid-rows-3 gap-4">
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
                          <div className="px-4 py-3 bg-white">
                            <div className="w-[206px] h-[269px] bg-white rounded">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "ALASK01",
                                )}
                              />
                            </div>
                          </div>
                          <div className="px-4 py-3 bg-white">
                            <div className="w-[206px] h-[269px] bg-white rounded">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "CENTU03",
                                )}
                              />
                            </div>
                          </div>

                          <div className="ml-10 px-4 py-3 bg-white">
                            <div className="w-[302px] h-[269px] ">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "NESTL01",
                                )}
                              />
                            </div>
                          </div>

                          {/* Sixth booth  */}
                          <div className="ml-10 px-4 py-3 bg-white">
                            <div className="w-[206px] h-[269px] bg-white rounded">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "UNIVE01",
                                )}
                              />
                            </div>
                          </div>
                          {/* Seventh booth*/}
                          <div className="px-4 py-3 bg-white">
                            <div className="w-[206px] h-[269px]">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "THEPU01",
                                )}
                              />
                            </div>
                          </div>

                          {/* Eighth booth*/}
                          <div className="px-4 py-3 bg-white">
                            <div className="w-[206px] h-[269px]">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "FOODS01",
                                )}
                              />
                            </div>
                          </div>

                          {/* Ninth booth*/}
                          <div className="ml-10 px-4 py-3  bg-white">
                            <div className="w-[206px] h-[269px] grid grid-cols-2 grid-rows-3 gap-4">
                              <div className="">
                                <RenderBooth
                                  booth={remapBooth.find(
                                    (b) => b.boothCode === "GENTL02",
                                  )}
                                />
                              </div>
                              <div className="">
                                <RenderBooth
                                  booth={remapBooth.find(
                                    (b) => b.boothCode === "GENTL01",
                                  )}
                                />
                              </div>

                              <div className="col-span-2 row-span-2">
                                <RenderBooth
                                  booth={remapBooth.find(
                                    (b) => b.boothCode === "NUTRI07",
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
                          <div className="px-10 py-3 bg-white">
                            <div className="w-[206px] h-[269px] ">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "PEPSI02",
                                )}
                              />
                            </div>
                          </div>
                          <div className="px-8 py-3 bg-white">
                            <div className="w-[206px] h-[269px] ">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "UNIVE01",
                                )}
                              />
                            </div>
                          </div>
                          <div className="px-4 py-3 bg-white">
                            <div className="w-[206px] h-[269px] ">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "COCA07",
                                )}
                              />
                            </div>
                          </div>
                          <div className="px-4 py-3 bg-white">
                            <div className="w-[206px] h-[269px] ">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "COLGA01",
                                )}
                              />
                            </div>
                          </div>
                          <div className="ml-10 px-4 py-3 bg-white">
                            <div className="w-[302px] h-[269px] ">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "PROCT06",
                                )}
                              />
                            </div>
                          </div>
                          <div className="ml-10 px-4 py-3 bg-white">
                            <div className="w-[206px] h-[269px]">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "UNILE01",
                                )}
                              />
                            </div>
                          </div>
                          <div className="px-4 py-3 bg-white">
                            <div className="w-[206px] h-[269px] ">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "MONDE03",
                                )}
                              />
                            </div>
                          </div>
                          <div className="px-4 py-3 bg-white">
                            <div className="w-[206px] h-[269px] ">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "PEERL01",
                                )}
                              />
                            </div>
                          </div>
                          <div className="ml-10 px-4 py-3 bg-white">
                            <div className="w-[206px] h-[269px] ">
                              <RenderBooth
                                booth={remapBooth.find(
                                  (b) => b.boothCode === "DELMO01",
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
              </div>
            </TransformComponent>
          </TransformWrapper>
        </div>
      </main>
    </div>
  );
}
