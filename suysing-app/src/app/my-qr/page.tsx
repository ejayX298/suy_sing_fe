"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { customerQr } from "@/services/api";
import InstructionModal from "@/components/homepage/InstructionModal";

interface ScheduleItem {
  time: string;
  activity: string;
  details?: string[]; // Added for nested list items
}

interface Schedule {
  event?: string; // Optional event title for the day
  schedule: ScheduleItem[];
}

// Schedule for Red and Green customer types
const scheduleRedGreen: Schedule[] = [
  {
    schedule: [
      { time: "07:00 AM", activity: "Registration" },
      { time: "08:00 AM", activity: "Opening Ceremony" },
      {
        time: "08:30 AM",
        activity: "Booth Hopping:",
        details: [
          "Main Hall: Trade Booths",
          "Tent:",
          "• Suy Sing Booths",
          "• Gaming Hub",
          "• More Trade Booths",
          "• Store Solution Pavilion",
          "Suki Day Deals",
        ],
      },
      { time: "11:30 AM", activity: "Buffet Lunch" },
      { time: "12:00 PM", activity: "Suki Day Show" },
      { time: "02:30 PM", activity: "Souvenir Redemption" },
      { time: "03:30 PM", activity: "Mini Show at Lobby Area" },
      { time: "07:00 PM (Sharp)", activity: "Event Closing" },
    ],
  },
];

// Schedule for Yellow customer type
const scheduleYellow: Schedule[] = [
  {
    schedule: [
      { time: "01:30 PM", activity: "Registration" },
      {
        time: "", // Empty time for multi-line activity alignment
        activity: "Booth Hopping:",
        details: [
          "Main Hall: Trade Booths",
          "Tent:",
          "• Suy Sing Booths",
          "• Gaming Hub",
          "• More Trade Booths",
          "• Store Solution Pavilion",
          "Suki Day Deals",
        ],
      },
      { time: "02:30 PM", activity: "Souvenir Redemption" },
      { time: "03:30 PM", activity: "Mini Show at Lobby Area" },
      { time: "07:00 PM (Sharp)", activity: "Event Closing" },
    ],
  },
];

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
  const [showInstructionModal, setShowInstructionModal] = useState(false);

  const fetchData = async () => {
    try {
      const customerResult = await customerQr.getCustomer(customer_hash_code);
      console.log(customerResult);

      if (customerResult.success) {
        setCustomerData(customerResult.results);
        setCustomerFound(true);
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

  // Determine which schedule to display
  const scheduleToDisplay =
    customerData?.customer_type === "yellow"
      ? scheduleYellow
      : scheduleRedGreen;

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
              <p className="font-bold text-gray-800">
                {customerData?.code || "DCRUZ001"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Customer Name:</p>
              <p className="font-bold text-gray-800">
                {customerData?.full_name || "Juan Dela Cruz"}
              </p>
            </div>
          </div>
        </div>

        {/* Schedule of Activities Card */}
        <div className="bg-white rounded-md border-2 border-gray-500 overflow-hidden mb-10">
          <div className="px-4 py-3 border-b border-gray-500">
            <h2 className="text-lg font-bold ">Schedule of Activities</h2>
          </div>

          {scheduleToDisplay.map((day, dayIndex) => (
            <div key={dayIndex}>
              {day.event && (
                <div className="px-4 py-2 bg-gray-100 border-b border-gray-500">
                  <p className="font-bold text-gray-700">{day.event}</p>
                </div>
              )}
              {day.schedule.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className={`grid grid-cols-2 border-b border-gray-500 ${
                    item.activity === "Booth Hopping:"
                      ? "items-start"
                      : "items-center"
                  }`}
                >
                  <div className="px-4 py-3">
                    <p className="text-sm">{item.time}</p>
                  </div>
                  <div className="px-4 py-3">
                    <p className="font-bold text-sm">{item.activity}</p>

                    {item.details && (
                      <ul className="mt-1 text-sm ">
                        {item.details.map((detail, detailIndex) => (
                          <li
                            key={detailIndex}
                            className={
                              detail === "Tent:"
                                ? "font-bold mt-1"
                                : detail === "Suki Day Deals"
                                ? "font-bold mt-2"
                                : detail.startsWith("•")
                                ? "mt-1"
                                : ""
                            }
                          >
                            {detail === "Tent:" && (
                              <Image
                                src="/images/new.svg"
                                alt="New"
                                width={24}
                                height={12}
                                className="inline-block -ml-7 mr-1 relative -top-0.5"
                              />
                            )}
                            {detail}
                          </li>
                        ))}
                      </ul>
                    )}
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
