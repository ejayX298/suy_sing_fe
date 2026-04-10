"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FaGift,
  FaChevronDown,
  FaChevronUp,
  FaTrophy,
  FaBars,
} from "react-icons/fa";

const SidebarLink = ({
  href,
  text,
  isActive,
  onClick = () => {},
}: {
  href: string;
  text: string;
  isActive: boolean;
  onClick?: () => void;
}) => {
  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-3 text-sm md:text-base lg:text-lg 2xl:text-lg transition-colors duration-200 ${
        isActive
          ? " text-white font-bold"
          : "text-blue-100 hover:bg-blue-800 hover:text-white"
      }`}
      onClick={onClick}
    >
      <span>{text}</span>
    </Link>
  );
};

const DropdownMenu = ({
  title,
  children,
  isOpen,
  onToggle,
  isActive,
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
        className={`flex items-center gap-4 w-full px-4 py-3 text-sm md:text-base lg:text-lg 2xl:text-lg transition-colors duration-200 ${
          isActive
            ? "bg-blue-800 text-white"
            : "text-blue-100 hover:bg-blue-800 hover:text-white"
        }`}
        onClick={onToggle}
      >
        <div className="flex items-center">
          <span>{title}</span>
        </div>
        <span>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
      </button>

      {isOpen && <div className="pl-2">{children}</div>}
    </div>
  );
};

export default function Sidebar() {
  const pathname = usePathname();
  const [bestBoothOpen, setBestBoothOpen] = useState(
    pathname?.includes("/best-booth")
  );
  const [souvenirOpen, setSouvenirOpen] = useState(
    pathname?.includes("/souvenir")
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-8 left-4 z-20 p-2 rounded-md bg-blue-600 text-white md:hidden hover:bg-blue-700 transition-colors"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <FaBars size={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static w-[245px] h-screen bg-[#0A20B1] text-white flex flex-col transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } z-30 top-0`}
      >
        <div className="p-4 md:p-10 flex items-center justify-center">
          <Image
            src="/images/suysing.png"
            alt="Suy Sing Logo"
            width={140}
            height={40}
            className="object-contain"
          />
        </div>
        <nav className="flex-1 overflow-y-auto">
          <SidebarLink
            href="/customer-activities"
            text="Customer Activities"
            isActive={pathname === "/customer-activities"}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <SidebarLink
            href="/booth-activities"
            text="Booth Activities"
            isActive={pathname === "/booth-activities"}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <SidebarLink
            href="/booth-hopping-report"
            text="Booth Hopping Report"
            isActive={pathname === "/booth-hopping-report"}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <DropdownMenu
            title="Best Booth"
            isOpen={bestBoothOpen}
            icon={<FaTrophy />}
            onToggle={() => setBestBoothOpen(!bestBoothOpen)}
            isActive={pathname?.includes("/best-booth") || false}
          >
            <SidebarLink
              href="/best-booth/best-booth-report"
              text="Best Booth Report"
              isActive={pathname === "/best-booth/best-booth-report"}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <SidebarLink
              href="/best-booth/best-booth-winner-tally"
              text="Best Booth Winner Tally"
              isActive={pathname === "/best-booth/best-booth-winner-tally"}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </DropdownMenu>

          <DropdownMenu
            title="Souvenir"
            icon={<FaGift />}
            isOpen={souvenirOpen}
            onToggle={() => setSouvenirOpen(!souvenirOpen)}
            isActive={pathname?.includes("/souvenir") || false}
          >
            <SidebarLink
              href="/souvenir/souvenir-claim"
              text="Souvenir Claim"
              isActive={pathname === "/souvenir/souvenir-claim"}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <SidebarLink
              href="/souvenir/souvenir-availability"
              text="Souvenir Availability"
              isActive={pathname === "/souvenir/souvenir-availability"}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </DropdownMenu>
          <SidebarLink
            href="/deal-forms"
            text="Deal Forms"
            isActive={pathname === "/deal-forms"}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <SidebarLink
            href="/deal-ordered"
            text="Deals Ordered"
            isActive={pathname === "/deal-ordered"}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <SidebarLink
            href="/notification"
            text="Notification"
            isActive={pathname === "/notification"}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
