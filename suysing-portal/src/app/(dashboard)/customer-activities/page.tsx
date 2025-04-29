"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaSortUp, FaSortDown } from "react-icons/fa";
import { customerActivitiesData } from "@/services/api";
import Pagination from "@/components/ui/Pagination";
import { Customer } from "@/types";
import { useAuth } from "@/lib/hooks/useAuth";

interface ActivitySummary {
  boothHopping: number;
  boothVoting: number;
  souvenirClaiming: number;
}

type SortField =
  | "full_name"
  | "total_visited_c"
  | "booth_hopping_status"
  | "booth_voting_status"
  | "souvenir_claiming_status";

export default function CustomerActivitiesPage() {
  const { token } = useAuth();
  const [summary, setSummary] = useState<ActivitySummary>({
    boothHopping: 0,
    boothVoting: 0,
    souvenirClaiming: 0,
  });
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
    setIsLoading(true); //show loader

    try {
      if (!token) {
        console.error("Authentication token is missing");
        setIsLoading(false);
        return;
      }

      const summaryData = await customerActivitiesData.getSummary(token);
      const customersData = await customerActivitiesData.getCustomers(
        token,
        filterParams
      );

      setSummary(summaryData);

      setFilteredCustomers(customersData.results);

      setCurrentPage(customersData.current_page);
      setTotalPages(customersData.total_pages);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
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
  //   // setCurrentPage(1);
  // }, [searchQuery, customers]);

  // Calculate pagination
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
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

  // Status color mapping
  const getStatusColor = (status: string | boolean | undefined): string => {
    if (status === undefined) return "text-gray-500";

    if (typeof status === "boolean") {
      return status ? "text-green-500" : "text-red-500";
    }

    switch (status) {
      case "Completed":
        return "text-green-500";
      case "Pending":
        return "text-orange-500";
      case "Not Started":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:justify-between lg:items-start">
        {/* Summary boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Booth Hopping */}
          <div className="border border-gray-400 p-4 w-full sm:w-[200px]">
            <h3 className="text-sm mb-2">Booth Hopping</h3>
            <p className="text-3xl font-bold">{summary.boothHopping}</p>
          </div>

          {/* Booth Voting */}
          <div className="border border-gray-400 p-4 w-full sm:w-[200px]">
            <h3 className="text-sm mb-2">Booth Voting</h3>
            <p className="text-3xl font-bold">{summary.boothVoting}</p>
          </div>

          {/* Souvenir Claiming */}
          <div className="border border-gray-400 p-4 w-full sm:w-[200px]">
            <h3 className="text-sm mb-2">Souvenir Claiming</h3>
            <p className="text-3xl font-bold">{summary.souvenirClaiming}</p>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
          <button className="inline-flex items-center justify-center px-3 py-2.5 bg-blue-800 text-white text-sm whitespace-nowrap">
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
      </div>

      <div className="overflow-x-auto ">
        <table className="w-full border-gray-400 border">
          <thead>
            <tr className="bg-blue-800 text-white">
              <th
                className="table-header cursor-pointer"
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
                className="table-header cursor-pointer"
                onClick={() => handleSort("total_visited_c")}
              >
                Total Booth Visited
                <span className="ml-1 inline-block">
                  {sortConfig && sortConfig.field === "total_visited_c" ? (
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
                className="table-header cursor-pointer"
                onClick={() => handleSort("booth_hopping_status")}
              >
                Booth Hopping
                <span className="ml-1 inline-block">
                  {sortConfig && sortConfig.field === "booth_hopping_status" ? (
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
                className="table-header cursor-pointer"
                onClick={() => handleSort("booth_voting_status")}
              >
                Booth Voting
                <span className="ml-1 inline-block">
                  {sortConfig && sortConfig.field === "booth_voting_status" ? (
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
                className="table-header cursor-pointer"
                onClick={() => handleSort("souvenir_claiming_status")}
              >
                Souvenir Claiming
                <span className="ml-1 inline-block">
                  {sortConfig &&
                  sortConfig.field === "souvenir_claiming_status" ? (
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
                <td colSpan={5} className="px-4 py-2 text-center">
                  Loading...
                </td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-2 text-center">
                  No customers found
                </td>
              </tr>
            ) : (
              currentItems.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-gray-400 hover:bg-gray-50"
                >
                  <td className="table-cell">
                    <div>{customer.name}</div>
                  </td>
                  <td className="table-cell">{customer.totalBoothVisited}</td>
                  <td
                    className={`table-cell ${getStatusColor(
                      customer.boothHopping
                    )}`}
                  >
                    {customer.boothHopping}
                  </td>
                  <td
                    className={`table-cell ${getStatusColor(
                      customer.boothVoting
                    )}`}
                  >
                    {customer.boothVoting}
                  </td>
                  <td
                    className={`table-cell ${getStatusColor(
                      customer.souvenirClaiming
                    )}`}
                  >
                    {customer.souvenirClaiming}
                  </td>
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
  );
}
