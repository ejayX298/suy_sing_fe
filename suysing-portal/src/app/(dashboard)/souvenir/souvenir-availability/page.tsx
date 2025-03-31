'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaPlus } from 'react-icons/fa';
import { MdModeEditOutline } from "react-icons/md";
import { souvenirAvailabilityData } from '@/services/api';
import Pagination from '@/components/ui/Pagination';
import { Souvenir } from '@/types';

export default function SouvenirAvailabilityPage() {
  const [souvenirs, setSouvenirs] = useState<Souvenir[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredSouvenirs, setFilteredSouvenirs] = useState<Souvenir[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newSouvenirName, setNewSouvenirName] = useState('');
  const [newSouvenirQuantity, setNewSouvenirQuantity] = useState('');
  const [selectedSouvenir, setSelectedSouvenir] = useState<Souvenir | null>(null);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const souvenirsData = await souvenirAvailabilityData.getSouvenirs();
        
        setSouvenirs(souvenirsData);
        setFilteredSouvenirs(souvenirsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const results = souvenirs.filter(souvenir =>
      souvenir.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredSouvenirs(results);
    setCurrentPage(1);
  }, [searchQuery, souvenirs]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredSouvenirs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSouvenirs.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleAddSouvenir = () => {
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
    const newSouvenir: Souvenir = {
      id: souvenirs.length + 1, // Simple ID generation for demo
      name: newSouvenirName,
      totalQuantity: quantity,
      claimed: 0,
      remaining: quantity
    };

    // Add to souvenirs list
    setSouvenirs([...souvenirs, newSouvenir]);
    
    // Reset form and close modal
    setNewSouvenirName('');
    setNewSouvenirQuantity('');
    setShowAddModal(false);
  };

  const handleEditSouvenir = () => {
    if (!selectedSouvenir) return;
    
    // Validate input
    const quantity = parseInt(newSouvenirQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    // Update the souvenir
    const updatedSouvenirs = souvenirs.map(souvenir => {
      if (souvenir.id === selectedSouvenir.id) {
        const claimed = souvenir.claimed;
        return {
          ...souvenir,
          totalQuantity: quantity,
          remaining: quantity - claimed
        };
      }
      return souvenir;
    });

    setSouvenirs(updatedSouvenirs);
    setShowEditModal(false);
    setSelectedSouvenir(null);
    setNewSouvenirQuantity('');
  };

  const openEditModal = (souvenir: Souvenir) => {
    setSelectedSouvenir(souvenir);
    setNewSouvenirQuantity(souvenir.totalQuantity.toString());
    setShowEditModal(true);
  };

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
              onChange={(e) => setSearchQuery(e.target.value)}
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
                  value={newSouvenirQuantity}
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
