"use client";
import BoothZone, { Booth as BoothZoneBooth } from "@/components/BoothZone";
import VisitedBooths from "@/components/VisitedBooths";
import BoothsProgress from "@/components/BoothsProgress";
import { useBooths, Booth as ContextBooth } from "@/context/BoothsContext";
import { useState, useEffect } from "react";
import { boothVisitService } from '@/services/api';
import { useSearchParams } from "next/navigation";

export default function BoothsVisitedPage() {
  // Use the global booth state from context
  const { booths, handleToggleBooth, visitedCount, totalBooths } = useBooths();
  const [isRender, setIsRender] = useState(false);
  const [regularBooths, setRegularBooths] = useState([]);
  const [doubleBooths, setDoubleBooths] = useState([]);
  const [visitedBooths, setVisitedBooths] = useState([]);
  const [customerData, setCustomerData] = useState<{
    id: number;
    code: string;
    name: string;
    hasVoted?: number;
    isDoneVisit?: number;
    totalBoothVisited?: number;
    totalBooths?: number;
  } | null>(null);

  const searchParams = useSearchParams();
  const customer_hash_code = searchParams.get("cc");
  
  let stored_hash_code: any = ""
  if (typeof window !== 'undefined') {
    stored_hash_code = localStorage.getItem('hash_code');
  }

  // Map booths to ensure they conform to the BoothZone.Booth interface
  const mapToBoothZoneFormat = (booth: ContextBooth): BoothZoneBooth => ({
    name: booth.name,
    logo:
      booth.logo ||
      (booth.image
        ? booth.image.split("/").pop()?.replace(".png", "") || "default"
        : "default"),
    visited: booth.visited,
  });

  // // Filter and transform booths by their type/zone
  // const regularBooths = booths
  //   .filter(
  //     (booth) =>
  //       booth.id?.startsWith("regular-") ||
  //       (!booth.id?.includes("double") && !booth.isDoubleZone)
  //   )
  //   .map(mapToBoothZoneFormat);

  // const doubleBooths = booths
  //   .filter((booth) => booth.isDoubleZone || booth.id?.includes("double"))
  //   .map(mapToBoothZoneFormat);

  // const visitedBooths = booths
  //   .filter((booth) => booth.visited)
  //   .map(mapToBoothZoneFormat);

  // Handle booth toggling through the context
  const handleBoothToggle = (
    zone: "regular" | "x2" | "visited",
    name: string,
    isVisited: boolean
  ) => {
    // Use the context's handleToggleBooth function
    handleToggleBooth(name, isVisited);
  };

  
  const get_unvisited_booth_list = async () => {
    try {

      const boothResult = await boothVisitService.getUnvisitedBoothlist();
      
      if(boothResult.success){

        const regularBoothsMap = boothResult.results.filter(
          (booth) =>
            booth.is_double_zone == 0
        );

        const doubleBoothsMap = boothResult.results.filter(
          (booth) =>
            booth.is_double_zone == 1
        );

        setRegularBooths(regularBoothsMap)
        setDoubleBooths(doubleBoothsMap)
      }
    
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const get_visited_booth_list = async () => {
    try {

      const boothResult = await boothVisitService.getVisitedBoothlist();
      
      if(boothResult.success){

        const visited_list = boothResult.results?.booths || [];

        setVisitedBooths(visited_list)
      }
    
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


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
  

  useEffect(() => {
    if(customer_hash_code && stored_hash_code){
      if(customer_hash_code == stored_hash_code){
        setIsRender(true)
        get_unvisited_booth_list();
        get_visited_booth_list();
        getCustomerRecord();
      }
      
    }
  }, []);

  if(!isRender){
    return null;
  }
  

  return (
    <div className="flex flex-col max-w-2xl mx-auto">
      <main className="flex-1 px-4 py-6">
        <div className="mb-10">
          <BoothsProgress
            visited={customerData?.totalBoothVisited || 0}
            total={customerData?.totalBooths || 0}
            viewList=""
          />
        </div>

        <BoothZone
          title="Regular Zone"
          booths={regularBooths}
          progress={`${regularBooths.filter((b) => b.visited).length}/${
            regularBooths.length
          }`}
          onBoothToggle={(name, isVisited) =>
            handleBoothToggle("regular", name, isVisited)
          }
        />
      
        <BoothZone
          title="Double Zone"
          booths={doubleBooths}
          progress={`${doubleBooths.filter((b) => b.visited).length}/${
            doubleBooths.length
          }`}
          onBoothToggle={(name, isVisited) =>
            handleBoothToggle("x2", name, isVisited)
          }
        />

        <VisitedBooths
          booths={visitedBooths}
          onBoothToggle={(name, isVisited) =>
            handleBoothToggle("visited", name, isVisited)
          }
        />
      </main>
    </div>
  );
}
