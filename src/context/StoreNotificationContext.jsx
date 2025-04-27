import { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

const StoreNotificationContext = createContext();
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
    console.log('StoreNotificationContext: Created new socket instance:', socketInstance.id);
  }
  return socketInstance;
};

export const StoreNotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { store } = useSelector(state => state.store);
  const [socket, setSocket] = useState(null);

  // Initialize socket connection and set up listeners
  useEffect(() => {
    if (!store?._id) return;

    console.log('StoreNotificationContext: Initializing socket connection for store', store._id);
    
    // Get the singleton socket instance
    const socketConn = getSocket();
    setSocket(socketConn);
    
    // Identify store to socket server
    const handleConnect = () => {
      console.log('StoreNotificationContext: Socket connected with ID:', socketConn.id);
      socketConn.emit('identify', { id: store?._id, role: 'Store' });
    };

    const handleDisconnect = (reason) => {
      console.log('StoreNotificationContext: Socket disconnected:', reason);
    };

    const handleReconnect = (attemptNumber) => {
      console.log('StoreNotificationContext: Socket reconnected after', attemptNumber, 'attempts');
      socketConn.emit('identify', { id: store?._id, role: 'Store' });
    };

    const handleMessageNotification = (notification) => {
      console.log('StoreNotificationContext: Received message notification:', notification);
      // Verify receiverId and receiverModel to ensure this notification is meant for this store
      const isForCurrentStore = 
        // Either receiverModel is 'Store' or not specified
        (notification.receiverModel === 'Store' || !notification.receiverModel) && 
        // And the receiverId matches the current store
        (notification.receiverId === store?._id);
        
      if (isForCurrentStore) {
        console.log('StoreNotificationContext: Notification is for current store:', store?._id);
        addNotification(notification);
      } else {
        console.log(`StoreNotificationContext: Notification not for this store. 
          Notification for: ${notification.receiverModel || 'Unknown'} ${notification.receiverId || 'Unknown'}, 
          Current store: ${store?._id || 'Unknown'}`);
      }
    };
    
    const handleCustomNotification = (notification) => {
      console.log('StoreNotificationContext: Received custom notification:', notification);
      // Verify receiverId and receiverModel to ensure this notification is meant for this store
      const isForCurrentStore = 
        // Either receiverModel is 'Store' or not specified
        (notification.receiverModel === 'Store' || !notification.receiverModel) && 
        // And the receiverId matches the current store
        (notification.receiverId === store?._id);
        
      if (isForCurrentStore) {
        console.log('StoreNotificationContext: Notification is for current store:', store?._id);
        addNotification(notification);
      } else {
        console.log(`StoreNotificationContext: Notification not for this store. 
          Notification for: ${notification.receiverModel || 'Unknown'} ${notification.receiverId || 'Unknown'}, 
          Current store: ${store?._id || 'Unknown'}`);
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
      console.error('StoreNotificationContext: Socket connection error:', error);
    });

    socketConn.on('error', (error) => {
      console.error('StoreNotificationContext: Socket error:', error);
    });

    // Cleanup function - remove event listeners but don't disconnect
    return () => {
      console.log('StoreNotificationContext: Removing event listeners');
      socketConn.off('connect', handleConnect);
      socketConn.off('disconnect', handleDisconnect);
      socketConn.off('reconnect', handleReconnect);
      socketConn.off('new_message_notification', handleMessageNotification);
      socketConn.off('new_notification', handleCustomNotification);
      // Don't disconnect the socket as it's shared
    };
  }, [store]);

  // Load notifications from localStorage on initial load
  useEffect(() => {
    if (!store?._id) return;

    const savedNotifications = localStorage.getItem(`store_notifications_${store._id}`);
    if (savedNotifications) {
      const parsedNotifications = JSON.parse(savedNotifications);
      setNotifications(parsedNotifications);
      
      // Count unread notifications
      const unreadNotifications = parsedNotifications.filter(notification => !notification.read);
      setUnreadCount(unreadNotifications.length);
    }
  }, [store]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (!store?._id || notifications.length === 0) return;
    
    localStorage.setItem(`store_notifications_${store._id}`, JSON.stringify(notifications));
    
    // Update unread count
    const unreadNotifications = notifications.filter(notification => !notification.read);
    setUnreadCount(unreadNotifications.length);
  }, [notifications, store]);

  // Add a new notification
  const addNotification = (notification) => {
    console.log('StoreNotificationContext: Adding notification:', notification);
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
        console.log('StoreNotificationContext: Duplicate notification, skipping');
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
    <StoreNotificationContext.Provider
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
    </StoreNotificationContext.Provider>
  );
};

export const useStoreNotifications = () => useContext(StoreNotificationContext);

export default StoreNotificationContext; 