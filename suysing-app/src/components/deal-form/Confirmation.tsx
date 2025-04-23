import React from "react";

interface Product {
  id: string;
  itemCode: string;
  name: string;
  quantity: number;
  discount: string;
  dealerName?: string;
  dealerId?: string;
}

interface Cart {
  id: string;
  customerCode: string;
  transactionType: string;
  branch: string;
  shipToAddress: string;
  selectedProducts: Product[];
}

interface FormData {
  customerCode: string;
  transactionType: string;
  branch: string;
  shipToAddress: string;
  remarks: string;
  carts?: Cart[];
  selectedProducts?: Product[];
}

interface CustomerPickupDetails {
  id: string;
  cp_type: string;
  branch_code: string;
}

interface CustomerDeliveryDetails {
  id: string;
  code: string;
  ship_to_id: string;
  cd_type: string;
  branch_code: string;
  address: string;
}

interface ConfirmationProps {
  formData: FormData;
  onSubmit: () => void;
  onInputChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSelectChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  carts?: Cart[];
  currentCartIndex?: number;
  onNavigateCart?: (direction: "prev" | "next") => void;
  onCreateNewCart?: () => void;
  maxCartsReached?: boolean;
  transactionTypes: string[];
  branch: string;
  shipToAddress: string;
  customerPickupDetails: CustomerPickupDetails[];
  customerDeliveryDetails: CustomerDeliveryDetails[];
  shipToAddressId: string;
  branchId: string;
  onNavigateToProducts?: () => void;
}

export default function Confirmation({
  formData,
  onSubmit,
  onSelectChange = () => {},
  carts = [],
  currentCartIndex = 0,
  onNavigateCart = () => {},
  onCreateNewCart = () => {},
  transactionTypes,
  shipToAddressId,
  branchId,
  customerPickupDetails,
  customerDeliveryDetails,
  onNavigateToProducts = () => {},
}: ConfirmationProps) {
  // Get products with quantities greater than 0 from formData
  const products =
    formData.selectedProducts?.filter((product) => product.quantity > 0) || [];

  // Group the products by dealer
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const groupedByDealer = products.reduce((acc: any, item) => {
    const dealerId: string = item.dealerId ?? "";
    if (dealerId == "") return {};
    if (!acc[dealerId]) {
      acc[dealerId] = {
        dealerId: dealerId,
        dealerName: item.dealerName,
        products: [],
      };
    }
    acc[dealerId].products.push(item);
    return acc;
  }, {});

  const handleBack = () => {
    onNavigateToProducts();
  };

  return (
    <div className="flex flex-col space-y-4 min-h-screen">
      {/* Header info */}
      <div className="mb-4 flex gap-1">
        <div className="flex-1 bg-white border-2 border-[#7D7D7D] p-4 rounded-sm">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <span className="text-black text-sm">Customer Code:</span>
              <span className="text-black font-bold text-sm">
                {formData.customerCode}
              </span>
            </div>

            <div className="mt-4">
              <div className="flex flex-col">
                <span className="text-black text-sm">Transaction Type:</span>
                <div className="relative">
                  <select
                    name="transactionType"
                    value={formData.transactionType}
                    onChange={onSelectChange}
                    className="block w-full appearance-none border-none bg-transparent pr-8 focus:outline-none text-black font-bold text-sm"
                  >
                    {transactionTypes.map((transactionTypeName, index) => (
                      <option key={index} value={transactionTypeName}>
                        {transactionTypeName}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#F78B1E]">
                    ▼
                  </div>
                </div>
              </div>
            </div>
          </div>

          {formData.transactionType === "Pick up" && (
            <div className="flex flex-col mt-4">
              <span className="text-black text-sm">Branch:</span>
              <div className="relative">
                <select
                  name="branch"
                  value={branchId}
                  onChange={onSelectChange}
                  className="block w-full appearance-none border-none bg-transparent pr-8 focus:outline-none text-black font-bold text-sm"
                >
                  {customerPickupDetails.map((customerPickup, index) => (
                    <option key={index} value={customerPickup.id}>
                      {customerPickup.branch_code}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#F78B1E]">
                  ▼
                </div>
              </div>
            </div>
          )}

          {formData.transactionType === "Delivery" && (
            <div className="flex flex-col mt-4">
              <span className="text-black text-sm">Ship to Address:</span>
              <div className="relative">
                <select
                  name="shipToAddress"
                  value={shipToAddressId}
                  onChange={onSelectChange}
                  className="block w-full appearance-none border-none bg-transparent pr-8 focus:outline-none text-black font-bold text-sm"
                >
                  {customerDeliveryDetails.map((customerDelivery, index) => (
                    <option key={index} value={customerDelivery.id}>
                      {customerDelivery.address}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#F78B1E]">
                  ▼
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="bg-white border-2 border-[#7D7D7D] p-4 rounded-sm flex flex-col items-center justify-center h-full">
            <button
              onClick={onCreateNewCart}
              className={`rounded-full size-10 flex items-center justify-center ${
                carts.length >= 3
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-900"
              }`}
              disabled={carts.length >= 3}
            >
              <span className="text-white text-3xl">+</span>
            </button>
            <span
              className={`text-xs text-center mt-1 ${
                carts.length >= 3 ? "text-gray-400" : "text-black"
              }`}
            >
              Create
              <br />
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
                    onClick={() => onNavigateCart("prev")}
                    className="bg-blue-900 size-8 flex items-center justify-center text-white"
                  >
                    ◀
                  </button>
                  <span className="text-black text-xs mt-1">Prev</span>
                </div>

                <div className="bg-white border-2 border-[#7D7D7D] p-2 rounded-sm flex flex-col items-center justify-center">
                  <button
                    onClick={() => onNavigateCart("next")}
                    className="bg-blue-900 size-8 flex items-center justify-center text-white"
                  >
                    ▶
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
                  onClick={() => onNavigateCart("next")}
                  className="bg-blue-900 size-8 flex items-center justify-center text-white"
                >
                  ▶
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
                    onClick={() => onNavigateCart("prev")}
                    className="bg-blue-900 size-8 flex items-center justify-center text-white"
                  >
                    ◀
                  </button>
                  <span className="text-black text-xs mt-1">Prev</span>
                </div>
              </div>
            )}
        </div>
      </div>

      <div className="bg-white border-2 border-[#7D7D7D] rounded-sm overflow-hidden p-3">
        <h2 className="text-lg font-bold text-black">Order Summary</h2>
      </div>

      {products.length > 0 &&
        Object.values(groupedByDealer).map((dealer: any, index) => (
          <div
            className="bg-white border-2 border-[#7D7D7D] rounded-sm overflow-hidden "
            key={index}
          >
            <div className="p-4 border-b border-[#7D7D7D]">
              <div className="font-bold text-black">{dealer?.dealerName}</div>
            </div>

            {/* Product items */}
            <div>
              {dealer?.products
                .filter((p: { quantity: number }) => p.quantity > 0)
                .map(
                  (product: {
                    id: string;
                    itemCode: string;
                    name: string;
                    discount: string;
                    quantity: number;
                  }) => (
                    <div
                      key={product.id}
                      className="border-t border-[#E5E5E5] p-4"
                    >
                      <div className="text-sm text-black">
                        {product.itemCode}
                      </div>
                      <div className="text-black">{product.name}</div>
                      <div className="flex justify-between items-start mt-1">
                        <div className="text-sm text-black">
                          {product.discount}
                        </div>
                        <div className="font-bold text-xl text-black">
                          x{product.quantity}
                        </div>
                      </div>
                    </div>
                  )
                )}
            </div>
          </div>
        ))}
      <div className="px-2 pb-4 flex gap-4 ">
        <button
          onClick={handleBack}
          className="w-full py-1 bg-white border-2 border-[#F78B1E] text-[#F78B1E] rounded-lg text-lg font-medium"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          className="w-full bg-[#F78B1E] py-3 text-black font-bold text-center rounded-md text-lg"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
