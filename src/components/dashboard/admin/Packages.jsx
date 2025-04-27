import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaEllipsisV } from 'react-icons/fa';
import { RiDeleteBinLine } from 'react-icons/ri'; 
import { FiEdit } from 'react-icons/fi';
import { getAllPackages, updatePackage } from '../../../store/actions/packageActions'; 


const packageData = {
  Self: {
    name: "Self",
    price: 500,
    features: {
      productLimit: 10,
      support: "Basic Email Support",
      analytics: "Basic Analytics",
      paymentGateways: "Standard Gateways",
      marketingTools: false,
      globalReach: false,
      referralProgram: false,
      transactionLimits: "Up to $500/month",
    },
  },
  Medium: {
    name: "Medium",
    price: 1000,
    features: {
      productLimit: 50,
      support: "Priority Email Support",
      analytics: "Advanced Analytics",
      paymentGateways: "Standard + Premium Gateways",
      marketingTools: true,
      globalReach: true,
      referralProgram: true,
      transactionLimits: "Up to $2000/month",
    },
  },
  Enterprise: {
    name: "Enterprise",
    price: 5000,
    features: {
      productLimit: 100,
      support: "24/7 Support",
      analytics: "Full Analytics Suite",
      paymentGateways: "All Gateways + Custom Integrations",
      marketingTools: true,
      globalReach: true,
      referralProgram: true,
      transactionLimits: "Up to $50,000/month",
    },
  },
  Large: {
    name: "Large",
    price: 15000,
    features: {
      productLimit: 500,
      support: "Dedicated Account Manager",
      analytics: "Custom Analytics and Reporting",
      paymentGateways: "All Gateways + Custom Integrations",
      marketingTools: true,
      globalReach: true,
      referralProgram: true,
      transactionLimits: "Unlimited",
    },
  },
};

const Packages = () => {
  const dispatch = useDispatch();
  const { packages, error, loading } = useSelector(state => state.package);
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editForm, setEditForm] = useState({
    name: '',
  });
  const [currentFeatures, setCurrentFeatures] = useState({});
console.log(packages)
  useEffect(() => {
    dispatch(getAllPackages());
  }, [dispatch]);


  const filteredPackages = packages?.filter((packageItem) => {
    return (
      packageItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      packageItem?._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      packageItem?.seller?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (searchQuery.toLowerCase() === 'active' && packageItem.isActive) ||
      (searchQuery.toLowerCase() === 'inactive' && !packageItem.isActive)
    );
  });

  const handleEdit = (packageItem) => {
    setSelectedPackage(packageItem._id);
    setEditForm({
      name: packageItem.name,
    });
    setCurrentFeatures(packageItem.features); 
    setShowModal(true);
  };

  const handleUpdate = () => {
    const updatedPackage = {
      name: editForm.name,
      price: packageData[editForm.name].price, 
      features: packageData[editForm.name].features, 
    };
  
    dispatch(updatePackage(selectedPackage, updatedPackage));
    setShowModal(false);
    setSelectedPackage(null);
  };
  


  const handlePackageChange = (e) => {
    const selectedPackageName = e.target.value;
    const selectedPackageData = packageData[selectedPackageName];
    setEditForm({
      name: selectedPackageData.name,
    });
    setCurrentFeatures(selectedPackageData.features); 
  };

  if (loading) {
    return <div>Loading packages...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-[#5A3ECB] text-center">
        All Packages
      </h1>
      <input
        type="text"
        placeholder="Search by Name, Store, ID, or Status"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5A3ECB]"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredPackages.length > 0 ? (
        filteredPackages?.map((packageItem) => (
          <div
            key={packageItem._id}
            className="bg-white shadow-md rounded-xl p-6 border border-gray-200 transition-transform duration-300 hover:scale-105 hover:shadow-xl relative"
          >
            <div className="absolute top-4 right-4">
              <FaEllipsisV
                className="text-xl cursor-pointer hover:text-[#5A3ECB] transition-colors duration-200"
                onClick={() => setSelectedPackage(packageItem._id)}
              />
              {selectedPackage === packageItem._id && (
                <div className="absolute right-0 mt-2 bg-white shadow-md border rounded-lg z-10">
                  <div
                    className="px-4 py-2 cursor-pointer text-gray-700 hover:bg-[#5A3ECB] hover:text-white transition-colors duration-200"
                    onClick={() => handleEdit(packageItem)}
                  >
                    <FiEdit className="inline" />
                  </div>
                  <div
                    className="px-4 py-2 cursor-pointer text-red-600 hover:bg-[#5A3ECB] hover:text-white transition-colors duration-200"
                    onClick={() => handleDelete(packageItem._id)}
                  >
                    <RiDeleteBinLine className="inline" />
                  </div>
                </div>
              )}
            </div>
            <h2 className="text-lg font-semibold text-[#5A3ECB] mb-1">
              {packageItem.name}
            </h2>
            <p className="text-gray-500 text-sm mb-2">Price: ${packageItem.price}</p>
            <p className="text-gray-700 text-sm mb-4">Store: {packageItem?.seller?.name}</p>
            <div className="text-sm text-gray-700 mb-4">
              <h3 className="font-semibold text-[#5A3ECB]">Features:</h3>
              <ul className="list-disc ml-6">
                <li>Product Limit: {packageItem.features.productLimit}</li>
                <li>Support: {packageItem.features.support}</li>
                <li>Analytics: {packageItem.features.analytics}</li>
                <li>Payment Gateways: {packageItem.features.paymentGateways}</li>
                <li>Marketing Tools: {packageItem.features.marketingTools ? 'Yes' : 'No'}</li>
                <li>Global Reach: {packageItem.features.globalReach ? 'Yes' : 'No'}</li>
                <li>Referral Program: {packageItem.features.referralProgram ? 'Yes' : 'No'}</li>
                <li>Transaction Limits: {packageItem.features.transactionLimits}</li>
              </ul>
            </div>
            <span
              className={`px-4 py-1 text-sm font-medium rounded-full ${
                packageItem.isActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {packageItem.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        )))
        : (
          <p className="text-center text-gray-500 col-span-full">No matching packages found</p>
        )}
      </div>
  
      {/* Edit Package Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-[#5A3ECB]">
              Update Package
            </h3>
            <form>
              <label className="block mb-4">
                Name:
                <select
                  name="name"
                  value={editForm.name}
                  onChange={handlePackageChange}
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5A3ECB]"
                >
                  {Object.keys(packageData).map((packageName) => (
                    <option key={packageName} value={packageName}>
                      {packageName}
                    </option>
                  ))}
                </select>
              </label>
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Features:</h3>
                <ul className="list-disc ml-6 text-gray-700">
                  <li>Product Limit: {currentFeatures.productLimit}</li>
                  <li>Support: {currentFeatures.support}</li>
                  <li>Analytics: {currentFeatures.analytics}</li>
                  <li>Payment Gateways: {currentFeatures.paymentGateways}</li>
                  <li>Marketing Tools: {currentFeatures.marketingTools ? 'Yes' : 'No'}</li>
                  <li>Global Reach: {currentFeatures.globalReach ? 'Yes' : 'No'}</li>
                  <li>Referral Program: {currentFeatures.referralProgram ? 'Yes' : 'No'}</li>
                  <li>Transaction Limits: {currentFeatures.transactionLimits}</li>
                </ul>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="bg-[#5A3ECB] text-white px-6 py-2 rounded-full shadow-md hover:bg-[#4B31A6] transition-colors duration-200"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-200 px-6 py-2 rounded-full hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default Packages;
