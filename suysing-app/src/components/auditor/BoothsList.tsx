"use client";

import { useBooths } from "@/context/BoothsContext";
import Image from "next/image";
import { useState } from "react";

interface BoothsListProps {
  onContinue: () => void;
}

export default function BoothsList({
  onContinue,
}: BoothsListProps) {
  // Track which booth images failed to load
  const [failedImages, setFailedImages] = useState<{[key: string]: boolean}>({});
  
  // Get booth data from context
  const { booths } = useBooths();

  // Filter booths by their type/zone
  const regularBooths = booths.filter(
    (booth) =>
      booth.id?.startsWith("regular-") ||
      (!booth.id?.includes("double") && !booth.isDoubleZone)
  );

  const doubleBooths = booths.filter(
    (booth) => booth.isDoubleZone || booth.id?.includes("double")
  );

  // Get initials for placeholders
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Regular Zone */}
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-[#0920B0] text-white py-2 px-3 flex justify-between items-center">
            <div>Regular Zone</div>
            <div className="text-sm">{regularBooths.filter(b => b.visited).length}/{regularBooths.length}</div>
          </div>
          <div className="p-2">
            <div className="bg-gray-100 py-1 mb-2 text-center">Unvisited Booth</div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {regularBooths.map((booth) => {
                const boothId = booth.id || booth.name;
                const imageKey = `regular-${boothId}`;
                return (
                  <div 
                    key={boothId} 
                    className={`flex items-center p-2 border-b border-gray-200 ${booth.visited ? 'opacity-70' : ''}`}
                  >
                    {!failedImages[imageKey] ? (
                      <div className="w-[60px] h-[30px] relative mr-2">
                        <Image
                          src={`/images/${booth.logo || booth.image?.split('/').pop()?.split('.')[0] || 'default'}.png`}
                          alt={booth.name}
                          width={60}
                          height={30}
                          className="object-contain"
                          unoptimized={true}
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
                    <div className="pl-2 flex-1">{booth.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Double Zone */}
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-[#0920B0] text-white py-2 px-3 flex justify-between items-center">
            <div>Double Zone</div>
            <div className="text-sm">{doubleBooths.filter(b => b.visited).length}/{doubleBooths.length}</div>
          </div>
          <div className="p-2">
            <div className="bg-gray-100 py-1 mb-2 text-center">Unvisited Booth</div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {doubleBooths.map((booth) => {
                const boothId = booth.id || booth.name;
                const imageKey = `double-${boothId}`;
                return (
                  <div 
                    key={boothId} 
                    className={`flex items-center p-2 border-b border-gray-200 ${booth.visited ? 'opacity-70' : ''}`}
                  >
                    {!failedImages[imageKey] ? (
                      <div className="w-[60px] h-[30px] relative mr-2">
                        <Image
                          src={`/images/${booth.logo || booth.image?.split('/').pop()?.split('.')[0] || 'default'}.png`}
                          alt={booth.name}
                          width={60}
                          height={30}
                          className="object-contain"
                          unoptimized={true}
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
                    <div className="pl-2 flex-1">{booth.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="w-full bg-orange-500 text-white py-3 rounded-lg mt-6 font-medium hover:bg-orange-600"
      >
        Continue
      </button>
    </div>
  );
}
