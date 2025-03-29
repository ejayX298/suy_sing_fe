'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import { boothHoppingReportData } from '@/services/api';
import Pagination from '@/components/ui/Pagination';
import QRCode from 'react-qr-code';
import { Customer, BoothVisit } from '@/types';
import { useAuth } from '@/lib/hooks/useAuth';



export default function CustomerBoothHoppingDetail({ params }: { params: { id: string } }) {
  const { token } = useAuth();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filteredVisits, setFilteredVisits] = useState<BoothVisit[]>([]);
  const router = useRouter();
  const itemsPerPage = 10;
  const [filterParams, setfilterParams] = useState({'page' : 1, 'perpage' : 10, 'query' : ''});


  const fetchData = async () => {
    try {
      const customerId = parseInt(params.id);
      const customerData = await boothHoppingReportData.getCustomerById(customerId, token, filterParams);
      
      if (customerData.results.length != 0) {
        setCustomer(customerData.results);
        setFilteredVisits(customerData.results.boothVisits || []);

        setCurrentPage(customerData.current_page)
        setTotalPages(customerData.total_pages)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, [filterParams, params.id]);

  // useEffect(() => {
  //   if (customer?.boothVisits) {
  //     const results = customer.boothVisits.filter((visit: BoothVisit) =>
  //       visit.boothName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       visit.boothCode.toLowerCase().includes(searchQuery.toLowerCase())
  //     );
      
  //     setFilteredVisits(results);
  //     setCurrentPage(1);
  //   }
  // }, [searchQuery, customer]);

  // Calculate pagination
  // const totalPages1 = Math.ceil((filteredVisits?.length || 0) / itemsPerPage);
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVisits

  const handlePageChange = (pageNumber: number) => {
    // setCurrentPage(pageNumber);
    setfilterParams({ ...filterParams, page: pageNumber })
  };

  const handleSearchQuery = (query : any) => {
    const search_val = query.target.value
    setSearchQuery(search_val)

    // set delay 2 seconds
    const delaySetSearch = setTimeout(() => {
      // it will get the latest value after two seconds of no keyboard activity
      setfilterParams({ ...filterParams, page: 1, query : search_val})
    }, 2000);
    
    //clears the timeout of the previous value of delaySetSearch
    //clears the timeout on re render
    return () => clearTimeout(delaySetSearch)
  }

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-xl mb-4">Customer not found</p>
        <button
          onClick={() => router.push('/booth-hopping-report')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FaArrowLeft className="mr-2" /> Back to Report
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push('/booth-hopping-report')}
          className="inline-flex items-center mr-4 text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-1" /> Back
        </button>
      </div>

      <div className="bg-white rounded-md shadow-sm p-6">
        <div className="flex justify-between">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <p className="text-sm text-gray-500">Customer Code:</p>
                <p className="font-medium">{customer.code}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer Name:</p>
                <p className="font-medium">{customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer Type:</p>
                <p className={`font-medium ${getCustomerTypeColor(customer.type)}`}>{customer.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Store Name:</p>
                <p className="font-medium">{customer.store || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Visited Booth:</p>
                <p className="font-medium">{customer.totalVisited}</p>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <QRCode value={customer.code} size={128} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Booth Hopping Report</h3>
        </div>
        
        <div className="p-4 flex justify-end">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchQuery}
              placeholder="Find booth name here..."
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
                <th className="px-4 py-2 text-left">Booth Code</th>
                <th className="px-4 py-2 text-left">Date of Visit</th>
                <th className="px-4 py-2 text-left">Time of Visit</th>
                <th className="px-4 py-2 text-left">Booth Count</th>
              </tr>
            </thead>
            <tbody>
              {!customer.boothVisits || customer.boothVisits.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-2 text-center">No booth visit records found</td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-2 text-center">No matching booth visits</td>
                </tr>
              ) : (
                currentItems.map((visit: BoothVisit, index: number) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{visit.boothName}</td>
                    <td className="px-4 py-3">{visit.boothCode}</td>
                    <td className="px-4 py-3">{visit.date}</td>
                    <td className="px-4 py-3">{visit.time}</td>
                    <td className="px-4 py-3">{visit.count}</td>
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
