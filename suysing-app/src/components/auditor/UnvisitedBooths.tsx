"use client";

interface UnvisitedBoothsProps {
  customerCode: string;
  customerName: string;
  booths: Array<{
    name: string;
    code: string;
    checked: boolean;
  }>;
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
  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Unvisited Booths</h2>
        <p className="text-gray-600">
          Customer: {customerName} ({customerCode})
        </p>
      </div>

      <div className="mb-6">
        <div className="space-y-3">
          {booths.map((booth) => (
            <div
              key={booth.code}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <p className="font-medium">{booth.name}</p>
                <p className="text-sm text-gray-500">{booth.code}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={booth.checked}
                  onChange={(e) => onBoothToggle(booth.name, e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onComplete}
        className="w-full rounded-lg bg-orange-500 px-4 py-3 text-white hover:bg-orange-600"
      >
        Submit
      </button>
    </div>
  );
}
