import React from 'react';

const ConfirmationModal = ({ show, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[90%] sm:w-2/3 md:w-1/3">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Confirmation</h2>
        <p className="text-sm sm:text-lg mb-4">
          To complete your store registration, an identity document and a Dahabi card are required.  
          After submission, your registration will be confirmed within 1 day. If approved, an amount of 
          <span className='text-blue-700 font-bold'> D.A 120</span> will be charged to your bank account.
        </p>
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 w-full sm:w-auto">
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full sm:w-auto">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
