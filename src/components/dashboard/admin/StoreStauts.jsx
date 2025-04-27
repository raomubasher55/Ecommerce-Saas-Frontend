import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StoreStatus = () => {
    const [allStores, setAllStores] = useState([]);
    const [suspendedStores, setSuspendedStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    const [showModal, setShowModal] = useState(false);
    const [selectedStoreId, setSelectedStoreId] = useState('');
    const [suspensionReason, setSuspensionReason] = useState('');

    const token = localStorage.getItem('token');

    const fetchAllStores = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_REGISTER_API}/api/v1/store/all-store`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAllStores(Array.isArray(data.stores.docs) ? data.stores.docs : []);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to fetch all stores');
        }
    };

    const fetchSuspendedStores = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_REGISTER_API}/api/v1/store/admin/stores/suspended`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuspendedStores(Array.isArray(data.stores) ? data.stores : []);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to fetch suspended stores');
        }
    };

    const suspendStore = async () => {
        if (!suspensionReason) {
            setMessage("Suspension reason is required");
            return;
        }

        try {
            setLoading(true);
            await axios.post(
                `${import.meta.env.VITE_REGISTER_API}/api/v1/store/admin/stores/${selectedStoreId}/suspend`,
                { reason: suspensionReason },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMessage('Store suspended successfully');
            setShowModal(false);
            setSuspensionReason('');
            fetchAllStores();
            fetchSuspendedStores();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to suspend store');
        } finally {
            setLoading(false);
        }
    };

    const recoverStore = async (id) => {
        try {
            setLoading(true);
            await axios.post(`${import.meta.env.VITE_REGISTER_API}/api/v1/store/admin/stores/${id}/recover`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage('Store recovered successfully');
            fetchAllStores();
            fetchSuspendedStores();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to recover store');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllStores();
        fetchSuspendedStores();
    }, []);

    const currentStores = activeTab === 'all' ? allStores : suspendedStores;
    const filteredStores = Array.isArray(currentStores)
        ? currentStores.filter((store) =>
              store.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [];

    return (
        <div className="p-6 w-[260px] sm:w-full mx-auto overflow-x-scroll">
            <h1 className="text-3xl font-bold mb-6 text-center">Store Management</h1>

            {message && (
                <div className="bg-blue-100 text-blue-700 p-3 rounded mb-4">{message}</div>
            )}

            <div className="mb-6 flex justify-between items-center flex-wrap gap-2">
                <div className="flex gap-2">
                    <button
                        className={`px-4 py-2 rounded ${
                            activeTab === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200'
                        }`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Stores ({allStores?.length})
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${
                            activeTab === 'suspended'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-200'
                        }`}
                        onClick={() => setActiveTab('suspended')}
                    >
                        Suspended Stores ({suspendedStores?.length})
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Search by name..."
                    className="border p-2 rounded w-full sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border bg-white shadow-sm rounded">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 border-b text-left">Store Name</th>
                                <th className="py-2 px-4 border-b text-left">Store ID</th>
                                <th className="py-2 px-4 border-b text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStores.length > 0 ? (
                                filteredStores.map((store) => (
                                    <tr key={store._id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b">{store.name}</td>
                                        <td className="py-2 px-4 border-b">{store._id}</td>
                                        <td className="py-2 px-4 border-b text-center">
                                            {activeTab === 'all' ? (
                                                <button
                                                    onClick={() => {
                                                        setSelectedStoreId(store._id);
                                                        setShowModal(true);
                                                    }}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                                                >
                                                    Suspend
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => recoverStore(store._id)}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                                                >
                                                    Recover
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center py-4 text-gray-500">
                                        No stores found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal for Suspension Reason */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Suspend Store</h2>
                        <label className="block mb-2 text-sm font-medium">Reason</label>
                        <textarea
                            className="w-full border p-2 rounded mb-4"
                            rows="4"
                            placeholder="Enter suspension reason..."
                            value={suspensionReason}
                            onChange={(e) => setSuspensionReason(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded"
                                onClick={() => {
                                    setShowModal(false);
                                    setSuspensionReason('');
                                    setSelectedStoreId('');
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded"
                                onClick={suspendStore}
                                disabled={loading}
                            >
                                {loading ? 'Suspending...' : 'Suspend'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoreStatus;
