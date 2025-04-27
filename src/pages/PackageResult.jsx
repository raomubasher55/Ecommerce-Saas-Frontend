import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCheckCircle } from 'react-icons/fa';
import logo from '../assets/logo.png'

const PackageResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const storeToken = localStorage.getItem('storeToken');
  const params = new URLSearchParams(location.search);
  const orderId = params.get('orderId');
  const isCancel = location.pathname === '/package/failed';
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  const handleConfirm = async () => {
    try {
      if (isCancel) {
        navigate('/');
        return;
      }

      const { data } = await axios.get(
        `${import.meta.env.VITE_REGISTER_API}/api/v1/package/confirm-payment/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${storeToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("The data is from the payment confirmation, " , data)
      if (data.data.paymentStatus === 'paid') {
        setPaymentData(data.data);
        setShowSuccessPopup(true);
      } else {
        toast.error('Payment failed');
        // navigate('/');
      }
    } catch (error) {
      console.error('Payment confirmation error:', error);
      toast.error('Payment confirmation failed');
    //   navigate('/');
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {isCancel ? 'Payment Cancelled' : 'Confirm Your Payment'}
          </h2>
          <p className="mb-4 text-gray-600">
            {isCancel 
              ? 'Your payment was cancelled. Click below to return home.'
              : 'Click the button below to confirm your payment'
            }
          </p>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isCancel ? 'Return Home' : 'Confirm Payment'}
          </button>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && paymentData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
          <img src={logo} alt="logo" className="w-[40%]  h-20 mx-auto mb-4" />
            <div className="text-center">
              <FaCheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h2 className="mt-4 text-2xl font-bold text-gray-900">
                Payment Successful!
              </h2>
              <p className="mt-2 text-gray-600">
                Your payment has been processed successfully.
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Order Amount: {(paymentData.amount || paymentData.satimResponse?.Amount)?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Order Number: {paymentData.orderNumber || paymentData.satimResponse?.OrderNumber}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PackageResult;