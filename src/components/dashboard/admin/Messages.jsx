import { useState, useEffect } from 'react';
import { FaReply, FaTrashAlt, FaSearch, FaStore, FaTrash, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Messages = () => {
  const [storeChats, setStoreChats] = useState([]);
  const [allStores, setAllStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [deleteModal , setDeleteModal] = useState(false)
  const ENDPOINT = import.meta.env.VITE_APP_API_URL;

  // Fetch store chats
  useEffect(() => {
    const fetchStoreChats = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${ENDPOINT}/api/v1/chat/admin/store-chats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setStoreChats(data);
      } catch (error) {
        console.error('Error fetching store chats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreChats();
  }, [ENDPOINT]);

  // Fetch all stores for potential new chats
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const { data } = await axios.get(`${ENDPOINT}/api/v1/store/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setAllStores(data.stores.docs || []);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    fetchStores();
  }, [ENDPOINT]);

  // Start a new chat with store
  const startChat = async (storeId) => {
    try {
      const { data } = await axios.post(
        `${ENDPOINT}/api/v1/chat/admin-store/create`,
        { storeId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (data._id) {
        navigate(`/chat/admin-store/${data._id}`);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  // Open existing chat
  const openChat = (chatId) => {
    navigate(`/chat/admin-store/${chatId}`);
  };

  // Delete chat
  const deleteChat = async (chatId) => {
    try {
      const { data } = await axios.delete(`${ENDPOINT}/api/v1/chat/${chatId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (data.success) {
        setStoreChats(storeChats?.filter(chat => chat._id !== chatId));
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  // Filter chats based on filter selection
  const filteredChats = filter === 'All'
    ? storeChats
    : storeChats?.filter(chat => chat.status === filter);

  // Filter stores based on search term
  const filteredStores = allStores?.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDeleteModal = ()=>{
    setDeleteModal(!deleteModal);
  }

  const handleDeleteAllChats = ()=>{
    setDeleteModal(!deleteModal);
    deleteAllChats();
  }

  const deleteAllChats = async ()=>{
    try {
      const { data } = await axios.delete(`${ENDPOINT}/api/v1/chat/admin/all-chat-delete`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if(data.success){
        
        setStoreChats([])
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="p-6 bg-gray-100 space-y-6 relative">
      {/* Header */}
      <h1 className="text-2xl font-bold text-[#4222C4]">Store Communications</h1>
      <p className="text-gray-600">
        Manage your conversations with stores on the platform.
      </p>

      {/* Stats and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div>
          <p className="text-gray-600">Total Store Chats: {storeChats?.length}</p>
          <p className="text-gray-600">
            Unanswered: {storeChats?.filter(chat => chat.status === 'Pending').length}
          </p>
        </div>

        <select
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="All">All Chats</option>
          <option value="Pending">Pending</option>
          <option value="Answered">Answered</option>
        </select>
      </div>

      {/* Existing Conversations */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <div className='flex flex-col sm:flex-row justify-between items-center mb-4'>
          <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-4">
            Existing Conversations
          </h3>
          <button onClick={openDeleteModal} className="bg-red-600 hover:bg-red-700 text-white text-sm sm:text-balance font-semibold py-2 px-4 rounded-xl shadow-md transition-all duration-300 ease-in-out hover:scale-105 active:scale-95">
            Delete All
          </button>

        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-700"></div>
          </div>
        ) : (
          <div className='w-full overflow-hidden'>
            {filteredChats?.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No conversations with stores yet.</p>
            ) : (
              <div className='relative w-full h-[300px] overflow-scroll'>
                <div className="absolute left-0 top-0 w-full">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-[#4222C4] text-white">
                      <th className="px-4 py-2 text-left">#</th>
                        <th className="px-4 py-2 text-left">Store</th>
                        <th className="px-4 py-2 text-left">Last Message</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredChats?.map((chat , index) => (
                        <tr key={chat._id} className="border-t hover:bg-gray-100">
                          <td className="px-4 py-2">
                            {index + 1}
                          </td>
                          <td className="px-4 py-2">
                            {chat.storeName || "Unknown Store"}
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
                              onClick={() => openChat(chat._id)}
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Start New Conversations */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaStore className="mr-2 text-[#4222C4]" />
          Start New Conversation
        </h3>

        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search stores..."
            className="pl-10 w-full p-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredStores.map((store) => (
            <div key={store._id} className="border p-4 rounded-lg hover:shadow-md">
              <h4 className="font-medium">{store.name}</h4>
              <p className="text-sm text-gray-500 mb-2">{store.email}</p>
              <button
                onClick={() => startChat(store._id)}
                className="w-full mt-2 px-3 py-1.5 bg-[#4222C4] text-white rounded-md hover:bg-[#3a1da9] transition-colors"
              >
                Start Chat
              </button>
            </div>
          ))}

          {filteredStores.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-4">
              No stores match your search
            </div>
          )}
        </div>
      </div>

      {deleteModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div className="bg-white rounded-2xl shadow-2xl w-[90%] sm:w-[400px] p-6 animate-fade-in-up">
      {/* Icon & Title */}
      <div className="flex flex-col items-center text-center">
        <FaTrash className="text-red-500 text-4xl mb-3" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Are you sure?
        </h2>
        <p className="text-gray-600 text-sm">
          You are about to delete all chats. This action cannot be undone.
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={handleDeleteAllChats} 
          className="flex flex-col sm:flex-row items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-xl transition-all duration-300"
        >
          <FaTrash className="text-white" />
          Delete All
        </button>

        <button
          onClick={() => setDeleteModal(false)}
          className="flex flex-col sm:flex-row items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-xl transition-all duration-300"
        >
          <FaTimesCircle className="text-gray-600" />
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Messages;
