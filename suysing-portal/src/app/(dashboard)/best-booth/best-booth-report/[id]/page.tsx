"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { bestBoothReportData } from "@/services/api";
import QRCode from "react-qr-code";
import { Customer, BoothVote } from "@/types";
import { useAuth } from "@/lib/hooks/useAuth";

export default function CustomerBoothReportDetail() {
  const { token } = useAuth();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const paramsId = useParams();

  const fetchData = async () => {
    try {
      const customerId = parseInt(paramsId.id as string);

      if (!token) {
        console.error("Authentication token is missing");

        return;
      }
      const customerData = await bestBoothReportData.getCustomerById(
        customerId,
        token
      );

      if (Array.isArray(customerData.results)) {
        if (customerData.results.length !== 0) {
          setCustomer(customerData.results[0]);
        }
      } else {
        // Results is an object
        setCustomer(customerData.results);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsId.id]);

  // Customer type color mapping
  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case "Red":
        return "text-red-500";
      case "Green":
        return "text-green-500";
      case "Yellow":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  // Booth color mapping
  const getBoothColorClass = (color: string) => {
    switch (color) {
      case "Blue Booth":
        return "bg-blue-600 text-white";
      case "Orange Booth":
        return "bg-orange-500 text-white";
      case "Red Booth":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-xl mb-4">Customer not found</p>
        <button
          onClick={() => router.push("/best-booth/best-booth-report")}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FaArrowLeft className="mr-2" /> Back to Report
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push("/best-booth/best-booth-report")}
          className="inline-flex items-center mr-4 text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-1" /> Back
        </button>
      </div>

      <div className="bg-white rounded-md shadow-sm p-6">
        <div className="flex justify-between">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <p className="text-sm text-gray-500">Customer Code:</p>
                <p className="font-medium">{customer.code}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer Name:</p>
                <p className="font-medium">{customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer Type:</p>
                <p
                  className={`font-medium ${getCustomerTypeColor(
                    customer.type
                  )}`}
                >
                  {customer.type}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Store Name:</p>
                <p className="font-medium">{customer.store || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Visited Booth:</p>
                <p className="font-medium">{customer.totalVisited || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            <QRCode value={customer.code} size={128} fgColor="#0A20B1" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Booth Vote History</h3>
        </div>

        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left bg-blue-600 text-white">
                  Booth Color
                </th>
                <th className="px-4 py-2 text-left bg-blue-600 text-white">
                  Booth Name
                </th>
              </tr>
            </thead>
            <tbody>
              {!customer.voteHistory || customer.voteHistory.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-4 py-2 text-center">
                    No vote history found
                  </td>
                </tr>
              ) : (
                customer.voteHistory.map((vote: BoothVote, index: number) => (
                  <tr key={index} className="border-b">
                    <td
                      className={`px-4 py-3 ${getBoothColorClass(vote.color)}`}
                    >
                      {vote.color}
                    </td>
                    <td className="px-4 py-3">{vote.name}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
