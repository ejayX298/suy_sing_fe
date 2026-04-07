import React from "react";

interface PickUpFormProps {
  customerCode: string;
  customerSubCode: string;
  customerSubCodeId : string;
  email: string;
  transactionType: string;
  branch: string;
  remarks: string;
  transactionTypes: string[];
  customerPickupDetails: CustomerPickupDetails[];
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onNext: () => void;
  subCodes: SubCode[];
  onCustomerCodeChange?: (e: React.ChangeEvent<HTMLSelectElement>)  => void;
}

interface CustomerPickupDetails {
  id: string;
  cp_type: string;
  branch_code: string;
}

interface SubCode {
  id: number;
  code: string;
  transaction_type: string;
  ship_to: string | null;
  payment_code: string;
}

export default function PickUpForm({
  customerCode,
  customerSubCode,
  customerSubCodeId,
  email,
  transactionType,
  branch,
  remarks,
  onInputChange,
  onSelectChange,
  onNext,
  transactionTypes,
  customerPickupDetails,
  subCodes = [],
  onCustomerCodeChange,
}: PickUpFormProps) {
  // const [showInfo, setShowInfo] = useState(false);
  return (
    <div className="bg-white rounded-md border-2 border-gray-400 shadow-sm overflow-hidden max-w-2xl mx-auto">
      <div className="px-6 mt-6">
        <h2 className="text-2xl font-bold text-black text-left">Deal Form</h2>
      </div>
      <div className="px-6 space-y-5 py-4 font-light">
          {/* <label
            htmlFor="customerCode"
            className="block text-sm  text-black mb-2"
          >
            Customer Code
          </label> */}
          <input
            type="hidden"
            id="customerCode"
            name="customerCode"
            value={customerCode}
            className="w-full px-3  py-4 border border-gray-400 rounded-md focus:outline-none text-black"
            readOnly
          />
          {/* <input
            type="text"
            id="customerSubCode"
            name="customerSubCode"
            value={customerSubCode}
            className="w-full px-3  py-4 border border-gray-400 rounded-md focus:outline-none text-black"
            readOnly
          />
         */}

        <div>
          <label
            htmlFor="customerSubCodeId"
            className="block text-sm  text-black mb-2"
          >
            Customer Code
          </label>
          {subCodes.length > 0 ?(

              <div className="relative">
                <select
                  id="customerSubCodeId"
                  name="customerSubCodeId"
                  value={customerSubCodeId}
                  onChange={onCustomerCodeChange}
                  className="w-full px-3 py-4 border border-gray-400 rounded-md text-black focus:outline-none appearance-none"
                >
                  {subCodes.map((subCodeOption, index) => (
                    <option key={index} value={subCodeOption.id}>
                      {subCodeOption.code}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>

          ) : (

              <input
                type="text"
                id="customerSubCode"
                name="customerSubCode"
                value={customerSubCode}
                className="w-full px-3  py-4 border border-gray-400 rounded-md focus:outline-none text-black"
                readOnly
              />

          )}

        </div>

        <div>
          <label
            htmlFor="transactionType"
            className="block text-sm  text-black mb-2"
          >
            Transaction Type
          </label>
          <div className="relative">
            <select
              id="transactionType"
              name="transactionType"
              value={transactionType}
              onChange={onSelectChange}
              className="w-full px-3 py-4 border border-gray-400 rounded-md text-black focus:outline-none appearance-none"
            >
              {transactionTypes.map((transactionTypeName, index) => (
                <option key={index} value={transactionTypeName}>
                  {transactionTypeName}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="branch" className="block text-sm  text-black mb-2">
            Branch
          </label>
          <div className="relative">
            <select
              id="branch"
              name="branch"
              value={branch}
              onChange={onSelectChange}
              className="w-full px-3 py-4 border border-gray-400 rounded-md focus:outline-none text-black appearance-none"
            >
              {customerPickupDetails.map((customerPickup, index) => (
                <option key={index} value={customerPickup.id}>
                  {customerPickup.branch_code}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm text-black mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onInputChange}
            className="w-full px-3 py-4 border border-gray-400 rounded-md focus:outline-none text-black"
          />
        </div>

        <div>
          <label htmlFor="remarks" className="block text-sm  text-black mb-2">
            Remarks
          </label>
          <textarea
            id="remarks"
            name="remarks"
            value={remarks}
            onChange={onInputChange}
            rows={4}
            className="w-full  px-3 py-4 border border-gray-400 rounded-md focus:outline-none text-black"
          />
        </div>
      </div>
      <div className="px-6 pb-10">
        <button
          onClick={onNext}
          className="w-full bg-[#F78B1E] py-3 text-black rounded-md text-center"
        >
          Next
        </button>
      </div>
    </div>
  );
}
