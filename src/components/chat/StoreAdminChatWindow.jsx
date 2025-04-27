import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import useSocketDebug from '../../hooks/useSocketDebug';

const ENDPOINT = import.meta.env.VITE_APP_API_URL;
let socket;

const StoreAdminChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [adminName, setAdminName] = useState('Platform Admin');
  const [adminId, setAdminId] = useState('');
  const { store } = useSelector(state => state.store);
  const { chatId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Use debug hook
  useSocketDebug(store?._id, 'Store');

  // Initialize socket connection
  useEffect(() => {
    socket = io(ENDPOINT);

    socket.on('connect', () => {
      if (store?._id) {
        console.log('Store connected to socket:', store._id);
        socket.emit('identify', { id: store._id, role: 'Store' });
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
  }, [store?._id, chatId]);

  // Fetch messages for the chat and admin info
  useEffect(() => {
    const fetchMessagesAndAdminInfo = async () => {
      if (!chatId || !store?._id) return;

      try {
        setLoading(true);
        
        // Get chat data
        const { data } = await axios.get(`${ENDPOINT}/api/v1/chat/admin-store/${chatId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('storeToken')}`
          }
        });

        if (data.chat) {
          setMessages(data.chat.messages || []);
          
          // First try to get admin ID from participants
          const adminParticipant = data.chat.participants?.find(p => p.type === 'Admin');
          if (adminParticipant && adminParticipant.id) {
            setAdminId(adminParticipant.id);
            if (adminParticipant.name) {
              setAdminName(adminParticipant.name);
            }
          } 
          // If admin ID not found in participants, get first admin from database via separate API call
          else {
            const adminResponse = await axios.get(`${ENDPOINT}/api/v1/chat/admin/first`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('storeToken')}`
              }
            });
            
            if (adminResponse.data.admin) {
              setAdminId(adminResponse.data.admin._id);
              if (adminResponse.data.admin.name) {
                setAdminName(adminResponse.data.admin.name);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessagesAndAdminInfo();
  }, [chatId, store?._id]);

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
      if (chatId && messages.length > 0 && store?._id) {
        try {
          await axios.put(`${ENDPOINT}/api/v1/chat/admin-store/${chatId}/read`, {}, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('storeToken')}`
            }
          });
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      }
    };

    markAsRead();
  }, [chatId, messages.length, store?._id]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !store?._id) {
      console.error('Missing required data:', {
        messageEmpty: !newMessage.trim(),
        sending,
        storeId: store?._id,
        adminId: adminId
      });
      return;
    }
    
    // If no adminId by now, try to get one
    let admin_id = adminId;
    if (!admin_id) {
      try {
        console.log('Attempting to fetch admin ID');
        const adminResponse = await axios.get(`${ENDPOINT}/api/v1/chat/admin/first`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('storeToken')}`
          }
        });
        
        if (adminResponse.data.admin) {
          admin_id = adminResponse.data.admin._id;
          setAdminId(admin_id);
          console.log('Admin ID retrieved:', admin_id);
        } else {
          console.error('No admin found to send message to');
          return;
        }
      } catch (error) {
        console.error('Error getting admin ID:', error);
        return;
      }
    }
    
    try {
      setSending(true);
      console.log('Sending message from Store to Admin:', {
        senderId: store._id,
        receiverId: admin_id,
        storeId: store._id,  // Add explicit store ID
        adminId: admin_id,   // Add explicit admin ID
        senderModel: 'Store',
        receiverModel: 'Admin',
        content: newMessage.trim(),
        chatId: chatId
      });
      
      // Add message to local state immediately for better UX
      const newMsg = {
        sender: store._id,
        receiver: admin_id,
        senderModel: 'Store',
        receiverModel: 'Admin',
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        chatId: chatId
      };

      setMessages(prev => [...prev, newMsg]);
      
      // Emit the message through socket with explicit IDs
      socket.emit('send_message', {
        senderId: store._id,
        receiverId: admin_id,
        storeId: store._id,  // Add explicit store ID
        adminId: admin_id,   // Add explicit admin ID
        senderModel: 'Store',
        receiverModel: 'Admin',
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
    navigate('/shopdashboard');
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
        <div className="w-10 h-10 bg-[#4222C4] rounded-full flex items-center justify-center text-white font-bold">
          {adminName.charAt(0) || 'A'}
        </div>
        <div className="ml-3">
          <h3 className="font-semibold">{adminName}</h3>
          <p className="text-sm text-gray-500">Platform Administration</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4222C4]"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation with admin support</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`max-w-[70%] mb-3 ${
                msg.senderModel === 'Store' 
                  ? 'ml-auto bg-[#4222C4] text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
                  : 'mr-auto bg-gray-200 text-gray-800 rounded-tr-lg rounded-tl-lg rounded-br-lg'
              } p-3 rounded-lg shadow-sm`}
            >
              <p>{msg.content}</p>
              <p className={`text-xs ${msg.senderModel === 'Store' ? 'text-indigo-200' : 'text-gray-500'} mt-1`}>
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
            className="flex-1 p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#4222C4] w-full sm:w-auto"
            disabled={sending}
          />
          <button
            type="submit"
            className="bg-[#4222C4] text-white p-3 rounded-r-lg hover:bg-[#3a1da9] focus:outline-none disabled:opacity-50 w-full sm:w-max flex justify-center items-center"
            disabled={!newMessage.trim() || sending}
          >
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoreAdminChatWindow; 