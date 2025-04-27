import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStores, recoverStoreById, suspendStore, sendReminder } from "../../../store/actions/storeActions";
import { approveDocument, rejectDocument } from "../../../store/actions/documentActions";
import UserContext from "../../context/UserContext";
import axios from 'axios';
import { IoClose } from "react-icons/io5";

export default function ShopManagement() {
  const dispatch = useDispatch();
  const { setRefreshData } = useContext(UserContext);
  const { stores, loading: storeLoading, error: storeError } = useSelector((state) => state.store);
  const [selectedCategory, setSelectedCategory] = useState("pending");
  const [expandedStore, setExpandedStore] = useState(null);
  const [storeSales, setStoreSales] = useState({});
  const [loadingSales, setLoadingSales] = useState(true);
  const [loadingActions, setLoadingActions] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchStores());
  }, [dispatch]);


  useEffect(() => {
    const fetchAllStoreSales = async () => {
      try {
        setLoadingSales(true);
        const salesPromises = stores.map(store =>
          axios.get(`${import.meta.env.VITE_APP}/api/v1/store/sales/${store._id}`)
        );

        const salesResults = await Promise.all(salesPromises);
        const salesData = {};

        salesResults.forEach((result, index) => {
          if (result.data.success) {
            salesData[stores[index]._id] = result.data.data;
          }
        });

        setStoreSales(salesData);
      } catch (error) {
        console.error('Error fetching store sales:', error);
      } finally {
        setLoadingSales(false);
      }
    };

    if (stores?.length > 0) {
      fetchAllStoreSales();
    }
  }, [stores]);

  const handleApprove = async (documentId, storeId) => {
    setLoadingActions((prev) => ({ ...prev, [documentId]: true }));
    await dispatch(approveDocument(documentId, storeId));
    setRefreshData(true);
    dispatch(fetchStores());
    setLoadingActions((prev) => ({ ...prev, [documentId]: false }));
  };

  const handleReject = async (documentId, storeId) => {
    setLoadingActions((prev) => ({ ...prev, [documentId]: true }));
    await dispatch(rejectDocument(documentId, storeId));
    setRefreshData(true);
    dispatch(fetchStores());
    setLoadingActions((prev) => ({ ...prev, [documentId]: false }));
  };

  const handleReminder = async (storeEmail) => {
    setLoadingActions((prev) => ({ ...prev, [storeEmail]: true }));
    await dispatch(sendReminder(storeEmail));
    setRefreshData(true);
    dispatch(fetchStores());
    setLoadingActions((prev) => ({ ...prev, [storeEmail]: false }));
    setExpandedStore(null)
  }
  // Categorizing stores based on document status
  // Updated categorization logic
  const pendingStores = stores.filter(store =>
    store.status !== "suspended" &&
    store.documents.some(doc => doc.status === "pending") &&
    !store.documents.some(doc => doc.status === "rejected")
  );

  const approvedStores = stores.filter(store =>
    store.status !== "suspended" &&
    store.documents.every(doc => doc.status === "approved")
  );

  const rejectedStores = stores.filter(store =>
    store.status === "suspended" ||
    store.documents.some(doc => doc.status === "rejected")
  );

  // Function to toggle expanded store details
  const toggleStoreDetails = (storeId) => {
    setExpandedStore(expandedStore === storeId ? null : storeId);
  };

  // Determine which stores to display based on selected category
  const displayedStores =
    selectedCategory === "pending"
      ? pendingStores
      : selectedCategory === "approved"
        ? approvedStores
        : rejectedStores;

  useEffect(() => {
    if (setRefreshData) {
      dispatch(fetchStores());
      setRefreshData(false);
    }
  }, [setRefreshData, dispatch]);

  const filteredShops = displayedStores.filter((shop) =>
    shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.phone.includes(searchQuery) ||
    shop.email.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const handleSuspendStore = async (storeId) => {
    await dispatch(suspendStore(storeId));
    dispatch(fetchStores());
    setExpandedStore(null)
  };

  const handleRecover = async (storeId) => {
    await dispatch(recoverStoreById(storeId));
    dispatch(fetchStores());
    setExpandedStore(null)
  };


  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6  max-h-screen">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Shop Management</h2>

      {/* Category Buttons */}
      <div className="flex flex-wrap space-x-0 sm:space-x-4 mb-6">
        <button
          onClick={() => setSelectedCategory("pending")}
          className={`px-4 py-2 rounded transition-all ${selectedCategory === "pending" ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
        >
          Pending Stores ({pendingStores.length})
        </button>
        <button
          onClick={() => setSelectedCategory("approved")}
          className={`px-4 py-2 rounded transition-all ${selectedCategory === "approved" ? "bg-green-600 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
        >
          Approved Stores ({approvedStores.length})
        </button>
        {/* <button
          onClick={() => setSelectedCategory("rejected")}
          className={`px-4 py-2 rounded transition-all ${selectedCategory === "rejected" ? "bg-red-600 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
        >
          Rejected Stores ({rejectedStores.length})
        </button> */}
      </div>

      <input
        type="text"
        placeholder="Search by name, phone, or email..."
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Store List */}
      {storeLoading ? (
        <p className="text-gray-600">Loading stores...</p>
      ) : storeError ? (
        <p className="text-red-500">{storeError}</p>
      ) : displayedStores.length === 0 ? (
        <p className="text-gray-600">No stores found in this category.</p>
      ) : (
        <div className="overflow-x-auto w-[230px] sm:w-auto">
          <table className="min-w-full text-left text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-2">Store Name</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Email</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShops.map((store) => (
                <tr key={store._id} className="border-t hover:bg-gray-50 transition-all">
                  <td className="py-2 px-4">{store.name}</td>
                  <td className="py-2 px-4">{store.phone}</td>
                  <td className="py-2 px-4">{store.email.toLowerCase()}</td>
                  <td className="py-2 px-4 capitalize">{selectedCategory}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => toggleStoreDetails(store._id)}
                      className="text-blue-500 hover:underline"
                    >
                      {expandedStore === store._id ? "Hide Details" : "View"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Expanded Store Details */}
      {expandedStore && (
        <div className="fixed top-0 left-0 w-full overflow-y-scroll h-screen bg-gray-800 bg-opacity-60">

          <div className="w-[90%] sm:w-[80%] lg:w-[45%] m-auto">
            <div className=" mt-6 p-4 bg-gray-50 rounded-lg relative mb-20">
              <button onClick={()=> setExpandedStore(null)} className="absolute right-5 sm:right-2 top-8 sm:top-1 cursor-pointer text-red-700 border border-red-700 rounded-full hover:bg-red-700 hover:text-white hover:border-red-300"> <IoClose /> </button>

              {displayedStores
                .filter(store => store._id === expandedStore)
                .map(store => (
                  <div key={store._id}>
                    <div className="flex flex-col mb-3 sm:flex-row justify-between border-b py-3">
                      <h3 className="text-lg font-semibold text-[#4222C4]">{store.name} - Store Details</h3>

                      {store.status === "suspended" ? (
                        <button
                          className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          onClick={() => handleRecover(store._id)}
                        >
                          Recover Store
                        </button>
                      ) : (
                        <button
                          className=" bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                          onClick={() => handleSuspendStore(store._id)}
                        >
                          Suspend Store
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <p><strong>Registered Date:</strong> {new Date(store.createdAt).toLocaleDateString()}</p>
                      <p><strong>Address:</strong> {store.address}</p>
                      <p><strong>Nationality:</strong> {store.nationality}</p>
                      <p><strong>Products:</strong> {store.products.length}</p>
                      {/* <p><strong>Orders:</strong> {store.orders.length}</p> */}
                      <p className={`${store.status === "suspended" ? "bg-red-500" : "bg-green-500"} text-white p-2 rounded w-max my-2`}>
                        <strong >Store Status: </strong>
                        <span >
                          {store.status}
                        </span>
                      </p>

                    </div>

                    {/* Document Details */}
                    <h4 className="mt-4 text-md font-semibold text-[#4222C4]">Documents</h4>
                    <ul className="space-y-4">
                      {store.documents.map((doc, index) => (
                        <li key={index} className="bg-white p-4 border rounded-lg shadow-sm">
                          <p><strong>Type:</strong> {doc.documentType}</p>
                          <p className={`${doc.status === "approved" ? "bg-green-500" : "bg-red-500"} text-white p-2 rounded w-max my-2`}>
                            <strong>DOC Status :</strong> {doc.status}
                          </p>

                          <p><strong>Uploaded At:</strong> {new Date(doc.uploadedAt).toLocaleDateString()}</p>

                          {/* Personal Info Section */}
                          <div className="mt-4">
                            <h5 className="text-md font-semibold text-[#4222C4]">Personal Info</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <p><strong>Name:</strong> {doc.personalInfo.firstName}</p>
                              <p><strong>Last Name:</strong> {doc.personalInfo.lastName}</p>
                              <p><strong>CNIC:</strong> {doc.personalInfo.cnic}</p>
                              <p><strong>Date of Birth:</strong> {new Date(doc.personalInfo.DOB).toLocaleDateString()}</p>
                              <p><strong>Gender:</strong> {doc.personalInfo.gender}</p>
                              <p><strong>Date of Issue:</strong> {new Date(doc.personalInfo.dateofissue).toLocaleDateString()}</p>
                              <p><strong>Date of Expiry:</strong> {new Date(doc.personalInfo.dateofexpiry).toLocaleDateString()}</p>
                            </div>
                          </div>

                          {/* Document Images */}
                          {doc.filePath && Array.isArray(doc.filePath) && (
                            <div className="mt-2 flex flex-col sm:flex-row space-x-2">
                              {doc.filePath.map((path, idx) => {
                                const imageUrl = `${import.meta.env.VITE_APP}/${path}`;
                                return (
                                  <a key={idx} href={imageUrl} target="_blank" rel="noopener noreferrer">
                                    <img
                                      src={imageUrl}
                                      alt="Document"
                                      className="w-full sm:w-56 h-32 object-cover border rounded cursor-pointer"
                                    />
                                  </a>
                                );
                              })}
                            </div>
                          )}



                          {/* Approve and Reject Buttons */}

                          <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            {
                              doc.status === 'approved' ?
                                <button
                                  onClick={() => handleReject(doc._id, store._id)}
                                  disabled={loadingActions[doc._id]}
                                  className={`bg-red-500 text-white px-4 py-2 rounded ${loadingActions[doc._id] ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
                                    }`}
                                >
                                  {loadingActions[doc._id] ? "Rejecting..." : "Reject"}
                                </button>
                                :
                                <button
                                  onClick={() => handleApprove(doc._id, store._id)}
                                  disabled={loadingActions[doc._id]}
                                  className={`bg-green-500 text-white px-4 py-2 rounded ${loadingActions[doc._id] ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
                                    }`}
                                >
                                  {loadingActions[doc._id] ? "Approving..." : "Approve"}
                                </button>
                            }

                            <button
                              onClick={() => handleReminder(store.email)}
                              disabled={loadingActions[store.email]}
                              className={`bg-blue-500 text-white px-4 py-2 rounded ${loadingActions[store.email] ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
                                }`}
                            >
                              {loadingActions[doc._id] ? "Sending..." : "Reminder Pending Payment"}
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Store Sales Data */}
                    {selectedCategory === "approved" && storeSales[store._id] && (
                      <div className="mt-6 p-4 bg-white border rounded-lg shadow-sm">
                        <h4 className="text-md font-semibold mb-2">Store Sales</h4>
                        <p><strong>Total Sales:</strong> {store?.totalSales}</p>
                        <p><strong>Total Withdrawal Earnings:</strong> {store?.earnings}</p>

                      </div>
                    )}


                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}