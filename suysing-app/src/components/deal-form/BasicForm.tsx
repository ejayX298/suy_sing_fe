import React from "react";

interface BasicFormProps {
  customerCode: string;
  transactionType: string;
  remarks: string;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onNext: () => void;
}

export default function BasicForm({
  customerCode,
  transactionType,
  remarks,
  onInputChange,
  onSelectChange,
  onNext,
}: BasicFormProps) {
  return (
    <div className="bg-white rounded-md border-2 border-gray-400 shadow-sm overflow-hidden max-w-2xl mx-auto">
      <div className="px-6 mt-6">
        <h2 className="text-2xl font-bold text-black text-left">Deal Form</h2>
      </div>
      <div className="px-6 space-y-5 py-4 font-light">
        <div>
          <label
            htmlFor="customerCode"
            className="block text-sm text-black mb-2"
          >
            Customer Code
          </label>
          <input
            type="text"
            id="customerCode"
            name="customerCode"
            value={customerCode}
            onChange={onInputChange}
            className="w-full px-3 py-3 border border-gray-400 rounded-md text-black focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="transactionType"
            className="block text-sm mb-2 text-black"
          >
            Transaction Type
          </label>
          <select
            id="transactionType"
            name="transactionType"
            value={transactionType}
            onChange={onSelectChange}
            className="w-full px-3 py-4 border border-gray-400 rounded-md text-black focus:outline-none"
          >
            <option value=""></option>
            <option value="Pick up">Pick up</option>
            <option value="Delivery">Delivery</option>
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
            className="w-full px-3 py-4 border border-gray-400 rounded-md text-black focus:outline-none"
          />
        </div>
      </div>
      <div className="px-6 pb-10">
        <button
          onClick={onNext}
          className="w-full bg-[#F78B1E] py-3 text-black font-medium text-center rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
}
