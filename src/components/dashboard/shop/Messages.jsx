import { useState, useEffect, useContext } from 'react';
import { FaReply, FaTrashAlt, FaUser } from 'react-icons/fa';
import axios from 'axios';
import { useSelector } from 'react-redux';
import UserContext from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Messages = () => {
  const [chats, setChats] = useState([]);
  const [adminChat, setAdminChat] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const { user } = useContext(UserContext);
  const { store } = useSelector(state => state.store);
  const navigate = useNavigate();
  const ENDPOINT = import.meta.env.VITE_APP_API_URL;

  const isStore = !!store?._id;
  const currentId = isStore ? store._id : user?._id;
  const currentType = isStore ? 'Store' : 'User';

  // Fetch all chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${ENDPOINT}/api/v1/chat/list`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('storeToken')}`
          }
        });
        
        // Filter out admin chat
        const customerChats = data.filter(chat => !chat.isAdminChat);
        const adminChats = data.filter(chat => chat.isAdminChat);
        
        setChats(customerChats);
        if (adminChats.length > 0) {
          setAdminChat(adminChats[0]);
        }

        const adminData = await axios.get(`${ENDPOINT}/api/v1/chat/admin/first`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('storeToken')}`
          }
        });
        setAdmin(adminData.data.admin);

      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentId) {
      fetchChats();
    }
  }, [currentId, currentType, ENDPOINT]);

  // Delete chat
  const deleteChat = async (chatId) => {
    try {
      const { data } = await axios.delete(`${ENDPOINT}/api/v1/chat/${chatId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('storeToken')}`
        }
      });

      if (data.success) {
        setChats(chats.filter(chat => chat._id !== chatId));
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  // Navigate to full chat window
  const openChat = (chatId) => {
    navigate(`/chat/store/full/${chatId}`);
  };

  // Open admin chat or create one if it doesn't exist
  const openAdminChat = async () => {
    if (adminChat) {
      navigate(`/chat/store-admin/${adminChat._id}`);
    } else {
      try {
        const { data } = await axios.post(`${ENDPOINT}/api/v1/chat/store-admin/create`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('storeToken')}`
          }
        });
        
        if (data._id) {
          navigate(`/chat/store-admin/${data._id}`);
        }
      } catch (error) {
        console.error('Error creating admin chat:', error);
      }
    }
  };

  // Filter chats - exclude admin chats completely
  const filteredChats = filter === 'All'
    ? chats.filter(chat => !chat.isAdminChat)
    : chats.filter(chat => !chat.isAdminChat && chat.status === filter);

  // Get other participant's info
  const getOtherParticipant = (chat) => {
    // Get the other participant object
    const participant = chat.participants?.find(p => p.type !== currentType)?.id || {};
    
    // Check if this participant is an admin
    const isAdmin = participant?._id === admin?._id;
    
    // Add an "isAdmin" flag to the participant object
    return {
      ...participant,
      isAdmin
    };
  };

  return (
    <div className="p-6 bg-gray-100 space-y-6 relative">
      {/* Header */}
      <h1 className="text-2xl font-bold text-[#4222C4]">Messages</h1>
      <p className="text-gray-600">
        {isStore ? 'Manage customer messages and admin communications here.' : 'View your conversations with stores.'}
      </p>

      {/* Admin Chat Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaUser className="mr-2 text-[#4222C4]" />
          Platform Administration
        </h3>
        
        <div className="flex items-center justify-between border rounded-lg p-4 bg-gray-50">
          <div>
            <p className="font-medium">Admin Support</p>
            <p className="text-sm text-gray-500">
              Contact the platform administrators for help or inquiries
            </p>
          </div>
          
          <button
            onClick={openAdminChat}
            className="px-4 py-2 bg-[#4222C4] text-white rounded-md hover:bg-[#3a1da9] transition-colors"
          >
            {adminChat ? 'Open Conversation' : 'Start Conversation'}
          </button>
        </div>
      </div>

      {/* Stats and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div>
          <p className="text-gray-600">Customer Messages: {chats.length}</p>
          {isStore && (
            <p className="text-gray-600">
              Unanswered: {chats.filter(chat => chat.status === 'Pending').length}
            </p>
          )}
        </div>

        <select
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="All">All Messages</option>
          <option value="Pending">Pending</option>
          <option value="Answered">Answered</option>
        </select>
      </div>

      {/* Messages Table */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {isStore ? 'Customer Messages' : 'Store Messages'}
        </h3>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-700"></div>
          </div>
        ) : (
          <div className='w-full overflow-hidden'>
            {chats.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No messages from customers yet.</p>
            ) : (
              <div className='relative w-full h-[300px] overflow-scroll'>
                <div className="absolute left-0 top-0 w-full">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-[#4222C4] text-white">
                        <th className="px-4 py-2 text-left">
                          {isStore ? 'Customer' : 'Store'}
                        </th>
                        <th className="px-4 py-2 text-left">Last Message</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredChats
                        .filter(chat => {
                          const otherParticipant = getOtherParticipant(chat);
                          return !otherParticipant.isAdmin; // Exclude Admins
                        })
                        .map((chat) => {
                          const otherParticipant = getOtherParticipant(chat);
                          return (
                            <tr key={chat._id} className="border-t hover:bg-gray-100">                            
                              <td className="px-4 py-2">
                                {otherParticipant.name}
                              </td>
                              <td className="px-4 py-2">
                                {chat.messages && chat.messages.length > 0 
                                  ? `${chat.messages[chat.messages.length - 1]?.content?.slice(0, 20)}${chat.messages[chat.messages.length - 1]?.content?.length > 20 ? "..." : ""}`
                                  : "No messages yet"}
                              </td>
                              <td className="px-4 py-2">
                                <span className={`px-2 py-1 rounded-full text-sm ${chat.status === 'Pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-green-100 text-green-800'
                                  }`}>
                                  {chat.status}
                                </span>
                              </td>
                              <td className="px-4 py-2">
                                {chat.lastMessage ? new Date(chat.lastMessage).toLocaleDateString() : "N/A"}
                              </td>
                              <td className="px-4 py-2 space-x-4">
                                <button
                                  onClick={() => openChat(chat?._id)}
                                  className="text-blue-500 hover:text-blue-700"
                                >
                                  <FaReply />
                                </button>
                                <button
                                  onClick={() => deleteChat(chat._id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <FaTrashAlt />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages; 