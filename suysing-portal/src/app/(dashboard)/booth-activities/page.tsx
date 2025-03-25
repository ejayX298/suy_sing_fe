'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaEye } from 'react-icons/fa';
import { boothActivitiesData } from '@/services/api';
import Pagination from '@/components/ui/Pagination';
import { Booth } from '@/types';

export default function BoothActivitiesPage() {
  const [booths, setBooths] = useState<Booth[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredBooths, setFilteredBooths] = useState<Booth[]>([]);
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
      <div className="bg-white shadow-sm rounded-md">
        <div className="p-4 flex justify-between items-center border-b">
          <button className="inline-flex items-center px-3 py-1 border border-blue-600 text-blue-600 rounded-md text-sm">
            <FaFilter className="mr-2" /> Filter by
          </button>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search booth name..."
              className="pl-10 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-2 text-left">Booth Name</th>
                <th className="px-4 py-2 text-left">Status</th>
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
                      <button className="text-blue-600 hover:text-blue-800">
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t">
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
