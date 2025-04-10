import React, { useState } from "react";

const PersonalInfoModal = ({ showModal, onClose, onSave, userData }) => {
  const [editedData, setEditedData] = useState(userData);

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(editedData);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Edit Personal Information</h3>
        <label className="block text-gray-600 mb-2">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={editedData.fullName}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-gray-200"
        />
        <label className="block text-gray-600 mb-2 mt-4">Email</label>
        <input
          type="email"
          name="email"
          value={editedData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-gray-200"
        />
                <label className="block text-gray-600 mb-2 mt-4">Phone</label>
        <input
          type="phoneNumber"
          name="phoneNumber"
          value={editedData.phoneNumber}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-gray-200"
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            className="bg-[#4222C4] text-white px-6 py-2 rounded-md hover:bg-[#2e179b] transition"
          >
            Save Changes
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 text-red-500 hover:text-red-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PersonalInfoModal;
