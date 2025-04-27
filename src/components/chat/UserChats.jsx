import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../../components/context/UserContext';

const UserChats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const ENDPOINT = import.meta.env.VITE_APP_API_URL;

  useEffect(() => {
    const fetchChats = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Use the user chats endpoint
        const response = await axios.get(`${ENDPOINT}/api/v1/chat/user/list`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setChats(response.data || []);
      } catch (err) {
        console.error('Error fetching chats:', err);
        setError('Failed to load messages. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user, ENDPOINT]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 bg-indigo-600 text-white">
        <h2 className="text-xl font-semibold">Your Messages</h2>
      </div>
      
      {chats.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <p>You don't have any messages yet.</p>
          <p className="mt-2">Visit stores to start a conversation!</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {chats.map((chat) => {
            // Determine the other participant (non-user)
            const otherParticipant = chat.participants.find(p => p.type === 'Store');
            const lastMessage = chat.messages.length > 0 
              ? chat.messages[chat.messages.length - 1] 
              : null;

              // Extract the store ID directly
            const storeId = otherParticipant?.id?._id;
            
            // Only render if we have a valid store ID
            if (!storeId) {
              console.warn("Missing store ID for chat:", chat._id);
              return null;
            }
            
            return (
              <li key={chat._id} className="hover:bg-gray-50">
                <Link 
                  to={`/chat/user/${storeId}`}
                  className="block p-4"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {otherParticipant?.name?.charAt(0) || 'S'}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {otherParticipant?.name || 'Store'}
                        </h3>
                        {lastMessage && (
                          <p className="text-xs text-gray-500">
                            {new Date(lastMessage.timestamp).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                      
                      <p className="mt-1 text-sm text-gray-600 truncate">
                        {lastMessage 
                          ? lastMessage.content 
                          : 'No messages yet'}
                      </p>
                      
                      {chat.status === 'Pending' && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                          Pending
                        </span>
                      )}
                    </div>
                    
                    <div className="ml-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default UserChats;
