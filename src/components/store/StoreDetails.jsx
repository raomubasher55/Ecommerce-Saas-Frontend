import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStoreDetails } from '../../store/actions/storeActions';
import UserChatWindow from '../chat/UserChatWindow';
import Loader from '../layout/Loader';
import  UserContext  from '../context/UserContext';

const StoreDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [showChat, setShowChat] = useState(false);
  const { store, loading, error } = useSelector((state) => state.storeDetails);
  const {user} = useContext(UserContext);

  useEffect(() => {
    if (id) {
      dispatch(fetchStoreDetails(id));
    }
  }, [dispatch, id]);

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <div><Loader /></div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : store ? (
        <div>
          {/* Store details content */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold">{store.name}</h1>
            {/* Other store details */}
          </div>

          {/* Chat button and window */}
          <div className="fixed bottom-4 right-4">
            {!showChat ? (
              <button
                onClick={() => setShowChat(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg"
              >
                Chat with Store
              </button>
            ) : (
              <div className="bg-white rounded-lg shadow-xl">
                <div className="flex justify-between items-center p-3 border-b">
                  <h3 className="font-semibold">Chat with {store.name}</h3>
                  <button
                    onClick={() => setShowChat(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
                <UserChatWindow 
                storeId={id}
                user={user}
                />
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default StoreDetails; 