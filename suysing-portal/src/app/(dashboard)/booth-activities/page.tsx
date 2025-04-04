'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaEye } from 'react-icons/fa';
import { boothActivitiesData } from '@/services/api';
import Pagination from '@/components/ui/Pagination';
import { Booth } from '@/types';
import { useAuth } from '@/lib/hooks/useAuth';
import QRCode from 'react-qr-code';
import Swal from 'sweetalert2'

export default function BoothActivitiesPage() {
  const { token } = useAuth();
  const [booths, setBooths] = useState<Booth[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filteredBooths, setFilteredBooths] = useState<Booth[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);
  const [boothStatus, setBoothStatus] = useState<string>('Open');
  const itemsPerPage = 8;
  const [filterParams, setfilterParams] = useState({'page' : 1, 'perpage' : 10, 'query' : ''});

  const fetchData = async () => {
    try {
      const boothsData = await boothActivitiesData.getBooths(token, filterParams);
      
      setBooths(boothsData.results);
      setFilteredBooths(boothsData.results);

      setCurrentPage(boothsData.current_page)
      setTotalPages(boothsData.total_pages)
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterParams]);

  // useEffect(() => {
  //   const results = booths.filter(booth =>
  //     booth.name.toLowerCase().includes(searchQuery.toLowerCase())
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
    setfilterParams({ ...filterParams, page: pageNumber })
  };

  const handleSearchQuery = (query : any) => {
    const search_val = query.target.value
    setSearchQuery(search_val)
  }

  
  useEffect(() => {
    // set delay 2 seconds
    const delaySetSearch = setTimeout(() => {
      // it will get the latest value after two seconds of no keyboard activity
      setfilterParams({ ...filterParams, page: 1, query : searchQuery})
    }, 2000);

    //clears the timeout of the previous value of delaySetSearch
    //clears the timeout on re render
    return () => clearTimeout(delaySetSearch)
  
  }, [searchQuery]);


  // Status color mapping
  const getStatusColor = (status: string | undefined): string => {
    if (!status) return 'text-gray-500';
    
    switch (status) {
      case 'Open':
        return 'text-green-500';
      case 'Closed Early':
        return 'text-red-500';
      case 'Closed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };


  const handleSubmitBooth = async () => {
    // Here you would typically update the booth status via API
    // console.log(`Updating booth ${selectedBooth.id} status to ${boothStatus}`);
    // Update local state
    // const updatedBooths = booths.map(booth => 
    //   booth.id === selectedBooth.id ? {...booth, status: boothStatus} : booth
    // );
    // setBooths(updatedBooths);
    // setFilteredBooths(updatedBooths.filter(booth =>
    //   booth.name.toLowerCase().includes(searchQuery.toLowerCase())
    // ));

    if (!selectedBooth) return;

    let booth_status = 0;
    if(boothStatus == "Closed Early"){
      booth_status = 1;
    }

    let confirmAction = await confirmMessage(`Are you sure you want to update this booth?`);

    if(confirmAction.isConfirmed){

        try{

          // Update booth status
          const boothUpdated = {
            booth_id : selectedBooth.id,
            booth_status : booth_status,
          }

          const boothUpdatedData = await boothActivitiesData.updateBooth(token, boothUpdated);
          
          if(boothUpdatedData.success){
            showMessage("1" , boothUpdatedData.message)
            setfilterParams({ ...filterParams})
          }else{
            showMessage("0" , boothUpdatedData.message)  
          }
          
        } catch (error) {
          // console.error('Error fetching data:', error);
          showMessage("0" , "Error updating booth.")   
        } finally {
          setIsLoading(false);
        }

        setShowModal(false);

    }
  }


  const confirmMessage = async (message: string)  => {
    
      const result = await Swal.fire({
        title: 'Confirm',
        text: message,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#193cb8",
      })

      return result;
  }

  const showMessage = (status: string, message : string)  => {
    
      let iconType: "success" | "error";
      let titleType: "Success" | "Error";

      if(status == "1"){
        iconType = "success";
        titleType = "Success";
      }else{
        iconType = "error";
        titleType = "Error";
      }

      Swal.fire({
        title: titleType,
        text: message,
        icon: iconType,
        confirmButtonColor: "#193cb8"
      })
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="py-4 flex justify-end items-center gap-4">
          <button className="inline-flex items-center px-3 py-3 border bg-blue-800 text-white text-sm">
            <FaFilter className="mr-2" /> Filter by
          </button>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchQuery}
              placeholder="Search booth name..."
              className="pl-4 py-2 border w-64 focus:outline-none focus:ring focus:ring-blue-500"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-7`00" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-400">
            <thead>
              <tr className="bg-blue-800 text-white">
                <th className="table-header">Booth Name</th>
                <th className="table-header">Status</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-center">Loading...</td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-center">No booths found</td>
                </tr>
              ) : (
                currentItems.map((booth) => (
                  <tr key={booth.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{booth.name}</td>
                    <td className={`px-4 py-3 ${getStatusColor(booth.status)}`}>{booth.status}</td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          setSelectedBooth(booth);
                          setBoothStatus(booth.status || 'Open');
                          setShowModal(true);
                        }}
                      >
                        <FaEye />
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

      {/* Booth QR Code Modal */}
      {showModal && selectedBooth && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-auto">
            <div className="flex justify-center items-center mb-4">
              <h2 className="text-4xl font-bold text-center">{selectedBooth.name}</h2>
            </div>
            
            <div className="flex justify-center my-6">
              <QRCode 
                value={`https://suysing.com/booth/${selectedBooth.id}`} 
                size={290} 
                fgColor="#0A20B1"
                
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Booth Status</label>
              <select
                value={boothStatus}
                onChange={(e) => setBoothStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Open">Open</option>
                <option value="Closed Early">Closed Early</option>
              </select>
            </div>
            
            <button 
              onClick={handleSubmitBooth}
              className="w-full bg-blue-800 text-white py-2 px-4 hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
