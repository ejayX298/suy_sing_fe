import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface DealSubmittedProps {
  isOpen: boolean;
  onClose: () => void;
}

const DealSubmitted: React.FC<DealSubmittedProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  let stored_hash_code: any = ""
  if (typeof window !== 'undefined') {
    stored_hash_code = localStorage.getItem('hash_code');
  }

  if (!isOpen) return null;

  const handleContinue = () => {
    // Clear any saved form data before navigating away
    localStorage.removeItem("dealformCarts");
    onClose();
    // Navigate to home page
    router.push(`/?cc=${stored_hash_code}`);
  };

  return (
    <div className="fixed inset-0  z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-md ">
      <div className="bg-white py-6 border-2 border-[#F78B1E] rounded-lg w-11/12 max-w-md flex flex-col items-center overflow-hidden shadow-xl">
        {/* Thank you image */}
        <div className="mb-2">
          <Image
            src="/images/thankyou.svg"
            alt="Deal Submitted"
            width={150}
            height={150}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col w-full px-8 py-2 pb-0">
          <h2 className="text-3xl sm:text-[34px] font-bold text-center text-black">
            Deal Form Submitted
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm text-center mb-2">
            Please check your email for confirmation.
          </p>
        </div>
        <div className="w-full px-8 py-4">
          <button
            onClick={handleContinue}
            className="w-full bg-[#F78B1E] py-3 text-black font-bold text-center rounded-md text-lg"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default DealSubmitted;
