import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyStoreEmail } from '../store/actions/storeActions';
import { useLanguage } from '../context/LanguageContext';

const StoreEmailVerification = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedLanguage, translateText } = useLanguage();
  
  const [verificationStatus, setVerificationStatus] = useState({
    loading: true,
    success: false,
    error: null
  });
  
  const [translatedContent, setTranslatedContent] = useState({
    loadingTitle: "Verifying your email...",
    loadingMessage: "Please wait while we verify your email address.",
    successTitle: "Email Verified!",
    successMessage: "Your email has been successfully verified.",
    successSubMessage: "You can now log in to your store account.",
    proceedButton: "Proceed to Login",
    errorTitle: "Verification Failed",
    defaultError: "Invalid or expired verification link.",
    registerAgain: "Register Again",
    contactSupport: "Contact Support"
  });
  
  
  useEffect(() => {
    const translateAll = async () => {
      if (selectedLanguage === "English") return;
      
      try {
        const translations = {
          loadingTitle: await translateText("Verifying your email..."),
          loadingMessage: await translateText("Please wait while we verify your email address."),
          successTitle: await translateText("Email Verified!"),
          successMessage: await translateText("Your email has been successfully verified."),
          successSubMessage: await translateText("You can now log in to your store account."),
          proceedButton: await translateText("Proceed to Login"),
          errorTitle: await translateText("Verification Failed"),
          defaultError: await translateText("Invalid or expired verification link."),
          registerAgain: await translateText("Register Again"),
          contactSupport: await translateText("Contact Support")
        };
        setTranslatedContent(translations);
      } catch (error) {
        console.error("Translation error:", error);
      }
    };
    
    translateAll();
  }, [selectedLanguage, translateText]);

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
            error: err.message || translatedContent.defaultError
          });
        });
    }
  }, [token, dispatch, translatedContent.defaultError]);
  
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
              <h2 className="text-xl font-semibold text-gray-700">{translatedContent.loadingTitle}</h2>
              <p className="text-gray-500 mt-2">{translatedContent.loadingMessage}</p>
            </div>
          ) : verificationStatus.success ? (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{translatedContent.successTitle}</h2>
              <p className="text-gray-600 mt-2">{translatedContent.successMessage}</p>
              <p className="text-gray-600 mt-1">{translatedContent.successSubMessage}</p>
              <button 
                onClick={handleRedirect}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
              >
                {translatedContent.proceedButton}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{translatedContent.errorTitle}</h2>
              <p className="text-gray-600 mt-2">
                {verificationStatus.error || translatedContent.defaultError}
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => navigate('/register-store')}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
                >
                  {translatedContent.registerAgain}
                </button>
                <button 
                  onClick={() => navigate('/contact-us')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                >
                  {translatedContent.contactSupport}
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