'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { boothHoppingReportData } from '@/services/api';
import Pagination from '@/components/ui/Pagination';
import { Customer } from '@/types';


export default function BoothHoppingReportPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersData = await boothHoppingReportData.getCustomers();
        
        setCustomers(customersData);
        setFilteredCustomers(customersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const results = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredCustomers(results);
    setCurrentPage(1);
  }, [searchQuery, customers]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
                <th className="px-4 py-2 text-left">Total Booth Visited</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-center">Loading...</td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-center">No customers found</td>
                </tr>
              ) : (
                currentItems.map((customer) => (
                  <tr 
                    key={customer.id} 
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => window.location.href = `/booth-hopping-report/${customer.id}`}
                  >
                    <td className="px-4 py-3">{customer.code}</td>
                    <td className="px-4 py-3">{customer.name}</td>
                    <td className={`px-4 py-3 ${getCustomerTypeColor(customer.type)}`}>{customer.type}</td>
                    <td className="px-4 py-3">{customer.totalVisited}</td>
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
