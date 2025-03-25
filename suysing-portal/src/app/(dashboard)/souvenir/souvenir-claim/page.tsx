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
        return 'bg-green-500 text-white';
      case 'Pending':
        return 'bg-yellow-500 text-white';
      case 'On Hold':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
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
              placeholder="Search customer here..."
              className="pl-10 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-2 text-left">Customer Code</th>
                <th className="px-4 py-2 text-left">Customer Name</th>
                <th className="px-4 py-2 text-left">Customer Type</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Item</th>
                <th className="px-4 py-2 text-left">Time Claimed</th>
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
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(claim.status)}`}>
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
