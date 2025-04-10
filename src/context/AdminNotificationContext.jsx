import { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const AdminNotificationContext = createContext();
const ENDPOINT = import.meta.env.VITE_APP_API_URL;

// Create a singleton socket instance
let socketInstance = null;

const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(ENDPOINT, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    console.log('AdminNotificationContext: Created new socket instance:', socketInstance.id);
  }
  return socketInstance;
};

export const AdminNotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [admin, setAdmin] = useState(null);
  const [socket, setSocket] = useState(null);

  // Initialize socket connection and set up listeners
  useEffect(() => {
    if (!admin?._id) return;

    console.log('AdminNotificationContext: Initializing socket connection for admin', admin._id);
    
    // Get the singleton socket instance
    const socketConn = getSocket();
    setSocket(socketConn);
    
    // Define event handlers
    const handleConnect = () => {
      console.log('AdminNotificationContext: Socket connected with ID:', socketConn.id);
      // Identify as Admin
      socketConn.emit('identify', { id: admin?._id, role: 'Admin' });
      
      // Broadcast presence - debug helper to identify which notification context is being used
      console.log('AdminNotificationContext is ACTIVE for Admin ID:', admin?._id);
    };

    const handleDisconnect = (reason) => {
      console.log('AdminNotificationContext: Socket disconnected:', reason);
    };

    const handleReconnect = (attemptNumber) => {
      console.log('AdminNotificationContext: Socket reconnected after', attemptNumber, 'attempts');
      socketConn.emit('identify', { id: admin?._id, role: 'Admin' });
    };

    const handleMessageNotification = (notification) => {
      console.log('AdminNotificationContext: Received message notification with full details:', JSON.stringify(notification, null, 2));
      // Verify receiverId and receiverModel to ensure this notification is meant for this admin
      const isForCurrentAdmin = 
        // Either receiverModel is 'Admin' or not specified
        (notification.receiverModel === 'Admin' || !notification.receiverModel) && 
        // And the receiverId matches the current admin
        (notification.receiverId === admin?._id);
        
      if (isForCurrentAdmin) {
        console.log('AdminNotificationContext: Notification is for current admin:', admin?._id);
        addNotification(notification);
        
        // Also add to the NotificationContext if it exists
        // This ensures that even if the wrong component is rendered, notifications will appear
        if (window.notificationContextAddNotification) {
          console.log('AdminNotificationContext: Also adding to general NotificationContext');
          window.notificationContextAddNotification(notification);
        }
      } else {
        console.log(`AdminNotificationContext: Notification not for this admin. 
          Notification for: ${notification.receiverModel || 'Unknown'} ${notification.receiverId || 'Unknown'}, 
          Current admin: ${admin?._id || 'Unknown'}`);
      }
    };
    
    const handleCustomNotification = (notification) => {
      console.log('AdminNotificationContext: Received custom notification:', notification);
      // Verify receiverId and receiverModel to ensure this notification is meant for this admin
      const isForCurrentAdmin = 
        // Either receiverModel is 'Admin' or not specified
        (notification.receiverModel === 'Admin' || !notification.receiverModel) && 
        // And the receiverId matches the current admin
        (notification.receiverId === admin?._id);
        
      if (isForCurrentAdmin) {
        console.log('AdminNotificationContext: Notification is for current admin:', admin?._id);
        addNotification(notification);
      } else {
        console.log(`AdminNotificationContext: Notification not for this admin. 
          Notification for: ${notification.receiverModel || 'Unknown'} ${notification.receiverId || 'Unknown'}, 
          Current admin: ${admin?._id || 'Unknown'}`);
      }
    };

    // If socket is already connected, identify immediately
    if (socketConn.connected) {
      handleConnect();
    }

    // Set up event handlers
    socketConn.on('connect', handleConnect);
    socketConn.on('disconnect', handleDisconnect);
    socketConn.on('reconnect', handleReconnect);
    socketConn.on('new_message_notification', handleMessageNotification);
    socketConn.on('new_notification', handleCustomNotification);

    // Enhanced logging for socket connection
    socketConn.on('connect_error', (error) => {
      console.error('AdminNotificationContext: Socket connection error:', error);
    });

    socketConn.on('error', (error) => {
      console.error('AdminNotificationContext: Socket error:', error);
    });

    // Cleanup function - remove event listeners but don't disconnect
    return () => {
      console.log('AdminNotificationContext: Removing event listeners');
      socketConn.off('connect', handleConnect);
      socketConn.off('disconnect', handleDisconnect);
      socketConn.off('reconnect', handleReconnect);
      socketConn.off('new_message_notification', handleMessageNotification);
      socketConn.off('new_notification', handleCustomNotification);
      // Don't disconnect the socket as it's shared
    };
  }, [admin]);

  // Fetch admin info
  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const { data } = await axios.get(`${ENDPOINT}/api/v1/chat/admin/current`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (data && data.admin) {
          setAdmin(data.admin);
        }
      } catch (error) {
        console.error('Error fetching admin info:', error);
      }
    };
    
    if (localStorage.getItem('token')) {
      fetchAdminInfo();
    }
  }, []);

  // Load notifications from localStorage on initial load
  useEffect(() => {
    if (!admin?._id) return;

    const savedNotifications = localStorage.getItem(`admin_notifications_${admin._id}`);
    if (savedNotifications) {
      const parsedNotifications = JSON.parse(savedNotifications);
      setNotifications(parsedNotifications);
      
      // Count unread notifications
      const unreadNotifications = parsedNotifications.filter(notification => !notification.read);
      setUnreadCount(unreadNotifications.length);
    }
  }, [admin]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (!admin?._id || notifications.length === 0) return;
    
    localStorage.setItem(`admin_notifications_${admin._id}`, JSON.stringify(notifications));
    
    // Update unread count
    const unreadNotifications = notifications.filter(notification => !notification.read);
    setUnreadCount(unreadNotifications.length);
  }, [notifications, admin]);

  // Add a new notification
  const addNotification = (notification) => {
    console.log('AdminNotificationContext: Adding notification:', notification);
    setNotifications(prev => {
      // Enhanced duplicate checking:
      // 1. Check for same ID
      // 2. Check for same content, sender, and timeframe (within 3 seconds)
      const isDuplicate = prev.some(n => {
        // Check for same ID
        if (n.id === notification.id) return true;
        
        // Check for similar content sent by the same sender within a short timeframe
        const timeDiff = Math.abs(new Date(n.timestamp) - new Date(notification.timestamp));
        const isSameSender = n.senderId === notification.senderId;
        const isSameContent = n.message === notification.message;
        const isRecent = timeDiff < 3000; // 3 seconds
        
        return isSameSender && isSameContent && isRecent;
      });
      
      if (isDuplicate) {
        console.log('AdminNotificationContext: Duplicate notification, skipping');
        return prev;
      }
      
      // Add new notification at the beginning
      return [
        {
          ...notification,
          timestamp: notification.timestamp || new Date().toISOString(),
          read: false
        },
        ...prev
      ];
    });
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  // Delete a notification
  const deleteNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <AdminNotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        socket,
        admin,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications
      }}
    >
      {children}
    </AdminNotificationContext.Provider>
  );
};

export const useAdminNotifications = () => useContext(AdminNotificationContext);

export default AdminNotificationContext; 