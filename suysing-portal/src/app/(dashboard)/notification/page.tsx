"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaSortUp, FaSortDown, FaBell } from "react-icons/fa";
import Pagination from "@/components/ui/Pagination";
import { NotificationInt } from "@/types";
// import { useRouter } from "next/navigation";
import { notificationService } from "@/services/api";
import { useAuth } from "@/lib/hooks/useAuth";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { FaPencil } from "react-icons/fa6";

type SortField =
  | "title"
  | "message"
  | "send_to";

export default function NotificationPage() {
  const { token } = useAuth();
  // const router = useRouter();
  const initialRenderVal = "__default_val__";

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialRenderVal);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [activeTab, setActiveTab] = useState("manual");
  const [notifications, setNotifications] = useState<NotificationInt[]>([]);
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

  // Form states
  const [selectedNotification, setSelectedNotification] = useState<NotificationInt | null>(null);
  const [newSendTo, setNewSendTo] = useState("all");
  const [newCustomerCodes, setNewCustomerCodes] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [newTime, setNewTime] = useState("");
  // const [sendImmediately, setSendImmediately] = useState(true)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (!token) {
        console.error("Authentication token is missing");
        setIsLoading(false);
        return;
      }

      const notificationData = await notificationService.getNotifications(
        token,
        filterParams
      );
      setNotifications(notificationData.results);
      setCurrentPage(notificationData.current_page);
      setTotalPages(notificationData.total_pages);
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

  // For tabs
  const handleSetActiveTab = (act_tab: "manual" | "upload") => {

    setActiveTab(act_tab);
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


  // Handle add notification
  const handleAddNotification = async () => {

    if (
      !newSendTo.trim() ||
      !newTitle.trim() ||
      !newMessage.trim()
    ) {
      alert("Please fill in all fields");
      return;
    }

     if (!token) {
      showMessage("0", "Authentication token is missing");
      return;
    }

    const confirmAction = await confirmMessage(
      'Send Notification?',
      `Are you sure you want to submit this notification? Once you click Send, all selected users will be notified.`
    );

    if (confirmAction.isConfirmed) {
      let send_to = newSendTo
      // Handle color code
      const color_code = send_to.includes("color_code_") ? send_to.split("color_code_")[1] : '';

      if (send_to.includes("color_code_")) {
        send_to = "color_code"
      }

      // Create new notification object
      const newNotification = {
        title: newTitle,
        message: newMessage,
        send_to: send_to,
        customer_codes : newCustomerCodes,
        color_code: color_code,
        scheduled_at : newTime ? newTime : null
      };

      try {
        const addNotificationResult =
          await notificationService.addNotification(token, newNotification);

        if (addNotificationResult.success) {
          showMessage("1", "Notification sent Successfully");
          // Refresh data
          fetchData();
        } else {
          showMessage("0", addNotificationResult.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showMessage("0", "Error adding notification.");
      }
     
    }

    setShowAddModal(false);
    resetForm()
  }


  // Handle Update Notification
  const handleUpdateNotification = async () => {
    if (!selectedNotification) return;

    if (
      !newSendTo.trim() ||
      !newTitle.trim() ||
      !newMessage.trim()
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (!token) {
      showMessage("0", "Authentication token is missing");
      return;
    }

    const confirmAction = await confirmMessage(
        'Send Notification Again?',
        `Are you sure you want to submit this notification again? Once you click Send, all selected users will be notified.`
    );

    if (confirmAction.isConfirmed) {
        let send_to = newSendTo

        // Handle color code
        const color_code = send_to.includes("color_code_") ? send_to.split("color_code_")[1] : '';

        if (send_to.includes("color_code_")) {
          send_to = "color_code"
        }

        // Update notification
        const updateNotif = {
          id : selectedNotification?.id,
          title: newTitle,
          message: newMessage,
          send_to: send_to,
          customer_codes : newCustomerCodes,
          color_code: color_code,
          scheduled_at : newTime ? newTime : null
        };

        try {
          const updateNotifDataResult =
            await notificationService.updateNotification(token, updateNotif);

          if (updateNotifDataResult.success) {
              showMessage("1", "Notification sent Successfully");
              // Refresh data
              fetchData();
          } else {
              showMessage("0", updateNotifDataResult.message);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          showMessage("0", "Error updating this notification.");
        }
      }

      setShowEditModal(false);
      setSelectedNotification(null);

      // Reset form
      resetForm()

  }

  const resetForm = () =>{
    // Reset form
    setNewTitle("");
    setNewMessage("");
    setNewSendTo("all");
    setNewTime("");
    setNewCustomerCodes("");
    setUploadedFile(null);
  }

  // for uploading
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel"
    ];

    if (!validTypes.includes(file.type)) {
      showMessage("0", "Please upload a valid Excel file (.xlsx)");
      return;
    }

    // Validate file size (50MB = 50 * 1024 * 1024 bytes)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      showMessage("0", "File size exceeds 50MB limit");
      return;
    }

    setUploadedFile(file);

    // Parse the Excel file
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) return;

      try {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as (string | number | boolean | null | undefined)[][];

        // Extract customer codes from the first column (skip header row)
        const customerCodes = jsonData
          .slice(1) // Skip first row (header)
          .map((row) => row[0])
          .filter((cell): cell is string => cell != null && typeof cell === "string" && cell.trim() !== "")
          .map((code) => code.trim().toUpperCase())
          .filter((code, index, self) => self.indexOf(code) === index);

        if (customerCodes.length === 0) {
          showMessage("0", "No customer codes found in the file");
          return;
        }

        // Join with comma and space
        const codesString = customerCodes.join(", ");
        setNewCustomerCodes(codesString);
        setNewSendTo('customer_code');

        showMessage("1", `Successfully loaded ${customerCodes.length} customer codes`);
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        showMessage("0", "Error parsing Excel file");
      }
    };

    reader.readAsBinaryString(file);
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel"
    ];

    if (!validTypes.includes(file.type)) {
      showMessage("0", "Please upload a valid Excel file (.xlsx)");
      return;
    }

    // Validate file size (50MB = 50 * 1024 * 1024 bytes)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      showMessage("0", "File size exceeds 50MB limit");
      return;
    }

    setUploadedFile(file);

    // Parse the Excel file
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) return;

      try {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as (string | number | boolean | null | undefined)[][];

        // Extract customer codes from the first column (skip header row)
        const customerCodes = jsonData
          .slice(1) // Skip first row (header)
          .map((row) => row[0])
          .filter((cell): cell is string => cell != null && typeof cell === "string" && cell.trim() !== "")
          .map((code) => code.trim().toUpperCase())
          .filter((code, index, self) => self.indexOf(code) === index);

        if (customerCodes.length === 0) {
          showMessage("0", "No customer codes found in the file");
          return;
        }

        // Join with comma and space
        const codesString = customerCodes.join(", ");
        setNewCustomerCodes(codesString);
        setNewSendTo('customer_code');

        showMessage("1", `Successfully loaded ${customerCodes.length} customer codes`);
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        showMessage("0", "Error parsing Excel file");
      }
    };

    reader.readAsBinaryString(file);
  };
  // end for uploading


  const getSendToDetails = (notif_details: NotificationInt) => {
    if (notif_details){
      if(notif_details.send_to == 'customer_code'){
        return truncateCustomerCodes(notif_details.customer_codes)
      }else if(notif_details.send_to == 'color_code'){
        return notif_details.color_code.toUpperCase()
      }else{
        return notif_details.send_to.toUpperCase()
      }
    }
    return '';
  }


  // Open edit modal
  const openEditModal = (notification: NotificationInt) => {

      let send_to = notification.send_to
      // handle color code
      const color_code = notification.color_code
      const colors = ["red", "green", "yellow"];

      // Handle color code -- check if color_code exists in colors
      if (send_to == 'color_code'){
          if (colors.includes(color_code)) {
            // get the color code
            send_to = "color_code_"+color_code
          }
      }

      setSelectedNotification(notification);
      setNewTitle(notification.title);
      setNewMessage(notification.message);
      setNewSendTo(send_to);
      setNewTime(notification.scheduled_at_local_time || "");
      setNewCustomerCodes(notification.customer_codes);
      setShowEditModal(true);
      
  };

  // Truncate message to specified character limit
  const truncateMessage = (message: string, maxLength: number = 30) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  // Truncate customer codes to show only first 5
  const truncateCustomerCodes = (codes: string, maxItems: number = 3) => {
    if (!codes) return "";
    const codesArray = codes.split(",").map(code => code.trim());
    if (codesArray.length <= maxItems) return codes;
    const visibleCodes = codesArray.slice(0, maxItems).join(", ");
    return `${visibleCodes}... (+${codesArray.length - maxItems} more)`;
  };

  // Confirmation message helper
  const confirmMessage = async (title : string, message: string) => {
    const result = await Swal.fire({
      title: title,
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
      <div className="">
        <div className="py-4 flex justify-end gap-4 items-center border-b">
          <div className="flex items-center space-x-2">
            {/* <button className="inline-flex items-center px-3 py-3 border bg-blue-800 text-white text-sm">
              <FaFilter className="mr-2" /> Filter by
            </button> */}
          </div>

          <button
            className="inline-flex items-center px-3 py-2 bg-blue-800 text-white rounded-md"
            onClick={() => setShowAddModal(true)}
          >
            <FaBell className="mr-2" /> Send Notification
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
                  onClick={() => handleSort("title")}
                >
                  Title
                  <span className="ml-1 inline-block">
                    {sortConfig && sortConfig.field === "title" ? (
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
                  onClick={() => handleSort("message")}
                >
                  Message
                  <span className="ml-1 inline-block">
                    {sortConfig && sortConfig.field === "message" ? (
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
                  onClick={() => handleSort("send_to")}
                >
                  Send To
                  <span className="ml-1 inline-block">
                    {sortConfig && sortConfig.field === "send_to" ? (
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
              ) : notifications.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-center">
                    No records found
                  </td>
                </tr>
              ) : (
                notifications.map((notif_details) => (
                  <tr key={notif_details.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{(notif_details.title)}</td>
                    <td className="px-4 py-3">{truncateMessage(notif_details.message)}</td>
                    <td className="px-4 py-3"> {getSendToDetails(notif_details)}                      
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => openEditModal(notif_details)}
                      >
                        <FaPencil size={18} />
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

      {/* Add Notification Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl">
            <div className="px-6 py-4">
              <h2 className="text-[34px] font-bold">Send Notification</h2>
            </div>
            <div className="border-t border-gray-400 px-6 py-5 space-y-5">

              <div className="flex border-b border-gray-400 space-x-1">
                <button
                  className={`px-4 py-3 font-medium text-sm ${
                    activeTab === "manual"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => {
                        handleSetActiveTab("manual")
                        resetForm()
                    }
                  }
                >
                  Manual Sending
                </button>
                <button
                  className={`px-4 py-3 font-medium text-sm ${
                    activeTab === "upload"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => {
                      handleSetActiveTab("upload")
                      resetForm()
                    }
                  }
                >
                  Upload Data
                </button>
              </div>
              
              {/* Time */}
              <div>
                <label className="block text-gray-700 mb-2">Time (notification applies only on April 26, 2026)</label>
                <input
                  type="time"
                  className="w-full px-2 py-4 border-gray-400 border"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  // disabled={sendImmediately}
                />
              </div>

               {/* <div className="mt-2">                                                      
                  <label className="flex items-center gap-2">                               
                    <input                                                                  
                      type="checkbox"                                                       
                      checked={sendImmediately}                                             
                      onChange={(e) => setSendImmediately(e.target.checked)}                
                    />                                                                      
                    <span className="text-gray-700">Send immediately after submit</span>    
                  </label>                                                                  
                </div>   */}
              {/* End Time */}

              {/* for manual */}
              {activeTab === "manual" && (
                <div>

                  {/* Send to */}
                  <div>
                    <label className="block text-gray-700 mb-2 mt-4">
                      Send To
                    </label>
                  </div>
                        
                  <div className="mt-2 mb-4 flex flex-row gap-6 items-center">
                    {[
                      { label: "All", value: "all" },
                      { label: "Red", value: "color_code_red" },
                      { label: "Green", value: "color_code_green" },
                      { label: "Yellow", value: "color_code_yellow" },
                      { label: "Customer Code", value: "customer_code" },
                    ].map((item) => (
                      <div key={item.value} className="flex flex-row gap-2 items-center">
                        <input
                          type="radio"
                          name="sendTo" // same name for grouping
                          value={item.value}
                          checked={newSendTo === item.value}
                          onChange={(e) => setNewSendTo(e.target.value)}
                        />
                        <label className="text-gray-700">{item.label}</label>
                      </div>
                    ))}
                  </div>
                  {/* End Send to */}
                  
                  {/* Customer Code */}
                  {newSendTo === "customer_code" && ( 
                      <div className="grid grid-cols gap-4">
                        <div>
                          <label className="block text-gray-700 mb-2">
                            Enter Customer Code (s)
                          </label>
                          <input
                            type="text"
                            className="w-full px-2 py-4 border-gray-400 border"
                            value={newCustomerCodes}
                            onChange={(e) => setNewCustomerCodes(e.target.value)}
                          />
                        </div>
                      </div>
                  )}
                  {/* End Customer Code */}

                </div>
              )}
              {/* end for manual */}


              {/* for uploading */}
              {activeTab === "upload" && (
                <div>
                  {/* Upload File */}
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-400 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">.XLSX only (MAX. 50MB)</p>
                        {uploadedFile && (
                          <div className="mt-2 flex flex-col items-center gap-2">
                            <p className="text-sm text-green-600 font-medium">
                              ✓ {uploadedFile.name}
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setUploadedFile(null);
                                setNewCustomerCodes("");
                              }}
                              className="text-sm text-red-600 hover:text-red-800 underline"
                            >
                              Remove File
                            </button>
                          </div>
                        )}
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        accept=".xlsx, .xls"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                  {/* End Upload File */}

                  {/* Display extracted customer codes */}
                  {newCustomerCodes && (
                    <div className="mt-4">
                      <label className="block text-gray-700 mb-2">
                        Extracted Customer Codes ({newCustomerCodes.split(", ").length} codes)
                      </label>
                      <textarea
                        className="w-full px-2 py-4 border-gray-400 border h-32"
                        value={newCustomerCodes}
                        onChange={(e) => setNewCustomerCodes(e.target.value)}
                        placeholder="Customer codes will appear here after upload..."
                      />
                    </div>
                  )}
                  {/* End Display extracted customer codes */}
                </div>
              )}
              {/* end for uploading */}


              {/* Title */}
              <div>
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  className="w-full px-2 py-4 border-gray-400 border"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              {/* End Title */}


              {/* Message */}
              <div>
                <label className="block text-gray-700 mb-2">Message</label>
                <textarea
                  className="w-full px-2 py-4 border-gray-400 border"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
              </div>
              {/* End Message */}

              <div className="flex justify-end space-x-2 mt-6 mb-6">
                <button
                  className="px-6 py-2 border border-blue-700 text-blue-700"
                  onClick={() => {
                    setShowAddModal(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 bg-blue-800 text-white"
                  onClick={handleAddNotification}
                >
                  Submit
                </button>
              </div> 

            </div>
          </div>
        </div>
      )}
      {/* End Add Modal */}





       {/* Edit Notification Modal */}
      {showEditModal && selectedNotification && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl">
            <div className="px-6 py-4">
              <h2 className="text-[34px] font-bold">Update Notification</h2>
            </div>
            <div className="border-t border-gray-400 px-6 py-5 space-y-5">

              <div className="flex border-b border-gray-400 space-x-1">
                <button
                  className={`px-4 py-3 font-medium text-sm ${
                    activeTab === "manual"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => {
                        handleSetActiveTab("manual")
                        // resetForm()
                    }
                  }
                >
                  Manual Sending
                </button>
                <button
                  className={`px-4 py-3 font-medium text-sm ${
                    activeTab === "upload"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => {
                      handleSetActiveTab("upload")
                      // resetForm()
                    }
                  }
                >
                  Upload Data
                </button>
              </div>
              
              {/* Time */}
              <div>
                <label className="block text-gray-700 mb-2">Time (notification applies only on April 26, 2026)</label>
                <input
                  type="time"
                  className="w-full px-2 py-4 border-gray-400 border"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  // disabled={sendImmediately}
                />
              </div>

               {/* <div className="mt-2">                                                      
                  <label className="flex items-center gap-2">                               
                    <input                                                                  
                      type="checkbox"                                                       
                      checked={sendImmediately}                                             
                      onChange={(e) => setSendImmediately(e.target.checked)}                
                    />                                                                      
                    <span className="text-gray-700">Send immediately after submit</span>    
                  </label>                                                                  
                </div>   */}
              {/* End Time */}

              {/* for manual */}
              {activeTab === "manual" && (
                <div>

                  {/* Send to */}
                  <div>
                    <label className="block text-gray-700 mb-2 mt-4">
                      Send To
                    </label>
                  </div>
                        
                  <div className="mt-2 mb-4 flex flex-row gap-6 items-center">
                    {[
                      { label: "All", value: "all" },
                      { label: "Red", value: "color_code_red" },
                      { label: "Green", value: "color_code_green" },
                      { label: "Yellow", value: "color_code_yellow" },
                      { label: "Customer Code", value: "customer_code" },
                    ].map((item) => (
                      <div key={item.value} className="flex flex-row gap-2 items-center">
                        <input
                          type="radio"
                          name="sendTo" // same name for grouping
                          value={item.value}
                          checked={newSendTo === item.value}
                          onChange={(e) => setNewSendTo(e.target.value)}
                        />
                        <label className="text-gray-700">{item.label}</label>
                      </div>
                    ))}
                  </div>
                  {/* End Send to */}
                  
                  {/* Customer Code */}
                  {newSendTo === "customer_code" && ( 
                      <div className="grid grid-cols gap-4">
                        <div>
                          <label className="block text-gray-700 mb-2">
                            Enter Customer Code (s)
                          </label>
                          <input
                            type="text"
                            className="w-full px-2 py-4 border-gray-400 border"
                            value={newCustomerCodes}
                            onChange={(e) => setNewCustomerCodes(e.target.value)}
                          />
                        </div>
                      </div>
                  )}
                  {/* End Customer Code */}

                </div>
              )}
              {/* end for manual */}


              {/* for uploading */}
              {activeTab === "upload" && (
                <div>
                  {/* Upload File */}
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-400 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">.XLSX only (MAX. 50MB)</p>
                        {uploadedFile && (
                          <div className="mt-2 flex flex-col items-center gap-2">
                            <p className="text-sm text-green-600 font-medium">
                              ✓ {uploadedFile.name}
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setUploadedFile(null);
                                setNewCustomerCodes("");
                              }}
                              className="text-sm text-red-600 hover:text-red-800 underline"
                            >
                              Remove File
                            </button>
                          </div>
                        )}
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        accept=".xlsx, .xls"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                  {/* End Upload File */}

                  {/* Display extracted customer codes */}
                  {newCustomerCodes && newSendTo == 'customer_code' && (
                    <div className="mt-4">
                      <label className="block text-gray-700 mb-2">
                        Extracted Customer Codes ({newCustomerCodes.split(", ").length} codes)
                      </label>
                      <textarea
                        className="w-full px-2 py-4 border-gray-400 border h-32"
                        value={newCustomerCodes}
                        onChange={(e) => setNewCustomerCodes(e.target.value)}
                        placeholder="Customer codes will appear here after upload..."
                      />
                    </div>
                  )}
                  {/* End Display extracted customer codes */}
                </div>
              )}
              {/* end for uploading */}


              {/* Title */}
              <div>
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  className="w-full px-2 py-4 border-gray-400 border"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              {/* End Title */}


              {/* Message */}
              <div>
                <label className="block text-gray-700 mb-2">Message</label>
                <textarea
                  className="w-full px-2 py-4 border-gray-400 border"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
              </div>
              {/* End Message */}

              <div className="flex justify-end space-x-2 mt-6 mb-6">
                <button
                  className="px-6 py-2 border border-blue-700 text-blue-700"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm()
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 bg-blue-800 text-white"
                  onClick={handleUpdateNotification}
                >
                  Send Again
                </button>
              </div> 

            </div>
          </div>
        </div>
      )}
      {/* End Edit Modal */}



    </div>
  );
}
