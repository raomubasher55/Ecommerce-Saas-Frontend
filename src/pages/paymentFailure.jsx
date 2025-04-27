import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';

const PaymentFailure = () => {
  const { orderNumber } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <FaTimesCircle className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Payment Failed
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Order #{orderNumber}
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <p className="text-center text-gray-700">
            We're sorry, but your payment could not be processed. Please try again or contact support if the problem persists.
          </p>
          <div className="flex flex-col space-y-3">
            <Link
              to="/cart"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Try Again
            </Link>
            <Link
              to="/"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
