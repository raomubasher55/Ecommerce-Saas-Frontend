import React, { useState, useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import UserContext from '../context/UserContext';
import { useNavigate, useParams } from 'react-router-dom';
const ENDPOINT = import.meta.env.VITE_APP_API_URL;
let socket;

const UserChatDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const [chatId, setChatId] = useState(null);
  const {user} = useContext(UserContext);
  const {id} = useParams();
  const storeId = id;
  const navigate = useNavigate();

  useEffect(() => {
    socket = io(ENDPOINT);

    socket.on('connect', () => {
      socket.emit('identify', { id: user?._id, role: 'User' });
    });

    socket.on('receive_message', (message) => {
      if (message.sender === storeId || message.receiver === storeId) {
        setMessages(prev => [...prev, message]);
      }
    });

    return () => {
      socket.disconnect();
    };


    }, [user?._id, storeId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const {data} = await axios.post(`${ENDPOINT}/api/v1/chat/find-or-create`, {
          storeId,
          senderModel: 'User',
          receiverModel: 'Store'
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setChatId(data?._id); 
        setMessages(data?.messages || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    if (storeId && user) {
      fetchMessages();
    }
  }, [storeId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const newMsg = {
        sender: user?._id,
        receiver: storeId,
        senderModel: 'User',
        receiverModel:'Store',
        content: newMessage.trim(),
        timestamp: new Date().toISOString()
      };

      // Add message to local state immediately for better UX
      setMessages(prev => [...prev, newMsg]);
      
      // Emit the message through socket
      socket.emit('send_message', {
        senderId: user?._id,
        receiverId: storeId,
        senderModel: 'User',
        receiverModel: 'Store',
        content: newMessage.trim()
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
      return; 
    }
}, [user, navigate]);

  return (
    <>

      <div className="flex flex-col h-[calc(100vh-64px)] bg-white relative">
        {/* Fixed Chat Header */}
        <div className="absolute top-16 left-0 right-0 p-4 bg-white border-y border-blue-200 flex items-center gap-3 z-50">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
            S
          </div>
          <div>
            <h3 className="font-semibold">Store Chat</h3>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>

        {/* Messages Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 mt-[72px] mb-[80px]">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-700"></div>
            </div>
          ) : (
            <div className="space-y-4 ">
              {messages?.map((message, index) => (
                <div
                  key={message._id || index}
                  className={`flex ${
                    message.senderModel === 'User' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {/* Store (Receiver) Message */}
                  {message.senderModel === 'Store' && (
                    <div className="flex items-start gap-2 max-w-[80%]">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-medium text-white shrink-0">
                        S
                      </div>
                      <div>
                        <div className="bg-white rounded-lg px-4 py-2 shadow-sm ">
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

                  {/* User (Sender) Message */}
                  {message.senderModel === 'User' && (
                    <div className="flex items-start gap-2 max-w-[80%]">
                      <div>
                        <div className="bg-indigo-600 rounded-lg px-4 py-2 shadow-sm">
                          <p className="text-sm text-white">{message.content}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 text-right mr-2">
                          {new Date(message.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-medium text-white shrink-0">
                        U
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
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t z-50">
          <form onSubmit={sendMessage} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="px-6 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>

    </>
  );
};

export default UserChatDashboard;
