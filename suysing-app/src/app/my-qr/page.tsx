'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { useSearchParams, useRouter } from "next/navigation";
import { customerQr } from '@/services/api';

export default function MyQrPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customer_hash_code = searchParams.get("cc") || "";

  const [customerData, setCustomerData] = useState<{
    id: string;
    code: string;
    customer_type: string;
    full_name: string;
    session_id: string;
  } | null>(null);
  const [customerFound, setCustomerFound] = useState(false);
  
  
  const fetchData = async () => {
    try {

      const customerResult = await customerQr.getCustomer(customer_hash_code);
      
      if(customerResult.success){
        setCustomerData(customerResult.results);
        setCustomerFound(true)
      }else{
        router.push(`/unauthorized`)
      }
    
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    if(customer_hash_code){
      fetchData();
    }else{
      router.push(`/unauthorized`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  if(!customerFound){
    return null;
  }


  return (
    <div className="flex min-h-screen flex-col items-center pt-10 pb-20 px-10">
      {/* Epic Journey Image */}
      {/* {JSON.stringify(customerData)} */}
      <div className="relative w-full h-40 mb-2 sm:h-56">
        <Image
          src="/images/epic-journey.png"
          alt="Epic Journey to Success - Suy Sing Suki 2025"
          fill
          style={{ objectFit: "contain" }}
          priority
        />
      </div>

    {customerFound && (
       <div className="p-6 w-full max-w-3xl">
       <div className="flex flex-col items-center mb-4">
         <div className="bg-white p-6 rounded-md shadow-sm mb-4 border-2 border-[#F78B1E]">
           <p className="text-center text-lg font-semibold mb-2">My QR Code</p>
           <QRCode value={customerData?.code || ""} size={256}/>
           <p className="text-center text-sm mt-2">Customer Code: <span className="font-semibold text-lg">{customerData?.code || ""}</span></p>
           <p className="text-center text-2xl mt-1">{customerData?.full_name || ""}</p>
         </div>
       </div>
     </div>
    )}
     
      
    </div>
  );
}
