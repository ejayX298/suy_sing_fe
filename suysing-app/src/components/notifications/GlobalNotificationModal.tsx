"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useCustomer } from "@/context/CustomerContext";
import { useSearchParams } from "next/navigation";
import { useNotifications, type Notification } from "./useNotifications";

const SESSION_SHOWN_IDS_KEY = "session_notification_shown_ids";

const getSessionShownIds = (): Set<number> => {
  try {
    const stored = sessionStorage.getItem(SESSION_SHOWN_IDS_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
};

export default function GlobalNotificationModal() {
  const { customerHashCode } = useCustomer();
  const searchParams = useSearchParams();

  const hashCode = customerHashCode || searchParams.get("cc") || "";

  const { notifications: allNotifications, markAsRead } =
    useNotifications(hashCode);

  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pendingNotifications, setPendingNotifications] = useState<
    Notification[]
  >([]);

  const [sessionShownIds, setSessionShownIds] = useState<Set<number>>(
    new Set()
  );

  const prevIdsRef = useRef<Set<number>>(new Set());

  // Initialize session shown IDs once
  useEffect(() => {
    setSessionShownIds(getSessionShownIds());
  }, []);

  const addSessionShownId = (id: number) => {
    setSessionShownIds((prev) => {
      const updated = new Set(prev);
      updated.add(id);
      sessionStorage.setItem(
        SESSION_SHOWN_IDS_KEY,
        JSON.stringify([...updated])
      );
      return updated;
    });
  };

  // Detect new notifications (not based on is_read anymore)
  useEffect(() => {
    if (!allNotifications.length) return;

    const currentIds = new Set(allNotifications.map((n) => n.id));
    const prevIds = prevIdsRef.current;

    // Find newly arrived notifications
    const newIds = [...currentIds].filter((id) => !prevIds.has(id));

    prevIdsRef.current = currentIds;

    if (newIds.length === 0 || showModal) return;

    const newItems = allNotifications.filter(
      (n) =>
        newIds.includes(n.id) && !sessionShownIds.has(n.id)
    );

    if (newItems.length > 0) {
      setPendingNotifications(newItems);
      setCurrentIndex(0);
      setShowModal(true);
    }
  }, [allNotifications, sessionShownIds, showModal]);

  const handleNext = () => {
    const current = pendingNotifications[currentIndex];
    if (!current) return;

    // Mark as shown immediately (UX first)
    addSessionShownId(current.id);

    // Fire & forget backend
    markAsRead(current.id);

    const nextIndex = currentIndex + 1;

    if (nextIndex < pendingNotifications.length) {
      setCurrentIndex(nextIndex);
    } else {
      setShowModal(false);
      setPendingNotifications([]);
    }
  };

  const handleClose = () => {
    const current = pendingNotifications[currentIndex];
    if (current) {
      addSessionShownId(current.id);
    }
    setShowModal(false);
  };

  const getButtonLabel = (item: Notification) =>
    (item?.button_label || item?.buttonLabel || "Next").replace(
      /<[^>]*>/g,
      ""
    );

  if (!showModal || pendingNotifications.length === 0) return null;

  const currentNotification = pendingNotifications[currentIndex];
  if (!currentNotification) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black/20"
        onClick={handleClose}
      />

      <div className="relative w-[90%] max-w-md p-6 bg-white border-[2px] border-[#0F1030] rounded-lg shadow-md">
        <div className="flex items-center justify-center mb-4">
          <Image
            src="/images/confetti.svg"
            alt="Notification"
            width={90}
            height={90}
          />
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">
          {currentNotification.title}
        </h2>

        <p className="text-center mb-6 text-lg">
          {currentNotification.message}
        </p>

        <button
          onClick={handleNext}
          className="w-full py-2 bg-[#F78B1E] text-white rounded-lg text-lg font-medium hover:bg-[#E67D0E] transition-colors"
        >
          {getButtonLabel(currentNotification)}
        </button>
      </div>
    </div>
  );
}