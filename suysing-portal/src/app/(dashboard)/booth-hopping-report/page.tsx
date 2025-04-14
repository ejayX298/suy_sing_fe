"use client";

import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import { boothHoppingReportData } from "@/services/api";
import Pagination from "@/components/ui/Pagination";
import { Customer } from "@/types";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function BoothHoppingReportPage() {
  const router = useRouter();
  const { token } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

  const [filterParams, setfilterParams] = useState({
    page: 1,
    perpage: 10,
    query: "",
  });

  const fetchData = async () => {
    try {
      if (!token) {
        console.error("No authentication token available");
        return;
      }

      const customersData = await boothHoppingReportData.getCustomers(
        token,
        filterParams
      );

      setFilteredCustomers(customersData.results);

      setCurrentPage(customersData.current_page);
      setTotalPages(customersData.total_pages);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterParams]);

  // useEffect(() => {
  //   const results = customers.filter(customer =>
  //     customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     customer.code.toLowerCase().includes(searchQuery.toLowerCase())
  //   );

  //   setFilteredCustomers(results);
  //   setCurrentPage(1);
  // }, [searchQuery, customers]);

  // Calculate pagination
  // const totalPages1 = Math.ceil(filteredCustomers.length / itemsPerPage);
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers;

  const handlePageChange = (pageNumber: number) => {
    // setCurrentPage(pageNumber);
    setfilterParams({ ...filterParams, page: pageNumber });
  };

  const handleSearchQuery = (query: React.ChangeEvent<HTMLInputElement>) => {
    const search_val = query.target.value;
    setSearchQuery(search_val);
  };

  useEffect(() => {
    // set delay 2 seconds
    const delaySetSearch = setTimeout(() => {
      // it will get the latest value after two seconds of no keyboard activity
      setfilterParams({ ...filterParams, page: 1, query: searchQuery });
    }, 2000);

    //clears the timeout of the previous value of delaySetSearch
    //clears the timeout on re render
    return () => clearTimeout(delaySetSearch);
  }, [searchQuery]);

  // Customer type color mapping
  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case "Red":
        return "text-red-500";
      case "Green":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const handleViewCustomer = (customerId: number) => {
    router.push(`/booth-hopping-report/${customerId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="py-4 flex justify-end gap-4 items-center">
          <button className="inline-flex items-center px-3 py-3 border bg-blue-800 text-white text-sm">
            <FaFilter className="mr-2" /> Filter by
          </button>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchQuery}
              placeholder="Search customer here..."
              className="pl-4 py-2 border w-64 focus:outline-none focus:ring focus:ring-blue-500"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-800" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-400">
            <thead>
              <tr className="bg-blue-800 text-white">
                <th className="table-header">Customer Code</th>
                <th className="table-header">Customer Name</th>
                <th className="table-header">Customer Type</th>
                <th className="table-header">Total Booth Visited</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-center">
                    Loading...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-center">
                    No customers found
                  </td>
                </tr>
              ) : (
                currentItems.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewCustomer(customer.id)}
                  >
                    <td className="px-4 py-3">{customer.code}</td>
                    <td className="px-4 py-3">{customer.name}</td>
                    <td
                      className={`px-4 py-3 ${getCustomerTypeColor(
                        customer.type
                      )}`}
                    >
                      {customer.type}
                    </td>
                    <td className="px-4 py-3">{customer.totalVisited}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4">
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
