import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAd, getActiveAds, deleteAd, updateAd } from '../../../store/actions/adActions';
import { FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';
import Loader from '../../../utils/Loader';

const Promotions = () => {
  const dispatch = useDispatch();
  const { loading, ads, error } = useSelector((state) => state.adData);

  const [adData, setAdData] = useState({
    title: '',
    description: '',
    product: '',
    startDate: '',
    endDate: '',
  });
  const [image, setImage] = useState(null);
  const [showOptions, setShowOptions] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteAdId, setDeleteAdId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


  const filteredPromotions = ads.filter((promo) => {
    const matchesSearch =
      promo.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (promo.product?.seller ? promo.product.seller.toString().includes(searchTerm.toLowerCase()) : false);

    const matchesStatus = statusFilter ? promo.status === statusFilter : true;

    const matchesDate =
      (!startDate || new Date(promo.startDate) >= new Date(startDate)) &&
      (!endDate || new Date(promo.endDate) <= new Date(endDate));

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleChange = (e) => {
    setAdData({
      ...adData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };


  const handleOptionClick = (adId, action) => {
    if (action === 'update') {
      setAdData({
        id: adId._id,
        title: adId.title,
        description: adId.description,
        product: adId.product._id,
        startDate: adId.startDate,
        endDate: adId.endDate,
        status: adId.status,
      });
      setShowEditModal(true);
    } else if (action === 'delete') {
      setDeleteAdId(adId);
      setShowDeleteModal(true);
    }
  };

  const handleDelete = () => {
    dispatch(deleteAd(deleteAdId._id));
    setShowDeleteModal(false);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', adData.title);
    formData.append('description', adData.description);
    formData.append('product', adData.product);
    formData.append('startDate', adData.startDate);
    formData.append('endDate', adData.endDate);
    formData.append('status', adData.status);
    if (image) {
      formData.append('image', image);
    }

    dispatch(updateAd(adData.id, formData));
    setShowEditModal(false);
    dispatch(getActiveAds());
  };

  useEffect(() => {
    dispatch(getActiveAds());
  }, [dispatch]);

  return (
    <div className="max-w-4xl h-screen mx-auto p-2 sm:p-6 shadow-md rounded-lg overflow-y-scroll overflow-hidden">


      <div className="w-full">
        <h2 className="text-2xl font-semibold text-center mb-6">Active Promotions</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by title, product, store"
            className="p-2 border rounded w-full sm:w-auto flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Status Filter */}
          <select
            className="p-2 border rounded w-full sm:w-auto"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Date Pickers */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <input
              type="date"
              className="p-2 border rounded w-full sm:w-auto"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="p-2 border rounded w-full sm:w-auto"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>


        {loading && <Loader />}

        {ads.length === 0 ? (
          <p className="text-center text-lg font-medium text-gray-500">No active ads found.</p>
        ) : (
          <div className="grid">
            {filteredPromotions.length === 0 ? (
              <p className="text-center text-lg font-medium text-gray-500">No active ads found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="bg-white border border-gray-300 rounded-lg">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Product</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPromotions.map((ad) => (
                      <tr key={ad.id} className="border-b">
                        <td className="px-6 py-4 text-sm">{ad.title}</td>
                        <td className="px-6 py-4 text-sm truncate max-w-xs">{ad.description}</td>
                        <td className="px-6 py-4 text-sm">{ad.product.name}</td>
                        <td className="px-6 py-4 text-sm">
                          {new Date(ad.startDate).toLocaleDateString()} - {new Date(ad.endDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-green-500">{ad.status}</td>
                        <td className="px-6 py-4 text-sm relative">
                          <button onClick={() => setShowOptions(showOptions === ad._id ? null : ad._id)}>
                            <FaEllipsisV className="text-lg" />
                          </button>
                          {showOptions === ad._id && (
                            <div className="absolute z-20 bg-white shadow-lg rounded-lg border border-gray-200 right-0">
                              <button onClick={() => handleOptionClick(ad, 'update')} className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100">
                                <FaEdit className="inline mr-2" /> Edit
                              </button>
                              <button onClick={() => handleOptionClick(ad, 'delete')} className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                <FaTrash className="inline mr-2" /> Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold">Are you sure you want to delete this advertisement for {deleteAdId?.product?.name} ?</h3>
            <img className='w-48 sm:w-[40%] h-36 m-auto' src={`${import.meta.env.VITE_APP}/${deleteAdId?.product?.images[0]?.url}`} alt="" />
            <div className="flex justify-around space-x-4 mt-4">
              <button onClick={handleCloseModal} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg">
                No
              </button>
              <button onClick={handleDelete} className="bg-red-600 text-white py-2 px-4 rounded-lg">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-11/12">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Update Ad</h3>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                value={adData.title}
                onChange={handleChange}
                placeholder="Title"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="description"
                value={adData.description}
                onChange={handleChange}
                placeholder="Description"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="product"
                value={adData.product}
                onChange={handleChange}
                placeholder="Product ID"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* Responsive Date Inputs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="date"
                  name="startDate"
                  value={adData.startDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  name="endDate"
                  value={adData.endDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                name="status"
                value={adData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 file:bg-blue-500 file:text-white file:border-none file:rounded-lg"
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                >
                  Update Ad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
};

export default Promotions;
