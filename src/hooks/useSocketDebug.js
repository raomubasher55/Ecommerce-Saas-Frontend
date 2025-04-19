import { useEffect } from 'react';
import io from 'socket.io-client';

// Singleton socket instance for debugging
let debugSocket = null;

/**
 * Custom hook for debugging socket connections and events
 * @param {string} userId - The user ID to identify with
 * @param {string} role - The role ('User', 'Store', or 'Admin')
 * @returns {void}
 */
const useSocketDebug = (userId, role) => {
  useEffect(() => {
    if (!userId) return;

    const ENDPOINT = import.meta.env.VITE_APP_API_URL;
    
    if (!debugSocket) {
      debugSocket = io(ENDPOINT);
      
      // Set up global event handlers for debugging
      debugSocket.on('connect', () => {
        console.log(`%c[DEBUG] Socket connected: ${debugSocket.id}`, 'color: green; font-weight: bold;');
      });
      
      debugSocket.on('disconnect', (reason) => {
        console.log(`%c[DEBUG] Socket disconnected: ${reason}`, 'color: red; font-weight: bold;');
      });
      
      debugSocket.on('error', (error) => {
        console.error(`%c[DEBUG] Socket error: ${error}`, 'color: red; font-weight: bold;');
      });
      
      debugSocket.on('connect_error', (error) => {
        console.error(`%c[DEBUG] Socket connection error: ${error}`, 'color: red; font-weight: bold;');
      });
    }
    
    // Identify to the server
    if (debugSocket.connected) {
      console.log(`%c[DEBUG] Identifying as ${role} with ID: ${userId}`, 'color: blue; font-weight: bold;');
      debugSocket.emit('identify', { id: userId, role });
    } else {
      debugSocket.on('connect', () => {
        console.log(`%c[DEBUG] Identifying as ${role} with ID: ${userId}`, 'color: blue; font-weight: bold;');
        debugSocket.emit('identify', { id: userId, role });
      });
    }
    
    // Log notification events
    const handleMessageNotification = (data) => {
      console.log(`🔔 ${role} ${userId} RECEIVED MESSAGE NOTIFICATION:`, data);
      console.log(`   Notification intended for: ${data.receiverModel} ${data.receiverId}`);
      console.log(`   Does it match current user? ${data.receiverId === userId ? 'YES ✓' : 'NO ✗'}`);
    };

    const handleNotification = (data) => {
      console.log(`📣 ${role} ${userId} RECEIVED GENERAL NOTIFICATION:`, data);
      console.log(`   Notification intended for: ${data.receiverModel} ${data.receiverId}`);
      console.log(`   Does it match current user? ${data.receiverId === userId ? 'YES ✓' : 'NO ✗'}`);
    };

    const handleReceiveMessage = (data) => {
      console.log(`✉️ ${role} ${userId} RECEIVED MESSAGE:`, data);
    };
    
    // Set up debug event listeners
    debugSocket.on('new_message_notification', handleMessageNotification);
    debugSocket.on('new_notification', handleNotification);
    debugSocket.on('receive_message', handleReceiveMessage);
    
    // Cleanup
    return () => {
      debugSocket.off('new_message_notification', handleMessageNotification);
      debugSocket.off('new_notification', handleNotification);
      debugSocket.off('receive_message', handleReceiveMessage);
    };
  }, [userId, role]);
};

export default useSocketDebug; 