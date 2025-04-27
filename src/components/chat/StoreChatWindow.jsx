import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useSelector } from 'react-redux';
const ENDPOINT = import.meta.env.VITE_APP_API_URL;
let socket;

const StoreChatWindow = ({  selectedChat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const [userId, setUserId] = useState(null);
  const {store} = useSelector(state => state.store);
  // Initialize socket connection
  useEffect(() => {
    socket = io(ENDPOINT);

    socket.on('connect', () => {
      socket.emit('identify', { id: store?._id, role: 'Store' });
    });

    // Listen for incoming messages
    socket.on('receive_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [store._id]);

  // Fetch messages for selected chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;

      try {
        setLoading(true);
        const { data } = await axios.get(`${ENDPOINT}/api/v1/chat/store/chat/${selectedChat}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('storeToken')}`
            }
        });

        
        // Set the userId from the first message's receiver (if it exists)
        const firstMessage = data?.[0];
        if (firstMessage) {
          const chatUserId = firstMessage.senderModel === 'User' 
            ? firstMessage.sender 
            : firstMessage.receiver;
          setUserId(chatUserId);
        }
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedChat]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !userId) return;
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
      socket.emit('send_message', {
        senderId: store._id,
        receiverId: userId,
        senderModel: 'Store',
        receiverModel: 'User',
        content: newMessage.trim(),
        timestamp: new Date().toISOString()
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50 reltiave">
      {/* Fixed Chat Header */}
      {selectedChat && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-white border-b flex items-center gap-3 z-50">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            U
          </div>
          <div>
            <h3 className="font-semibold">User Chat</h3>
            <p className="text-sm text-gray-500">
              {selectedChat.updatedAt && new Date(selectedChat.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 mt-[72px] mb-[80px]">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
                {/* User (Receiver) Message */}
                {message.senderModel === 'User' && (
                  <div className="flex items-end gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-white">
                      U
                    </div>
                    <div className="max-w-[80%] bg-gray-200 rounded-t-2xl rounded-br-2xl px-4 py-2">
                      <p className="text-sm text-gray-800">{message.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {/* Store (Sender) Message */}
                {message.senderModel === 'Store' && (
                  <div className="flex items-end gap-2">
                    <div className="max-w-[80%] bg-blue-500 rounded-t-2xl rounded-bl-2xl px-4 py-2">
                      <p className="text-sm text-white">{message.content}</p>
                      <p className="text-xs text-blue-100 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                      </p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-medium text-white">
                      S
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Message Input */}
      {selectedChat && userId && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t z-50">
          <form onSubmit={sendMessage} className="flex flex-col sm:flex-row gap-4 sm:gap-2 items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors
               w-full sm:w-max flex justify-center items-center"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default StoreChatWindow;
