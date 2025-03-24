import React from "react";

interface TermsAndConditionsProps {
  acceptTerms: boolean;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
}

export default function TermsAndConditions({
  acceptTerms,
  onCheckboxChange,
  onNext,
}: TermsAndConditionsProps) {
  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden ">
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4 text-black">
          Terms & Conditions
        </h3>
        <ol className="list-decimal pl-6 space-y-3 mb-6 font-light text-black">
          <li>
            You may edit your orders after submission. Please refer to the
            instructions given to you for the steps.
          </li>
          <li>
            Submit this Form until 7:00pm today only. Forms submitted after the
            deadline will not be accepted.
          </li>
          <li>
            This serves as your proposed order. Fulfillment of order is subject
            to allocation and overall availability per branch.
          </li>
          <li>Discounts may vary per warehouse.</li>
          <li>Contact your Account Officer for more details.</li>
        </ol>
        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="acceptTerms"
            name="acceptTerms"
            checked={acceptTerms}
            onChange={onCheckboxChange}
            className="h-5 w-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
          />
          <label htmlFor="acceptTerms" className="ml-2 text-sm text-black">
            I accept the Terms and Conditions
          </label>
        </div>
      </div>
      <div className="px-6 pb-10">
        <button
          onClick={onNext}
          className="w-full bg-[#F78B1E] py-3 font-medium text-center text-black rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
}
