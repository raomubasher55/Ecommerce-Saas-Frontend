import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShippingAddressModal from '../../presentation/modals/ShippingAddressModal';
import NotificationsModal from '../../presentation/modals/NotificationsModal';
import PaymentMethodModal from '../../presentation/modals/PaymentMethodModal';
import PersonalInfoModal from '../../presentation/modals/PersonalInfoModal';
import SecuritySettingsModal from '../../presentation/modals/SecuritySettingsModal';


export default function UserSettings( { onSaveAddress }) {
  const [userData, setUserData] = useState({
    personalInformation: {
      fullName: "Zahid Ghotia",
      email: "zahidghotia@example.com",
      phoneNumber: "+1234567890",
      profilePicture: "https://via.placeholder.com/150",
      dob: "1990-01-01",
      gender: "Male",
    },
    shippingAddresses: [
      {
        addressLine1: "123 Street Name",
        addressLine2: "Apt 101",
        city: "City Name",
        state: "State Name",
        postalCode: "12345",
        country: "Country Name",
        isDefault: true,
      },
    ],
    paymentMethods: [
      {
        method: "Credit Card",
        cardNumber: "**** **** **** 1234",
        expiryDate: "12/24",
        isDefault: true,
      },
    ],
    securitySettings: {
      passwordChanged: "2024-12-01",
      twoFactorEnabled: true,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
    },
  });

  const [showPersonalInfoModal, setShowPersonalInfoModal] = useState(false);
  const [showShippingAddressModal, setShowShippingAddressModal] = useState(false);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [showSecuritySettingsModal, setShowSecuritySettingsModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [editedAddress, setEditedAddress] = useState(null);

  const updateData = (section, newData) => {
    setUserData((prevState) => ({
      ...prevState,
      [section]: newData,
    }));
    toast.success(`${section} updated successfully!`);
  };

  const handleSaveAddress = (updatedAddress) => {
    onSaveAddress(updatedAddress);  // Call the onSaveAddress prop to handle the save
    setShowShippingAddressModal(false);  // Close the modal after saving
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Toast Notifications */}
        <ToastContainer />

        {/* Settings Container */}
        <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#4222C4]">Account Settings</h2>

          {/* Personal Information */}
          <section className="bg-white shadow-lg rounded-lg p-6 mb-6 border-l-4 border-[#4222C4]">
            <h3 className="text-2xl font-semibold mb-4">Personal Information</h3>
            <div>
              <p>Name: {userData.personalInformation.fullName}</p>
              <p>Email: {userData.personalInformation.email}</p>
              <p>Phone: {userData.personalInformation.phoneNumber}</p>
              <button
                onClick={() => setShowPersonalInfoModal(true)}
                className="bg-[#4222C4] text-white px-6 py-2 rounded-md hover:bg-[#2e179b] mt-4"
              >
                Edit Info
              </button>
            </div>
          </section>

      {/* Shipping Address */}
      <section className="bg-white shadow-lg rounded-lg p-6 mb-6 border-l-4 border-[#4222C4]">
        <h3 className="text-2xl font-semibold mb-4">Shipping Address</h3>
        {Array.isArray(userData?.shippingAddresses) && userData?.shippingAddresses?.map((address, index) => (
          <div key={index} className="border-b pb-4 mb-4">
            <p>{address.addressLine1}, {address.addressLine2}</p>
            <p>{address.city}, {address.state} {address.postalCode}</p>
            <p>{address.country}</p>
            <button
              onClick={() => {
                setShowShippingAddressModal(true);
                setEditedAddress(address);  // Set specific address for editing
              }}
              className="text-[#4222C4] hover:text-[#2e179b] transition"
            >
              Edit Address
            </button>
          </div>
        ))}
        <button
          onClick={() => {
            setShowShippingAddressModal(true);
            setEditedAddress({});  // For adding a new address (empty object)
          }}
          className="bg-[#4222C4] text-white px-6 py-2 rounded-md hover:bg-[#2e179b] mt-4"
        >
          Add New Address
        </button>
      </section>

      {/* Shipping Address Modal */}
      <ShippingAddressModal
        showModal={showShippingAddressModal}
        onClose={() => setShowShippingAddressModal(false)}
        onSave={handleSaveAddress}
        userData={userData}
        setUserData={setUserData}
      />


          {/* Payment Method */}
          <section className="bg-white shadow-lg rounded-lg p-6 mb-6 border-l-4 border-[#4222C4]">
            <h3 className="text-2xl font-semibold mb-4">Payment Methods</h3>
            {userData.paymentMethods.map((payment, index) => (
              <div key={index} className="border-b pb-4 mb-4">
                <p>{payment.method}</p>
                <p>{payment.cardNumber}</p>
                <p>Expiry Date: {payment.expiryDate}</p>
                <button
                  onClick={() => setShowPaymentMethodModal(true)}
                  className="text-[#4222C4] hover:text-[#2e179b] transition"
                >
                  Edit Payment Method
                </button>
              </div>
            ))}
            <button
              onClick={() => setShowPaymentMethodModal(true)}
              className="bg-[#4222C4] text-white px-6 py-2 rounded-md hover:bg-[#2e179b] mt-4"
            >
              Add Payment Method
            </button>
          </section>

          {/* Security Settings */}
          <section className="bg-white shadow-lg rounded-lg p-6 mb-6 border-l-4 border-[#4222C4]">
            <h3 className="text-2xl font-semibold mb-4">Security Settings</h3>
            <p>Password last changed on: {userData.securitySettings.passwordChanged}</p>
            <p>Two-factor authentication: {userData.securitySettings.twoFactorEnabled ? "Enabled" : "Disabled"}</p>
            <button
              onClick={() => setShowSecuritySettingsModal(true)}
              className="bg-[#4222C4] text-white px-6 py-2 rounded-md hover:bg-[#2e179b] mt-4"
            >
              Edit Security Settings
            </button>
          </section>

          {/* Notifications Settings */}
          <section className="bg-white shadow-lg rounded-lg p-6 mb-6 border-l-4 border-[#4222C4]">
            <h3 className="text-2xl font-semibold mb-4">Notification Settings</h3>
            <p>Email Notifications: {userData.notifications.emailNotifications ? "Enabled" : "Disabled"}</p>
            <p>SMS Notifications: {userData.notifications.smsNotifications ? "Enabled" : "Disabled"}</p>
            <p>Push Notifications: {userData.notifications.pushNotifications ? "Enabled" : "Disabled"}</p>
            <button
              onClick={() => setShowNotificationsModal(true)}
              className="bg-[#4222C4] text-white px-6 py-2 rounded-md hover:bg-[#2e179b] mt-4"
            >
              Edit Notification Settings
            </button>
          </section>
        </div>
      </div>

      {/* Modals for editing */}
      <PersonalInfoModal
        showModal={showPersonalInfoModal}
        onClose={() => setShowPersonalInfoModal(false)}
        onSave={(data) => {
          updateData("personalInformation", data);
          setShowPersonalInfoModal(false);
        }}
        userData={userData.personalInformation}
      />

      <ShippingAddressModal
        showModal={showShippingAddressModal}
        onClose={() => setShowShippingAddressModal(false)}
        onSave={(data) => {
          updateData("shippingAddresses", data);
          setShowShippingAddressModal(false);
        }}
        userData={userData.shippingAddresses}
      />

      <PaymentMethodModal
        showModal={showPaymentMethodModal}
        onClose={() => setShowPaymentMethodModal(false)}
        onSave={(data) => {
          updateData("paymentMethods", data);
          setShowPaymentMethodModal(false);
        }}
        userData={userData.paymentMethods}
      />

      <SecuritySettingsModal
        showModal={showSecuritySettingsModal}
        onClose={() => setShowSecuritySettingsModal(false)}
        onSave={(data) => {
          updateData("securitySettings", data);
          setShowSecuritySettingsModal(false);
        }}
        userData={userData.securitySettings}
      />

      <NotificationsModal
        showModal={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        onSave={(data) => {
          updateData("notifications", data);
          setShowNotificationsModal(false);
        }}
        userData={userData.notifications}
      />
    </div>
  );
}
