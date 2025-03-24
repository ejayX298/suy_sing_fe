'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaUsers, 
  FaStore, 
  FaClipboardList, 
  FaTrophy, 
  FaGift, 
  FaChevronDown, 
  FaChevronUp 
} from 'react-icons/fa';

const SidebarLink = ({ 
  href, 
  icon, 
  text, 
  isActive,
  onClick = () => {}
}: {
  href: string;
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
  onClick?: () => void;
}) => {
  return (
    <Link 
      href={href}
      className={`flex items-center px-4 py-3 text-sm transition-colors duration-200 ${
        isActive 
          ? 'bg-blue-800 text-white' 
          : 'text-blue-100 hover:bg-blue-800 hover:text-white'
      }`}
      onClick={onClick}
    >
      <span className="mr-3">{icon}</span>
      <span>{text}</span>
    </Link>
  );
};

const DropdownMenu = ({ 
  title, 
  icon, 
  children, 
  isOpen, 
  onToggle,
  isActive 
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  isActive: boolean;
}) => {
  return (
    <div>
      <button
        className={`flex items-center justify-between w-full px-4 py-3 text-sm transition-colors duration-200 ${
          isActive 
            ? 'bg-blue-800 text-white' 
            : 'text-blue-100 hover:bg-blue-800 hover:text-white'
        }`}
        onClick={onToggle}
      >
        <div className="flex items-center">
          <span className="mr-3">{icon}</span>
          <span>{title}</span>
        </div>
        <span>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
      </button>
      
      {isOpen && (
        <div className="pl-4 bg-blue-900">
          {children}
        </div>
      )}
    </div>
  );
};

export default function Sidebar() {
  const pathname = usePathname();
  const [bestBoothOpen, setBestBoothOpen] = useState(
    pathname?.includes('/best-booth')
  );
  const [souvenirOpen, setSouvenirOpen] = useState(
    pathname?.includes('/souvenir')
  );

  return (
    <div className="w-56 min-h-screen bg-blue-900 text-white flex flex-col">
      <div className="p-4 border-b border-blue-800 flex items-center justify-center">
        <div className="font-bold text-white text-xl">SUY SING</div>
      </div>
      
      <div className="mt-2 text-white/70 text-xs px-4 py-2">
        Customer Activities
      </div>
      
      <nav className="flex-1">
        <SidebarLink 
          href="/customer-activities" 
          icon={<FaUsers />} 
          text="Customer Activities" 
          isActive={pathname === '/customer-activities'} 
        />
        
        <SidebarLink 
          href="/booth-activities" 
          icon={<FaStore />} 
          text="Booth Activities" 
          isActive={pathname === '/booth-activities'} 
        />
        
        <SidebarLink 
          href="/booth-hopping-report" 
          icon={<FaClipboardList />} 
          text="Booth Hopping Report" 
          isActive={pathname === '/booth-hopping-report'} 
        />
        
        <DropdownMenu
          title="Best Booth"
          icon={<FaTrophy />}
          isOpen={bestBoothOpen}
          onToggle={() => setBestBoothOpen(!bestBoothOpen)}
          isActive={pathname?.includes('/best-booth') || false}
        >
          <SidebarLink 
            href="/best-booth/best-booth-report" 
            icon={<span className="w-3">→</span>} 
            text="Best Booth Report" 
            isActive={pathname === '/best-booth/best-booth-report'} 
          />
          <SidebarLink 
            href="/best-booth/best-booth-winner-tally" 
            icon={<span className="w-3">→</span>} 
            text="Best Booth Winner Tally" 
            isActive={pathname === '/best-booth/best-booth-winner-tally'} 
          />
        </DropdownMenu>
        
        <DropdownMenu
          title="Souvenir"
          icon={<FaGift />}
          isOpen={souvenirOpen}
          onToggle={() => setSouvenirOpen(!souvenirOpen)}
          isActive={pathname?.includes('/souvenir') || false}
        >
          <SidebarLink 
            href="/souvenir/souvenir-claim" 
            icon={<span className="w-3">→</span>} 
            text="Souvenir Claim" 
            isActive={pathname === '/souvenir/souvenir-claim'} 
          />
          <SidebarLink 
            href="/souvenir/souvenir-availability" 
            icon={<span className="w-3">→</span>} 
            text="Souvenir Availability" 
            isActive={pathname === '/souvenir/souvenir-availability'} 
          />
        </DropdownMenu>
      </nav>
    </div>
  );
}
