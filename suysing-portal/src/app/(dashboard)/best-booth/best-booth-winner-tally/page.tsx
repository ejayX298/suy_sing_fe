'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { bestBoothWinnerTallyData } from '@/services/api';
import Pagination from '@/components/ui/Pagination';
import { Booth } from '@/types';

export default function BestBoothWinnerTallyPage() {
  const [booths, setBooths] = useState<Booth[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredBooths, setFilteredBooths] = useState<Booth[]>([]);
  const [activeTab, setActiveTab] = useState('Blue Booth');
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const boothsData = await bestBoothWinnerTallyData.getBooths();
        
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
      booth.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booth.code.toLowerCase().includes(searchQuery.toLowerCase())
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

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-md">
        <div className="border-b">
          <div className="flex space-x-1">
            <button
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === 'Blue Booth' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('Blue Booth')}
            >
              Blue Booth
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === 'Orange Booth' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('Orange Booth')}
            >
              Orange Booth
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === 'Red Booth' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('Red Booth')}
            >
              Red Booth
            </button>
          </div>
        </div>

        <div className="p-4 flex justify-between items-center border-b">
          <button className="inline-flex items-center px-3 py-1 border border-blue-600 text-blue-600 rounded-md text-sm">
            <FaFilter className="mr-2" /> Filter by
          </button>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search booth here..."
              className="pl-10 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-2 text-left">Rank No.</th>
                <th className="px-4 py-2 text-left">Booth Name</th>
                <th className="px-4 py-2 text-left">Booth Code</th>
                <th className="px-4 py-2 text-left">Total No. of Votes</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-center">Loading...</td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-center">No booths found</td>
                </tr>
              ) : (
                currentItems.map((booth) => (
                  <tr key={booth.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{booth.rank}</td>
                    <td className="px-4 py-3">{booth.name}</td>
                    <td className="px-4 py-3">{booth.code}</td>
                    <td className="px-4 py-3">{booth.totalVotes}</td>
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
