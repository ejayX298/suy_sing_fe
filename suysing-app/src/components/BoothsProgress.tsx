import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

interface BoothsProgressProps {
  visited: number;
  total: number;
  viewList: string;
}

export default function BoothsProgress({
  visited,
  total,
  viewList,
}: BoothsProgressProps) {

  const [hashCode, setHashCode] = useState("");

  let stored_hash_code: string = ""
  if (typeof window !== 'undefined') {
    stored_hash_code = localStorage.getItem('hash_code') || "";
  }

  const concatUrl = (urlString : string) =>{
    return `${urlString}/?cc=${hashCode}`
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      stored_hash_code = localStorage.getItem('hash_code') || "";
      setHashCode(stored_hash_code);
    }
  }, []);


  return (
    <Link href={concatUrl("/booths-visited")}>
      <div className=" flex flex-row items-center text-center justify-between gap-2 ">
        <div className="bg-white px-1 py-2 border border-[#4E4E4E] min-w-52 min-h-28 max-w-52 sm:max-w-none sm:mx-0">
          <h2 className="text-[17px] md:text-lg font-bold text-[#4E4E4E] flex items-center justify-center">
            <Image
              src="/images/check-icon.svg"
              alt="Check Icon"
              width={24}
              height={24}
              className="mr-2"
            />
            Booths Visited
          </h2>
          <div className="flex flex-col items-center">
            <span className="font-bold text-[#4E4E4E] text-[34px]">
              {visited} / {total}
            </span>
            <span className="text-[10px] text-[#4E4E4E] ml-2">{viewList}</span>
          </div>
        </div>

        <div className="relative w-[17rem] h-28">
          <Image
            src="/images/epic-journey.png"
            alt="Epic Journey"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    </Link>
  );
}
