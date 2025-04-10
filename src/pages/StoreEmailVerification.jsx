// EmailVerification.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyStoreEmail } from '../store/actions/storeActions'; 

const StoreEmailVerification = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [verificationStatus, setVerificationStatus] = useState({
    loading: true,
    success: false,
    error: null
  });
  
  const { loading, error } = useSelector(state => state.store);
  
  useEffect(() => {
    if (token) {
      dispatch(verifyStoreEmail(token))
        .then((response) => {
          setVerificationStatus({
            loading: false,
            success: true,
            error: null
          });
        })
        .catch((err) => {
          setVerificationStatus({
            loading: false,
            success: false,
            error: err.message || 'Verification failed. Please try again.'
          });
        });
    }
  }, [token, dispatch]);
  
  const handleRedirect = () => {
    navigate('/upload-documents'); 
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          {verificationStatus.loading ? (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-700">Verifying your email...</h2>
              <p className="text-gray-500 mt-2">Please wait while we verify your email address.</p>
            </div>
          ) : verificationStatus.success ? (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Email Verified!</h2>
              <p className="text-gray-600 mt-2">Your email has been successfully verified.</p>
              <p className="text-gray-600 mt-1">You can now log in to your store account.</p>
              <button 
                onClick={handleRedirect}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
              >
                Proceed to Login
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Verification Failed</h2>
              <p className="text-gray-600 mt-2">
                {verificationStatus.error || 'Invalid or expired verification link.'}
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => navigate('/register-store')}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
                >
                  Register Again
                </button>
                <button 
                  onClick={() => navigate('/contact-us')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                >
                  Contact Support
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreEmailVerification;