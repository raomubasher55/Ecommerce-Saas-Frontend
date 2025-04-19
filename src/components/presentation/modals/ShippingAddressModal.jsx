import React, { useState, useEffect } from "react";

const ShippingAddressModal = ({ showModal, onClose, onSave, userData }) => {
  const [editedAddress, setEditedAddress] = useState(userData);

  useEffect(() => {
    setEditedAddress(userData); // Update state when userData changes
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedAddress({ ...editedAddress, [name]: value });
  };

  const handleSave = () => {
    onSave(editedAddress);  // Save updated address
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Edit Shipping Address</h3>

        <label className="block text-gray-600 mb-2">Address Line 1</label>
        <input
          type="text"
          name="addressLine1"
          value={editedAddress.addressLine1 || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-gray-200"
        />

        <label className="block text-gray-600 mb-2 mt-4">Address Line 2</label>
        <input
          type="text"
          name="addressLine2"
          value={editedAddress.addressLine2 || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-gray-200"
        />

        <label className="block text-gray-600 mb-2 mt-4">City</label>
        <input
          type="text"
          name="city"
          value={editedAddress.city || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-gray-200"
        />

        <label className="block text-gray-600 mb-2 mt-4">State</label>
        <input
          type="text"
          name="state"
          value={editedAddress.state || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-gray-200"
        />

        <label className="block text-gray-600 mb-2 mt-4">Postal Code</label>
        <input
          type="text"
          name="postalCode"
          value={editedAddress.postalCode || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-gray-200"
        />

        <label className="block text-gray-600 mb-2 mt-4">Country</label>
        <input
          type="text"
          name="country"
          value={editedAddress.country || ""}
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

export default ShippingAddressModal;
