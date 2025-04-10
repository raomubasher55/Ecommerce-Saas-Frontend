import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { getStoreOrders } from "../../../store/actions/orderActions";
import Loader from "../../../utils/Loader";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const dispatch = useDispatch();
  const { loading, orders = [], error } = useSelector((state) => state.storeOrders);
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const { store } = useSelector(state => state.store);
  useEffect(() => {
    dispatch(getStoreOrders());
  }, [dispatch]);

  // Handle loading and error states
  if (loading) return <p className="text-center text-gray-600"> <Loader /> </p>;

  // Revenue and total sales calculations
  const totalSales = orders.length
    ? orders.reduce((acc, order) => acc + order.totalPrice, 0)
    : 0;
  const today = new Date().toISOString().split("T")[0]; 

  const revenueToday = orders
    .filter(order =>
      order.orderStatus === "delivered" &&
      new Date(order.createdAt).toISOString().split("T")[0] === today
    )
    .reduce((acc, order) => acc + order.totalPrice, 0);
  const productsSold = orders.length
    ? orders.reduce((acc, order) => acc + order.orderItems.reduce((itemAcc, item) => itemAcc + item.quantity, 0), 0)
    : 0;

  // Calculate sales per day for the last 7 days
  const salesPerDay = [0, 0, 0, 0, 0, 0, 0];
  if (orders.length) {
    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const dayOfWeek = orderDate.getDay();
      salesPerDay[dayOfWeek] += order.totalPrice;
    });
  }

  const salesData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Sales ($)",
        data: salesPerDay,
        borderColor: "#4222C4",
        backgroundColor: "rgba(66, 34, 196, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const ordersData = {
    labels: ["Pending", "Processing", "Delivered", "Canceled"],
    datasets: [
      {
        label: "Orders",
        data: [
          orders.filter((order) => order.orderStatus === "pending").length,
          orders.filter((order) => order.orderStatus === "processing").length,
          orders.filter((order) => order.orderStatus === "delivered").length,
          orders.filter((order) => order.orderStatus === "canceled").length,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const filteredOrders = filterStatus === "All" ? orders : orders.filter((order) => order.orderStatus === filterStatus);

  const ordersPerPage = 6;
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#4222C4] text-center">Dashboard Overview</h2>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
        {[{ label: "Total Sales", value: `A.D ${store?.totalSales}`, color: "text-green-600" },
        { label: "Orders", value: orders.length, color: "text-blue-600" },
        { label: "Products Sold", value: productsSold, color: "text-purple-600" },
        { label: "Withdrawals", value: `A.D ${store?.earnings}`, color: "text-red-600" },
        { 
          label: "Withdrawal Pending", 
          value: `A.D ${store?.withdraw
            ?.filter(w => w.status === "pending") 
            .reduce((total, w) => total + w.amount, 0)}`, 
          color: "text-orange-600" 
          },        
        { label: "Revenue Today", value: `A.D ${revenueToday.toLocaleString()}`, color: "text-green-600" }].map((item, index) => (
          <div key={index} className="bg-white shadow-md p-4 sm:p-6 rounded-lg text-center transition-transform duration-300 hover:scale-105">
            <h3 className="text-base sm:text-lg font-medium">{item.label}</h3>
            <p className={`text-xl sm:text-2xl font-bold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white shadow-md p-4 sm:p-6 rounded-lg">
          <h3 className="text-base sm:text-lg font-bold mb-4">Weekly Sales Trend</h3>
          <div className="overflow-x-auto">
            {orders.length ? <Line data={salesData} options={{ responsive: true, maintainAspectRatio: false }} /> : <p className="text-center text-gray-600">No sales data available.</p>}
          </div>
        </div>
        <div className="bg-white shadow-md p-4 sm:p-6 rounded-lg">
          <h3 className="text-base sm:text-lg font-bold mb-4">Order Distribution</h3>
          <div className="overflow-x-auto">
            {orders.length ? <Bar data={ordersData} options={{ responsive: true, maintainAspectRatio: false }} /> : <p className="text-center text-gray-600">No order data available.</p>}
          </div>
        </div>
      </div>

      {/* Order Filter Buttons */}
      <div className="flex flex-wrap gap-2 sm:gap-4 mt-4 justify-center">
        {["All", "pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
          <button
            key={status}
            className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base text-white ${filterStatus === status ? 'bg-[#4222C4]' : 'bg-gray-400'} transition-colors duration-300`}
            onClick={() => setFilterStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Display filtered orders */}
      <div className="mt-6">
        {paginatedOrders.length > 0 ? (
          <>
            <ul className="flex justify-center flex-wrap gap-4">
              {paginatedOrders.map((order) => (
                <li key={order._id} className="p-4 sm:p-6 bg-white shadow-md rounded-lg w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33%-1rem)] transition-transform duration-300 hover:scale-105">
                  <h4 className="font-semibold text-sm sm:text-base">Order ID: {order._id}</h4>
                  <p className="text-sm sm:text-base">Status: {order.orderStatus}</p>
                  <p className="text-sm sm:text-base">Total Price: ${order.totalPrice}</p>
                  <p className="text-sm sm:text-base">Customer: {order.user?.name || "Unknown"}</p>
                </li>
              ))}
            </ul>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4 space-x-4">
              <button
                className={`px-4 py-2 rounded-lg ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-[#4222C4] text-white"}`}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Prev
              </button>
              <span className="text-gray-700 text-sm sm:text-base">
                Page {currentPage} of {totalPages} ({filteredOrders.length} orders)
              </span>
              <button
                className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-[#4222C4] text-white"}`}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600">No orders to display for the selected status.</p>
        )}
      </div>
    </div>
  );
}
