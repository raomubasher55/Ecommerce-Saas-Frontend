import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { fetchStore, updateStoreProfile } from "../../../store/actions/storeActions";
import L from 'leaflet';
import ShopPaymentCard from "./ShopPaymentCard";
import Loader from "../../../utils/Loader";

const Settings = () => {
  const dispatch = useDispatch();
  const { store, loading, error } = useSelector((state) => state.store);
  const [selectedStore, setSelectedStore] = useState(null);
  const [tempData, setTempData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    location: { type: "Point", coordinates: [0, 0] },
    photo: { public_id: "", url: "" },
  });
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    dispatch(fetchStore());
  }, [dispatch]);

  useEffect(() => {
    if (selectedStore) {
      setTempData({
        name: selectedStore.name,
        description: selectedStore.description,
        address: selectedStore.address,
        phone: selectedStore.phone,
        email: selectedStore.email,
        location: selectedStore.location,
        photo: selectedStore.photo,
      });
    }
  }, [selectedStore]);

  useEffect(() => {
    if (isMapVisible && mapRef.current) {
      const map = L.map(mapRef.current).setView(
        [tempData.location.coordinates[1] || 0, tempData.location.coordinates[0] || 0],
        10
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const marker = L.marker(
        [tempData.location.coordinates[1] || 0, tempData.location.coordinates[0] || 0]
      ).addTo(map);

      map.on('click', function (e) {
        const { lat, lng } = e.latlng;
        setTempData((prevState) => ({
          ...prevState,
          location: { type: "Point", coordinates: [lng, lat] },
        }));
        marker.setLatLng([lat, lng]);
      });

      return () => {
        map.remove();
      };
    }
  }, [isMapVisible, tempData.location]);

  const handleSave = () => {
    dispatch(updateStoreProfile(tempData));
    setIsEditModalVisible(false);
  };

  const isVerified = store.documents?.[0]?.status === "approved";

  if (loading) return <div> <Loader /> </div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-3 sm:p-6 bg-gray-100 space-y-6">
      <h1 className="text-3xl font-bold text-[#4222C4] border-b-2 border-[#4222C4] pb-3">Shop Settings</h1>

      <div className="bg-white shadow-xl rounded-lg p-8 flex flex-col items-center md:items-start md:flex-row md:gap-12">

        {/* Profile Picture & Name */}
        <div className="text-center md:text-left relative">
          {store.photo?.url && (
            <img
              src={`${import.meta.env.VITE_APP}${store.photo.url}`}
              alt="Store"
              className="w-40 h-40 object-cover rounded-full border-4 border-[#4222C4] shadow-md"
            />
          )}
          <h3 className="text-2xl font-semibold text-gray-900 mt-4 flex items-center justify-center md:justify-start gap-2">
            {store.name}
            {isVerified && <span className="absolute left-0 top-0 bg-blue-500 text-white text-sm px-3 py-1 rounded-md">Verified</span>}
          </h3>
        </div>

        {/* Store Information */}
        <div className="w-full">
          <div className="space-y-3">
            <p className="text-gray-700"><strong className="text-[#4222C4]">Description:</strong> {store.description}</p>
            <p className="text-gray-700"><strong className="text-[#4222C4]">Address:</strong> {store.address}</p>
            <p className="text-gray-700"><strong className="text-[#4222C4]">Phone:</strong> {store.phone}</p>
            <p className="text-gray-700 text-sm"><strong className="text-[#4222C4]">Email:</strong> {store.email}</p>
            <p className="text-gray-700"><strong className="text-[#4222C4]">Nationality:</strong> {store.nationality}</p>
            <p className="text-gray-700"><strong className="text-[#4222C4]">Created At:</strong> {new Date(store.createdAt).toLocaleDateString()}</p>
            <p className="text-gray-700"><strong className="text-[#4222C4]">Last Updated:</strong> {new Date(store.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      {store?.documents?.[0]?.personalInfo && (
        <div className="bg-white shadow-xl rounded-lg p-6 mt-6">
          <h3 className="text-2xl font-semibold text-gray-900 border-b-2 border-[#4222C4] pb-2">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <p className="text-gray-700"><strong className="text-[#4222C4]">Name:</strong> {store.documents[0].personalInfo.name}</p>
            <p className="text-gray-700"><strong className="text-[#4222C4]">Father's Name:</strong> {store.documents[0].personalInfo.fathername}</p>
            <p className="text-gray-700"><strong className="text-[#4222C4]">Gender:</strong> {store.documents[0].personalInfo.gender}</p>
            <p className="text-gray-700"><strong className="text-[#4222C4]">DOB:</strong> {new Date(store.documents[0].personalInfo.DOB).toLocaleDateString()}</p>
            <p className="text-gray-700"><strong className="text-[#4222C4]">CNIC:</strong> {store.documents[0].personalInfo.cnic}</p>
            <p className="text-gray-700"><strong className="text-[#4222C4]">Date of Issue:</strong> {new Date(store.documents[0].personalInfo.dateofissue).toLocaleDateString()}</p>
            <p className="text-gray-700"><strong className="text-[#4222C4]">Date of Expiry:</strong> {new Date(store.documents[0].personalInfo.dateofexpiry).toLocaleDateString()}</p>
          </div>
        </div>
      )}

      {/* Edit Store Button */}
      <button
        onClick={() => { setSelectedStore(store); setIsEditModalVisible(true); }}
        className="bg-gradient-to-r from-[#4222C4] to-blue-500 text-white px-6 py-3 rounded-lg text-lg font-medium shadow-md hover:scale-105 transition-transform duration-200"
      >
        Edit Store
      </button>

      {/* Edit Modal */}
      {isEditModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-96 relative">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Store Information</h3>
            <input
              type="text"
              value={tempData.name}
              onChange={(e) => setTempData({ ...tempData, name: e.target.value })}
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Store Name"
            />
            <textarea
              value={tempData.description}
              onChange={(e) => setTempData({ ...tempData, description: e.target.value })}
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Store Description"
            ></textarea>
            <input
              type="text"
              value={tempData.address}
              onChange={(e) => setTempData({ ...tempData, address: e.target.value })}
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Store Address"
            />
            <input
              type="text"
              value={tempData.phone}
              onChange={(e) => setTempData({ ...tempData, phone: e.target.value })}
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Phone"
            />
            <input
              type="email"
              value={tempData.email}
              onChange={(e) => setTempData({ ...tempData, email: e.target.value })}
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Email"
            />
            <input
              type="text"
              value={tempData.photo.public_id}
              onChange={(e) => setTempData({ ...tempData, photo: { ...tempData.photo, public_id: e.target.value } })}
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Image ID"
            />

            <div className="flex justify-end mt-4 space-x-4">
              <button
                onClick={() => setIsEditModalVisible(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <ShopPaymentCard />
    </div>

  );
};

export default Settings;
