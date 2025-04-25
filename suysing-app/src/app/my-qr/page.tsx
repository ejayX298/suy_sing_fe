"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { customerQr } from "@/services/api";
import InstructionModal from "@/components/homepage/InstructionModal";

interface Schedule {
  event: string;
  schedule: Array<{
    activity: string;
    time: string;
  }>;
}

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
  const [scheduleData, setScheduleData] = useState<Schedule[]>([]);
  const [showInstructionModal, setShowInstructionModal] = useState(false);

  const fetchData = async () => {
    try {
      const customerResult = await customerQr.getCustomer(customer_hash_code);

      if (customerResult.success) {
        setCustomerData(customerResult.results);
        setCustomerFound(true);

        const scheduleResult = await customerQr.getSchedule();
        if (scheduleResult.success) {
          setScheduleData(scheduleResult.results);
        }
      } else {
        router.push(`/unauthorized`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      router.push(`/unauthorized`);
    }
  };

  useEffect(() => {
    if (customer_hash_code) {
      fetchData();
    } else {
      router.push(`/unauthorized`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const firstVisitIds = localStorage.getItem("firstVisitIds");

    if (firstVisitIds) {
      if (customerData?.id) {
        const parSedVisitedIds = JSON.parse(firstVisitIds);
        if (parSedVisitedIds.includes(customerData?.id)) {
          setShowInstructionModal(false);
        } else {
          setShowInstructionModal(true);
        }
      }
    } else {
      setShowInstructionModal(true);
    }
  }, [customerData]);

  if (!customerFound) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col py-10 items-center w-full mb-10">
      {/* Epic Journey Image */}
      <div className="relative w-full h-32 mb-2 sm:h-56">
        <Image
          src="/images/epic-journey2.png"
          alt="Epic Journey to Success - Suy Sing Suki 2025"
          fill
          style={{ objectFit: "contain" }}
          priority
        />
      </div>

      <div className="w-full max-w-md px-4 mt-4">
        {/* Customer Info Card */}
        <div className="bg-white rounded-md border-2 border-gray-500 p-6 mb-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-gray-600 font-medium">Customer Code:</p>
              <p className="font-semibold text-gray-800">
                {customerData?.code || "DCRUZ001"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Customer Name:</p>
              <p className="font-semibold text-gray-800">
                {customerData?.full_name || "Juan Dela Cruz"}
              </p>
            </div>
          </div>
        </div>

        {/* Schedule of Activities Card */}
        <div className="bg-white rounded-md border-2 border-gray-500 overflow-hidden mb-10">
          <div className="p-4 border-b border-gray-500">
            <h2 className="text-xl font-semibold ">Schedule of Activities</h2>
          </div>

          {scheduleData.map((day, dayIndex) => (
            <div key={dayIndex}>
              {day.schedule.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="grid grid-cols-2 border-b border-gray-500"
                >
                  <div className="p-4">
                    <p className="font-medium">{item.time}</p>
                  </div>
                  <div className="p-4">
                    <p className="font-medium">{item.activity}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <InstructionModal
        customer_data={customerData}
        isOpen={showInstructionModal}
        onClose={() => setShowInstructionModal(false)}
      />
    </div>
  );
}
