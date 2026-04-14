"use client";

import { useState } from "react";
import { useNotifications } from "./useNotifications";

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

export default function NotificationBell({
  customerHashCode,
}: {
  customerHashCode: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const { notifications, markAsRead } = useNotifications(customerHashCode);

  return (
    <div className="absolute top-4 right-4 z-40">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 bg-white rounded-full shadow-md"
      >
        <BellIcon className="w-6 h-6 text-[#0F1030]" />
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-80 max-h-96 bg-white rounded-lg shadow-xl border overflow-hidden">
          <div className="p-3 bg-[#0F1030] text-white">
            <h3 className="font-semibold">Notifications</h3>
          </div>

          <div className="overflow-y-auto max-h-80">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-gray-500">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className="p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50"
                >
                  <p className="font-medium text-sm">{n.title}</p>
                  <p className="text-xs  mt-1">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
