'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';

export default function MyQrPage() {
  const [customerCode, setCustomerCode] = useState<string>('');
  
  useEffect(() => {
    const code = localStorage.getItem('customerCode') || 'SUY-SING-2025';
    setCustomerCode(code);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center pt-10 pb-20 px-10">
      {/* Epic Journey Image */}
      <div className="relative w-full h-40 mb-2 sm:h-56">
        <Image
          src="/images/epic-journey.png"
          alt="Epic Journey to Success - Suy Sing Suki 2025"
          fill
          style={{ objectFit: "contain" }}
          priority
        />
      </div>


      <div className="p-6 w-full max-w-3xl">
        <div className="flex flex-col items-center mb-4">
          <div className="bg-white p-6 rounded-md shadow-sm mb-4 border-2 border-[#F78B1E]">
            <p className="text-center text-lg font-semibold mb-2">My QR Code</p>
            <QRCode value={customerCode} size={256}/>
            <p className="text-center text-sm mt-2">Customer Code: <span className="font-semibold text-lg">{customerCode}</span></p>
            <p className="text-center text-2xl mt-1">Juan Dela Cruz</p>
          </div>
        </div>
      </div>
    </div>
  );
}
