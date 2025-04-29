"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaSortUp, FaSortDown } from "react-icons/fa";
import { bestBoothReportData } from "@/services/api";
import Pagination from "@/components/ui/Pagination";
import { Customer } from "@/types";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";

type SortField =
  | "code"
  | "full_name"
  | "customer_type"
  | "last_voting_created_at";

export default function BestBoothReportPage() {
  const { token } = useAuth();
  const router = useRouter();
  const initialRenderVal = "__default_val__";

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialRenderVal);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

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
      if (!token) {
        console.error("Authentication token is missing");
        return;
      }

      const customersData = await bestBoothReportData.getCustomers(
        token,
        filterParams
      );

      setFilteredCustomers(customersData.results);

      setCurrentPage(customersData.current_page);
      setTotalPages(customersData.total_pages);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (searchQuery != initialRenderVal) {
      // to avoid executing on initial render
      // set delay 2 seconds
      const delaySetSearch = setTimeout(() => {
        // it will get the latest value after two seconds of no keyboard activity
        setfilterParams({ ...filterParams, page: 1, query: searchQuery });
      }, 500);

      //clears the timeout of the previous value of delaySetSearch
      //clears the timeout on re render
      return () => clearTimeout(delaySetSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

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

  const navigateToDetail = (customerId: string | number) => {
    router.push(`/best-booth/best-booth-report/${customerId}`);
  };

  // Handle sort
  const handleSort = (field: SortField) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig && sortConfig.field === field) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }

    let api_sort_field: string = field;

    if (direction == "desc") {
      api_sort_field = `-${api_sort_field}`;
    }

    setfilterParams({ ...filterParams, sort_by: api_sort_field });

    setSortConfig({ field, direction });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center lg:justify-end gap-2 w-full lg:w-auto mb-4">
          <button className="inline-flex items-center px-3 py-3 border bg-blue-800 text-white text-sm">
            <FaFilter className="mr-2" /> Filter by
          </button>

          <div className="relative flex-grow sm:flex-grow-0">
            <input
              type="text"
              value={searchQuery == initialRenderVal ? "" : searchQuery}
              onChange={handleSearchQuery}
              placeholder="Search customer here..."
              className="w-full sm:w-72 pl-4 pr-10 py-2 border focus:outline-none border-gray-400"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-400">
            <thead>
              <tr className="bg-blue-800 text-white">
                <th
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort("code")}
                >
                  Customer Code
                  <span className="ml-1 inline-block">
                    {sortConfig && sortConfig.field === "code" ? (
                      sortConfig.direction === "asc" ? (
                        <FaSortUp />
                      ) : (
                        <FaSortDown />
                      )
                    ) : (
                      <span className="inline-flex flex-col">
                        <FaSortUp className="-mb-1" />
                        <FaSortDown className="-mt-1" />
                      </span>
                    )}
                  </span>
                </th>
                <th
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort("full_name")}
                >
                  Customer Name
                  <span className="ml-1 inline-block">
                    {sortConfig && sortConfig.field === "full_name" ? (
                      sortConfig.direction === "asc" ? (
                        <FaSortUp />
                      ) : (
                        <FaSortDown />
                      )
                    ) : (
                      <span className="inline-flex flex-col">
                        <FaSortUp className="-mb-1" />
                        <FaSortDown className="-mt-1" />
                      </span>
                    )}
                  </span>
                </th>
                <th
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort("customer_type")}
                >
                  Customer Type
                  <span className="ml-1 inline-block">
                    {sortConfig && sortConfig.field === "customer_type" ? (
                      sortConfig.direction === "asc" ? (
                        <FaSortUp />
                      ) : (
                        <FaSortDown />
                      )
                    ) : (
                      <span className="inline-flex flex-col">
                        <FaSortUp className="-mb-1" />
                        <FaSortDown className="-mt-1" />
                      </span>
                    )}
                  </span>
                </th>
                <th
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort("last_voting_created_at")}
                >
                  Time Submitted
                  <span className="ml-1 inline-block">
                    {sortConfig &&
                    sortConfig.field === "last_voting_created_at" ? (
                      sortConfig.direction === "asc" ? (
                        <FaSortUp />
                      ) : (
                        <FaSortDown />
                      )
                    ) : (
                      <span className="inline-flex flex-col">
                        <FaSortUp className="-mb-1" />
                        <FaSortDown className="-mt-1" />
                      </span>
                    )}
                  </span>
                </th>
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
                    onClick={() => navigateToDetail(customer.id)}
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
                    <td className="px-4 py-3">{customer.timeSubmitted}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 ">
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
