'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useAuth } from '@/lib/hooks/useAuth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Get page title based on pathname
  const getPageTitle = () => {
    switch (true) {
      case pathname === '/customer-activities':
        return 'Customer Activities';
      case pathname === '/booth-activities':
        return 'Booth Activities';
      case pathname === '/booth-hopping-report':
        return 'Booth Hopping Report';
      case pathname === '/best-booth/best-booth-report':
        return 'Best Booth Report';
      case pathname === '/best-booth/best-booth-winner-tally':
        return 'Best Booth Winner Tally';
      case pathname === '/souvenir/souvenir-claim':
        return 'Souvenir Claim';
      case pathname === '/souvenir/souvenir-availability':
        return 'Souvenir Availability';
      default:
        return 'Dashboard';
    }
  };

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // If not authenticated, don't render dashboard
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getPageTitle()} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
