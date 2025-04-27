import React, { useState } from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications 
  } = useNotifications();

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
    
    // Navigate based on notification type
    if (notification.type === 'message') {
      // Navigate to chat if chatId is available
      if (notification.chatId) {
        
        // Check if we're in an admin context by looking at the URL
        const isAdminContext = window.location.pathname.includes('/admin');
        let chatUrl;
        
        if (isAdminContext) {
          // For admin users, always navigate to admin-store chat regardless of sender
          chatUrl = `/chat/admin-store/${notification.chatId}`;
        } else {
          // Determine if we're in a store context
          const isStoreContext = window.location.pathname.includes('/shopdashboard');
          if (isStoreContext) {
            // Store is viewing this notification
            chatUrl = `/chat/store-admin/${notification.chatId}`;
          } else {
            // User is viewing this notification
            chatUrl = `/chat/user/${notification.senderId}`;
          }
        }
        
        navigate(chatUrl);
      } else {
        console.error('No chatId in notification');
        // Fallback to appropriate dashboard based on context
        const isAdminContext = window.location.pathname.includes('/admin');
        const isStoreContext = window.location.pathname.includes('/shopdashboard');
        
        if (isAdminContext) {
          navigate('/admin/dashboard/messages');
        } else if (isStoreContext) {
          navigate('/shopdashboard/messages');
        } else {
          navigate('/dashboard/messages');
        }
      }
    } else {
      // Other notification types - navigate based on context
      const isAdminContext = window.location.pathname.includes('/admin');
      const isStoreContext = window.location.pathname.includes('/shopdashboard');
      
      if (isAdminContext) {
        navigate('/admin/dashboard/notifications');
      } else if (isStoreContext) {
        navigate('/shopdashboard/notifications');
      } else {
        navigate('/dashboard/notifications');
      }
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
      {/* Notification Bell Icon */}
      <div 
        className="cursor-pointer flex items-center" 
        onClick={toggleNotifications}
      >
        <IoNotificationsOutline className="text-[#4222C4] text-xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </div>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 overflow-hidden border border-gray-200">
          <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium text-gray-700">Notifications</h3>
            {notifications.length > 0 && (
              <button 
                onClick={clearAllNotifications}
                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
              >
                <FaTrash size={10} />
                Clear All
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-4 px-4 text-center text-gray-500">
                No new notifications
              </div>
            ) : (
              <ul>
                {notifications.map((notification) => (
                  <li 
                    key={notification.id} 
                    className={`
                      border-b border-gray-100 last:border-b-0 hover:bg-gray-50 relative
                      ${!notification.read ? 'bg-blue-50' : ''}
                    `}
                  >
                    <div 
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-gray-800">
                          {notification.title}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {notification.message}
                      </p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    >
                      <FaTrash size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell; 