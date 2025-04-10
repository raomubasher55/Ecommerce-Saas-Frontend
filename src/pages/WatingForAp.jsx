import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt, FaHourglassHalf } from 'react-icons/fa';

const WatingForAp = () => {
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleReturnHome();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleReturnHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <FaFileAlt className="text-6xl text-purple-600" />
            <div className="absolute -top-2 -right-2">
              <FaHourglassHalf className="text-3xl text-yellow-500 animate-pulse" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Documents Under Review
        </h1>

        <p className="text-gray-600 mb-6">
          Your documents are currently being reviewed by our team. This process typically takes 24-48 hours.
        </p>

        <div className="space-y-4 mb-6">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h2 className="font-semibold text-purple-700 mb-2">What's Next?</h2>
            <ul className="text-left text-gray-600 space-y-2">
              <li>• Our team will verify your submitted documents</li>
              <li>• You'll receive an email notification once approved</li>
              <li>• You can then proceed with setting up your store</li>
            </ul>
          </div>
        </div>


        {/* Countdown Timer */}
        <div className="text-lg font-semibold text-gray-800 mb-6">
          Auto-returning home in: <span className="text-red-600">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
        </div>

        <button
          onClick={() => navigate('/upload-documents/choose-plans')}
          className="w-full bg-[#4222C4] text-white py-3 px-6 rounded-lg hover:bg-[#3618a0] transition-colors duration-300"
        >
          Make Payment
        </button>

        {/* Return Home Button */}
        <button
          onClick={handleReturnHome}
          className="w-full bg-red-500 text-white py-3 px-6 mt-4 rounded-lg hover:bg-red-600 transition-colors duration-300"
        >
          Return Home
        </button>

        <div className="space-y-4 mt-4">


          <button
            onClick={() => navigate('/contact-us')}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-300"
          >
            Contact Support
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>Need help? Contact our support team at</p>
          <a href="mailto:contact@cebleu.com" className="text-purple-600 hover:text-purple-700">
          contact@cebleu.com
          </a>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="mt-8 bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Document Status</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-4 w-4 rounded-full bg-green-500"></div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Documents Submitted</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0 h-4 w-4 rounded-full bg-yellow-500 animate-pulse"></div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Under Review</p>
              <p className="text-sm text-gray-500">In Progress</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0 h-4 w-4 rounded-full bg-gray-200"></div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Final Approval</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatingForAp;
