import React, { useState } from "react";

const SecuritySettingsModal = ({ showModal, onClose, onSave, userData }) => {
  const [editedSecuritySettings, setEditedSecuritySettings] = useState(userData);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setEditedSecuritySettings({
      ...editedSecuritySettings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = () => {
    onSave(editedSecuritySettings);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Edit Security Settings</h3>

        <label className="block text-gray-600 mb-2">Password Changed</label>
        <input
          type="text"
          name="passwordChanged"
          value={editedSecuritySettings.passwordChanged}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-gray-200"
        />

        <label className="block text-gray-600 mb-2 mt-4">Enable Two-Factor Authentication</label>
        <input
          type="checkbox"
          name="twoFactorEnabled"
          checked={editedSecuritySettings.twoFactorEnabled}
          onChange={handleChange}
          className="mr-2"
        />
        <span>Enable</span>

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

export default SecuritySettingsModal;
