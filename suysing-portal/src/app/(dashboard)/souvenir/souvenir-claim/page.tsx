"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaSortUp, FaSortDown } from "react-icons/fa";
import { souvenirClaimData } from "@/services/api";
import Pagination from "@/components/ui/Pagination";
import { Claim } from "@/types";
import { useAuth } from "@/lib/hooks/useAuth";
import { MdModeEditOutline } from "react-icons/md";
import Swal from "sweetalert2";

type SortField =
  | "code"
  | "full_name"
  | "customer_type"
  | "claim_status"
  | "customer_souvenir_name"
  | "customer_souvenir_time_submiited";

export default function SouvenirClaimPage() {
  const { token } = useAuth();
  const initialRenderVal = "__default_val__";

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialRenderVal);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Claim | null>(null);
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

  const [customerStatus, setCustomerStatus] = useState<string>("Pending");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (!token) {
        console.error("No authentication token available");
        return;
      }

      const claimsData = await souvenirClaimData.getClaims(token, filterParams);

      setFilteredClaims(claimsData.results);

      setCurrentPage(claimsData.current_page);
      setTotalPages(claimsData.total_pages);
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
  //   const results = claims.filter(claim =>
  //     claim.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     claim.code.toLowerCase().includes(searchQuery.toLowerCase())
  //   );

  //   setFilteredClaims(results);
  //   setCurrentPage(1);
  // }, [searchQuery, claims]);

  // Calculate pagination
  // const totalPages1 = Math.ceil(filteredClaims.length / itemsPerPage);
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClaims;

  const handlePageChange = (pageNumber: number) => {
    // setCurrentPage(pageNumber);
    setfilterParams({ ...filterParams, page: pageNumber });
  };

  useEffect(() => {
    if(searchQuery != initialRenderVal){ // to avoid executing on initial render
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

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Claimed":
        return "bg-[#2EE84A] text-black";
      case "Pending":
        return "bg-[#FFE944] text-black";
      case "On hold":
        return "bg-[#FF5A44] text-black";
      default:
        return "bg-gray-400 text-black";
    }
  };

  // Customer tye color mapping
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

  const openEditModal = (claim: Claim) => {
    setSelectedCustomer(claim);
    setCustomerStatus(claim.status || "Pending");
    setShowEditModal(true);
  };

  const handleEditCustomerStatus = async () => {
    if (!selectedCustomer) return;
    if (!token) {
      console.error("No authentication token available");
      return;
    }

    let customer_status = "0";
    if (customerStatus == "On hold") {
      customer_status = "2";
    }

    const confirmAction = await confirmMessage(
      `Are you sure you want to update this customer?`
    );

    if (confirmAction.isConfirmed) {
      try {
        // Update customer status
        const customerUpdate = {
          customer_id: selectedCustomer.id,
          customer_status: customer_status,
        };

        const souvenirsData = await souvenirClaimData.updateCustomerStatus(
          token,
          customerUpdate
        );

        if (souvenirsData.success) {
          showMessage("1", souvenirsData.message);
          setfilterParams({ ...filterParams, page: 1, query: "" });
        } else {
          showMessage("0", souvenirsData.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showMessage("0", "Error updating customer.");
      } finally {
        setIsLoading(false);
      }

      setShowEditModal(false);
      setSelectedCustomer(null);
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

  const confirmMessage = async (message: string) => {
    const result = await Swal.fire({
      title: "Confirm",
      text: message,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#193cb8",
    });

    return result;
  };

  const showMessage = (status: string, message: string) => {
    let iconType: "success" | "error";
    let titleType: "Success" | "Oops!";

    if (status == "1") {
      iconType = "success";
      titleType = "Success";
    } else {
      iconType = "error";
      titleType = "Oops!";
    }

    Swal.fire({
      title: titleType,
      text: message,
      icon: iconType,
      confirmButtonColor: "#193cb8",
    });
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
              value={searchQuery == initialRenderVal ? "" : searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                <th 
                  className="table-header cursor-pointer"
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
                  className="table-header cursor-pointer"
                  onClick={() => handleSort("claim_status")}
                >
                  Status
                  <span className="ml-1 inline-block">
                    {sortConfig && sortConfig.field === "claim_status" ? (
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
                  onClick={() => handleSort("customer_souvenir_name")}
                >
                  Item
                  <span className="ml-1 inline-block">
                    {sortConfig && sortConfig.field === "customer_souvenir_name" ? (
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
                  onClick={() => handleSort("customer_souvenir_time_submiited")}
                >
                  Time Claimed
                  <span className="ml-1 inline-block">
                    {sortConfig && sortConfig.field === "customer_souvenir_time_submiited" ? (
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
                  <td colSpan={6} className="px-4 py-2 text-center">
                    Loading...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-2 text-center">
                    No claims found
                  </td>
                </tr>
              ) : (
                currentItems.map((claim) => (
                  <tr key={claim.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{claim.code}</td>
                    <td className="px-4 py-3">{claim.name}</td>
                    <td
                      className={`px-4 py-3 ${getCustomerTypeColor(
                        claim.type
                      )}`}
                    >
                      {claim.type}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-2  ${getStatusColor(claim.status)}`}
                      >
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{claim.item}</td>
                    <td className="px-4 py-3">{claim.timeClaimed}</td>
                    <td className="px-4 py-3 text-center">
                      {claim.status != "Claimed" && (
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => openEditModal(claim)}
                        >
                          <MdModeEditOutline />
                        </button>
                      )}
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

      {/* Edit Customer status Modal */}
      {showEditModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl">
            <div className="px-6 py-4">
              <h2 className="text-[34px] font-bold">Edit Customer Status</h2>
            </div>
            <div className="border-t border-gray-400 px-6 py-5 space-y-5">
              <div>
                <label className="block 0 mb-2">Customer Name</label>
                <input
                  type="text"
                  className="w-full px-2 py-4 border bg-gray-200"
                  value={selectedCustomer.name}
                  disabled
                />
              </div>
              <div>
                <label className="block 0 mb-2">Status</label>
                <select
                  value={customerStatus}
                  onChange={(e) => setCustomerStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="On hold">On hold</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 mt-6 mb-6">
                <button
                  className="px-6 py-2 border border-blue-700 text-blue-700"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedCustomer(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 bg-blue-800 text-white"
                  onClick={handleEditCustomerStatus}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
