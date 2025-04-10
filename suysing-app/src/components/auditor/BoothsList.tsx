"use client";

import { useBooths } from "@/context/BoothsContext";
import Image from "next/image";
import { useState, useEffect } from "react";
import { auditorService } from '@/services/api';

interface BoothsListProps {
  onBack: () => void;
  customerId : number
}

export default function BoothsList({
  onBack,
  customerId,
}: BoothsListProps) {
  // Track which booth images failed to load
  const [failedImages, setFailedImages] = useState<{[key: string]: boolean}>({});
  const [regularBooths, setRegularBooths] = useState([]);
  const [doubleBooths, setDoubleBooths] = useState([]);
  
  // Get booth data from context
  const { booths } = useBooths();

  // Filter booths by their type/zone
  // const regularBooths = booths.filter(
  //   (booth) =>
  //     booth.id?.startsWith("regular-") ||
  //     (!booth.id?.includes("double") && !booth.isDoubleZone)
  // );

  // const doubleBooths = booths.filter(
  //   (booth) => booth.isDoubleZone || booth.id?.includes("double")
  // );

  const get_unvisited_booth_list = async () => {
    try {

      const boothResult = await auditorService.getUnvisitedBoothlist(customerId);
      
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
    } finally {
      // setIsLoading(false);
    }
  };

  // Get initials for placeholders
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };


  useEffect(() => {
    if(customerId){
      get_unvisited_booth_list()
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center">
        <button
          onClick={onBack}
          className="flex items-center text-white underline"
        >
          <span>Go Back</span>
        </button>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Regular Zone */}
        <div className="bg-white mb-6 rounded-[10px] border border-[#7D7D7D] p-4">
        <div className="flex justify-between rounded-md items-center bg-[#0920B0] text-white px-4 py-3">
            <h2 className="text-lg font-bold">Regular Zone</h2>
            <div className="text-sm">{regularBooths.filter(b => b.visited).length}/{regularBooths.length}</div>
          </div>
          <div className="border border-[#7D7D7D] mt-3 rounded-sm">
          <div className="p-3 border-b border-[#7D7D7D]">
            <h3 className="text-lg font-medium">
              Unvisited Booth
            </h3>
          </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {regularBooths.map((booth) => {
                const boothId = booth.id || booth.name;
                const imageKey = `regular-${boothId}`;
                return (
                  <div 
                    key={boothId} 
                    className={`flex items-center p-2 border-b border-[#7D7D7D] last:border-b-0 ${booth.visited ? 'opacity-70' : ''}`}
                  >
                    {!failedImages[imageKey] ? (
                      <div className="w-24 h-8 relative mr-2 shrink-0">
                        <Image
                          src={`/images/booths/${booth.logo || booth.image?.split('/').pop()?.split('.')[0] || 'default'}.png`}
                          alt={booth.logo}
                          fill
                          style={{ objectFit: "contain" }}
                          onError={() => {
                            setFailedImages(prev => ({...prev, [imageKey]: true}));
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-[60px] h-[30px] bg-gray-200 flex items-center justify-center rounded mr-2">
                        <span className="text-gray-600 font-medium text-sm">{getInitials(booth.name)}</span>
                      </div>
                    )}
                    <span className=" font-medium">{booth.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Double Zone */}
        <div className="bg-white mb-6 rounded-[10px] border border-[#7D7D7D] p-4 ">
        <div className="flex justify-between rounded-md items-center bg-[#0920B0] text-white px-4 py-3">
            <h2 className="text-lg font-bold">Double Zone</h2>
            <div className="text-sm">{doubleBooths.filter(b => b.visited).length}/{doubleBooths.length}</div>
          </div>
          <div className="border border-[#7D7D7D] mt-3 rounded-sm">
          <div className="p-3 border-b border-[#7D7D7D]">
            <h3 className="text-lg font-medium">
              Unvisited Booth
            </h3>
          </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {doubleBooths.map((booth) => {
                const boothId = booth.id || booth.name;
                const imageKey = `double-${boothId}`;
                return (
                  <div 
                    key={boothId} 
                    className={`flex items-center p-2 border-b border-[#7D7D7D] last:border-b-0 ${booth.visited ? 'opacity-70' : ''}`}
                  >
                    {!failedImages[imageKey] ? (
                      <div className="w-24 h-8 relative mr-2 shrink-0 ">
                        <Image
                          src={`/images/booths/${booth.logo || booth.image?.split('/').pop()?.split('.')[0] || 'default'}.png`}
                          alt={booth.logo}
                          fill
                          style={{ objectFit: "contain" }}
                          onError={() => {
                            setFailedImages(prev => ({...prev, [imageKey]: true}));
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-[60px] h-[30px] bg-gray-200 flex items-center justify-center rounded mr-2">
                        <span className="text-gray-600 font-medium text-sm">{getInitials(booth.name)}</span>
                      </div>
                    )}
                    <div className="font-medium">{booth.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
