import BoothItem from "./BoothItem";

export interface Booth {
  name: string;
  image?: string;
  boothCode?: string;
  visited: boolean;
}

interface BoothZoneProps {
  title: string;
  booths: Booth[];
  progress: string;
}

export default function BoothZone({ title, booths, progress }: BoothZoneProps) {
  return (
    <div className="bg-white mb-6 rounded-[10px] border border-[#7D7D7D]">
      <div className="p-4">
        <div className="flex justify-between rounded-md items-center bg-[#0920B0] text-white px-4 py-3">
          <h2 className="text-lg font-bold">{title}</h2>
          <span className="text-sm">{progress}</span>
        </div>
        <div className="border border-[#7D7D7D] mt-3 rounded-sm">
          <div className="p-3 border-b border-[#7D7D7D]">
            <h3 className="text-lg font-medium text-[#343434]">
              Unvisited Booth
            </h3>
          </div>
          {booths
            .filter((booth) => !booth.visited)
            .map((booth) => (
              <BoothItem
                key={booth.name}
                boothCode={booth.boothCode}
                name={booth.name}
                image={booth.image}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
