import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { FaCcAmex, FaCcDinersClub, FaCcDiscover, FaCcJcb, FaCcMastercard, FaCcVisa, FaRegCreditCard, FaSimCard, FaTimes } from 'react-icons/fa';

const PaymentApprove = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWithdrawals = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/v1/store/admin/withdrawals`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setWithdrawals(data.withdrawals);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching withdrawals');
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleApprove = async (storeId, withdrawalId) => {
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/api/v1/store/admin/withdrawals/${withdrawalId}/approve`,
        { storeId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      toast.success(data.message);
      fetchWithdrawals(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Approval failed');
    }
    setLoading(false);
  };

  // Separate withdrawals by status
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');
  const approvedWithdrawals = withdrawals.filter(w => w.status === 'completed');

  // State for payment details modal
  const [selectedDetails, setSelectedDetails] = useState(null);

  const cardStyles = {
    Visa: { bg: "bg-gradient-to-r from-blue-500 to-blue-800", icon: <FaCcVisa className="text-blue-600" /> },
    MasterCard: { bg: "bg-gradient-to-r from-red-500 to-orange-600", icon: <FaCcMastercard className="text-red-600" /> },
    Amex: { bg: "bg-gradient-to-r from-green-500 to-green-700", icon: <FaCcAmex className="text-green-600" /> },
    Discover: { bg: "bg-gradient-to-r from-orange-500 to-yellow-500", icon: <FaCcDiscover className="text-orange-600" /> },
    DinersClub: { bg: "bg-gradient-to-r from-purple-500 to-purple-800", icon: <FaCcDinersClub className="text-purple-600" /> },
    JCB: { bg: "bg-gradient-to-r from-yellow-500 to-yellow-800", icon: <FaCcJcb className="text-yellow-600" /> },
    Default: { bg: "bg-gradient-to-r from-gray-600 to-gray-800", icon: <FaRegCreditCard className="text-white" /> },
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Withdrawal Requests</h2>

      {/* Pending Section */}
      <div className="mb-12">
        <h3 className="text-lg font-semibold mb-4">Pending Applications ({pendingWithdrawals.length})</h3>
        <div className="space-y-4">
          {pendingWithdrawals.map((withdrawal) => (
            <WithdrawalItem
              key={withdrawal._id}
              withdrawal={withdrawal}
              onShowDetails={() => setSelectedDetails(withdrawal.store.paymentDetails)}
              onApprove={() => handleApprove(withdrawal.store._id, withdrawal._id)}
            />
          ))}
        </div>
      </div>

      {/* Approved Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Approved History ({approvedWithdrawals.length})</h3>
        <div className="space-y-4">
          {approvedWithdrawals.map((withdrawal) => (
            <WithdrawalItem
              key={withdrawal._id}
              withdrawal={withdrawal}
              onShowDetails={() => setSelectedDetails(withdrawal.store.paymentDetails)}
            />
          ))}
        </div>
      </div>

      {/* Payment Details Modal */}
      {selectedDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="flex justify-center relative">
            <div
              className={`relative w-96 h-56 p-6 rounded-xl shadow-xl text-white 
                     flex flex-col justify-between transform transition-transform hover:scale-105
                     ${cardStyles[selectedDetails.cardType]?.bg || cardStyles.Default.bg}`}
            >
              {/* Chip Icon */}
              <div className="absolute top-4 left-4 text-4xl text-gray-200">
                <FaSimCard />
              </div>

              {/* Card Number */}
              <h3 className="text-lg tracking-widest mt-10">{selectedDetails.cardNumber}</h3>

              {/* Holder Name & Expiry */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs uppercase text-gray-200">Card Holder</p>
                  <p className="text-lg font-semibold">{selectedDetails.holderName}</p>
                </div>
                <div className="mr-10">
                  <p className="text-xs uppercase text-gray-200">Expires</p>
                  <p className="text-lg font-semibold">{selectedDetails.expiryDate}</p>
                </div>
              </div>

              {/* Card Type Icon */}
              <div className="absolute bottom-4 right-4 text-4xl">
                {cardStyles[selectedDetails.cardType]?.icon || cardStyles.Default.icon}
              </div>
            </div>
            <button
              onClick={() => setSelectedDetails(null)}
              className="absolute right-[-50px] top-[-40px] mt-4 w-max bg-blue-600 text-white py-2 px-2 rounded-full"
            >
              <FaTimes className="text-red-600 text-2xl" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const WithdrawalItem = ({ withdrawal, onShowDetails, onApprove }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
    <div>
      <p className="font-medium">{withdrawal.store.name}</p>
      <p className="text-gray-600">Amount: ${withdrawal.amount}</p>
      <p className="text-sm text-gray-500">
        Requested: {new Date(withdrawal.createdAt).toLocaleDateString()}
      </p>
    </div>

    <Menu as="div" className="relative">
      <Menu.Button className="p-1 hover:bg-gray-100 rounded-full">
        <EllipsisVerticalIcon className="h-6 w-6 text-gray-600" />
      </Menu.Button>

      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Menu.Items className="absolute right-0 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onShowDetails}
                className={`${active ? 'bg-blue-50' : ''
                  } w-full px-4 py-2 text-left text-sm`}
              >
                View Details
              </button>
            )}
          </Menu.Item>
          {onApprove && (
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onApprove}
                  className={`${active ? 'bg-blue-50' : ''
                    } w-full px-4 py-2 text-left text-sm text-green-600`}
                >
                  Approve
                </button>
              )}
            </Menu.Item>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  </div>
);

const StoreInfo = ({ store }) => (
  <div>
    <p className="font-medium">{store.name}</p>
    <p className="text-sm text-gray-500">{store.email}</p>
  </div>
);

const StatusBadge = ({ status }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${status === 'completed'
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800'
    }`}>
    {status}
  </span>
);

const ApproveButton = ({ status, loading, onClick, fullWidth }) => (
  <button
    onClick={onClick}
    disabled={status === 'completed' || loading}
    className={`px-4 py-2 rounded-md ${status === 'pending'
        ? 'bg-blue-600 text-white hover:bg-blue-700'
        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
      } ${fullWidth ? 'w-full' : ''}`}
  >
    {loading ? 'Processing...' : 'Approve'}
  </button>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-600">{label}:</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

export default PaymentApprove;
