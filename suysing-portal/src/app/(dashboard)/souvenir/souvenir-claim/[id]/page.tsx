"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaArrowLeft} from "react-icons/fa";
import { souvenirClaimData } from "@/services/api";
import Pagination from "@/components/ui/Pagination";
//import QRCode from "react-qr-code";
import { Customer, CustomerClaimHistory,  } from "@/types";
import { useAuth } from "@/lib/hooks/useAuth";

type SortField =
  | "booth_name"
  | "booth_code"
  | "created_at"
  | "booth_double_zone";

export default function CustomerClaimDetailsPage() {
  const { token } = useAuth();
  // const initialRenderVal = "__default_val__";
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // const [searchQuery, setSearchQuery] = useState(initialRenderVal);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filteredClaimHistory, setFilteredClaimHistory] = useState<CustomerClaimHistory[]>([]);
  const router = useRouter();
  const paramsId = useParams();

  const [filterParams, setfilterParams] = useState({
    page: 1,
    perpage: 10,
    query: "",
    sort_by: "",
  });

  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    direction: "asc" | "desc";
  } | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const customerId = parseInt(paramsId.id as string);
      if (!token) {
        throw new Error("Authentication token is required");
      }
      const customerData = await souvenirClaimData.getCustomerById(
        customerId,
        token,
        filterParams
      );
      
      if (
        customerData.results &&
        (Array.isArray(customerData.results)
          ? customerData.results.length > 0
          : customerData.results)
      ) {
        const customerResult = Array.isArray(customerData.results)
          ? (customerData.results[0] as Customer)
          : (customerData.results as Customer);

        console.log('customerdata')
        console.log(customerData)

        setCustomer(customerResult);

        setFilteredClaimHistory(customerResult?.customerSouvenirClaimHistory || []);

        setCurrentPage(customerData.current_page);
        setTotalPages(customerData.total_pages);
        setIsLoading(false);
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
  }, [filterParams, paramsId.id]);

  const currentItems = filteredClaimHistory;

  const handlePageChange = (pageNumber: number) => {
    // setCurrentPage(pageNumber);
    setfilterParams({ ...filterParams, page: pageNumber });
  };

  // const handleSearchQuery = (query: React.ChangeEvent<HTMLInputElement>) => {
  //   const search_val = query.target.value;
  //   setSearchQuery(search_val);
  // };

  // useEffect(() => {
  //   if(searchQuery != initialRenderVal){ // to avoid executing on initial render
  //       // set delay 2 seconds
  //       const delaySetSearch = setTimeout(() => {
  //         // it will get the latest value after two seconds of no keyboard activity
  //         setfilterParams({ ...filterParams, page: 1, query: searchQuery });
  //       }, 500);

  //       //clears the timeout of the previous value of delaySetSearch
  //       //clears the timeout on re render
  //       return () => clearTimeout(delaySetSearch);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [searchQuery]);

  // Customer type color mapping
  const getCustomerTypeColor = (type: string) => {
    type = type ? type.toLowerCase() : type
    switch (type) {
      case "red":
        return "text-red-500";
      case "green":
        return "text-green-500";
      case "yellow":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

    // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Successful":
        return "bg-[#2EE84A] text-black";
      case "Unsuccessful":
        return "bg-[#e8372e] text-black";
      case "Pending":
        return "bg-[#FFE944] text-black";
      case "On hold":
        return "bg-[#FF5A44] text-black";
      default:
        return "bg-gray-400 text-black";
    }
  };

   // Handle sort
   const handleSort = (field: SortField) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig && sortConfig.field === field) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }
    
    let api_sort_field : string = field

    if (direction == "desc"){
      api_sort_field  = `-${api_sort_field}`
    }

    setfilterParams({ ...filterParams, sort_by: api_sort_field });

    setSortConfig({ field, direction });
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
          onClick={() => router.push("/souvenir/souvenir-claim")}
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
          onClick={() => router.push("/souvenir/souvenir-claim")}
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
                <p className="text-sm text-gray-500">Customer Type:</p>
                <p
                  className={`font-medium px-1 py-1  ${getStatusColor(
                    customer.pretty_claim_status || ''
                  )}`}
                >
                  {customer.pretty_claim_status}
                </p>
              </div>
            </div>
          </div>

        {/*   <div className="flex-shrink-0">
            <QRCode value={customer.code} size={128} fgColor="#0A20B1" />
          </div> */}
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Souvenir Claim History</h3>
        </div>
{/* 
        <div className="p-4 flex justify-end">
          <div className="relative">
            <input
              type="text"
              value={searchQuery == initialRenderVal ? "" : searchQuery}
              onChange={handleSearchQuery}
              placeholder="Find booth name here..."
              className="pl-10 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div> */}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th 
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort("booth_name")}
                >
                  Item
                </th>
                <th 
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort("booth_code")}
                >
                  Auditor
                </th>
                <th 
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort("created_at")}
                >
                  Date & Time Claimed
                </th>
                <th 
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort("created_at")}
                >
                  Counter Group
                </th>
                <th 
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort("booth_double_zone")}
                >
                  Status
                  
                </th>
              </tr>
            </thead>
            <tbody>
              {!customer.customerSouvenirClaimHistory || customer.customerSouvenirClaimHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-2 text-center">
                    Souvenir claim history not found
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-2 text-center">
                    Souvenir claim history not found
                  </td>
                </tr>
              ) : (
                currentItems.map((souvenir_claim: CustomerClaimHistory, index: number) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{souvenir_claim.item_claimed}</td>
                    <td className="px-4 py-3">{souvenir_claim.released_by}</td>
                    <td className="px-4 py-3">{souvenir_claim.time_claimed}</td>
                    <td className="px-4 py-3">{souvenir_claim.counter_group}</td>
                    <td className="px-4 py-3">
                     <span
                        className={`px-3 py-2  ${getStatusColor(souvenir_claim.pretty_claim_status)}`}
                      >
                        {souvenir_claim.pretty_claim_status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
