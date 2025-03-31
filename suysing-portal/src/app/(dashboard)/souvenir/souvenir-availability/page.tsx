'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaPlus, FaLeaf } from 'react-icons/fa';
import { MdModeEditOutline } from "react-icons/md";
import { souvenirAvailabilityData } from '@/services/api';
import Pagination from '@/components/ui/Pagination';
import { Souvenir } from '@/types';
import { useAuth } from '@/lib/hooks/useAuth';
import Swal from 'sweetalert2'

export default function SouvenirAvailabilityPage() {
  const { token } = useAuth();
  const [souvenirs, setSouvenirs] = useState<Souvenir[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filteredSouvenirs, setFilteredSouvenirs] = useState<Souvenir[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newSouvenirName, setNewSouvenirName] = useState('');
  const [newSouvenirQuantity, setNewSouvenirQuantity] = useState('');
  const [selectedSouvenir, setSelectedSouvenir] = useState<Souvenir | null>(null);
  const itemsPerPage = 8;
  const [filterParams, setfilterParams] = useState({'page' : 1, 'perpage' : 10, 'query' : ''});

  const fetchData = async () => {
    try {
      const souvenirsData = await souvenirAvailabilityData.getSouvenirs(token, filterParams);
      
      setSouvenirs(souvenirsData.results);
      setFilteredSouvenirs(souvenirsData.results);
      
      setCurrentPage(souvenirsData.current_page)
      setTotalPages(souvenirsData.total_pages)
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

  
  const handleAddSouvenir = async () => {
    // Validate inputs
    if (!newSouvenirName.trim() || !newSouvenirQuantity.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const quantity = parseInt(newSouvenirQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      alert('Please enter a valid quantity');
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

    let confirmAction = await confirmMessage(`Are you sure you want to add ${newSouvenirName}?`);

    if(confirmAction.isConfirmed){

        // Add souvenir
        const newSouvenir = {
          name: newSouvenirName,
          totalQuantity: quantity,
        };

        try {
          const souvenirsData = await souvenirAvailabilityData.addSouvenir(token, newSouvenir);
          
          if(souvenirsData.success){
            showMessage("1" , souvenirsData.message)
            setfilterParams({ ...filterParams, page: 1, query : ''})
          }else{
            showMessage("0" , souvenirsData.message)  
          }
          
        } catch (error) {
          // console.error('Error fetching data:', error);
          showMessage("0" , "Error adding souvenir.")   
        } finally {
          setIsLoading(false);
        }
        
        // Reset form and close modal
        setNewSouvenirName('');
        setNewSouvenirQuantity('');
        setShowAddModal(false);
        
    }
   
  };

  const handleEditSouvenir = async () => {
    if (!selectedSouvenir) return;
    
    // Validate input
    const quantity = parseInt(newSouvenirQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      alert('Please enter a valid quantity');
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

    let confirmAction = await confirmMessage(`Are you sure you want to update this souvenir?`);

    if(confirmAction.isConfirmed){

      try {
        
        // Update souvenir
        const updatedSouvenir = {
          souvenir_id : selectedSouvenir.id,
          souvenir_qty : quantity
        }

        const souvenirsData = await souvenirAvailabilityData.updateSouvenir(token, updatedSouvenir);
        
        if(souvenirsData.success){
          showMessage("1" , souvenirsData.message)
          setfilterParams({ ...filterParams, page : 1, query : ''})
        }else{
          showMessage("0" , souvenirsData.message)  
        }
        
      } catch (error) {
        // console.error('Error fetching data:', error);
        showMessage("0" , "Error adding souvenir.")   
      } finally {
        setIsLoading(false);
      }
      
      // setSouvenirs(updatedSouvenirs);
      setShowEditModal(false);
      setSelectedSouvenir(null);
      setNewSouvenirQuantity('');
    }

    
  };

  const openEditModal = (souvenir: Souvenir) => {
    setSelectedSouvenir(souvenir);
    setNewSouvenirQuantity(souvenir.totalQuantity.toString());
    setShowEditModal(true);
  };


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
      <div className="">
        <div className="py-4 flex justify-end gap-4 items-center border-b">
          <div className="flex items-center space-x-2"> 
            <button 
              className="inline-flex items-center px-3 py-3 bg-blue-800 text-white text-sm"
              onClick={() => setShowAddModal(true)}
            >
              <FaPlus className="mr-2" /> Add Souvenir
            </button>
            <button className="inline-flex items-center px-3 py-3 border bg-blue-800 text-white text-sm">
              <FaFilter className="mr-2" /> Filter by
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchQuery}
              placeholder="Search souvenir here..."
              className="pl-4 py-2 border w-64 focus:outline-none border-gray-400 focus:ring focus:ring-blue-500"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-800" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-400">
            <thead>
              <tr className="bg-blue-800 text-white">
                <th className="px-4 py-2 text-left">Souvenir Name</th>
                <th className="px-4 py-2 text-left">Total Quantity</th>
                <th className="px-4 py-2 text-left">Claimed</th>
                <th className="px-4 py-2 text-left">Remaining Qty</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-2 text-center">Loading...</td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-2 text-center">No souvenirs found</td>
                </tr>
              ) : (
                currentItems.map((souvenir) => (
                  <tr key={souvenir.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{souvenir.name}</td>
                    <td className="px-4 py-3">{souvenir.totalQuantity}</td>
                    <td className="px-4 py-3">{souvenir.claimed}</td>
                    <td className="px-4 py-3">{souvenir.remaining}</td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => openEditModal(souvenir)}
                      >
                        <MdModeEditOutline/>
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

      {/* Add Souvenir Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl">
            <div className="px-6 py-4">
              <h2 className="text-[34px] font-bold">Add Souvenir</h2>
            </div>
            <div className="border-t border-gray-400 px-6 py-5 space-y-5">
              <div>
                <label className="block text-gray-700 mb-2">Souvenir Name</label>
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
                    setShowAddModal(false);
                    setNewSouvenirName('');
                    setNewSouvenirQuantity('');
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
                  // value={newSouvenirQuantity}
                  onChange={(e) => setNewSouvenirQuantity(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6 mb-6">
                <button
                  className="px-6 py-2 border border-blue-700 text-blue-700"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedSouvenir(null);
                    setNewSouvenirQuantity('');
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
