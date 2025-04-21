"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaEye, FaSortUp, FaSortDown } from "react-icons/fa";
import Pagination from "@/components/ui/Pagination";
import { Vendor } from "@/types";
import { useRouter } from "next/navigation";
import { dealFormsApiService } from "@/services/api";
import { useAuth } from "@/lib/hooks/useAuth";

type SortField =
  | "code"
  | "name";

export default function DealFormsPage() {
  const { token } = useAuth();
  const router = useRouter();
  const initialRenderVal = "__default_val__";

  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialRenderVal);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filterParams, setFilterParams] = useState({
    page: 1,
    perpage: 10,
    query: "",
    sort_by: ""
  });

  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    direction: "asc" | "desc";
  } | null>(null);

  // Mock data for vendors
  // const mockVendors: Vendor[] = [
  //   { id: '1', vendorCode: 'ALAS01', vendorName: 'Alaska Milk Corporation' },
  //   { id: '2', vendorCode: 'UNILE01', vendorName: 'Unilever Philippines, Inc.' },
  //   { id: '3', vendorCode: 'MONDE03', vendorName: 'Mondelez Philippines, Inc.' },
  //   { id: '4', vendorCode: 'MEGA001', vendorName: 'Mega Prime Foods Incorporated' },
  //   { id: '5', vendorCode: 'CENTU03', vendorName: 'Century Pacific Food, Inc.' },
  //   { id: '6', vendorCode: 'THEPU01', vendorName: 'The Purefoods-Hormel Co. Inc.' },
  //   { id: '7', vendorCode: 'ACSC401', vendorName: 'ACS Manufacturing Corporation' },
  //   { id: '8', vendorCode: 'COLGA01', vendorName: 'Colgate-Palmolive Phil. Inc.' },
  // ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (!token) {
        console.error("Authentication token is missing");
        setIsLoading(false);
        return;
      }

      const boothsData = await dealFormsApiService.getBooths(
        token,
        filterParams
      );
      setVendors(boothsData.results);
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

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setFilterParams({ ...filterParams, page: pageNumber });
  };

  // Handle search query
  const handleSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearchQuery(searchValue);
  };

  // Debounce search input
  useEffect(() => {
    if(searchQuery != initialRenderVal){ // to avoid executing on initial render

        const delaySearch = setTimeout(() => {
          setFilterParams({ ...filterParams, page: 1, query: searchQuery });
        }, 500);

        return () => clearTimeout(delaySearch);
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

    if (direction == "desc"){
      api_sort_field  = `-${api_sort_field}`
    }

    setFilterParams({ ...filterParams, sort_by: api_sort_field });

    setSortConfig({ field, direction });
  };

  // Navigate to vendor detail page
  const handleViewVendor = (vendorId: string) => {
    router.push(`/deal-forms/${vendorId}`);
  };

  return (
    <div className="space-y-6">
      <div className="">
        <div className="py-4 flex justify-end gap-4 items-center border-b">
          <div className="flex items-center space-x-2">
            {/* <button className="inline-flex items-center px-3 py-3 border bg-blue-800 text-white text-sm">
              <FaFilter className="mr-2" /> Filter by
            </button> */}
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery == initialRenderVal ? "" : searchQuery}
              onChange={handleSearchQuery}
              placeholder="Search vendor here..."
              className="pl-4 py-2 border w-64 focus:outline-none border-gray-400 focus:ring focus:ring-blue-500"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-800" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-400">
            <thead>
              <tr className="bg-blue-800 text-white">
                <th 
                  className="px-4 py-2 text-left"
                  onClick={() => handleSort("code")}
                >
                  Vendor Code
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
                  className="px-4 py-2 text-left"
                  onClick={() => handleSort("name")}
                >
                  Vendor Name
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
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-center">
                    Loading...
                  </td>
                </tr>
              ) : vendors.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-center">
                    No vendors found
                  </td>
                </tr>
              ) : (
                vendors.map((vendor) => (
                  <tr key={vendor.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{vendor.vendorCode}</td>
                    <td className="px-4 py-3">{vendor.vendorName}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleViewVendor(vendor.id)}
                      >
                        <FaEye size={18} />
                      </button>
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
    </div>
  );
}
