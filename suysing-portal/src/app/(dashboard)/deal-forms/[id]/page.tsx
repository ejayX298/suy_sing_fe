'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaSearch, FaFilter, FaPen, FaTrash, FaPlus, FaArrowLeft } from 'react-icons/fa';
import Pagination from '@/components/ui/Pagination';
import { Product, Vendor } from '@/types';
import Swal from 'sweetalert2';
import { dealFormsApiService } from '@/services/api';
import { useAuth } from '@/lib/hooks/useAuth';



export default function VendorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params.id as string;
  const { token } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [vendor, setVendor] = useState<(Vendor & { products?: Product[] }) | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filterParams, setFilterParams] = useState({ page: 1, perpage: 10, query: '' });
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newProductCode, setNewProductCode] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [newProductDiscount, setNewProductDiscount] = useState('');

  const mockProducts: Product[] = [
    { id: '1', productCode: '55011', productName: 'Alaska Fortified Milk 600g', discount: '10%' },
    { id: '2', productCode: '55012', productName: 'Alaska Fortified Milk 1.4kg', discount: '10%' },
    { id: '3', productCode: '55013', productName: 'Alaska Classic Evaporated Filled Milk 370ml', discount: '10%' },
    { id: '4', productCode: '55014', productName: 'Alaska Classic Evaporated Filled Milk 360ml', discount: '10%' },
    { id: '5', productCode: '55015', productName: 'Alaska Fortified Powdered Filled Milk 900g', discount: '10%' },
    { id: '6', productCode: '55016', productName: 'Cowbell Condensap 360ml', discount: '10%' },
    { id: '7', productCode: '55017', productName: 'Alaska Fortified Powdered Filled Milk 500g', discount: '10%' },
    { id: '8', productCode: '55018', productName: 'Alaska Fortified Powdered Filled Milk 250ML', discount: '10%' },
  ];

  const mockVendors: (Vendor & { products?: Product[] })[] = [
    { 
      id: '1', 
      vendorCode: 'ALAS01', 
      vendorName: 'Alaska Milk Corporation',
      products: mockProducts
    },
    { id: '2', vendorCode: 'UNILE01', vendorName: 'Unilever Philippines, Inc.' },
    { id: '3', vendorCode: 'MONDE03', vendorName: 'Mondelez Philippines, Inc.' },
    { id: '4', vendorCode: 'MEGA001', vendorName: 'Mega Prime Foods Incorporated' },
    { id: '5', vendorCode: 'CENTU03', vendorName: 'Century Pacific Food, Inc.' },
    { id: '6', vendorCode: 'THEPU01', vendorName: 'The Purefoods-Hormel Co. Inc.' },
    { id: '7', vendorCode: 'ACSC401', vendorName: 'ACS Manufacturing Corporation' },
    { id: '8', vendorCode: 'COLGA01', vendorName: 'Colgate-Palmolive Phil. Inc.' },
  ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const booth_id = parseInt(vendorId);
      const boothProductsResult = await dealFormsApiService.getBoothProducts(booth_id, token, filterParams);
      
      if (boothProductsResult.success) {
        setVendor(boothProductsResult.results?.booth_info || []);
        setProducts(boothProductsResult.results?.booth_products || []);
        setCurrentPage(boothProductsResult.current_page)
        setTotalPages(boothProductsResult.total_pages)
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, [vendorId, filterParams]);

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

  // Handle add product
  const handleAddProduct = async () => {
    // Validate inputs
    if (!newProductCode.trim() || !newProductName.trim() || !newProductDiscount.trim()) {
      alert('Please fill in all fields');
      return;
    }

    let confirmAction = await confirmMessage(`Are you sure you want to add this product?`);

    if (confirmAction.isConfirmed) {

      // Create new product object
      const newProduct = {
        booth_id : vendorId,
        booth_product_code : newProductCode,
        booth_product_name : newProductName,
        booth_product_discount : newProductDiscount,
      }
      
      try {
        const boothProductDataResult = await dealFormsApiService.addBoothProduct(token, newProduct);
        
        if(boothProductDataResult.success){
            
            // Show success message
            setSuccessMessage('Product Added Successfully');
            setShowSuccessModal(true);
            
            // Refresh data
            fetchData();

        }else{
          showMessage("0" , boothProductDataResult.message)  
          
        }
        
      } catch (error) {
        // console.error('Error fetching data:', error);
        showMessage("0" , "Error adding product.")   
      }
    }
    
    setShowAddModal(false);

    // Reset form
    setNewProductCode('');
    setNewProductName('');
    setNewProductDiscount('');
     
  };

  // Debounce search input
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      setFilterParams({ ...filterParams, page: 1, query: searchQuery });
    }, 500);
    
    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  // Handle edit product
  const handleEditProduct = async () => {
    if (!selectedProduct) return;
    
    // Validate inputs
    if (!newProductCode.trim() || !newProductName.trim() || !String(newProductDiscount).trim()) {
      alert('Please fill in all fields');
      return;
    }

    const confirmAction = await confirmMessage(`Are you sure you want to update this product?`);

    if (confirmAction.isConfirmed) {

        // Update product
        const updateProduct = {
          booth_product_id : selectedProduct?.id || 0,
          booth_product_code : newProductCode,
          booth_product_name : newProductName,
          booth_product_discount : newProductDiscount,
        }
        
        try {
          const boothProductDataResult = await dealFormsApiService.updateBoothProduct(token, updateProduct);
          
          if(boothProductDataResult.success){
              
              // Show success message
              setSuccessMessage('Product Updated Successfully');
              setShowSuccessModal(true);
              
              // Refresh data
              fetchData();

          }else{
            showMessage("0" , boothProductDataResult.message)  
            
          }
          
        } catch (error) {
          // console.error('Error fetching data:', error);
          showMessage("0" , "Error updating this product.")   
        }
    }

      
    setShowEditModal(false);
    setSelectedProduct(null);
    
    // Reset form
    setNewProductCode('');
    setNewProductName('');
    setNewProductDiscount('');
    
  };

  // Handle delete product
  const handleDeleteProduct = async (product: Product) => {
    const result = await Swal.fire({
      title: 'Delete product?',
      text: 'Are you sure you want to delete this product? Once deleted, all associated data will be permanently removed and cannot be recovered.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete Product',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#193cb8',
    });

    if (result.isConfirmed) {
       // Delete product
       const deleteProduct = {
        booth_product_id : product?.id || 0,
      }
      
      try {
        const boothProductDataResult = await dealFormsApiService.deleteBoothProduct(token, deleteProduct);
        
        if(boothProductDataResult.success){
            
            // Show success message
            setSuccessMessage('Product Deleted Successfully');
            setShowSuccessModal(true);

            // Refresh data
            fetchData();

        }else{
          showMessage("0" , boothProductDataResult.message)  
          
        }
        
      } catch (error) {
        // console.error('Error fetching data:', error);
        showMessage("0" , "Error deleting this product.")   
      }
      
    }
  };

  // Open edit modal
  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setNewProductCode(product.productCode);
    setNewProductName(product.productName);
    setNewProductDiscount(product.discount);
    setShowEditModal(true);
  };

  // Handle back to list
  const handleBackToList = () => {
    router.push('/deal-forms');
  };

  // Confirmation message helper
  const confirmMessage = async (message: string) => {
    const result = await Swal.fire({
      title: 'Confirm',
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#193cb8',
    });

    return result;
  };

  const showMessage = (status: string, message : string)  => {
    
    let iconType: "success" | "error";
    let titleType: "Success" | "Error";

    if(status == "1"){
      iconType = "success";
      titleType = "Success";
    }else{
      iconType = "error";
      titleType = "Error";
    }

    Swal.fire({
      title: titleType,
      text: message,
      icon: iconType,
      confirmButtonColor: "#193cb8"
    })
}

  if (isLoading && !vendor) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading...</p>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-xl mb-4">Vendor not found</p>
        <button
          onClick={handleBackToList}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Vendors
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Vendor Info Card */}
      <div className="bg-white border border-gray-300 p-4 rounded-md">
        <div className="flex space-x-20">
          <div className="mb-2">
            <span className="font-semibold">Vendor Code:</span>
            <span className="block">{vendor.vendorCode}</span>
          </div>
          <div>
            <span className="font-semibold">Vendor Name:</span>
            <span className="block">{vendor.vendorName}</span>
          </div>
        </div>
      </div>

      {/* Product List Section */}
      <div>
        <div className="py-4 flex justify-between items-center border-b">
          <h3 className="text-lg font-semibold">Product List</h3>
          <div className="flex items-center gap-4">
          <button 
            className="inline-flex items-center px-3 py-2 bg-blue-800 text-white rounded-md"
            onClick={() => setShowAddModal(true)}
          >
            <FaPlus className="mr-2" /> Add Product
          </button>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchQuery}
                placeholder="Search product here..."
                className="pl-4 py-2 border w-64 focus:outline-none border-gray-400 focus:ring focus:ring-blue-500"
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-800" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-400">
            <thead>
              <tr className="bg-blue-800 text-white">
                <th className="px-4 py-2 text-left">Product Code</th>
                <th className="px-4 py-2 text-left">Product Name</th>
                <th className="px-4 py-2 text-left">Discount</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-center">Loading...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-center">No products found</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{product.productCode}</td>
                    <td className="px-4 py-3">{product.productName}</td>
                    <td className="px-4 py-3">{product.discount}%</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center space-x-3">
                        <button 
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => openEditModal(product)}
                        >
                          <FaPen size={16} />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteProduct(product)}
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
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

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl">
            <div className="px-6 py-4">
              <h2 className="text-[34px] font-bold">Add Product</h2>
            </div>
            <div className="border-t border-gray-400 px-6 py-5 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Product Code</label>
                  <input
                    type="text"
                    className="w-full px-2 py-4 border-gray-400 border"
                    value={newProductCode}
                    onChange={(e) => setNewProductCode(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Discount in %</label>
                  <input
                    type="number"
                    className="w-full px-2 py-4 border-gray-400 border"
                    value={newProductDiscount}
                    onChange={(e) => setNewProductDiscount(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  className="w-full px-2 py-4 border-gray-400 border"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6 mb-6">
                <button
                  className="px-6 py-2 border border-blue-700 text-blue-700"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewProductCode('');
                    setNewProductName('');
                    setNewProductDiscount('');
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 bg-blue-800 text-white"
                  onClick={handleAddProduct}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl">
            <div className="px-6 py-4">
              <h2 className="text-[34px] font-bold">Edit Product</h2>
            </div>
            <div className="border-t border-gray-400 px-6 py-5 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Product Code</label>
                  <input
                    type="text"
                    className="w-full px-2 py-4 border-gray-400 border"
                    value={newProductCode}
                    onChange={(e) => setNewProductCode(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Discount in %</label>
                  <input
                    type="number"
                    className="w-full px-2 py-4 border-gray-400 border"
                    value={newProductDiscount}
                    onChange={(e) => setNewProductDiscount(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  className="w-full px-2 py-4 border-gray-400 border"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6 mb-6">
                <button
                  className="px-6 py-2 border border-blue-700 text-blue-700"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                    setNewProductCode('');
                    setNewProductName('');
                    setNewProductDiscount('');
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 bg-blue-800 text-white"
                  onClick={handleEditProduct}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-md text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-500 rounded-full p-3 inline-flex">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-4">{successMessage}</h2>
            <button
              className="w-full py-2 bg-blue-800 text-white rounded-md"
              onClick={() => setShowSuccessModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}