import Image from "next/image";

interface BoothItemProps {
  name: string;
  image: string;
  boothCode: string;
}

export default function BoothItem({ name, image, boothCode }: BoothItemProps) {
  return (
    <div className="flex items-center p-3 border-b border-[#7D7D7D] bg-white last:border-b-0">
      <div className="w-18 h-12 relative mr-4 shrink-0">
        <Image src={image} alt={boothCode} fill  />
      </div>
      <span className="text-gray-800 font-medium">{name}</span>
    </div>
  );
}
