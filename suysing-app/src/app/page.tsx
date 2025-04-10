"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import BoothsProgress from "@/components/BoothsProgress";
import DoubleZoneDisplay from "@/components/DoubleZoneDisplay";
import TestDoubleZone from "@/components/TestDoubleZone";
import { useBooths, Booth as BoothType } from "@/context/BoothsContext";
import { getInitialBooths } from "@/data/booths";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { boothVisitService } from '@/services/api';
import { useSearchParams } from "next/navigation";

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
  const { booths, setBooths, visitedCount, totalBooths, handleVisitBooth } =
    useBooths();

  const [initialBoothsList, setInitialBoothsList] = useState<Booth[]>();
  const [totalVisitCount, setTotalVisitCount] = useState(0);
  const [doubleZoneBooths, setDoubleZoneBooths] = useState<Booth[]>(
    Array(22).fill('')
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


  const searchParams = useSearchParams();
  const customer_hash_code = searchParams.get("cc");
  
  let stored_hash_code: any = ""
  if (typeof window !== 'undefined') {
    stored_hash_code = localStorage.getItem('hash_code');
  }


  const getCustomerRecord = async () => {
    try {
      const customerResult = await boothVisitService.getCustomerRecord();
      
      if(customerResult.success){

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
      }else{

        return false;
      }
    
    } catch (error) {
      
      return false;
      
    }

  };
  

  const get_visited_booth_list = async () => {
    try {

      const boothResult = await boothVisitService.getVisitedBoothlist();
      if(boothResult.success){

        const doubleBoothsMap = boothResult.results.booths.filter(
          (booth) =>
            booth.is_double_zone == 1
        );

        const regularBoothsMap = boothResult.results.booths.filter(
          (booth) =>
            booth.is_double_zone == 0
        );

        mapRegularBooths(regularBoothsMap)
        mapDoubleZone(doubleBoothsMap)
      }
    
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updateCount = () => {
    setTotalVisitCount((prevTotalVisitCount) => {
      return prevTotalVisitCount + 1;  // Increment by 1 based on the previous value
    });
  }

  const mapRegularBooths = (regularBooths : any) => {
    const remapBooth  = booths?.map(boothDefault => 
      {
        const findVisited = regularBooths.find(
          (regularBooth) => regularBooth.code === boothDefault.boothCode
        );

        return {
          ...boothDefault,
          visited : findVisited ? true : false,
        }
    });
    setRemapBooth([...remapBooth])
  }

  const mapDoubleZone = (doubleBoothsMap : any) => {
    doubleBoothsMap.forEach((item: { code: any; booth_id: any; name: any; }, index: string | number) => {
    
      // find image if booth code already defined in initial booth list
      const findDefaultBooth = initialBoothsList?.find(
        (defaultBooth) => defaultBooth.boothCode === item.code
      );

    //  console.log(findDefaultBooth?.image)

      let mapItem = {
        boothCode : item.code,
        doubleZonePosition : index,
        height : 100,
        id : item.booth_id,
        image : findDefaultBooth?.image ||  `/image/booths/${item.code}.png` ,
        isDoubleZone : true,
        name : item.name,
        visited : true,
        width: true
      }
      if (doubleZoneBooths[index] == '') {
        doubleZoneBooths[index]= mapItem;
        updateCount()
      }
    });

    setDoubleZoneBooths([...doubleZoneBooths])
  }


  
  useEffect(() => {
    if(customer_hash_code && stored_hash_code){
      if(customer_hash_code == stored_hash_code){
        setIsRender(true)
      }
    }
  }, []);

 
  useEffect(() => {

    if (booths.length === 0) {
      setBooths(getInitialBooths());
      setInitialBoothsList(getInitialBooths())
    }else{
      setInitialBoothsList([...booths])
    }
  }, [booths.length, setBooths]);

  useEffect(() => {
    if (!initialBoothsList)  return;

    if (initialBoothsList.length > 0) {
        getCustomerRecord();
        get_visited_booth_list(); // Call with updated state
    }
  }, [initialBoothsList]);


  if(!isRender){
    return null;
  }
  

  // RenderBooth component
  const RenderBooth = ({ booth }: { booth: BoothType | undefined }) => {
    if (!booth) return null;

    return (
      <div key={booth.id} className="h-full ">
        <button
          onClick={() => booth.id && handleVisitBooth(booth.id)}
          className={`block w-full h-full relative aspect-square bg-white border-blue-800 border-2 ${
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
              alt={booth.boothCode}
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
            limitToBounds={false}
            wheel={{ disabled: false, step: 0.05 }}
            pinch={{ disabled: false, step: 5 }}
            doubleClick={{ disabled: false, mode: "reset" }}
          >
            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%', overflow: 'visible' }}
              contentStyle={{ minHeight: '1100px', padding: '20px 0 200px 0' }}
            >
            <div className="relative w-full min-w-[1200px] h-full flex items-center justify-center px-2 py-4">
              <div className="flex w-full h-[1200px] justify-center">
                {/* Tent Area - Gaming Hub & Customer Lounge */}
                <div className="border-2 border-blue-800 rounded bg-white w-[550px] h-[1200px] flex flex-col self-center mr-8 overflow-y-auto">
                  {/* Header/Banner Section */}
                  <div className="bg-gray-400 w-full p-4 flex flex-col items-center justify-center mb-4">
                    <div className="flex items-center justify-center mb-2">
                      <Image src="/images/gaming-hub.svg" alt="Gaming Hub" width={210} height={210} />
                    </div>
                    <div className="text-white font-bold text-xl text-center">GAMING HUB & CUSTOMER LOUNGE AREA</div>
                  </div>
                  
                  {/* Test*/}
                  <TestDoubleZone />
                  
                  {/* Double Zone Section */}
                  <DoubleZoneDisplay totalVisitCount={totalVisitCount} boothData={doubleZoneBooths}/>
                  
                  {/* Additional Boxes/Booths Below */}
                  <div className="px-4 py-4 grid grid-cols-4 gap-3">
                    <div className="border-2 border-blue-800 h-[40px] flex items-center justify-center text-xs font-semibold">REBISCO</div>
                    <div className="border-2 border-blue-800 h-[40px] flex items-center justify-center text-xs font-semibold">SUYPA CORP</div>
                    <div className="border-2 border-blue-800 h-[40px] flex items-center justify-center text-xs font-semibold">LAMOIYAN</div>
                    <div className="border-2 border-blue-800 h-[40px] flex items-center justify-center text-xs font-semibold">MONDELEZ</div>
                    
                    <div className="border-2 border-blue-800 h-[40px] flex items-center justify-center text-xs font-semibold">FEEDING</div>
                    <div className="border-2 border-blue-800 h-[40px] flex items-center justify-center text-xs font-semibold">MILO/NIDO</div>
                    <div className="border-2 border-blue-800 h-[40px] flex items-center justify-center text-xs font-semibold">PHILUSA</div>
                    <div className="border-2 border-blue-800 h-[40px] flex items-center justify-center text-xs font-semibold">PERFETTI</div>
                    
                    <div className="border-2 border-blue-800 h-[40px] flex items-center justify-center text-xs font-semibold col-span-2">UNILAB/OTC</div>
                    <div className="border-2 border-blue-800 h-[40px] flex items-center justify-center text-xs font-semibold col-span-2">SEALANT</div>
                    
                    <div className="border-2 border-blue-800 h-[40px] flex items-center justify-center text-xs font-semibold">VASELINE</div>
                    <div className="border-2 border-blue-800 h-[40px] flex items-center justify-center text-xs font-semibold col-span-3 row-span-2">SUY SING BOOTH</div>
                    
                    <div className="border-2 border-blue-800 h-[40px] flex items-center justify-center text-xs font-semibold">JOYRIDE</div>
                    <div className="border-2 border-blue-800 h-[40px] flex items-center justify-center text-xs font-semibold">LIFEBUOY</div>
                    
                    <div className="border-2 border-blue-800 h-[40px] flex items-center justify-center text-xs font-semibold">LESLEI</div>
                    <div className="border-2 border-blue-800 h-[40px] flex items-center justify-center text-xs font-semibold">SOFISKI</div>
                    
                    <div className="border-2 border-blue-800 h-[40px] flex items-center justify-center text-xs font-semibold">SWEETS</div>
                    <div className="border-2 border-blue-800 h-[40px] flex items-center justify-center text-xs font-semibold">UNI ELEMENTS</div>
                  </div>
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
                      <RenderBooth booth={remapBooth.find((b) => b.id === "empty")} />
                    </div>
                    <div className="w-[80px] h-[80px] ">
                      <RenderBooth booth={remapBooth.find((b) => b.id === "empty")} />
                    </div>
                    <div className=" w-[80px] h-[80px] ">
                      <RenderBooth booth={remapBooth.find((b) => b.boothCode === "WELLM01")} />
                    </div>
                    
                    {/* 4th-5th combined */}
                    <div className="w-[163px] h-[80px] ">
                      <RenderBooth booth={remapBooth.find((b) => b.boothCode === "FOODS01")} />
                    </div>
                    
                    {/* 6th-8th are single */}
                    <div className="w-[80px] h-[80px] ">
                      <RenderBooth booth={remapBooth.find((b) => b.boothCode === "RFMCO01")} />
                    </div>
                    <div className="w-[80px] h-[80px] ">
                      <RenderBooth booth={remapBooth.find((b) => b.boothCode === "MEGAP01")} />
                    </div>
                    <div className="w-[80px] h-[80px] ">
                      <RenderBooth booth={remapBooth.find((b) => b.boothCode === "REPUB03")} />
                    </div>
                  </div>
                  
                  {/* DINING ENT label */}
                  <div className="flex flex-col items-center mx-2 -mt-5">
                    <div className="w-[150px] h-[30px] flex items-center justify-center text-lg font-bold mb-1">DINING ENT</div>
                  </div>
                  
                  <div className="flex gap-0.5">
                    {/* 9th-11th combined */}
                    <div className="w-[249px] h-[80px]">
                      <RenderBooth booth={remapBooth.find((b) => b.boothCode === "ACSCH01")} />
                    </div>
                    
                    {/* 12th is single */}
                    <div className="w-[80px] h-[80px] ">
                      <RenderBooth booth={remapBooth.find((b) => b.boothCode === "REGEN01")} />
                    </div>
                    
                    {/* combined */}
                    <div className="w-[163px] h-[80px]">
                      <RenderBooth booth={remapBooth.find((b) => b.boothCode === "FIRST05")} />
                    </div>
                  </div>
                  
                  {/* DINING ENT label */}
                  <div className="flex flex-col items-center mx-2 -mt-5">
                    <div className="w-[150px] h-[30px] flex items-center justify-center text-lg font-bold mb-1">DINING ENT</div>
                  </div>
                  
                  <div className="flex gap-0.5">
                    {/* Two single squares */}
                    <div className="w-[80px] h-[80px] ">
                      <RenderBooth booth={remapBooth.find((b) => b.boothCode === "MONHE01")} />
                    </div>
                    <div className="w-[80px] h-[80px] ">
                      <RenderBooth booth={remapBooth.find((b) => b.boothCode === "GENTL01")} />
                    </div>
                    
                    {/*two squares */}
                    <div className="w-[163px] h-[80px]">
                      <RenderBooth booth={remapBooth.find((b) => b.boothCode === "FEDER01")} />
                    </div>
                    
                    {/* single grid */}
                    <div className="w-[80px] h-[80px] ">
                      <RenderBooth booth={remapBooth.find((b) => b.boothCode === "PHILI11")} />
                    </div>
                    <div className="w-[80px] h-[80px] ">
                      <RenderBooth booth={remapBooth.find((b) => b.boothCode === "empty")} />
                    </div>
                    <div className="w-[80px] h-[80px] ">
                      <RenderBooth booth={remapBooth.find((b) => b.boothCode === "empty")} />
                    </div>
                    <div className="w-[80px] h-[80px] ">
                      <RenderBooth booth={remapBooth.find((b) => b.boothCode === "GINEB01")} />
                    </div>
                  </div>
                </div>
                
                {/* Middle Section */}
                <div className="flex justify-center w-full mt-4">
                  <div className="flex gap-15 w-full">
                    {/* First booth */}
                    <div className="w-[164px] h-[251px] grid grid-cols-2 grid-rows-3 gap-0.5">
                      <div className="col-span-2">
                        <RenderBooth booth={remapBooth.find((b) => b.boothCode === "JNTLC01")} />
                      </div>
                      <div className="">
                        <RenderBooth booth={remapBooth.find((b) => b.boothCode === "empty")} />
                      </div>
                      <div className="">
                        <RenderBooth booth={remapBooth.find((b) => b.boothCode === "empty")} />
                      </div>
                      <div className=" col-span-2">
                        <RenderBooth booth={remapBooth.find((b) => b.boothCode === "PMFTC01")} />
                      </div>
                    </div>
                    
                    {/* Second booth */}
                    <div className="w-[164px] h-[251px] grid grid-cols-2 grid-rows-3 gap-0.5">
                      <div className="">
                        <RenderBooth booth={remapBooth.find((b) => b.boothCode === "MAGIS01")} />
                      </div>
                      <div className="">
                        <RenderBooth booth={remapBooth.find((b) => b.boothCode === "SKINT01")} />
                      </div>
                      <div className="">
                        <RenderBooth booth={remapBooth.find((b) => b.boothCode === "GARDE01")} />
                      </div>
                      <div className="">
                        <RenderBooth booth={remapBooth.find((b) => b.boothCode === "COSME01")} />
                      </div>
                      <div className="col-span-2">
                        <RenderBooth booth={remapBooth.find((b) => b.boothCode === "AJINO01")} />
                      </div>
                    </div>
                    
                    {/* Third booth */}
                    <div className="w-[164px] h-[251px] grid grid-cols-2 grid-rows-3 gap-0.5">
                      <div className="">
                        <RenderBooth booth={remapBooth.find((b) => b.boothCode === "LIWAY01_2")} />
                      </div>
                      <div className="row-span-2">
                        <RenderBooth booth={remapBooth.find((b) => b.boothCode === "ABSOL01")} />
                      </div>
                      <div className="">
                        <RenderBooth booth={remapBooth.find((b) => b.boothCode === "NABAT01")} />
                      </div>
                      <div className="">
                        <RenderBooth booth={remapBooth.find((b) => b.boothCode === "SANIT01")} />
                      </div>
                      <div className="">
                        <RenderBooth booth={remapBooth.find((b) => b.boothCode === "GREEN01")} />
                      </div>
                    </div>
                    
                    {/* Fourth booth - Nestle (single) */}
                    <div className="w-[164px] h-[251px] bg-white">
                      <RenderBooth booth={remapBooth.find((b) => b.boothCode === "NESTL01")} />
                    </div>
                    
                    {/* Fifth booth - P&G (single) */}
                    <div className="w-[164px] h-[251px] bg-white">
                      <RenderBooth booth={remapBooth.find((b) => b.boothCode === "PROCT06")} />
                    </div>
                    
                    {/* Sixth booth - Emperador/Century (2x3 grid) */}
                    <div className="w-[164px] h-[251px] grid grid-cols-2 grid-rows-3 gap-0.5">
                      <div className="col-span-2">
                        <RenderBooth booth={remapBooth.find((b) => b.boothCode === "EMPER01")} />
                      </div>
                      <div className="col-span-2 row-span-2">
                        <RenderBooth booth={remapBooth.find((b) => b.boothCode === "NUTRI0607")} />
                      </div>
                      
                    </div>
                    
                    {/* Seventh booth - Monde Nissin (single) */}
                    <div className="w-[164px] h-[251px]">
                      <RenderBooth booth={remapBooth.find((b) => b.boothCode === "MONDE01")} />
                    </div>
                    
                    {/* Eighth booth - Alaska (single) */}
                    <div className="w-[164px] h-[251px]">
                      <RenderBooth booth={remapBooth.find((b) => b.boothCode === "ALASK01")} />
                    </div>
                    
                    {/* Ninth booth - INTER04/ECOSS04 (2x3 grid) */}
                    <div className="w-[164px] h-[251px] grid grid-cols-2 grid-rows-3 gap-0.5">
                      <div className="">
                        <RenderBooth booth={remapBooth.find((b) => b.boothCode === "INTER04")} />
                      </div>
                      <div className="">
                        <RenderBooth booth={remapBooth.find((b) => b.boothCode === "empty")} />
                      </div>
                      <div className="">
                        <RenderBooth booth={remapBooth.find((b) => b.boothCode === "empty")} />
                      </div>
                      <div className="row-span-2">
                        <RenderBooth booth={remapBooth.find((b) => b.boothCode === "PEPSI01")} />
                      </div>
                      <div className="">
                        <RenderBooth booth={remapBooth.find((b) => b.boothCode === "ARCRE01")} />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bottom Section */}  
                <div className="flex justify-center mb-5 mt-4 w-full">
                  <div className="flex gap-15 w-full">
                    <div className="w-[164px] h-[251px] bg-white">
                      <RenderBooth booth={remapBooth.find((b) => b.boothCode === "COCAC01")} />
                    </div>
                    <div className="w-[164px] h-[251px] bg-white">
                      <RenderBooth booth={remapBooth.find((b) => b.boothCode === "UNIVE01-red")} />
                    </div>
                    <div className="w-[164px] h-[251px] bg-white">
                      <RenderBooth booth={remapBooth.find((b) => b.boothCode === "MONDE03")} />
                    </div>
                    <div className="w-[164px] h-[251px] bg-white">
                      <RenderBooth booth={remapBooth.find((b) => b.boothCode === "THEPU01&MAGNO01")} />
                    </div>
                    <div className="w-[164px] h-[251px] bg-white">
                      <RenderBooth booth={remapBooth.find((b) => b.boothCode === "UNILE01")} />
                    </div>
                    <div className="w-[164px] h-[251px] bg-white">
                      <RenderBooth booth={remapBooth.find((b) => b.boothCode === "CENTU03")} />
                    </div>
                    <div className="w-[164px] h-[251px] bg-white">
                      <RenderBooth booth={remapBooth.find((b) => b.boothCode === "COLGA01")} />
                    </div>
                    <div className="w-[164px] h-[251px] bg-white">
                      <RenderBooth booth={remapBooth.find((b) => b.boothCode === "PEERL01")} />
                    </div>
                    <div className="w-[164px] h-[251px] bg-white">
                      <RenderBooth booth={remapBooth.find((b) => b.boothCode === "DELMO01")} />
                    </div>
                  </div>
                </div>
                
                {/* Entrance/Exit, CRs Section */}
                <div className="flex justify-center pr-56 gap-[275px] w-full mt-5">
                  <div className="bg-[#FF9933] w-[187px] h-14 flex items-center justify-center text-sm font-bold border border-black rounded">
                    <Image src="/images/booths/arrow.svg" alt="Entrance/Exit" width={49} height={24} />
                    <span className="ml-2">ENTRANCE / EXIT</span>
                  </div>
                  <div className="bg-[#FF9933] w-[187px] h-14 flex items-center justify-center text-sm font-bold border border-black rounded">
                    <Image src="/images/booths/arrow.svg" alt="Entrance/Exit" width={49} height={24} />
                    <span className="ml-2">ENTRANCE / EXIT</span>
                  </div>
                  <div className="bg-[#FF9933] w-[187px] h-14 flex items-center justify-center text-sm font-bold border border-black rounded">
                    <Image src="/images/booths/arrow.svg" alt="Entrance/Exit" width={49} height={24} />
                    <span className="ml-2">ENTRANCE / EXIT</span>
                  </div>
                </div>
                
                <div className="flex justify-center gap-[210px] pr-[230px] mt-1 w-full">
                  <div className="bg-[#3399FF] w-64 h-12 flex items-center justify-center text-[9px] font-bold border border-black rounded">
                    <Image src="/images/booths/men.svg" alt="Men's CR" width={13} height={32} />
                    <span className="ml-2">MEN&apos;S CR</span>
                  </div>
                  <div className="bg-[#FF66CC] w-64 h-12 flex items-center justify-center text-[9px] font-bold border border-black rounded">
                    <Image src="/images/booths/woman.svg" alt="Women's CR" width={16} height={32} />
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
        </div>
      </main>
    </div>
  );
}
