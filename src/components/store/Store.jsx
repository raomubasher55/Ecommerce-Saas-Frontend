import { useState } from 'react';
import { useSelector } from 'react-redux';
import ChatWindow from '../chat/ChatWindow';

const Store = () => {
  const [showChat, setShowChat] = useState(false);
  const { store } = useSelector(state => state.store);

  return (
    <div>
      {/* Your existing store content */}
      
      {/* Chat Button */}
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-4 right-4 bg-[#4222C4] text-white px-4 py-2 rounded-full shadow-lg hover:bg-[#3019A0]"
      >
        Chat with Store
      </button>

      {/* Chat Window */}
      {showChat && (
        <ChatWindow
          storeId={store._id}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
};

export default Store; 