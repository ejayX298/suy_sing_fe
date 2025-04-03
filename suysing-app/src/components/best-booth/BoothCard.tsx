"use client";

import Image from "next/image";
import React from "react";

interface BoothCardProps {
  logo: string;
  color: "blue" | "orange" | "red";
  onClick: () => void;
}

export default function BoothCard({ logo, color, onClick }: BoothCardProps) {
  const borderClasses = {
    blue: "border-[#0A20B1]",
    orange: "border-[#F78B1E]",
    red: "border-[#F71E1E]",
  };

  return (  
    <div 
      className={`flex flex-col items-center mb-2 rounded-lg overflow-hidden cursor-pointer border-2 ${borderClasses[color]}`}
      onClick={onClick}
    >
      <div className="bg-white w-full flex justify-center items-center h-32 sm:h-52">
        <Image 
          src={`/images/${logo}.png`}   
          alt={logo} 
          width={80} 
          height={50}
          className="object-contain sm:w-32"
        />
      </div>

    </div>
  );
}
