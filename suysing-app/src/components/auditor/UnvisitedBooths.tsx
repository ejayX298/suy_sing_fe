"use client";
import { useState } from "react";
import Image from "next/image";

interface BoothInfo {
  name: string;
  code: string;
  checked?: boolean;
}

interface UnvisitedBoothsProps {
  customerCode: string;
  customerName: string;
  booths: BoothInfo[];
  onComplete: () => void;
  onBoothToggle: (name: string, isVisited: boolean) => void;
}

export default function UnvisitedBooths({
  customerCode,
  customerName,
  booths,
  onComplete,
  onBoothToggle,
}: UnvisitedBoothsProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleBoothToggle = (booth: BoothInfo) => {
    // Toggle the check state without removing from list
    onBoothToggle(booth.name, !booth.checked);
  };

  const filteredBooths = booths.filter(booth =>
    booth.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if all booths are checked (ready to be marked as visited)
  const allChecked = booths.length > 0 && booths.every(booth => booth.checked);

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-4">
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Customer Code</label>
            <p className="font-semibold">{customerCode}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Customer Name</label>
            <p className="font-semibold">{customerName}</p>
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
                alt="Search Icon"
                width={24}
                height={24}
                className="mr-2"
              />
            </div>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto mb-4">
          {filteredBooths.length > 0 ? (
            <table className="w-full">
              <thead className="sticky top-0 bg-gray-50">
                <tr>
                  <th className="p-2 text-center w-16">Visited</th>
                  <th className="p-2 text-left">Booth Name</th>
                  <th className="p-2 text-left">Booth Code</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooths.map((booth) => (
                  <tr key={booth.code} className="border-t">
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={booth.checked || false}
                        onChange={() => handleBoothToggle(booth)}
                        className="h-5 w-5 accent-orange-500"
                      />
                    </td>
                    <td className="p-2">{booth.name}</td>
                    <td className="p-2">{booth.code}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-4 text-gray-500">
              {searchTerm ? "No booths match your search" : "No booths to display"}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onComplete}
        className={`w-full rounded-lg ${allChecked ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'} px-4 py-2 text-white`}
      >
        {allChecked ? "All Booths Checked - Continue" : "Submit"}
      </button>
    </div>
  );
}
