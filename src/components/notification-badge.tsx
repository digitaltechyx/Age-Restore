"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  type: string;
  status: string;
  timestamp: any;
}

export function NotificationBadge() {
  const [notificationCount, setNotificationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        // Fetch all notifications
        const notificationsRef = collection(db, 'notifications');
        const q = query(
          notificationsRef,
          orderBy('timestamp', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const notifications: Notification[] = [];
        
        querySnapshot.forEach((doc) => {
          notifications.push({
            id: doc.id,
            ...doc.data()
          } as Notification);
        });

        // Count unread notifications (status is 'pending' or 'under_review')
        const unreadCount = notifications.filter(notification => 
          notification.status === 'pending' || 
          notification.status === 'under_review' ||
          notification.refundStatus === 'pending' ||
          notification.refundStatus === 'under_review' ||
          notification.deletionStatus === 'pending' ||
          notification.deletionStatus === 'under_review'
        ).length;

        setNotificationCount(unreadCount);
      } catch (error) {
        console.error('Error fetching notification count:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotificationCount();

    // Set up real-time listener for notifications
    const interval = setInterval(fetchNotificationCount, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return null;
  }

  if (notificationCount === 0) {
    return null;
  }

  return (
    <Badge 
      variant="destructive" 
      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold"
    >
      {notificationCount > 99 ? '99+' : notificationCount}
    </Badge>
  );
}

