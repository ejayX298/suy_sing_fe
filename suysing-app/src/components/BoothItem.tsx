import Image from "next/image";

interface BoothItemProps {
  name: string;
  logo: string;
}

export default function BoothItem({ name, logo }: BoothItemProps) {
  const hasExtension = /\.(png|jpg|jpeg|gif|webp)$/i.test(logo);
  
  const imageSrc = logo.startsWith('/') 
    ? logo
    : hasExtension 
      ? `/images/booths/${logo}`
      : `/images/booths/${logo}.png`;

  return (
    <div className="flex items-center p-3 border-b border-[#7D7D7D] bg-white last:border-b-0">
      <div className="w-24 h-8 relative mr-4 shrink-0">
        <Image
          src={imageSrc}
          alt={`${logo} logo`}
          fill
          objectFit="contain"
          unoptimized
        />
      </div>
      <span className="text-gray-800 font-medium">{name}</span>
    </div>
  );
}
