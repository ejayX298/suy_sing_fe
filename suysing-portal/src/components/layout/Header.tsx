'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/lib/hooks/useAuth';

export default function Header({ title }: { title: string }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();
  let admin_first_name = ''

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  
  if (typeof window != "undefined") {
    const auth = localStorage.getItem("auth");
    if (!auth){
      admin_first_name = '';
    }else{
      admin_first_name = JSON.parse(auth)?.user || '';
    }
  }

  return (
    <header className="h-20 flex items-center justify-between px-6 mt-4 mb-4">
      <h1 className="text-3xl font-bold">{title}</h1>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            className="flex items-center space-x-2 hover:text-gray-800 focus:outline-none"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <FaUserCircle className="w-6 h-6" />
            <span>Hello {admin_first_name}!</span>
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm  hover:bg-gray-100 w-full text-left"
              >
                <FaSignOutAlt className="mr-2" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
