import { useEffect, useState } from "react";
import { FaSearch, FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getStoreOrders } from "../../../store/actions/orderActions";

export const Customers = () => {
  const dispatch = useDispatch();
  const { loading, orders, error } = useSelector((state) => state.storeOrders);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    dispatch(getStoreOrders());
  }, [dispatch]);

  useEffect(() => {
    if (orders && orders.length > 0) {
      const customerOrderCount = {};
      
      orders.forEach((order) => {
        if (order.user && order.user._id) {
          const userId = order.user._id;
          customerOrderCount[userId] = (customerOrderCount[userId] || 0) + 1;
        }
      });

      const uniqueCustomers = [];
      const seenEmails = new Set();

      orders.forEach((order) => {
        const user = order.user;
        if (user && !seenEmails.has(user.email)) {
          uniqueCustomers.push({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: order.shippingInfo.phoneNo,
            totalOrders: customerOrderCount[user._id] || 0,
            status: order.orderStatus === "pending" ? "Inactive" : "Active",
          });
          seenEmails.add(user.email);
        }
      });

      setCustomers(uniqueCustomers);
    }
  }, [orders]);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-gray-100 min-h-screen">
      {/* Search Bar */}
      <div className="flex items-center justify-center relative max-w-full sm:max-w-md lg:max-w-lg mx-auto">
        <input
          type="text"
          placeholder="Search customers by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <FaSearch 
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 transition-all duration-300 ${
            search ? "left-[calc(100%-2.5rem)] text-blue-500" : ""
          }`}
        />
      </div>

      {/* Customers List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white p-4 shadow-md rounded-lg space-y-2">
            <h3 className="font-bold text-lg">{customer.name}</h3>
            <p className="text-sm text-gray-600">{customer.email}</p>
            <p className="text-sm">Phone: {customer.phone}</p>
            <p className="text-sm">Total Orders: {customer.totalOrders}</p>
            <button
              onClick={() => setSelectedCustomer(customer)}
              className="text-white bg-blue-500 px-3 py-2 rounded-lg hover:bg-blue-600 text-sm w-full"
            >
              <FaEye className="inline-block mr-1" /> View Details
            </button>
          </div>
        ))}
      </div>

      {/* Modal for Customer Details */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Customer Details</h2>
            <p><strong>Name:</strong> {selectedCustomer.name}</p>
            <p><strong>Email:</strong> {selectedCustomer.email}</p>
            <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
            <p><strong>Total Orders:</strong> {selectedCustomer.totalOrders}</p>
            <button
              onClick={() => setSelectedCustomer(null)}
              className="mt-4 px-4 py-2 bg-[#4222C4] text-white rounded-lg hover:bg-purple-800 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
