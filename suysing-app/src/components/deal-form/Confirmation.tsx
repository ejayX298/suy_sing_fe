import React from "react";
import Image from "next/image";

interface Product {
  id: string;
  itemCode: string;
  name: string;
  quantity: number;
  discount: string;
  dealerName?: string;
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
}

export default function Confirmation({
  formData,
  onSubmit,

  onSelectChange = () => {},
  carts = [],
  currentCartIndex = 0,
  onNavigateCart = () => {},
  onCreateNewCart = () => {},
}: ConfirmationProps) {
  // Get products with quantities greater than 0 from formData
  const products =
    formData.selectedProducts?.filter((product) => product.quantity > 0) || [];

  return (
    <div className="flex flex-col space-y-4 min-h-screen">
      {/* Header info */}
      <div className="mb-4 flex gap-1">
        <div className="flex-1 bg-white border-2 border-[#7D7D7D] p-4 rounded-sm">
          <div className="flex flex-row justify-between">
            <div className="flex-1">
              <div className="flex flex-col">
                <span className="text-black text-sm">Customer Code:</span>
                <span className="text-black font-bold text-sm">
                  {formData.customerCode}
                </span>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col">
                <span className="text-black text-sm">Transaction Type:</span>
                <div className="relative">
                  <select
                    name="transactionType"
                    value={formData.transactionType}
                    onChange={onSelectChange}
                    className="block w-full appearance-none border-none bg-transparent pr-8 focus:outline-none text-black font-bold text-sm"
                  >
                    <option value="Pick up">Pick Up</option>
                    <option value="Delivery">Delivery</option>
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
                  value={formData.branch}
                  onChange={onSelectChange}
                  className="block w-full appearance-none border-none bg-transparent pr-8 focus:outline-none text-black font-bold text-sm"
                >
                  <option value="Quezon City">Quezon City</option>
                  <option value="Makati">Makati</option>
                  <option value="Manila">Manila</option>
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
              <span className="text-black font-bold text-sm">
                {formData.shipToAddress}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="bg-white border-2 border-[#7D7D7D] py-2 px-4 rounded-sm flex flex-col items-center justify-center w-27">
            {/* Always show button but disable when at max carts */}
            <button
              onClick={onCreateNewCart}
              className={`rounded-full size-8 flex items-center justify-center mb-1 ${
                carts.length >= 3
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-900"
              }`}
              disabled={carts.length >= 3}
            >
              <span className="text-white text-2xl">+</span>
            </button>
            <span
              className={`text-xs text-center ${
                carts.length >= 3 ? "text-gray-400" : "text-black"
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

      <div className="bg-white border-2 border-[#7D7D7D] rounded-sm overflow-hidden p-4">
        <div className="flex items-center gap-2">
          <Image
            src="/images/order-summary.svg"
            alt="Order Summary"
            width={70}
            height={70}
          />
          <h2 className="text-lg font-bold text-black">Order Summary</h2>
        </div>
      </div>

      {products.length > 0 && (
        <div className="bg-white border-2 border-[#7D7D7D] rounded-sm overflow-hidden ">
          <div className="p-4 border-b border-[#7D7D7D]">
            <div className="font-bold text-black">
              {products[0]?.dealerName}
            </div>
          </div>

          {/* Product items */}
          <div>
            {products
              .filter((p) => p.quantity > 0)
              .map((product) => (
                <div key={product.id} className="border-t border-[#E5E5E5] p-4">
                  <div className="text-sm text-black">{product.itemCode}</div>
                  <div className="text-black">{product.name}</div>
                  <div className="flex justify-between items-start mt-1">
                    <div className="text-sm text-black">{product.discount}</div>
                    <div className="font-bold text-xl text-black">
                      x{product.quantity}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      <div className="py-2">
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
