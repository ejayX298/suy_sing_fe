import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

// Product interface
interface Product {
  id: string;
  itemCode: string;
  name: string;
  quantity: number;
  discount: string;
  dealerName?: string;
}

// Dealer interface
interface Dealer {
  id: string;
  name: string;
  products: Product[];
}

// Cart interface
interface Cart {
  id: string;
  customerCode: string;
  transactionType: string;
  branch: string;
  shipToAddress: string;
  selectedProducts: Product[];
}

// Initial product data
const initialProducts: Product[] = [
  {
    id: "1",
    itemCode: "55011",
    name: "Buy Alaska Fortified Milk 600g",
    quantity: 0,
    discount: "10% Discount",
  },
  {
    id: "2",
    itemCode: "55012",
    name: "Buy Alaska Fortified Milk 1.4kg",
    quantity: 0,
    discount: "10% Discount",
  },
  {
    id: "3",
    itemCode: "55013",
    name: "Alaska Classic Evaporated Filled Milk 370ml",
    quantity: 0,
    discount: "15% Discount",
  },
  {
    id: "4",
    itemCode: "55014",
    name: "Alaska Classic Evaporated Filled Milk 360ml",
    quantity: 0,
    discount: "25% Discount",
  },
  {
    id: "5",
    itemCode: "55015",
    name: "Alaska Fortified Powdered Filled Milk 900g",
    quantity: 0,
    discount: "10% Discount",
  },
  {
    id: "6",
    itemCode: "55016",
    name: "Cowbell Condensap 360ml",
    quantity: 0,
    discount: "10% Discount",
  },
  {
    id: "7",
    itemCode: "55017",
    name: "Alaska Fortified Powdered Filled Milk 500g",
    quantity: 0,
    discount: "10% Discount",
  },
  {
    id: "8",
    itemCode: "55018",
    name: "Alaska Fortified Powdered Filled Milk 250ML",
    quantity: 0,
    discount: "10% Discount",
  },
];

// Initial dealer list
const initialDealers: Dealer[] = [
  {
    id: "1",
    name: "Alaska Milk Corporation",
    products: initialProducts,
  },
  { id: "2", name: "Alce", products: [] },
  { id: "3", name: "Aji-Ginisa", products: [] },
  { id: "4", name: "AJI-NO-MOTO", products: [] },
  { id: "5", name: "Aji-Shio", products: [] },
  { id: "6", name: "B'lue", products: [] },
  { id: "7", name: "B-Meg", products: [] },
  { id: "8", name: "Barrio Fiesta", products: [] },
  { id: "9", name: "Cadbury", products: [] },
  { id: "10", name: "CDO Foodsphere", products: [] },
  { id: "11", name: "Cerelac", products: [] },
];

// Sample branches and shipping addresses
const branches = ["Quezon City", "Makati", "Pasig", "Mandaluyong", "Taguig"];
const shippingAddresses = ["123 Main St, Quezon City", "456 Ayala Ave, Makati", "789 Ortigas Center, Pasig", "101 Shaw Blvd, Mandaluyong"];

// Component props
interface ProductSelectionProps {
  customerCode: string;
  transactionType: string;
  branch: string;
  shipToAddress: string;
  onNext: () => void;
  onPrevious: () => void;
  // New props
  currentCartIndex?: number;
  carts?: Cart[];
  selectedProducts?: Product[];
  onCreateNewCart?: () => void;
  onUpdateCart?: (cartIndex: number, products: Product[]) => void;
  onNavigateCart?: (direction: "prev" | "next") => void;
  maxCartsReached?: boolean;
  onTransactionTypeChange?: (type: string) => void;
  onBranchChange?: (branch: string) => void;
  onShipToAddressChange?: (address: string) => void;
}

export default function ProductSelection({
  customerCode,
  transactionType,
  branch,
  shipToAddress,
  onNext,
  currentCartIndex = 0,
  carts = [],
  selectedProducts = [],
  onCreateNewCart = () => {},
  onUpdateCart = () => {},
  onNavigateCart = () => {},
  maxCartsReached = false,
  onTransactionTypeChange = () => {},
  onBranchChange = () => {},
  onShipToAddressChange = () => {},
}: ProductSelectionProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const [products, setProducts] = useState<Product[]>(
    selectedProducts.length > 0
      ? selectedProducts
      : initialProducts.map((p) => ({ ...p }))
  );
  const [dealers] = useState<Dealer[]>(initialDealers);
  const [expandedDealers, setExpandedDealers] = useState<string[]>(["1"]);
  

  const [isTransactionTypeOpen, setIsTransactionTypeOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isShippingDropdownOpen, setIsShippingDropdownOpen] = useState(false);
  
  const transactionTypeRef = useRef<HTMLDivElement>(null);
  const branchDropdownRef = useRef<HTMLDivElement>(null);
  const shippingDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedProducts && selectedProducts.length > 0) {
      console.log("ProductSelection received products:", selectedProducts);
      setProducts(selectedProducts);
    }
  }, [selectedProducts]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (transactionTypeRef.current && !transactionTypeRef.current.contains(event.target as Node)) {
        setIsTransactionTypeOpen(false);
      }
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target as Node)) {
        setIsBranchDropdownOpen(false);
      }
      if (shippingDropdownRef.current && !shippingDropdownRef.current.contains(event.target as Node)) {
        setIsShippingDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleQuantityChange = (
    id: string,
    newQuantity: number,
    dealerName: string = "Alaska Milk Corporation"
  ) => {
    if (newQuantity >= 0) {
      // Update local state
      const updatedProducts = products.map((product) =>
        product.id === id
          ? { ...product, quantity: newQuantity, dealerName }
          : product
      );
      setProducts(updatedProducts);

      // Update the cart with current products
      if (onUpdateCart) {
        onUpdateCart(currentCartIndex, updatedProducts);
      }
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Toggle dealer expansion
  const toggleDealer = (dealerId: string) => {
    if (expandedDealers.includes(dealerId)) {
      setExpandedDealers(expandedDealers.filter((id) => id !== dealerId));
    } else {
      setExpandedDealers([...expandedDealers, dealerId]);
    }
  };

  // Create new cart
  const handleCreateNewCart = () => {
    onCreateNewCart();
  };

  // Navigate to previous or next cart
  const handleNavigateCart = (direction: "prev" | "next") => {
    onNavigateCart(direction);
  };

  // Handle transaction type selection
  const handleTransactionTypeSelect = (type: string) => {
    onTransactionTypeChange(type);
    setIsTransactionTypeOpen(false);
  };

  // Handle branch selection
  const handleBranchSelect = (selectedBranch: string) => {
    onBranchChange(selectedBranch);
    setIsBranchDropdownOpen(false);
  };

  // Handle shipping address selection
  const handleShippingAddressSelect = (address: string) => {
    onShipToAddressChange(address);
    setIsShippingDropdownOpen(false);
  };

  const filteredDealers = dealers.filter((dealer) =>
    dealer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-4 ">
      <div className="mb-4 flex gap-1">
        <div className="flex-1 bg-white border-2 border-[#7D7D7D] p-4 rounded-sm">
          <div className="flex flex-row justify-between">
            <div className="flex-1">
              <div className="flex flex-col">
                <span className="text-black text-sm">Customer Code:</span>
                <span className="text-black font-bold  text-sm">
                  {customerCode}
                </span>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col">
                <span className="text-black text-sm">Transaction Type:</span>
                <div className="relative" ref={transactionTypeRef}>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => setIsTransactionTypeOpen(!isTransactionTypeOpen)}
                  >
                    <span className="text-black font-bold text-sm">
                      {transactionType}
                    </span>
                    <span className="text-[#F78B1E] ml-2 text-sm">▼</span>
                  </div>
                  
                  {isTransactionTypeOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                      {["Pick up", "Delivery"].map((type) => (
                        <div
                          key={type}
                          className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${transactionType === type ? 'bg-gray-100' : ''}`}
                          onClick={() => handleTransactionTypeSelect(type)}
                        >
                          <span className="text-black text-sm">{type}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {transactionType === "Pick up" && (
            <div className="flex flex-col mt-4">
              <span className="text-black text-sm">Branch:</span>
              <div className="relative" ref={branchDropdownRef}>
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                >
                  <span className="text-black font-bold text-sm">{branch}</span>
                  <span className="text-[#F78B1E] ml-2 text-sm">▼</span>
                </div>
                
                {isBranchDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {branches.map((branchOption) => (
                      <div
                        key={branchOption}
                        className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${branch === branchOption ? 'bg-gray-100' : ''}`}
                        onClick={() => handleBranchSelect(branchOption)}
                      >
                        <span className="text-black text-sm">{branchOption}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {transactionType === "Delivery" && (
            <div className="flex flex-col mt-4">
              <span className="text-black text-sm">Ship to Address:</span>
              <div className="relative" ref={shippingDropdownRef}>
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => setIsShippingDropdownOpen(!isShippingDropdownOpen)}
                >
                  <span className="text-black font-bold text-sm">
                    {shipToAddress}
                  </span>
                  <span className="text-[#F78B1E] ml-2 text-sm">▼</span>
                </div>
                
                {isShippingDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {shippingAddresses.map((address) => (
                      <div
                        key={address}
                        className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${shipToAddress === address ? 'bg-gray-100' : ''}`}
                        onClick={() => handleShippingAddressSelect(address)}
                      >
                        <span className="text-black text-sm">{address}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="bg-white border-2 border-[#7D7D7D] py-2 px-4 rounded-sm flex flex-col items-center justify-center w-27">
            <button
              onClick={handleCreateNewCart}
              className={`rounded-full size-8 flex items-center justify-center mb-1 ${
                maxCartsReached
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-900"
              }`}
              disabled={maxCartsReached}
            >
              <span className="text-white text-2xl">+</span>
            </button>
            <span
              className={`text-xs text-center ${
                maxCartsReached ? "text-gray-400" : "text-black"
              }`}
            >
              Create <br />
              new cart
            </span>
          </div>

          {/* Show both Prev and Next buttons when in the middle of carts */}
          {carts.length > 1 &&
            currentCartIndex > 0 &&
            currentCartIndex < carts.length - 1 && (
              <div className="flex gap-1 mt-1">
                <div className="bg-white border-2 border-[#7D7D7D] p-2 rounded-sm flex flex-col items-center justify-center">
                  <button
                    onClick={() => handleNavigateCart("prev")}
                    className="bg-blue-900 size-8 flex items-center justify-center text-white"
                  >
                    <span className="text-2xl font-bold">←</span>
                  </button>
                  <span className="text-black text-xs mt-1">Prev</span>
                </div>

                <div className="bg-white border-2 border-[#7D7D7D] p-2 rounded-sm flex flex-col items-center justify-center">
                  <button
                    onClick={() => handleNavigateCart("next")}
                    className="bg-blue-900 size-8 flex items-center justify-center text-white"
                  >
                    <span className="text-2xl font-bold">→</span>
                  </button>
                  <span className="text-black text-xs mt-1">Next</span>
                </div>
              </div>
            )}

          {/* Show only Next button when on the first cart */}
          {carts.length > 1 && currentCartIndex === 0 && (
            <div className="flex gap-1 mt-1">
              <div className="bg-white border-2 border-[#7D7D7D] p-2 rounded-sm flex flex-col items-center justify-center">
                <button
                  onClick={() => handleNavigateCart("next")}
                  className="bg-blue-900 size-8 flex items-center justify-center text-white"
                >
                  <span className="text-2xl font-bold">→</span>
                </button>
                <span className="text-black text-xs mt-1">Next</span>
              </div>
            </div>
          )}

          {/* Show only Prev button when on the last cart */}
          {carts.length > 1 &&
            currentCartIndex === carts.length - 1 &&
            currentCartIndex !== 0 && (
              <div className="flex gap-1 mt-1">
                <div className="bg-white border-2 border-[#7D7D7D] p-2 rounded-sm flex flex-col items-center justify-center">
                  <button
                    onClick={() => handleNavigateCart("prev")}
                    className="bg-blue-900 size-8 flex items-center justify-center text-white"
                  >
                    <span className="text-2xl font-bold">←</span>
                  </button>
                  <span className="text-black text-xs mt-1">Prev</span>
                </div>
              </div>
            )}
        </div>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Find Dealer..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-2 rounded-sm text-black bg-white border-2 border-[#7D7D7D] focus:outline-none "
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="size-8 flex items-center justify-center">
            <Image
              src="/images/search.svg"
              alt="Check Icon"
              width={24}
              height={24}
              className="mr-2"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {filteredDealers.map((dealer) => (
          <div
            key={dealer.id}
            className="border-2 border-[#7D7D7D] rounded-md overflow-hidden"
          >
            <div
              className="p-3 flex justify-between items-center cursor-pointer bg-white"
              onClick={() => toggleDealer(dealer.id)}
            >
              <h3 className="text-black font-medium">{dealer.name}</h3>
              <span className="text-[#7D7D7D] text-xs">
                {expandedDealers.includes(dealer.id) ? "▲" : "▼"}
              </span>
            </div>

            {expandedDealers.includes(dealer.id) && (
              <div className="grid grid-cols-1 gap-2  bg-white">
                {dealer.id === "1" ? (
                  products.map((product) => (
                    <div
                      key={product.id}
                      className="border-2 py-2 flex flex-col border-t-[#7D7D7D]"
                    >
                      <div className="flex justify-between items-center p-2">
                        <div className="space-y-1">
                          <p className="text-sm text-black ">
                            Item Code:{" "}
                            <span className="font-bold">
                              {product.itemCode}
                            </span>
                          </p>
                          <p className="text-black font-light">
                            {product.name}
                          </p>
                          <p className="text-sm font-bold text-black">
                            {product.discount}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                product.id,
                                product.quantity - 1,
                                dealer.name
                              )
                            }
                            className="bg-[#F78B1E] text-white size-6 font-bold flex items-center justify-center rounded"
                          >
                            -
                          </button>
                          <span className="text-black font-bold text-2xl w-8 text-center">
                            {product.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                product.id,
                                product.quantity + 1,
                                dealer.name
                              )
                            }
                            className="bg-[#F78B1E] text-white size-6 font-bold flex items-center justify-center rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-black font-light border-2 rounded-md">
                    No products available for this dealer
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="fixed right-0 top-1/3 bg-transparent flex flex-col text-xs">
        {[
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
          "P",
          "Q",
          "R",
          "S",
          "T",
          "U",
          "V",
          "W",
          "X",
          "Y",
          "Z",
        ].map((letter) => (
          <div key={letter} className="p-1 text-blue-500 font-medium">
            {letter}
          </div>
        ))}
      </div>

      {products.some((product) => product.quantity > 0) && (
        <button
          onClick={onNext}
          className="w-full bg-[#F78B1E] py-3 text-black font-bold text-center rounded-md text-lg"
        >
          Confirm
        </button>
      )}
    </div>
  );
}
