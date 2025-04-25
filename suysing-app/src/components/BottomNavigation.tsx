"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function BottomNavigation() {
  const pathname = usePathname();
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white text-[#696969] border-t border-gray-200 flex justify-evenly items-stretch h-16">
      <Link
        href={concatUrl("/")}
        className={`flex flex-col items-center h-full justify-center px-3 gap-1 ${
          pathname === "/" ? "bg-[#0920B0] text-white" : ""
        }`}
      >
        <div className="relative w-[21px] h-[24px]">
          <Image
            src="/images/booths.png"
            alt="Booths"
            fill
            style={{
              objectFit: "contain",
              filter: pathname === "/" ? "brightness(0) invert(1)" : "none",
            }}
          />
        </div>
        <span className="text-sm">Booths</span>
      </Link>

      <Link
        href={concatUrl("/deal-form")}
        className={`flex flex-col items-center h-full justify-center  px-2  gap-1 ${
          pathname === "/deal-form" ? "bg-[#0920B0] text-white" : ""
        }`}
      >
        <div className="relative w-[16px] h-[24px]">
          <Image
            src="/images/deal-form.png"
            alt="Deal Form"
            fill
            style={{
              objectFit: "contain",
              filter:
                pathname === "/deal-form" ? "brightness(0) invert(1)" : "none",
            }}
          />
        </div>
        <span className="text-sm">Deal Form</span>
      </Link>

      <Link href={concatUrl("/camera")} className="flex flex-col items-center -mt-7">
        <div className="bg-[#0920B0] rounded-full p-3 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
      </Link>

      <Link
        href={concatUrl("/best-booth")}
        className={`flex flex-col items-center h-full justify-center px-1 gap-1 ${
          pathname === "/best-booth" ? "bg-[#0920B0] text-white" : ""
        }`}
      >
        <div className="relative w-[22px] h-[24px]">
          <Image
            src="/images/best-booth.svg"
            alt="Best Booth"
            fill
            style={{
              objectFit: "contain",
              filter:
                pathname === "/best-booth" ? "brightness(0) invert(1)" : "none",
            }}
          />
        </div>
        <span className="text-sm">Best Booth</span>
      </Link>

      <Link
        href={concatUrl("/my-qr")}
        className={`flex flex-col items-center h-full justify-center  px-1 gap-1 ${
          pathname === "/my-qr" ? "bg-[#0920B0] text-white" : ""
        }`}
      >
        <div className="relative w-[19px] h-[24px]">
          <Image
            src="/images/account.png"
            alt="Account"
            fill
            style={{
              objectFit: "contain",
              filter:
                pathname === "/my-qr" ? "brightness(0) invert(1)" : "none",
            }}
          />
        </div>
        <span className="text-sm">Account</span>
      </Link>
    </nav>
  );
}
