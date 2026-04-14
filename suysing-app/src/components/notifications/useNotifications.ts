"use client";

import { useEffect, useState, useCallback } from "react";
import { notifications } from "@/services/api";

const READ_NOTIFICATIONS_KEY = "read_notification_ids";

export interface Notification {
  id: number;
  title?: string;
  subject?: string;
  message?: string;
  body?: string;
  button_label?: string;
  buttonLabel?: string;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refresh: () => Promise<void>;
}

const stripHtml = (text?: string) =>
  (text || "").replace(/<[^>]*>/g, "");

const getStoredReadIds = (): Set<number> => {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = localStorage.getItem(READ_NOTIFICATIONS_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
};

const persistReadIds = (ids: Set<number>) => {
  localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify([...ids]));
};

export function useNotifications(
  customerHashCode: string
): UseNotificationsReturn {
  const [notificationsList, setNotificationsList] = useState<Notification[]>([]);
  const [readIds, setReadIds] = useState<Set<number>>(new Set());

  // initialize local read IDs once
  useEffect(() => {
    setReadIds(getStoredReadIds());
  }, []);

  const normalize = (results: unknown): Notification[] => {
    if (Array.isArray(results)) return results;
    const data = results as {
      notifications?: Notification[];
      data?: Notification[];
    };
    return data?.notifications || data?.data || [];
  };

  const refresh = useCallback(async () => {
    if (!customerHashCode) return;

    // Validate hash code format (expected 64+ character hex string)
    if (!/^[a-f0-9]{64,}$/.test(customerHashCode)) return;

    try {
      const res = await notifications.getAllByHashCode(customerHashCode);
      if (!res.success) return;

      const items = normalize(res.results);
      setNotificationsList(items);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  }, [customerHashCode]);

  // polling (visibility-aware)
  useEffect(() => {
    refresh();

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [refresh]);

  const markAsRead = async (id: number) => {
    try {
      await notifications.markAsRead(id, customerHashCode);

      // optimistic update
      const updated = new Set(readIds);
      updated.add(id);
      setReadIds(updated);
      persistReadIds(updated);
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notificationsList
      .filter((n) => !readIds.has(n.id))
      .map((n) => n.id);

    if (unreadIds.length === 0) return;

    try {
      await notifications.markAllAsRead(unreadIds, customerHashCode);

      // optimistic update
      const updated = new Set(readIds);
      unreadIds.forEach((id) => updated.add(id));
      setReadIds(updated);
      persistReadIds(updated);
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  // Strip HTML from title and message; use localStorage as source of truth for is_read
  const mergedNotifications = notificationsList.map((n) => ({
    ...n,
    title: stripHtml(n.title || n.subject),
    message: stripHtml(n.message || n.body),
    is_read: readIds.has(n.id),
  }));

  const unreadCount = mergedNotifications.filter((n) => !n.is_read).length;

  return {
    notifications: mergedNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refresh,
  };
}

export const getButtonLabel = (item: Notification) =>
  stripHtml(item?.button_label || item?.buttonLabel || "Next");
