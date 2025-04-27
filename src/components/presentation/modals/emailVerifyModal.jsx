import React from 'react';
import companyLogo from '../../../assets/logo.png';

export default function EmailVerifyModal({ handleReturnHome }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg shadow-2xl text-center w-96 animate-fadeIn">
        {/* Company Logo */}
        <img src={companyLogo} alt="Company Logo" className="w-24 h-16 mx-auto mb-4" />

        <h2 className="text-2xl font-bold text-gray-800">Verify Your Email</h2>
        <p className="mt-2 text-gray-600">Please verify your email within <span className="font-semibold text-red-500">15 minutes</span> to continue.</p>

        {/* Open Gmail Button */}
        <div className="mt-6">
          <a 
            href="https://mail.google.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition duration-300"
          >
            Open Gmail
          </a>
        </div>

        {/* Return Home Button */}
        <button 
          onClick={handleReturnHome} 
          className="mt-4 w-full bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-800 transition duration-300"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
