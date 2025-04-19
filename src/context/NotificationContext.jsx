import { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import UserContext from '../components/context/UserContext';

const NotificationContext = createContext();
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
    console.log('NotificationContext: Created new socket instance:', socketInstance.id);
  }
  return socketInstance;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const [socket, setSocket] = useState(null);
  
  // Expose addNotification to window for cross-context communication
  useEffect(() => {
    // Expose the addNotification function to the window object for cross-context communication
    window.notificationContextAddNotification = addNotification;
    
    return () => {
      delete window.notificationContextAddNotification;
    };
  }, []);

  // Initialize socket connection and set up listeners
  useEffect(() => {
    if (!user?._id) {
      console.log('NotificationContext: No user ID available, skipping socket connection');
      return;
    }

    console.log('NotificationContext: Initializing socket connection for user', user._id);
    console.log('NotificationContext: User role =', user.role);
    console.log('NotificationContext: Full user object:', JSON.stringify(user, null, 2));
    
    // Get the singleton socket instance
    const socketConn = getSocket();
    setSocket(socketConn);
    
    // Define event handlers
    const handleConnect = () => {
      console.log('NotificationContext: Socket connected with ID:', socketConn.id);
      
      // Identify with the appropriate role
      const role = user.role === 'admin' ? 'Admin' : (user.role === 'store' ? 'Store' : 'User');
      console.log(`NotificationContext: Identifying as ${role} with ID ${user._id}`);
      socketConn.emit('identify', { id: user?._id, role: role });
      
      // Broadcast presence - debug helper to identify which notification context is being used
      console.log(`NotificationContext is ACTIVE for ${role} ID:`, user?._id);
    };

    const handleDisconnect = (reason) => {
      console.log('NotificationContext: Socket disconnected:', reason);
    };

    const handleReconnect = (attemptNumber) => {
      console.log('NotificationContext: Socket reconnected after', attemptNumber, 'attempts');
      const role = user.role === 'admin' ? 'Admin' : (user.role === 'store' ? 'Store' : 'User');
      socketConn.emit('identify', { id: user?._id, role: role });
    };

    const handleMessageNotification = (notification) => {
      console.log('NotificationContext: Received message notification with full details:', JSON.stringify(notification, null, 2));
      
      // Check user role to determine which notifications to accept
      if (user.role === 'admin') {
        // For admin users, accept notifications meant for Admin role
        const isForCurrentAdmin = 
          // Either receiverModel is 'Admin' or not specified
          (notification.receiverModel === 'Admin' || !notification.receiverModel) && 
          // And the receiverId matches the current user
          (notification.receiverId === user?._id);
          
        if (isForCurrentAdmin) {
          console.log('NotificationContext: Notification is for current admin:', user?._id);
          addNotification(notification);
        } else {
          console.log(`NotificationContext: Notification not for this admin. 
            Notification for: ${notification.receiverModel || 'Unknown'} ${notification.receiverId || 'Unknown'}, 
            Current admin: ${user?._id || 'Unknown'}`);
        }
      } else if (user.role === 'store') {
        // For store users, accept notifications meant for Store role
        const isForCurrentStore = 
          // Either receiverModel is 'Store' or not specified
          (notification.receiverModel === 'Store' || !notification.receiverModel) && 
          // And the receiverId matches the current user
          (notification.receiverId === user?._id);
          
        if (isForCurrentStore) {
          console.log('NotificationContext: Notification is for current store:', user?._id);
          addNotification(notification);
        } else {
          console.log(`NotificationContext: Notification not for this store. 
            Notification for: ${notification.receiverModel || 'Unknown'} ${notification.receiverId || 'Unknown'}, 
            Current store: ${user?._id || 'Unknown'}`);
        }
      } else {
        // For regular users, check if receiverId matches
        if (notification.receiverId === user?._id) {
          console.log('NotificationContext: Adding notification for user', user._id);
          addNotification(notification);
        } else {
          console.log(`NotificationContext: Notification receiverId ${notification.receiverId} doesn't match user ID ${user?._id}`);
        }
      }
    };
    
    const handleCustomNotification = (notification) => {
      console.log('NotificationContext: Received custom notification:', notification);
      // Only add notifications meant for this user
      if (notification.receiverId === user?._id) {
        addNotification(notification);
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

    // Cleanup function - remove event listeners but don't disconnect
    return () => {
      console.log('NotificationContext: Removing event listeners');
      socketConn.off('connect', handleConnect);
      socketConn.off('disconnect', handleDisconnect);
      socketConn.off('reconnect', handleReconnect);
      socketConn.off('new_message_notification', handleMessageNotification);
      socketConn.off('new_notification', handleCustomNotification);
      // Don't disconnect the socket as it's shared
    };
  }, [user]);

  // Load notifications from localStorage on initial load
  useEffect(() => {
    if (!user) return;

    const savedNotifications = localStorage.getItem(`notifications_${user._id}`);
    if (savedNotifications) {
      const parsedNotifications = JSON.parse(savedNotifications);
      setNotifications(parsedNotifications);
      
      // Count unread notifications
      const unreadNotifications = parsedNotifications.filter(notification => !notification.read);
      setUnreadCount(unreadNotifications.length);
    }
  }, [user]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (!user || notifications.length === 0) return;
    
    localStorage.setItem(`notifications_${user._id}`, JSON.stringify(notifications));
    
    // Update unread count
    const unreadNotifications = notifications.filter(notification => !notification.read);
    setUnreadCount(unreadNotifications.length);
  }, [notifications, user]);

  // Add a new notification
  const addNotification = (notification) => {
    console.log('NotificationContext: Adding notification:', notification);
    setNotifications(prev => {
      // Avoid duplicates by checking if notification with same ID already exists
      const exists = prev.some(n => n.id === notification.id);
      if (exists) {
        console.log('NotificationContext: Duplicate notification, skipping');
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
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        socket,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

export default NotificationContext; 