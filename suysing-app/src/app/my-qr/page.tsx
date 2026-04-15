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

const boothHoppingDetails = [
  "Main Hall:",
  "Trade Booths",
  "",
  "Tent:",
  "Suy Sing Booth",
  "More Trade Booths",
  "Store Booster Pavilion",
  "Gaming Hub & Lounge",
];

// Schedule for Red customer type
const scheduleRed: Schedule[] = [
  {
    schedule: [
      {
        time: "07:00 AM",
        activity: "Self Registration\n(Suki Day Deals)",
      },
      { time: "8:00 AM", activity: "Opening Ceremony" },
      {
        time: "8:30 AM",
        activity: "Digital Booth Hopping",
        details: boothHoppingDetails,
      },
      { time: "11:30 AM", activity: "Buffet Lunch" },
      { time: "12:00 PM", activity: "Suki Day Show" },
      { time: "1:00 PM", activity: "Souvenir Redemption\nat the Tent" },
      { time: "3:30 PM", activity: "Mini Show at the Lobby" },
      { time: "7:00 PM", activity: "Event Closing" },
    ],
  },
];

// Schedule for Green customer type
const scheduleGreen: Schedule[] = [
  {
    schedule: [
      {
        time: "07:00 AM",
        activity: "Self Registration\n(Suki Day Deals)",
      },
      { time: "8:00 AM", activity: "Opening Ceremony" },
      {
        time: "8:30 AM",
        activity: "Digital Booth Hopping",
        details: boothHoppingDetails,
      },
      { time: "11:30 AM", activity: "Buffet Lunch" },
      { time: "12:00 PM", activity: "Suki Day Show" },
      { time: "2:30 PM", activity: "Souvenir Redemption\nat the Tent" },
      { time: "3:30 PM", activity: "Mini Show at the Lobby" },
      { time: "7:00 PM", activity: "Event Closing" },
    ],
  },
];

// Schedule for Yellow customer type
const scheduleYellow: Schedule[] = [
  {
    schedule: [
      {
        time: "1:30 PM",
        activity: "Self Registration\n(Suki Day Deals)",
      },
      {
        time: "1:30 PM",
        activity: "Digital Booth Hopping",
        details: boothHoppingDetails,
      },
      { time: "2:00 PM", activity: "Food Hall at the Tent" },
      { time: "2:30 PM", activity: "Souvenir Redemption\nat the Tent" },
      { time: "3:30 PM", activity: "Mini Show at the Lobby" },
      { time: "7:00 PM", activity: "Event Closing" },
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
        // debug log
        console.log('unauthorized1')
        console.log(customerResult)
        router.push(`/unauthorized1`);
      }
    } catch (error) {
        // debug log
      console.log('unauthorized2')
      console.error("Error fetching data:", error);
      router.push(`/unauthorized2`);
    }
  };

  useEffect(() => {
    if (customer_hash_code) {
      const accountVerified = localStorage.getItem("account_verified");
      if (accountVerified !== customer_hash_code) {
        router.push(`/verify?cc=${customer_hash_code}`);
        return;
      }
      fetchData();
    } else {
      // debug log
      console.log('unauthorized3')
      console.log(customer_hash_code)
      router.push(`/unauthorized3`);
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
  const getSchedule = () => {
    switch (customerData?.customer_type) {
      case "yellow":
        return scheduleYellow;
      case "green":
        return scheduleGreen;
      default:
        return scheduleRed;
    }
  };
  const scheduleToDisplay = getSchedule();

  const colorGroup = customerData?.customer_type
    ? customerData.customer_type.charAt(0).toUpperCase() +
      customerData.customer_type.slice(1)
    : "";

  return (
    <div className="flex min-h-screen flex-col items-center w-full pb-24 bg-white">
      {/* Header Banner */}
      <div className="w-full max-w-md px-4 mt-6">
        <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden">
          <Image
            src="/images/account-header.png"
            alt="Suy Sing 80 to Infinity"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Customer Name & Code */}
      <div className="text-center mt-4 mb-10">
        <h1 className="text-2xl font-bold ">
          {customerData?.full_name || ""}
        </h1>
        <p className="text-[#686868] text-2xl  mt-1">
          Customer Code:{" "}
          <span className="font-bold">{customerData?.code || ""}</span>
        </p>
      </div>

      <div className="w-full max-w-md px-4">
        {/* Color Group / Table No / Raffle No */}
        <div className="bg-white mb-12">
          <div className="grid grid-cols-3 justify-around  border-b">
            <div>
              <p className=" text-[#0F1030]">Color Group:</p>
              <p className="font-bold  mt-1">{colorGroup}</p>
            </div>
            <div>
              <p className=" text-[#0F1030]">Table No.:</p>
              <p className="font-bold  mt-1">—</p>
            </div>
            <div>
              <p className=" text-[#0F1030]">Raffle No.:</p>
              <p className="font-bold  mt-1">—</p>
            </div>
          </div>
        </div>

        {/* Schedule of Activities Card */}
        <div className="bg-white border  rounded-xl overflow-hidden mb-10">
          <div className="px-4 py-3 border-b ">
            <h2 className="text-lg font-bold">Schedule of Activities</h2>
          </div>

          {scheduleToDisplay.map((day, dayIndex) => (
            <div key={dayIndex}>
              {day.event && (
                <div className="px-4 py-2 bg-gray-50 border-b ">
                  <p className="font-bold text-gray-700">{day.event}</p>
                </div>
              )}
              {day.schedule.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className={`grid grid-cols-[120px_1fr] border-b  ${
                    item.details ? "items-start" : "items-center"
                  }`}
                >
                  <div className="px-4 py-3">
                    <p className="">{item.time}</p>
                  </div>
                  <div className="px-4 py-3">
                    <p className="font-bold  whitespace-pre-line">
                      {item.activity}
                    </p>

                    {item.details && (
                      <div className="mt-1 ">
                        {item.details.map((detail, detailIndex) => (
                          <p
                            key={detailIndex}
                            className={
                              detail === "Main Hall:" || detail === "Tent:"
                                ? "font-bold mt-2"
                                : detail === ""
                                  ? "h-1"
                                  : ""
                            }
                          >
                            {detail}
                          </p>
                        ))}
                      </div>
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
