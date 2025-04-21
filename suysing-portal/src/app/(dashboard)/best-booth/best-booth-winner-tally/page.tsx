"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaSortUp, FaSortDown } from "react-icons/fa";
import { bestBoothWinnerTallyData } from "@/services/api";
import Pagination from "@/components/ui/Pagination";
import { Booth } from "@/types";
import { useAuth } from "@/lib/hooks/useAuth";

type SortField =
  | "rank_no"
  | "customer_voting_booth_count"
  | "name"
  | "code";

export default function BestBoothWinnerTallyPage() {
  const { token } = useAuth();
  const initialRenderVal = "__default_val__";

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialRenderVal);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filteredBooths, setFilteredBooths] = useState<Booth[]>([]);
  const [activeTab, setActiveTab] = useState("Blue Booth");
  const [filterParams, setfilterParams] = useState({
    page: 1,  
    perpage: 10,
    query: "",
    color_code: "blue",
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
        setIsLoading(false);
        return;
      }

      const boothsData = await bestBoothWinnerTallyData.getBooths(
        token,
        filterParams
      );

      setFilteredBooths(boothsData?.results);

      setCurrentPage(boothsData.current_page);
      setTotalPages(boothsData.total_pages);
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
  //   const results = booths.filter(booth =>
  //     booth.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     booth.code.toLowerCase().includes(searchQuery.toLowerCase())
  //   );

  //   setFilteredBooths(results);
  //   setCurrentPage(1);
  // }, [searchQuery, booths]);

  // Calculate pagination
  // const totalPages1 = Math.ceil(filteredBooths.length / itemsPerPage);
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBooths;

  const handlePageChange = (pageNumber: number) => {
    // setCurrentPage(pageNumber);
    setfilterParams({ ...filterParams, page: pageNumber });
  };

  const handleSearchQuery = (query: React.ChangeEvent<HTMLInputElement>) => {
    const search_val = query.target.value;
    setSearchQuery(search_val);
  };

  const handleSetActiveTab = (booth_name: "Blue Booth" | "Orange Booth" | "Red Booth") => {
    let booth_value = "blue";

    if (booth_name == "Red Booth") {
      booth_value = "red";
    } else if (booth_name == "Orange Booth") {
      booth_value = "orange";
    }
    setActiveTab(booth_name);
    setfilterParams({ ...filterParams, page: 1, color_code: booth_value });
  };

  useEffect(() => {
    if(searchQuery != initialRenderVal){ // to avoid executing on initial render
        // set delay 2 seconds
        const delaySetSearch = setTimeout(() => {
          // it will get the latest value after two seconds of no keyboard activity
          setfilterParams({ ...filterParams, page: 1, query: searchQuery });
        }, 2000);

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
    
    let api_sort_field : string = field
    let modified_direction : string = direction

     // use customer_voting_booth_count for descending and -customer_voting_booth_count for ascending for rank_no field
     if(api_sort_field == 'rank_no'){
      api_sort_field = 'customer_voting_booth_count';
      if(modified_direction == 'asc'){
        modified_direction = 'desc';
      }else{
        modified_direction = 'asc';
      }
    }
    
    if (modified_direction == "desc"){
      api_sort_field  = `-${api_sort_field}`
    }

    setfilterParams({ ...filterParams, sort_by: api_sort_field });

    setSortConfig({ field, direction });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex border-b border-gray-400 space-x-1">
            <button
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === "Blue Booth"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => handleSetActiveTab("Blue Booth")}
            >
              Blue Booth
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === "Orange Booth"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => handleSetActiveTab("Orange Booth")}
            >
              Orange Booth
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === "Red Booth"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => handleSetActiveTab("Red Booth")}
            >
              Red Booth
            </button>
          </div>
          <div className="py-4 flex justify-end gap-4 items-center">
            {/* <button className="inline-flex items-center px-3 py-3 border bg-blue-800 text-white text-sm">
              <FaFilter className="mr-2" /> Filter by
            </button> */}

            <div className="relative">
              <input
                type="text"
                value={searchQuery == initialRenderVal ? "" : searchQuery}
                onChange={handleSearchQuery}
                placeholder="Search booth here..."
                className="pl-4 py-2 border w-64 focus:outline-none focus:ring focus:ring-blue-500"
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-800" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-400">
            <thead>
              <tr className="bg-blue-800 text-white">
                <th 
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort("rank_no")}
                >
                  Rank No.
                  <span className="ml-1 inline-block">
                    {sortConfig && sortConfig.field === "rank_no" ? (
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
                  onClick={() => handleSort("name")}
                >
                  Booth Name
                  <span className="ml-1 inline-block">
                    {sortConfig && sortConfig.field === "name" ? (
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
                  onClick={() => handleSort("code")}
                >
                  Booth Code
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
                  onClick={() => handleSort("customer_voting_booth_count")}
                  >
                  Total No. of Votes
                  <span className="ml-1 inline-block">
                    {sortConfig && sortConfig.field === "customer_voting_booth_count" ? (
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
                    No booths found
                  </td>
                </tr>
              ) : (
                currentItems.map((booth) => (
                  <tr key={booth.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{booth.rank}</td>
                    <td className="px-4 py-3">{booth.name}</td>
                    <td className="px-4 py-3">{booth.code}</td>
                    <td className="px-4 py-3">{booth.totalVotes}</td>
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
