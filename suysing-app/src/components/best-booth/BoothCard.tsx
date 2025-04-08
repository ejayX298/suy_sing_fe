"use client";
import Image from "next/image";
import React from "react";
import { ColorBooth } from "@/data/colorBooths";

interface BoothCardProps {
  booth: ColorBooth;
  color: "blue" | "orange" | "red";
  onClick: () => void;
  isSelected?: boolean;
}

export default function BoothCard({ booth, color, isSelected, onClick }: BoothCardProps) {
  const borderClasses = {
    blue: "border-[#0A20B1]",
    orange: "border-[#F78B1E]",
    red: "border-[#F71E1E]",
  };

  return (
    <div
      className={`flex flex-col items-center mb-2 rounded-lg overflow-hidden cursor-pointer border-2  ${isSelected 
          ? `border-4 ${borderClasses[color]}` 
          : `border-2 ${borderClasses[color]}`
        }`}
      onClick={onClick}
    >
      <div className="bg-white w-full flex justify-center items-center h-32 sm:h-52">
        <Image
          src={booth.image}
          alt={booth.boothCode}
          width={80}
          height={50}
          className="object-contain sm:w-32"
        />
      </div>
    </div>
  );
}
