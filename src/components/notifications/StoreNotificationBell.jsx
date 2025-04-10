import React, { useState, useEffect } from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useStoreNotifications } from '../../context/StoreNotificationContext';
import { useSelector } from 'react-redux';

const StoreNotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications 
  } = useStoreNotifications();
  const { store } = useSelector(state => state.store);

  useEffect(() => {
    // Debug: Log when notifications or store change
    console.log(`StoreNotificationBell: Store ID: ${store?._id}, Notification count: ${notifications.length}`);
  }, [store, notifications]);

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
        console.log(`Navigating to chat: ${notification.chatId}`);
        
        // Determine the appropriate chat URL based on the sender model
        let chatUrl = '';
        if (notification.senderModel === 'Admin') {
          chatUrl = `/chat/store-admin/${notification.chatId}`;
          console.log(`StoreNotificationBell: Navigating to admin chat: ${chatUrl}`);
        } else if (notification.senderModel === 'User') {
          chatUrl = `/chat/store/full/${notification.chatId}`;
          console.log(`StoreNotificationBell: Navigating to user chat: ${chatUrl}`);
        } else {
          // Default fallback if sender model is unknown
          console.log(`StoreNotificationBell: Unknown sender model, using default path`);
          chatUrl = `/shopdashboard/messages`;
        }
        
        console.log(`StoreNotificationBell: Final navigation to ${chatUrl}`);
        navigate(chatUrl);
      } else {
        console.error('No chatId in notification');
        // Fallback to messages dashboard
        navigate('/shopdashboard/messages');
      }
    } else if (notification.type === 'order') {
      // Navigate to order details
      navigate(`/shopdashboard/orders/${notification.orderId || ''}`);
    } else {
      // Other notification types
      navigate('/shopdashboard/notifications');
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

export default StoreNotificationBell; 