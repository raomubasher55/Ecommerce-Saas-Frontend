import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPackages } from '../../../store/actions/packageActions';

const Packages = () => {
  const dispatch = useDispatch();
  const { packages, error, loading } = useSelector(state => state.package);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllPackages());
  }, [dispatch]);

  const getUniqueLatestPackages = (packagesList) => {
    const latestPackagesMap = new Map();

    packagesList.forEach((pkg) => {
      const sellerId = pkg.seller?._id;
      if (!sellerId) return;

      const existingPkg = latestPackagesMap.get(sellerId);
      if (!existingPkg) {
        latestPackagesMap.set(sellerId, pkg);
      } else {
        const existingDate = new Date(existingPkg.updatedAt);
        const newDate = new Date(pkg.updatedAt);
        if (newDate > existingDate) {
          latestPackagesMap.set(sellerId, pkg);
        }
      }
    });

    return Array.from(latestPackagesMap.values());
  };

  const uniquePackages = getUniqueLatestPackages(packages || []);

  const filteredPackages = uniquePackages.filter((packageItem) => {
    return (
      packageItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      packageItem?._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      packageItem?.seller?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (searchQuery.toLowerCase() === 'active' && packageItem.isActive) ||
      (searchQuery.toLowerCase() === 'inactive' && !packageItem.isActive)
    );
  });

  const openModal = (packageItem) => {
    setSelectedPackage(packageItem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPackage(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return <div>Loading packages...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto w-[260px] sm:w-max p-2 sm:p-4 overflow-hidden">
      <h1 className="text-3xl font-bold mb-8 text-[#5A3ECB] text-center">Active Store Packages</h1>
      
      <input
        type="text"
        placeholder="Search by Name, Store, ID, or Status"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5A3ECB]"
      />

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#5A3ECB] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Store Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Package Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPackages.length > 0 ? (
              filteredPackages.map((pkg) => (
                <tr key={pkg._id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap">{pkg.seller?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{pkg.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{pkg.price} A.D</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-sm ${pkg.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {pkg.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => openModal(pkg)}
                      className="px-2 py-1 bg-[#5A3ECB] text-white rounded-md hover:bg-[#3b27a1] transition"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No matching packages found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && selectedPackage && (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
    <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl animate-scaleIn">

      {/* Close Button */}
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition text-2xl"
      >
        ✕
      </button>

      {/* Title */}
      <h2 className="text-3xl font-extrabold text-center text-[#5A3ECB] mb-6">
        📦 Package Details
      </h2>

      {/* Main Info */}
      <div className="space-y-2 text-gray-700 mb-6">
        <p><span className="font-semibold">🏪 Store Name:</span> {selectedPackage?.seller?.name}</p>
        <p><span className="font-semibold">📝 Package Name:</span> {selectedPackage?.name}</p>
        <p><span className="font-semibold">💰 Price:</span> {selectedPackage?.price} A.D</p>
        <p>
          <span className="font-semibold">⚡ Status:</span>{" "}
          <span className={`px-3 py-1 rounded-full text-sm ${selectedPackage.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {selectedPackage.isActive ? "Active" : "Inactive"}
          </span>
        </p>
      </div>

      {/* Features */}
      <div className="border-t pt-4">
        <h3 className="text-2xl font-bold text-[#5A3ECB] mb-4 text-center">✨ Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600 text-sm">
          <div>🛒 Product Limit: <span className="font-semibold">{selectedPackage.features?.productLimit}</span></div>
          <div>🤝 Support: <span className="font-semibold">{selectedPackage.features?.support}</span></div>
          <div>📈 Analytics: <span className="font-semibold">{selectedPackage.features?.analytics}</span></div>
          <div>💳 Payment Gateways: <span className="font-semibold">{selectedPackage.features?.paymentGateways}</span></div>
          <div>📢 Marketing Tools: <span className="font-semibold">{selectedPackage.features?.marketingTools ? 'Yes' : 'No'}</span></div>
          <div>🌍 Global Reach: <span className="font-semibold">{selectedPackage.features?.globalReach ? 'Yes' : 'No'}</span></div>
          <div>🎁 Referral Program: <span className="font-semibold">{selectedPackage.features?.referralProgram ? 'Yes' : 'No'}</span></div>
          <div>💸 Transaction Limits: <span className="font-semibold">{selectedPackage.features?.transactionLimits}</span></div>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Packages;
