import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import useSocketDebug from '../../hooks/useSocketDebug';

const ENDPOINT = import.meta.env.VITE_APP_API_URL;
let socket;

const AdminStoreChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [adminId, setAdminId] = useState('');
  const [storeId, setStoreId] = useState('');
  const { chatId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Initialize socket connection
  useEffect(() => {
    socket = io(ENDPOINT);

    socket.on('connect', () => {
      const token = localStorage.getItem('token');
      // Check if token exists to determine if user is admin
      if (token && adminId) {
        console.log('Admin connected to socket:', adminId);
        socket.emit('identify', { id: adminId, role: 'Admin' });
      }
    });

    // Listen for incoming messages
    socket.on('receive_message', (message) => {
      console.log('Message received:', message);
      if (message.chatId === chatId) {
        setMessages(prev => [...prev, message]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [adminId, chatId]);

  // Fetch admin user ID
  useEffect(() => {
    const fetchAdminId = async () => {
      try {
        const { data } = await axios.get(`${ENDPOINT}/api/v1/chat/admin/current`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (data.admin) {
          setAdminId(data.admin._id);
          
          // Now that we have adminId, initialize socket connection
          if (socket && socket.connected) {
            console.log('Identifying as Admin with ID:', data.admin._id);
            socket.emit('identify', { id: data.admin._id, role: 'Admin' });
          }
        }
      } catch (error) {
        console.error('Error fetching admin info:', error);
      }
    };
    
    fetchAdminId();
  }, []);

  // Fetch messages for the chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) return;

      try {
        setLoading(true);
        const { data } = await axios.get(`${ENDPOINT}/api/v1/chat/admin-store/${chatId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (data.chat) {
          setMessages(data.chat.messages || []);
          setStoreName(data.chat.storeName || 'Store');
          
          // Extract store ID directly
          if (data.chat.stores && data.chat.stores.length > 0) {
            // If stores is populated with objects
            if (typeof data.chat.stores[0] === 'object') {
              setStoreId(data.chat.stores[0]._id);
            } 
            // If stores is an array of IDs
            else {
              setStoreId(data.chat.stores[0]);
            }
          }
          
          // Extract admin ID if not already set
          if (!adminId && data.chat.users && data.chat.users.length > 0) {
            // If users is populated with objects
            if (typeof data.chat.users[0] === 'object') {
              setAdminId(data.chat.users[0]._id);
            } 
            // If users is an array of IDs
            else {
              setAdminId(data.chat.users[0]);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatId, adminId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Mark messages as read
  useEffect(() => {
    const markAsRead = async () => {
      if (chatId && messages.length > 0) {
        try {
          await axios.put(`${ENDPOINT}/api/v1/chat/admin-store/${chatId}/read`, {}, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      }
    };

    markAsRead();
  }, [chatId, messages.length]);

  // Use debug hook
  useSocketDebug(adminId, 'Admin');

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !storeId || !adminId) {
      console.error('Missing required data:', {
        messageEmpty: !newMessage.trim(),
        sending,
        storeId,
        adminId
      });
      return;
    }
    
    try {
      setSending(true);
      
      console.log('Sending message from Admin to Store:', {
        senderId: adminId,
        receiverId: storeId,
        storeId: storeId,    // Explicit store ID
        adminId: adminId,    // Explicit admin ID
        senderModel: 'Admin',
        receiverModel: 'Store',
        content: newMessage.trim(),
        chatId: chatId
      });
      
      // Add message to local state immediately for better UX
      const newMsg = {
        sender: adminId,
        receiver: storeId,
        senderModel: 'Admin',
        receiverModel: 'Store',
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        chatId: chatId
      };

      setMessages(prev => [...prev, newMsg]);
      
      // Emit the message through socket with explicit IDs
      socket.emit('send_message', {
        senderId: adminId,
        receiverId: storeId,
        storeId: storeId,    // Explicit store ID
        adminId: adminId,    // Explicit admin ID
        senderModel: 'Admin',
        receiverModel: 'Store',
        content: newMessage.trim(),
        chatId: chatId
      });
      
      setNewMessage('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const goBack = () => {
    navigate('/admindashboard/dashboard');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat Header */}
      <div className="bg-white p-4 shadow-md flex items-center">
        <button 
          onClick={goBack}
          className="mr-3 text-gray-600 hover:text-gray-800"
        >
          <FaArrowLeft />
        </button>
        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
          {storeName.charAt(0) || 'S'}
        </div>
        <div className="ml-3">
          <h3 className="font-semibold">{storeName}</h3>
          <p className="text-sm text-gray-500">Store</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-700"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`max-w-[70%] mb-3 ${
                msg.senderModel === 'Admin' 
                  ? 'ml-auto bg-indigo-600 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
                  : 'mr-auto bg-gray-200 text-gray-800 rounded-tr-lg rounded-tl-lg rounded-br-lg'
              } p-3 rounded-lg shadow-sm`}
            >
              <p>{msg.content}</p>
              <p className={`text-xs ${msg.senderModel === 'Admin' ? 'text-indigo-200' : 'text-gray-500'} mt-1`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 bg-white border-t">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 items-center">
          <input
            type="text"
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
            disabled={sending}
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white p-3 rounded-r-lg hover:bg-indigo-700 focus:outline-none disabled:opacity-50 w-full sm:w-max flex justify-center items-center"
            disabled={!newMessage.trim() || sending}
          >
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminStoreChatWindow; 