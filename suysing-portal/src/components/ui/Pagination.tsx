'use client';

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getPaginationRange } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pageNumbers = getPaginationRange(totalPages, currentPage);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-end space-x-1 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-8 h-8 text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200"
      >
        <FaChevronLeft className="w-3 h-3" />
      </button>

      {pageNumbers.map((page, index) => (
        <button
          key={index}
          onClick={() => onPageChange(page)}
          className={`flex items-center justify-center w-8 h-8 text-sm rounded-md ${
            currentPage === page
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-8 h-8 text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200"
      >
        <FaChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
}
