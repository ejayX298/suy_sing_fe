'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaEye } from 'react-icons/fa';
import { boothActivitiesData } from '@/services/api';
import Pagination from '@/components/ui/Pagination';
import { Booth } from '@/types';
import QRCode from 'react-qr-code';

export default function BoothActivitiesPage() {
  const [booths, setBooths] = useState<Booth[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredBooths, setFilteredBooths] = useState<Booth[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);
  const [boothStatus, setBoothStatus] = useState<string>('Open');
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const boothsData = await boothActivitiesData.getBooths();
        
        setBooths(boothsData);
        setFilteredBooths(boothsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const results = booths.filter(booth =>
      booth.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredBooths(results);
    setCurrentPage(1);
  }, [searchQuery, booths]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredBooths.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBooths.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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
              onChange={(e) => setSearchQuery(e.target.value)}
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
              onClick={() => {
                // Here you would typically update the booth status via API
                console.log(`Updating booth ${selectedBooth.id} status to ${boothStatus}`);
                // Update local state
                const updatedBooths = booths.map(booth => 
                  booth.id === selectedBooth.id ? {...booth, status: boothStatus} : booth
                );
                setBooths(updatedBooths);
                setFilteredBooths(updatedBooths.filter(booth =>
                  booth.name.toLowerCase().includes(searchQuery.toLowerCase())
                ));
                setShowModal(false);
              }}
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
