import { useState } from "react";
import Image from "next/image";

interface ClickableBoothItemProps {
  name: string;
  logo: string;
  onToggle?: (name: string, isVisited: boolean) => void;
}

export default function ClickableBoothItem({
  name,
  logo,
  onToggle,
}: ClickableBoothItemProps) {
  const [isVisited, setIsVisited] = useState(false);

  const hasExtension = /\.(png|jpg|jpeg|gif|webp)$/i.test(logo);
  
  const imageSrc = logo.startsWith('/') 
    ? logo
    : hasExtension 
      ? `/images/main-hall/${logo}`
      : `/images/main-hall/${logo}.png`;

  const handleClick = () => {
    setIsVisited(!isVisited);
    if (onToggle) {
      onToggle(name, !isVisited);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-between p-3 border-b border-gray-200 w-full transition-colors ${
        isVisited ? "bg-white" : "bg-white"
      }`}
    >
      <div className="flex items-center">
        <div className="w-24 h-8 relative mr-4 shrink-0">
          <Image
            src={imageSrc}
            alt={`${name} logo`}
            fill
            objectFit="contain"
            unoptimized
          />
        </div>
        <span
          className={`font-medium ${
            isVisited ? "text-black" : "text-gray-600"
          }`}
        >
          {name}
        </span>
      </div>

      {isVisited && (
        <div className="bg-green-500 rounded-full p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
    </button>
  );
}
