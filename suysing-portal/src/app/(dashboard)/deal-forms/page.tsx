'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaEye } from 'react-icons/fa';
import Pagination from '@/components/ui/Pagination';
import { Vendor } from '@/types';
import { dealFormsApiService } from '@/services/api';
import { useAuth } from '@/lib/hooks/useAuth';

export default function DealFormsPage() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5); 
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filterParams, setFilterParams] = useState({ page: 1, perpage: 10, query: '' });

  // Mock data for vendors
  // const mockVendors: Vendor[] = [
  //   { id: '1', vendorCode: 'ALAS01', vendorName: 'Alaska Milk Corporation' },
  //   { id: '2', vendorCode: 'UNILE01', vendorName: 'Unilever Philippines, Inc.' },
  //   { id: '3', vendorCode: 'MONDE03', vendorName: 'Mondelez Philippines, Inc.' },
  //   { id: '4', vendorCode: 'MEGA001', vendorName: 'Mega Prime Foods Incorporated' },
  //   { id: '5', vendorCode: 'CENTU03', vendorName: 'Century Pacific Food, Inc.' },
  //   { id: '6', vendorCode: 'THEPU01', vendorName: 'The Purefoods-Hormel Co. Inc.' },
  //   { id: '7', vendorCode: 'ACSC401', vendorName: 'ACS Manufacturing Corporation' },
  //   { id: '8', vendorCode: 'COLGA01', vendorName: 'Colgate-Palmolive Phil. Inc.' },
  // ];

  // Fetch data function (using mock data for now)
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const boothsData = await dealFormsApiService.getBooths(token, filterParams);
      setVendors(boothsData.results);

      setCurrentPage(boothsData.current_page)
      setTotalPages(boothsData.total_pages)
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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

  // Debounce search input
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      setFilterParams({ ...filterParams, page: 1, query: searchQuery });
    }, 500);
    
    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  // Navigate to vendor detail page
  const handleViewVendor = (vendorId: string) => {
    window.location.href = `/deal-forms/${vendorId}`;
  };

  return (
    <div className="space-y-6">
      <div className="">
        <div className="py-4 flex justify-end gap-4 items-center border-b">
          <div className="flex items-center space-x-2"> 
            <button className="inline-flex items-center px-3 py-3 border bg-blue-800 text-white text-sm">
              <FaFilter className="mr-2" /> Filter by
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchQuery}
              placeholder="Search vendor here..."
              className="pl-4 py-2 border w-64 focus:outline-none border-gray-400 focus:ring focus:ring-blue-500"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-800" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-400">
            <thead>
              <tr className="bg-blue-800 text-white">
                <th className="px-4 py-2 text-left">Vendor Code</th>
                <th className="px-4 py-2 text-left">Vendor Name</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-center">Loading...</td>
                </tr>
              ) : vendors.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-center">No vendors found</td>
                </tr>
              ) : (
                vendors.map((vendor) => (
                  <tr key={vendor.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{vendor.vendorCode}</td>
                    <td className="px-4 py-3">{vendor.vendorName}</td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleViewVendor(vendor.id)}
                      >
                        <FaEye size={18} />
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
    </div>
  );
}