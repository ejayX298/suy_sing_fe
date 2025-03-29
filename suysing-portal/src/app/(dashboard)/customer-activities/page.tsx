'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { customerActivitiesData } from '@/services/api';
import Pagination from '@/components/ui/Pagination';
import { Customer } from '@/types';
import { useAuth } from '@/lib/hooks/useAuth';

interface ActivitySummary {
  boothHopping: number;
  boothVoting: number;
  souvenirClaiming: number;
}

export default function CustomerActivitiesPage() {
  const { token } = useAuth();
  const [summary, setSummary] = useState<ActivitySummary>({
    boothHopping: 0,
    boothVoting: 0,
    souvenirClaiming: 0,
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const itemsPerPage = 7;
  const [filterParams, setfilterParams] = useState({'page' : 1, 'perpage' : 10, 'query' : ''});

  const fetchData = async () => {
    try {

      const summaryData = await customerActivitiesData.getSummary(token);
      const customersData = await customerActivitiesData.getCustomers(token, filterParams);
      
      setSummary(summaryData);
      setCustomers(customersData.results);
      setFilteredCustomers(customersData.results);
      
      setCurrentPage(customersData.current_page)
      setTotalPages(customersData.total_pages)
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
  //   const results = customers.filter(customer =>
  //     customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     customer.code.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
    
  //   setFilteredCustomers(results);
  //   // setCurrentPage(1);
  // }, [searchQuery, customers]);

  // Calculate pagination
  const totalPages1 = Math.ceil(filteredCustomers.length / itemsPerPage);
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
  const currentItems = filteredCustomers;

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


  // Status color mapping
  const getStatusColor = (status: string | boolean | undefined): string => {
    if (status === undefined) return 'text-gray-500';
    
    if (typeof status === 'boolean') {
      return status ? 'text-green-500' : 'text-red-500';
    }
    
    switch (status) {
      case 'Completed':
        return 'text-green-500';
      case 'Pending':
        return 'text-orange-500';
      case 'Not Started':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };



  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start">
        {/* Summary boxes */}
        <div className="flex flex-wrap gap-4">
          {/* Booth Hopping */}
          <div className="border border-gray-400 p-4 w-[200px]">
            <h3 className="text-sm mb-2">Booth Hopping</h3>
            <p className="text-3xl font-bold">{summary.boothHopping}</p>
          </div>

          {/* Booth Voting */}
          <div className="border border-gray-400 p-4 w-[200px]">
            <h3 className="text-sm mb-2">Booth Voting</h3>
            <p className="text-3xl font-bold">{summary.boothVoting}</p>
          </div>

          {/* Souvenir Claiming */}
          <div className="border border-gray-400 p-4 w-[200px]">
            <h3 className="text-sm mb-2">Souvenir Claiming</h3>
            <p className="text-3xl font-bold">{summary.souvenirClaiming}</p>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="flex items-center gap-2 self-end">
          <button className="inline-flex items-center px-3 py-2.5 bg-blue-800 text-white text-sm">
            <FaFilter className="mr-2" /> Filter by
          </button>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchQuery}
              placeholder="Search customer here..."
              className="pl-4 pr-10 py-2 border w-72 focus:outline-none border-gray-400"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto ">
        <table className="w-full border-gray-400 border">
          <thead>
            <tr className="bg-blue-800 text-white">
              <th className="table-header">Customer Name</th>
                <th className="table-header">Total Booth Visited</th>
                <th className="table-header">Booth Hopping</th>
                <th className="table-header">Booth Voting</th>
                <th className="table-header">Souvenir Claiming</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-2 text-center">Loading...</td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-2 text-center">No customers found</td>
                </tr>
              ) : (
                currentItems.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-400 hover:bg-gray-50">
                    <td className="table-cell">
                      <div>{customer.name}</div>
                    </td>
                    <td className="table-cell">{customer.totalBoothVisited}</td>
                    <td className={`table-cell ${getStatusColor(customer.boothHopping)}`}>{customer.boothHopping}</td>
                    <td className={`table-cell ${getStatusColor(customer.boothVoting)}`}>{customer.boothVoting}</td>
                    <td className={`table-cell ${getStatusColor(customer.souvenirClaiming)}`}>{customer.souvenirClaiming}</td>
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
  );
}
