import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useStoreNotifications } from '../../context/StoreNotificationContext';
import Navbar from '../homepage/Navbar';

const ENDPOINT = import.meta.env.VITE_APP_API_URL;

const StoreFullChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('User');
  const { store } = useSelector(state => state.store);
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { addNotification, socket } = useStoreNotifications();

  console.log("chatId", chatId)

  // Set up message listeners using the shared socket
  useEffect(() => {
    if (!socket || !store?._id || !userId) return;

    console.log('StoreFullChatWindow: Using shared socket', socket.id);

    // Message receiver handler
    const handleReceiveMessage = (message, chatId) => {
      console.log('StoreFullChatWindow: Received message:', message, 'for chat:', chatId);
      if (message.sender === userId || message.receiver === userId) {
        setMessages(prev => [...prev, message]);
      }
    };

    // Add event listeners
    socket.on('receive_message', handleReceiveMessage);
    
    // Clean up event listeners
    return () => {
      console.log('StoreFullChatWindow: Removing message listener');
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, store?._id, userId]);

  // Fetch messages for selected chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId || !store?._id) return;

      try {
        setLoading(true);
        const { data } = await axios.get(`${ENDPOINT}/api/v1/chat/store/chat/${chatId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('storeToken')}`
            }
        });
        
        // Set the userId from the first message's receiver or sender
        const firstMessage = data?.[0];
        if (firstMessage) {
          const chatUserId = firstMessage.senderModel === 'User' 
            ? firstMessage.sender 
            : firstMessage.receiver;
          setUserId(chatUserId);
          
          // If available, set the user's name
          try {
            const userResponse = await axios.get(`${ENDPOINT}/api/v1/users/${chatUserId}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('storeToken')}`
              }
            });
            if (userResponse.data && userResponse.data.name) {
              setUserName(userResponse.data.name);
            }
          } catch (error) {
            console.error('Error fetching user details:', error);
          }
        }
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatId, store?._id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !userId || !socket) return;
    
    try {
      setSending(true);
      // Add message to local state immediately for better UX
      const newMsg = {
        sender: store._id,
        receiver: userId,
        senderModel: 'Store',
        receiverModel: 'User',
        content: newMessage.trim(),
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, newMsg]);
      
      // Emit the message through socket
      socket.emit('send_message', {
        senderId: store._id,
        receiverId: userId,
        senderModel: 'Store',
        receiverModel: 'User',
        content: newMessage.trim()
      });
      
      // No need to emit separate notification as our backend will handle it
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {store && <Navbar />}
      <div className="flex flex-col h-[calc(100vh-64px)] bg-white relative">
        {/* Fixed Chat Header */}
        <div className="absolute top-16 left-0 right-0 p-4 bg-white border-y border-blue-200 flex items-center gap-3 z-50">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {userName?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="font-semibold">{userName}</h3>
            <p className="text-sm text-gray-500">Customer</p>
          </div>
          <div className="ml-auto">
            <button 
              onClick={() => navigate('/shopdashboard')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Messages Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 mt-[72px] mb-[80px]">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages?.map((message, index) => (
                <div
                  key={message._id || index}
                  className={`flex ${
                    message.senderModel === 'Store' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {/* User (Customer) Message */}
                  {message.senderModel === 'User' && (
                    <div className="flex items-start gap-2 max-w-[80%]">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-medium text-white shrink-0">
                        {userName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                          <p className="text-sm text-gray-800">{message.content}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-2">
                          {new Date(message.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Store (Owner) Message */}
                  {message.senderModel === 'Store' && (
                    <div className="flex items-start gap-2 max-w-[80%]">
                      <div>
                        <div className="bg-blue-600 rounded-lg px-4 py-2 shadow-sm">
                          <p className="text-sm text-white">{message.content}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 text-right mr-2">
                          {new Date(message.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-xs font-medium text-white shrink-0">
                        S
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Fixed Message Input */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t z-50">
          <form onSubmit={sendMessage} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending || !userId || !socket}
              className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default StoreFullChatWindow; 