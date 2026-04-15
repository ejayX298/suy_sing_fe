"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaSortUp, FaSortDown } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import { IoTrashOutline } from "react-icons/io5";
import { souvenirAvailabilityData } from "@/services/api";
import Pagination from "@/components/ui/Pagination";
import { Souvenir } from "@/types";
import { useAuth } from "@/lib/hooks/useAuth";
import Swal from "sweetalert2";

type SortField = "name" | "qty_as_int" | "claimed_as_int" | "remaining_as_int";

export default function SouvenirAvailabilityPage() {
  const { token } = useAuth();
  const initialRenderVal = "__default_val__";

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialRenderVal);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filteredSouvenirs, setFilteredSouvenirs] = useState<Souvenir[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newSouvenirName, setNewSouvenirName] = useState("");
  const [newSouvenirQuantity, setNewSouvenirQuantity] = useState("");
  const [newSouvenirFor, setNewSouvenirFor] = useState("yellow");
  const [activeTab, setActiveTab] = useState("yellow");
  const [selectedSouvenir, setSelectedSouvenir] = useState<Souvenir | null>(
    null
  );
  const [filterParams, setfilterParams] = useState({
    page: 1,
    perpage: 10,
    query: "",
    sort_by: "",
    color_code : "yellow"
  });

  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    direction: "asc" | "desc";
  } | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (!token) {
        console.error("No authentication token available");
        return;
      }
      const souvenirsData = await souvenirAvailabilityData.getSouvenirs(
        token,
        filterParams
      );

      setFilteredSouvenirs(souvenirsData.results);

      setCurrentPage(souvenirsData.current_page);
      setTotalPages(souvenirsData.total_pages);
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
  //   const results = souvenirs.filter(souvenir =>
  //     souvenir.name.toLowerCase().includes(searchQuery.toLowerCase())
  //   );

  //   setFilteredSouvenirs(results);
  //   setCurrentPage(1);
  // }, [searchQuery, souvenirs]);

  // Calculate pagination
  // const totalPages = Math.ceil(filteredSouvenirs.length / itemsPerPage);
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSouvenirs;

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

  const handleAddSouvenir = async () => {
    // Validate inputs
    if (!newSouvenirFor.trim() || !newSouvenirName.trim() || !newSouvenirQuantity.trim()) {
      alert("Please fill in all fields");
      return;
    }

    const quantity = parseInt(newSouvenirQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    if (!token) {
      showMessage("0", "You are not authenticated. Please log in again.");
      return;
    }

    // Create new souvenir object
    // const newSouvenir: Souvenir = {
    //   id: souvenirs.length + 1, // Simple ID generation for demo
    //   name: newSouvenirName,
    //   totalQuantity: quantity,
    //   claimed: 0,
    //   remaining: quantity
    // };

    // Add to souvenirs list
    // setSouvenirs([...souvenirs, newSouvenir]);

    const confirmAction = await confirmMessage(
      `Are you sure you want to add ${newSouvenirName}?`
    );

    if (confirmAction.isConfirmed) {
      // Add souvenir
      const newSouvenir = {
        color_code : newSouvenirFor,
        name: newSouvenirName,
        totalQuantity: quantity,
      };

      try {
        const souvenirsData = await souvenirAvailabilityData.addSouvenir(
          token,
          newSouvenir
        );

        if (souvenirsData.success) {
          showMessage("1", souvenirsData.message);
          setfilterParams({ ...filterParams, page: 1, query: "" });
        } else {
          showMessage("0", souvenirsData.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showMessage("0", "Error adding souvenir.");
      } finally {
        setIsLoading(false);
      }

      // Reset form and close modal
      setNewSouvenirFor("yellow");
      setNewSouvenirName("");
      setNewSouvenirQuantity("");
      setShowAddModal(false);
    }
  };

  const handleEditSouvenir = async () => {
    if (!selectedSouvenir) return;

    // Validate input
    const quantity = parseInt(newSouvenirQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    if (!token) {
      showMessage("0", "You are not authenticated. Please log in again.");
      return;
    }

    // Update the souvenir
    // const updatedSouvenirs = souvenirs.map(souvenir => {
    //   if (souvenir.id === selectedSouvenir.id) {
    //     const claimed = souvenir.claimed;
    //     return {
    //       ...souvenir,
    //       totalQuantity: quantity,
    //       remaining: quantity - claimed
    //     };
    //   }
    //   return souvenir;
    // });

    const confirmAction = await confirmMessage(
      `Are you sure you want to update this souvenir?`
    );

    if (confirmAction.isConfirmed) {
      try {
        // Update souvenir
        const updatedSouvenir = {
          color_code: newSouvenirFor,
          souvenir_id: selectedSouvenir.id,
          name : selectedSouvenir.name,
          souvenir_qty: quantity,
        };

        const souvenirsData = await souvenirAvailabilityData.updateSouvenirDetails(
          token,
          updatedSouvenir
        );

        if (souvenirsData.success) {
          showMessage("1", souvenirsData.message);
          setfilterParams({ ...filterParams, page: 1, query: "" });
        } else {
          showMessage("0", souvenirsData.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showMessage("0", "Error updating souvenir.");
      } finally {
        setIsLoading(false);
      }

      // setSouvenirs(updatedSouvenirs);
      setNewSouvenirFor("yellow")
      setShowEditModal(false);
      setSelectedSouvenir(null);
      setNewSouvenirQuantity("");
    }
  };

  const openEditModal = (souvenir: Souvenir) => {
    setNewSouvenirFor(souvenir.color_code)
    setSelectedSouvenir(souvenir);
    setNewSouvenirQuantity(souvenir.totalQuantity.toString());
    setShowEditModal(true);
  };

  const confirmMessage = async (message: string) => {
    const Swal = (await import("sweetalert2")).default;
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

  const handleDeleteSouvenir = async (souvenir: Souvenir) => {
    const confirmAction = await confirmMessage(
      `Are you sure you want to delete ${souvenir.name}?`
    );

    if (confirmAction.isConfirmed) {
      
      if (!token) {
        showMessage("0", "You are not authenticated. Please log in again.");
        return;
      }

      try {

        const deleteSouvenir = {
          souvenir_id: souvenir?.id || 0,
        };

        const souvenirDelete =
          await souvenirAvailabilityData.deleteSouvenir(token, deleteSouvenir);

        if (souvenirDelete.success) {
            showMessage("1", souvenirDelete.message);
            setfilterParams({ ...filterParams, page: 1, query: "" });
          } else {
            showMessage("0", souvenirDelete.message);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          showMessage("0", "Error deleting souvenir.");
        } finally {
          setIsLoading(false);
        }

    }
  };


  const handleSetActiveTab = (tab_active: "yellow" | "red" | "green") => {
    let tab = "yellow";

    if (tab_active == "yellow") {
      tab = "yellow";
    } else if (tab_active == "green") {
      tab = "green";
    } else if (tab_active == "red") {
      tab = "red";
    }
    setActiveTab(tab);
    setfilterParams({ ...filterParams, page: 1, color_code: tab });
  };

  return (
    <div className="space-y-6">
      <div className="">
          <div className="flex justify-between items-center mb-6">
          <div className="flex border-b border-gray-400 space-x-1">
            <button
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === "yellow"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => handleSetActiveTab("yellow")}
            >
              Yellow Customers
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === "green"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => handleSetActiveTab("green")}
            >
              Green Customers
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === "red"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => handleSetActiveTab("red")}
            >
              Red Customers
            </button>
          </div>
          <div className="flex justify-end items-center">
            <button 
              className="inline-flex items-center px-3 py-3 border bg-blue-800 text-white text-sm"
              onClick={() => setShowAddModal(true)}
            >
              {/* <FaFilter className="" /> */}
              Add Souvenir
            </button>
          
            <div className="relative">
              <input
                type="text"
                value={searchQuery == initialRenderVal ? "" : searchQuery}
                onChange={handleSearchQuery}
                placeholder="Search souvenir here..."
                className="pl-4 py-2 border w-64 focus:outline-none border-gray-400 focus:ring focus:ring-blue-500"
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
                  onClick={() => handleSort("name")}
                >
                  Souvenir Name
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
                  className="px-4 py-2 text-left"
                  onClick={() => handleSort("qty_as_int")}
                >
                  Total Quantity
                  <span className="ml-1 inline-block">
                    {sortConfig && sortConfig.field === "qty_as_int" ? (
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
                  onClick={() => handleSort("claimed_as_int")}
                >
                  Claimed
                  <span className="ml-1 inline-block">
                    {sortConfig && sortConfig.field === "claimed_as_int" ? (
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
                  onClick={() => handleSort("remaining_as_int")}
                >
                  Remaining Qty
                  <span className="ml-1 inline-block">
                    {sortConfig && sortConfig.field === "remaining_as_int" ? (
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
                  <td colSpan={5} className="px-4 py-2 text-center">
                    Loading...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-2 text-center">
                    No souvenirs found
                  </td>
                </tr>
              ) : (
                currentItems.map((souvenir) => (
                  <tr key={souvenir.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{souvenir.name}</td>
                    <td className="px-4 py-3">{souvenir.totalQuantity}</td>
                    <td className="px-4 py-3">{souvenir.claimed}</td>
                    <td className="px-4 py-3">{souvenir.remaining}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          className="text-blue-700 hover:text-blue-800"
                          onClick={() => openEditModal(souvenir)}
                        >
                          <MdModeEditOutline className="size-5" />
                        </button>
                        <button
                          className="text-red-700 hover:text-red-800"
                          onClick={() => handleDeleteSouvenir(souvenir)}
                        >
                          <IoTrashOutline className="size-5" />
                        </button>
                      </div>
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

      {/* Add Souvenir Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl">

            <div className="px-6 py-4">
              <h2 className="text-[34px] font-bold">Add Souvenir</h2>
            </div>
            <div className="border-t border-gray-400 px-6 py-5 space-y-5">
              
              {/* Souvenir For */}
              <div>
                  <div>
                    <label className="block text-gray-700 mb-2 mt-4">
                      Souvenir For
                    </label>
                  </div>
                        
                  <div className="mt-2 mb-4 flex flex-row gap-6 items-center">
                    {[
                      { label: "Yellow", value: "yellow" },
                      { label: "Green", value: "green" },
                      { label: "Red", value: "red" }
                    ].map((item) => (
                      <div key={item.value} className="flex flex-row gap-2 items-center">
                        <input
                          type="radio"
                          name="souvenirFor" // same name for grouping
                          value={item.value}
                          checked={newSouvenirFor === item.value}
                          onChange={(e) => setNewSouvenirFor(e.target.value)}
                        />
                        <label className="text-gray-700">{item.label}</label>
                      </div>
                    ))}
                  </div>
              </div>
              {/* Send For */}
              
              <div>
                <label className="block text-gray-700 mb-2">
                  Souvenir Name
                </label>
                <input
                  type="text"
                  className="w-full px-2 py-4  border-gray-400 border"
                  value={newSouvenirName}
                  onChange={(e) => setNewSouvenirName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Total Qty</label>
                <input
                  type="number"
                  className="w-full px-2 py-4 border-gray-400 border"
                  value={newSouvenirQuantity}
                  onChange={(e) => setNewSouvenirQuantity(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6 mb-6">
                <button
                  className="px-6 py-2 border border-blue-700 text-blue-700"
                  onClick={() => {
                    setNewSouvenirFor("yellow");
                    setShowAddModal(false);
                    setNewSouvenirName("");
                    setNewSouvenirQuantity("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 bg-blue-800 text-white"
                  onClick={handleAddSouvenir}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Souvenir Modal */}
      {showEditModal && selectedSouvenir && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl">
            <div className="px-6 py-4">
              <h2 className="text-[34px] font-bold">Edit Souvenir</h2>
            </div>
            <div className="border-t border-gray-400 px-6 py-5 space-y-5">

              {/* Souvenir For */}
              <div>
                  <div>
                    <label className="block text-gray-700 mb-2 mt-4">
                      Souvenir For
                    </label>
                  </div>
                        
                  <div className="mt-2 mb-4 flex flex-row gap-6 items-center">
                    {[
                      { label: "Yellow", value: "yellow" },
                      { label: "Green", value: "green" },
                      { label: "Red", value: "red" }
                    ].map((item) => (
                      <div key={item.value} className="flex flex-row gap-2 items-center">
                        <input
                          type="radio"
                          name="souvenirFor" // same name for grouping
                          value={item.value}
                          checked={newSouvenirFor === item.value}
                          onChange={(e) => setNewSouvenirFor(e.target.value)}
                        />
                        <label className="text-gray-700">{item.label}</label>
                      </div>
                    ))}
                  </div>
              </div>
              {/* Send For */}

              <div>
                <label className="block 0 mb-2">Souvenir Name</label>
                <input
                  type="text"
                  className="w-full px-2 py-4 border bg-gray-200"
                  value={selectedSouvenir.name}
                  disabled
                />
              </div>
              <div>
                <label className="block 0 mb-2">Total Quantity</label>
                <input
                  type="number"
                  className="w-full px-2 py-4 border border-gray-400"
                  value={newSouvenirQuantity}
                  onChange={(e) => setNewSouvenirQuantity(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6 mb-6">
                <button
                  className="px-6 py-2 border border-blue-700 text-blue-700"
                  onClick={() => {
                    setNewSouvenirFor("yellow");
                    setShowEditModal(false);
                    setSelectedSouvenir(null);
                    setNewSouvenirQuantity("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 bg-blue-800 text-white"
                  onClick={handleEditSouvenir}
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
