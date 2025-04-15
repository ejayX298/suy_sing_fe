import React from "react";

interface PickUpFormProps {
  customerCode: string;
  transactionType: string;
  branch: string;
  remarks: string;
  transactionTypes: string[];
  customerPickupDetails : CustomerPickupDetails[];
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onNext: () => void;
}

interface CustomerPickupDetails {
  id: string;
  cp_type: string;
  branch_code: string;
}

export default function PickUpForm({
  customerCode,
  transactionType,
  branch,
  remarks,
  onInputChange,
  onSelectChange,
  onNext,
  transactionTypes,
  customerPickupDetails,
}: PickUpFormProps) {
  return (
    <div className="bg-white rounded-md border-2 border-gray-400 shadow-sm overflow-hidden max-w-2xl mx-auto">
      <div className="px-6 mt-6">
        <h2 className="text-2xl font-bold text-black text-left">Deal Form</h2>
      </div>
      <div className="px-6 space-y-5 py-4 font-light">
        <div>
          <label
            htmlFor="customerCode"
            className="block text-sm  text-black mb-2"
          >
            Customer Code
          </label>
          <input
            type="text"
            id="customerCode"
            name="customerCode"
            value={customerCode}
            className="w-full px-3  py-4 border border-gray-400 rounded-md focus:outline-none text-black"
            readOnly
          />
        </div>

        <div>
          <label
            htmlFor="transactionType"
            className="block text-sm  text-black mb-2"
          >
            Transaction Type
          </label>
          {/* <input
            type="text"
            id="transactionType"
            name="transactionType"
            value={transactionType}
            className="w-full px-3 py-4 border  border-gray-400 rounded-md focus:outline-none text-black"
            readOnly
          /> */}

          <select
            id="transactionType"
            name="transactionType"
            value={transactionType}
            onChange={onSelectChange}
            className="w-full px-3 py-4 border border-gray-400 rounded-md text-black focus:outline-none"
          >
            {/* <option value="" disabled></option> */}
            {transactionTypes.map((transactionTypeName, index) => (
              <option key={index} value={transactionTypeName}>
                {transactionTypeName}
              </option>
            ))}
          </select>


        </div>

        <div>
          <label htmlFor="branch" className="block text-sm  text-black mb-2">
            Branch
          </label>
          <select
            id="branch"
            name="branch"
            value={branch}
            onChange={onSelectChange}
            className="w-full px-3 py-4 border  border-gray-400 rounded-md focus:outline-none text-black"
          >
            {/* <option value=""></option> */}
            {customerPickupDetails.map((customerPickup, index) => (
              <option key={index} value={customerPickup.id}>
                {customerPickup.branch_code}
              </option>
            ))}
          </select>
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
