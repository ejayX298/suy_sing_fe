'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaEdit, FaPlus } from 'react-icons/fa';
import { souvenirAvailabilityData } from '@/services/api';
import Pagination from '@/components/ui/Pagination';
import { Souvenir } from '@/types';
import { useAuth } from '@/lib/hooks/useAuth';

export default function SouvenirAvailabilityPage() {
  const { token } = useAuth();
  const [souvenirs, setSouvenirs] = useState<Souvenir[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filteredSouvenirs, setFilteredSouvenirs] = useState<Souvenir[]>([]);
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

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-md">
        <div className="p-4 flex justify-between items-center border-b">
          <div className="flex items-center space-x-2">
            <button className="inline-flex items-center px-3 py-1 border border-blue-600 text-blue-600 rounded-md text-sm">
              <FaFilter className="mr-2" /> Filter by
            </button>
            
            <button className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-md text-sm">
              <FaPlus className="mr-2" /> Add Souvenir
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchQuery}
              placeholder="Search souvenir here..."
              className="pl-10 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-600 text-white">
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
                      <button className="text-blue-600 hover:text-blue-800">
                        <FaEdit />
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
