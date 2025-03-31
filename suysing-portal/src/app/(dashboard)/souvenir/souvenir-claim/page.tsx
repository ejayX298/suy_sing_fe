'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { souvenirClaimData } from '@/services/api';
import Pagination from '@/components/ui/Pagination';
import { Claim } from '@/types';

export default function SouvenirClaimPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([]);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const claimsData = await souvenirClaimData.getClaims();
        
        setClaims(claimsData);
        setFilteredClaims(claimsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const results = claims.filter(claim =>
      claim.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredClaims(results);
    setCurrentPage(1);
  }, [searchQuery, claims]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredClaims.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClaims.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Claimed':
        return 'bg-[#2EE84A] text-black';
      case 'Pending':
        return 'bg-[#FFE944] text-black';
      case 'On Hold':
        return 'bg-[#FF5A44] text-black';
      default:
        return 'bg-gray-400 text-black';
    }
  };

  // Customer type color mapping
  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case 'Red':
        return 'text-red-500';
      case 'Green':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
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
              value={searchQuery}
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
                <th className="table-header">Customer Code</th>
                <th className="table-header">Customer Name</th>
                <th className="table-header">Customer Type</th>
                <th className="table-header">Status</th>
                <th className="table-header">Item</th>
                <th className="table-header">Time Claimed</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-2 text-center">Loading...</td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-2 text-center">No claims found</td>
                </tr>
              ) : (
                currentItems.map((claim) => (
                  <tr key={claim.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{claim.code}</td>
                    <td className="px-4 py-3">{claim.name}</td>
                    <td className={`px-4 py-3 ${getCustomerTypeColor(claim.type)}`}>{claim.type}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-2  ${getStatusColor(claim.status)}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{claim.item}</td>
                    <td className="px-4 py-3">{claim.timeClaimed}</td>
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
