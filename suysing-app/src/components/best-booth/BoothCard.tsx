"use client";
import Image from "next/image";
import React from "react";
import { ColorBooth } from "@/data/colorBooths";

interface BoothCardProps {
  booth: ColorBooth;
  color: "blue" | "orange" | "red" | "green";
  onClick: () => void;
  isSelected?: boolean;
}

export default function BoothCard({ booth, color, isSelected, onClick }: BoothCardProps) {
  const borderClasses = {
    blue: "border-[#2711F0]",
    orange: "border-[#E98414]",
    red: "border-[#FF3838]",
    green: "border-[#08B227]",
  };
  const ringClasses = {
    blue: "ring-[#2711F0]",
    orange: "ring-[#E98414]",
    red: "ring-[#FF3838]",
    green: "ring-[#08B227]",
  };

  return (
    <div
    className={`
      flex flex-col items-center mb-2 rounded-lg overflow-hidden cursor-pointer
      border-4 ${borderClasses[color]}
      ${isSelected ? `ring-4 ${ringClasses[color]}` : ""}
    `}
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
