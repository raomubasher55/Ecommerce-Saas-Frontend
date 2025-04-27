import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStoreOrders, updateOrderStatus, updatePaymentStatus } from "../../../store/actions/orderActions";
import { FaSearch, FaEllipsisV, FaTimes } from "react-icons/fa";
import Loader from "../../../utils/Loader";

export const CostumerOrders = () => {
  const dispatch = useDispatch();
  const { loading, orders , error } = useSelector((state) => state.storeOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [statusUpdateOpen, setStatusUpdateOpen] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [paymentUpdateOpen, setPaymentUpdateOpen] = useState(null);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");


  useEffect(() => {
    dispatch(getStoreOrders());
  }, [dispatch]);

  const handleStatusSubmit = () => {
    if (selectedStatus && statusUpdateOpen) {
      dispatch(updateOrderStatus(statusUpdateOpen, selectedStatus)).then(() => {
        setStatusUpdateOpen(null);
        setSelectedStatus("");
        dispatch(getStoreOrders());
      });
    }
  };

  const handlePaymentStatusSubmit = () => {
    if (selectedPaymentStatus && paymentUpdateOpen) {
      dispatch(updatePaymentStatus(paymentUpdateOpen, selectedPaymentStatus)).then(() => {
        setPaymentUpdateOpen(null);
        setSelectedPaymentStatus("");
        dispatch(getStoreOrders());
      });
    }
  };
  


  const filteredOrders = orders?.filter(
    (order) =>
      (order.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        order._id.includes(search)) &&
      (statusFilter ? order.orderStatus === statusFilter : true)
  );

  return (
    <div className="p-4 bg-gray-50 min-h-screen w-full overflow-auto">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 animate-fade-in">
        <div className="flex items-center w-full md:max-w-md lg:max-w-lg xl:max-w-xl mb-4 md:mb-0">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by order ID or customer name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4222C4]"
          />
        </div>
        <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
          {["pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${statusFilter === status ? "bg-[#4222C4] text-white" : "bg-gray-200 text-gray-800"} hover:bg-[#4222C4] hover:text-white transition-colors duration-300`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
          <button
            onClick={() => setStatusFilter("")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${!statusFilter ? "bg-[#4222C4] text-white" : "bg-gray-200 text-gray-800"} hover:bg-[#4222C4] hover:text-white transition-colors duration-300`}
          >
            All
          </button>
        </div>
      </div>

      {/* Loading or Orders */}
      {loading ? (
        <div className="text-center text-xl font-bold animate-pulse text-[#4222C4]"> <Loader /> </div>
      ) : (
        <div>
          {filteredOrders?.length === 0 ? (
            <div className="text-center text-gray-500 animate-fade-in text-lg font-medium">
              No orders yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredOrders?.map((order) => (
                <div
                  key={order._id}
                  className="relative bg-white p-4 rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 border border-[#4222C4]/30 animate-slide-up"
                >
                  <span
                    className={`absolute right-0 top-1 px-3 py-1 rounded-full text-sm font-medium ${order.orderStatus === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.orderStatus === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : order.orderStatus === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.orderStatus === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {order.orderStatus}
                  </span>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold break-words w-full">
                      <span className="text-[#4222C4]">Order ID: </span> {order._id}
                    </h2>
                    <button onClick={() => setDropdownOpen(dropdownOpen === order._id ? null : order._id)}>
                      <FaEllipsisV className="text-gray-600 hover:text-[#4222C4]" />
                    </button>
                    {dropdownOpen === order._id && (
                      <div className="absolute right-2 top-8 bg-white shadow-lg border rounded-lg w-40 z-10">
                        <button
                          onClick={() => {
                            setStatusUpdateOpen(order._id);
                            setDropdownOpen(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Order Status
                        </button>
                        <button
                          onClick={() => {
                            setPaymentUpdateOpen(order._id);
                            setDropdownOpen(null);
                          }}
                          className="w-full text-left px-2 py-2 hover:bg-gray-100"
                        >
                          Payment Status
                        </button>

                      </div>
                    )}
                  </div>
                  <div className="space-y-2 text-gray-700">
                    <p><strong className="text-[#4222C4]">Customer:</strong> {order.user?.name || "N/A"}</p>
                    <p><strong className="text-[#4222C4]">Email:</strong> {order.user?.email || "N/A"}</p>
                    <p><strong className="text-[#4222C4]">Phone:</strong> {order.shippingInfo?.phoneNo || "N/A"}</p>
                    <p><strong className="text-[#4222C4]">Address:</strong> {`${order.shippingInfo?.address || ""}, ${order.shippingInfo?.city || ""}, ${order.shippingInfo?.postalCode || ""}, ${order.shippingInfo?.country || ""}`}</p>
                    <p><strong className="text-[#4222C4]">Payment Method:</strong> {order.paymentInfo?.method || "N/A"}</p>
                    <p>
                      <strong className="text-[#4222C4]">Payment Status:</strong>
                      <span className={`ml-2 ${order.paymentInfo?.status === "paid"
                        ? "text-green-600"
                        : order.paymentInfo?.status === "failed"
                          ? "text-red-600"
                          : "text-yellow-600"
                        }`}>
                        {order.paymentInfo?.status || "Pending"}
                      </span>
                    </p>

                    <p><strong className="text-[#4222C4]">Total Price:</strong> <span className="text-[#4222C4]">$ {order.totalPrice}</span></p>
                    <p><strong className="text-[#4222C4]">Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal for Status Update */}
      {statusUpdateOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96 relative animate-fade-in">
            <button
              onClick={() => setStatusUpdateOpen(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
            >
              <FaTimes size={18} />
            </button>
            <h2 className="text-lg font-semibold text-[#4222C4] mb-4">Update Order Status</h2>
            <div className="space-y-3">
              {["pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`w-full px-4 py-2 rounded-lg ${selectedStatus === status ? "bg-[#4222C4] text-white" : "bg-gray-200 text-gray-800"} hover:bg-[#4222C4] hover:text-white transition-colors duration-300`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={handleStatusSubmit}
              className="w-full mt-4 px-4 py-2 bg-[#4222C4] text-white rounded-lg hover:bg-[#3418A0] transition-colors duration-300"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {paymentUpdateOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96 relative animate-fade-in">
            <button
              onClick={() => setPaymentUpdateOpen(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
            >
              <FaTimes size={18} />
            </button>
            <h2 className="text-lg font-semibold text-[#4222C4] mb-4">Update Payment Status</h2>
            <div className="space-y-3">
              {["pending", "paid", "failed" , "refunded"].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedPaymentStatus(status)}
                  className={`w-full px-4 py-2 rounded-lg ${selectedPaymentStatus === status ? "bg-[#4222C4] text-white" : "bg-gray-200 text-gray-800"
                    } hover:bg-[#4222C4] hover:text-white transition-colors duration-300`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={handlePaymentStatusSubmit}
              className="w-full mt-4 px-4 py-2 bg-[#4222C4] text-white rounded-lg hover:bg-[#341a9d] transition-colors duration-300"
            >
              Update Payment Status
            </button>
          </div>
        </div>
      )}


    </div>
  );
};
