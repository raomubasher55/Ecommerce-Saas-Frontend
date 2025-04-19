import React, { useState, useEffect } from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAdminNotifications } from '../../context/AdminNotificationContext';

const AdminNotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications,
    admin
  } = useAdminNotifications();

  useEffect(() => {
    // Debug: Log when notifications or admin change
    console.log(`AdminNotificationBell: Admin ID: ${admin?._id}, Notification count: ${notifications.length}`);
  }, [admin, notifications]);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Only mark all as read when opening the dropdown
      markAllAsRead();
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark notification as read
    markAsRead(notification.id);
    
    console.log('Clicked notification:', notification);
    
    // Navigate based on notification type
    if (notification.type === 'message') {
      // Navigate to chat if chatId is available
      if (notification.chatId) {
        console.log(`Notification details:`, {
          senderModel: notification.senderModel,
          senderId: notification.senderId,
          chatId: notification.chatId
        });
        
        // For admin, always navigate to admin-store chat regardless of the sender
        const chatUrl = `/chat/admin-store/${notification.chatId}`;
        console.log(`AdminNotificationBell: Admin role - always navigating to: ${chatUrl}`);
        
        navigate(chatUrl);
      } else {
        console.error('No chatId in notification');
        // Fallback to messages dashboard
        navigate('/admin/dashboard/messages');
      }
    } else {
      // Other notification types can have different navigation logic
      navigate('/admin/dashboard/notifications');
    }
    
    setIsOpen(false);
  };

  // Format timestamp to display in a readable format
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // Less than a minute
    if (diff < 60000) {
      return 'just now';
    }
    
    // Less than an hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    
    // Less than a day
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    
    // Less than a week
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
    
    // Otherwise, return the full date
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      <button
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        onClick={toggleNotifications}
      >
        <IoNotificationsOutline className="text-2xl" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
          <div className="py-2 px-4 bg-[#4222C4] text-white flex justify-between items-center">
            <span>Notifications ({notifications.length})</span>
            {notifications.length > 0 && (
              <button 
                className="text-xs hover:underline flex items-center"
                onClick={clearAllNotifications}
              >
                <FaTrash className="mr-1" /> Clear All
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-4 px-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div 
                  key={index} 
                  className={`border-b last:border-b-0 px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex justify-between">
                    <div 
                      className="flex-1"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <p className="text-sm font-medium">
                        {notification.title || 'New Message'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.message || notification.content || 'You have a new notification'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                    <button 
                      className="text-gray-400 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotificationBell; 