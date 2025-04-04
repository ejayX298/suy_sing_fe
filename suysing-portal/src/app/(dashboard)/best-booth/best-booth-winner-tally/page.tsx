'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { bestBoothWinnerTallyData } from '@/services/api';
import Pagination from '@/components/ui/Pagination';
import { Booth } from '@/types';
import { useAuth } from '@/lib/hooks/useAuth';

export default function BestBoothWinnerTallyPage() {
  const { token } = useAuth();
  const [booths, setBooths] = useState<Booth[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filteredBooths, setFilteredBooths] = useState<Booth[]>([]);
  const [activeTab, setActiveTab] = useState('Blue Booth');
  const itemsPerPage = 10;
  const [filterParams, setfilterParams] = useState({'page' : 1, 'perpage' : 10, 'query' : '', color_code: 'blue'});

  const fetchData = async () => {
    try {
      const boothsData = await bestBoothWinnerTallyData.getBooths(token, filterParams);
      
      setBooths(boothsData?.results);
      setFilteredBooths(boothsData?.results);

      setCurrentPage(boothsData.current_page);
      setTotalPages(boothsData.total_pages);
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
  //   const results = booths.filter(booth =>
  //     booth.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     booth.code.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
    
  //   setFilteredBooths(results);
  //   setCurrentPage(1);
  // }, [searchQuery, booths]);

  // Calculate pagination
  // const totalPages1 = Math.ceil(filteredBooths.length / itemsPerPage);
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBooths

  const handlePageChange = (pageNumber: number) => {
    // setCurrentPage(pageNumber);
    setfilterParams({ ...filterParams, page: pageNumber })
  };

  const handleSearchQuery = (query : any) => {
    const search_val = query.target.value
    setSearchQuery(search_val)
  }

  const handleSetActiveTab = (booth_name : any) => {
    let booth_value = 'blue'
    
    if(booth_name == 'Red Booth'){
      booth_value = 'red'
    }else if(booth_name == 'Orange Booth'){
      booth_value = 'orange'
    }
    setActiveTab(booth_name)
    setfilterParams({ ...filterParams, page: 1, color_code : booth_value})
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
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex border-b border-gray-400 space-x-1">
            <button
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === 'Blue Booth' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleSetActiveTab('Blue Booth')}
            >
              Blue Booth
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === 'Orange Booth' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleSetActiveTab('Orange Booth')}
            >
              Orange Booth
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === 'Red Booth' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleSetActiveTab('Red Booth')}
            >
              Red Booth
            </button>
          </div>
          <div className="py-4 flex justify-end gap-4 items-center">
          <button className="inline-flex items-center px-3 py-3 border bg-blue-800 text-white text-sm">
            <FaFilter className="mr-2" /> Filter by
          </button>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchQuery}
              placeholder="Search booth here..."
              className="pl-4 py-2 border w-64 focus:outline-none focus:ring focus:ring-blue-500"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-800" />
          </div>
        </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-400">
            <thead>
              <tr className="bg-blue-800 text-white">
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
