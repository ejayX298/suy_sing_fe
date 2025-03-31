"use client";

import Image from "next/image";
import React from "react";

interface BoothCardProps {
  logo: string;
  name: string;
  color: "blue" | "orange" | "red";
  selected?: boolean;
  onClick: () => void;
}

export default function BoothCard({ logo, name, color, selected = false, onClick }: BoothCardProps) {
  const colorClasses = {
    blue: "bg-[#0A20B1] text-white",
    orange: "bg-[#F78B1E] text-white",
    red: "bg-[#F71E1E] text-white",
  };

  const borderClasses = selected ? "border-2 border-orange-500" : "";

  return (
    <div 
      className={`flex flex-col items-center mb-2 rounded-lg overflow-hidden cursor-pointer border border-[#F78B1E] ${borderClasses}`}
      onClick={onClick}
    >
      <div className="bg-white w-full flex justify-center items-center h-32 sm:h-52">
        <Image 
          src={`/images/${logo}.png`} 
          alt={name} 
          width={80} 
          height={50}
          className="object-contain sm:w-32"
        />
      </div>
      <div className={`w-full text-center py-3 font-bold text-lg ${colorClasses[color]}`}>
        {name}
      </div>
    </div>
  );
}
