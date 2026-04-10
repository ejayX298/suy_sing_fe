"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaEye, FaSortUp, FaSortDown } from "react-icons/fa";
import Pagination from "@/components/ui/Pagination";
import { DealOrderedCustomer } from "@/types";
import { useRouter } from "next/navigation";
import { dealOrderedApiService, dealFormsApiService } from "@/services/api";
import { useAuth } from "@/lib/hooks/useAuth";

type SortField =
  | "code"
  | "name"
  | "customer_code"
  | "customer_name"
  | "customer_type"
  | "ordered_qty"
  | "date_ordered"  ;

export default function DealOrderedPage() {
  const { token } = useAuth();
  const router = useRouter();
  const initialRenderVal = "__default_val__";

  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialRenderVal);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [dealOrders, setDealOrders] = useState<DealOrderedCustomer[]>([]);
  const [filterParams, setFilterParams] = useState({
    page: 1,
    perpage: 10,
    query: "",
    sort_by: "-id"
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
        setIsLoading(false);
        return;
      }

      const dealOrderedData = await dealOrderedApiService.getDealOrdered(
        token,
        filterParams
      );
      setDealOrders(dealOrderedData.results);
      setCurrentPage(dealOrderedData.current_page);
      setTotalPages(dealOrderedData.total_pages);
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

  // Navigate to deal order detail page
  const handleViewDealOrder = (dealOrderedId: string) => {
    router.push(`/deal-ordered/${dealOrderedId}`);
  };

  const handleExport = async () => {
    if (isExporting) return;
    if (!token) {
      alert("Authentication token is missing");
      return;
    }

    setIsExporting(true);
    try {
      const result = await dealFormsApiService.exportDealCarts(token);
      if (!result?.success || !result?.blob) {
        alert(result?.message || "Export failed. Please try again later.");
        return;
      }

      const url = window.URL.createObjectURL(result.blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = result.filename || "deal-carts-export.zip";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
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

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center px-3 py-3 border bg-blue-800 text-white text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isExporting ? "Exporting..." : "Export"}
          </button>

          <div className="relative">
            <input
              type="text"
              value={searchQuery == initialRenderVal ? "" : searchQuery}
              onChange={handleSearchQuery}
              placeholder="Search customer here..."
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
                  onClick={() => handleSort("customer_code")}
                >
                  Custmer Code
                  <span className="ml-1 inline-block">
                    {sortConfig && sortConfig.field === "customer_code" ? (
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
                  onClick={() => handleSort("customer_name")}
                >
                  Customer Name
                  <span className="ml-1 inline-block">
                    {sortConfig && sortConfig.field === "customer_name" ? (
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
                  className="px-4 py-2 text-left"
                  onClick={() => handleSort("ordered_qty")}
                >
                  Ordered Qty
                  <span className="ml-1 inline-block">
                    {sortConfig && sortConfig.field === "ordered_qty" ? (
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
                  onClick={() => handleSort("date_ordered")}
                >
                  Date Ordered
                  <span className="ml-1 inline-block">
                    {sortConfig && sortConfig.field === "date_ordered" ? (
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
              ) : dealOrders.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-center">
                    No records found
                  </td>
                </tr>
              ) : (
                dealOrders.map((dealOrder) => (
                  <tr key={dealOrder.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{dealOrder.customerCode}</td>
                    <td className="px-4 py-3">{dealOrder.customerName}</td>
                    <td className="px-4 py-3">{dealOrder.customerType}</td>
                    <td className="px-4 py-3">{dealOrder.orderedQty}</td>
                    <td className="px-4 py-3">{dealOrder.dateOrdered}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleViewDealOrder(dealOrder.id)}
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
