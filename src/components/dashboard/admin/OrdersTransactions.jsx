import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../../store/actions/orderActions";
import AdminOrderTable from "../../../utils/AdminOrderTable";

export default function OrdersTransactions() {
  const dispatch = useDispatch();

  // Get orders from Redux store
  const { orders = [], loading, error } = useSelector((state) => state.allOrders);
  const [pagination, setPagination] = useState({ currentPage: 1, pageSize: 6 });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);


  // Filtering orders based on search input
  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase();
    return (
      order._id?.toLowerCase().includes(query) ||   // Order ID
      order.user?.toLowerCase().includes(query) || // User ID
      order.store?.toLowerCase().includes(query) || // Store ID
      order.orderItems?.some((item) =>
        item._id?.toLowerCase().includes(query) || // Product order ID
        item.name?.toLowerCase().includes(query) || // Product name
        item.product?.toLowerCase().includes(query) // Product ID
      )
    );
  });


  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / pagination.pageSize);
  const paginatedOrders = filteredOrders.slice(
    (pagination.currentPage - 1) * pagination.pageSize,
    pagination.currentPage * pagination.pageSize
  );

  // Open order details modal
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedOrder(null);
  };


  // Pagination controls
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPagination({ ...pagination, currentPage: newPage });
    }
  };

  const formatNumber = (num) => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1) + "M"; // Convert to million
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(1) + "k"; // Convert to thousand
    }
    return num.toFixed(2); // Show exact value for smaller numbers
  };


  return (
    <div className="bg-gray-50 shadow-md rounded-lg p-6 mt-6 overflow-hidden">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Orders & Transactions</h2>


      {/* Overview: Total Orders & Payments */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
  {/* Total Orders */}
  <div className="bg-blue-600 text-white rounded-xl p-6 shadow-lg flex flex-col items-center justify-center text-center">
    <h3 className="text-base sm:text-lg font-semibold">Total Orders</h3>
    <p className="text-3xl font-bold mt-2">{formatNumber(orders.length)}</p>
  </div>

  {/* Total Payments */}
  <div className="bg-green-600 text-white rounded-xl p-6 shadow-lg flex flex-col items-center justify-center text-center">
    <h3 className="text-base sm:text-lg font-semibold">Total Payments</h3>
    <p className="text-3xl font-bold mt-2">
      D.A {formatNumber(orders.reduce((acc, order) => acc + parseFloat(order.totalPrice || 0), 0))}
    </p>
  </div>
</div>


      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Order ID, User ID, Store ID, Product ID, or Product Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>


      {/* Orders Table */}
      <div className="w-full relative h-[400px] overflow-hidden">
        <div className="absolute inset-0 w-full h-full overflow-x-auto">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : orders.length === 0 ? (
            <p>No records yet.</p>
          ) : (
            <div className="min-w-full">
              <div className="overflow-x-auto">
                <AdminOrderTable paginatedOrders={paginatedOrders} handleViewDetails={handleViewDetails} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-4 py-2 bg-gray-100 rounded">
            Page {pagination.currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === totalPages}
            className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        console.log(selectedOrder, 'select'),
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold">Order Details</h3>
            <p><strong>Order ID:</strong> {selectedOrder._id}</p>
            <p><strong>Status:</strong> {selectedOrder.orderStatus}</p>
            <p><strong>Total Price:</strong> D.A {selectedOrder.totalPrice}</p>
            <p><strong>Payment:</strong> {selectedOrder.paymentInfo.method} ({selectedOrder.paymentInfo.status})</p>
            <p><strong>Shipping Address:</strong> {selectedOrder.shippingInfo.address}, {selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.country}</p>
            <p><strong>Phone:</strong> {selectedOrder.shippingInfo.phoneNo}</p>

            <p><strong>Items:</strong></p>
            <ul className="list-disc pl-5">
              {selectedOrder.orderItems.map((item, index) => (
                <li key={index}>
                  {item.name} - D.A {item.price} (Qty: {item.quantity})
                </li>
              ))}
            </ul>

            <button onClick={handleCloseModal} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
