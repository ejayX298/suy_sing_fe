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

  let stored_hash_code: string = "";
  if (typeof window !== "undefined") {
    stored_hash_code = localStorage.getItem("hash_code") || "";
  }

  const concatUrl = (urlString: string) => {
    return `${urlString}/?cc=${hashCode}`;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      stored_hash_code = localStorage.getItem("hash_code") || "";
      setHashCode(stored_hash_code);
    }
  }, []);

  return (
    <Link href={concatUrl("/booths-visited")}>
      <div className=" flex flex-row items-center  justify-between gap-2 ">
        <div className="bg-white border border-[#0F1030] rounded-xl px-4 py-2  min-w-52 min-h-28 max-w-52 sm:max-w-none sm:mx-0">
          <h2 className="text-[14px] md:text-lg font-bold text-[#0F1030] flex justify-start">
            <Image
              src="/images/booths-logo.svg"
              alt="Check Icon"
              width={14}
              height={14}
              className="mr-2"
            />
            Booths Visited
          </h2>
          <div className="flex flex-col ">
            <span className="font-bold text-[#0F1030] text-[34px]">
              {visited} / {total}
            </span>
            <span className="text-[12px] text-[#0F1030]">{viewList}</span>
          </div>
        </div>

        <div className="relative w-[17rem] h-28">
          <Image
            src="/images/new-logo.webp"
            alt="Epic Journey"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    </Link>
  );
}
