import { useEffect } from "react";
import { FaDollarSign, FaShoppingCart, FaChartLine, FaUsers } from "react-icons/fa";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { getStoreOrders } from "../../../store/actions/orderActions";
import Loader from "../../../utils/Loader";

export const Analytics = () => {
  const dispatch = useDispatch();

  // Fetch data on component mount
  useEffect(() => {
    dispatch(getStoreOrders());
  }, [dispatch]);

  // Get data from Redux store
  const { loading, orders, error } = useSelector((state) => state.storeOrders);

  // Handle loading and error states
  if (loading) {
    return <div className="p-6 text-center text-lg text-blue-500"> <Loader /> </div>;
  }

  if (error) {
    return <div className="p-6 text-center text-lg text-gray-500 mt-32">No Record Yet</div>;
  }

  // Prepare data for charts and metrics
  const salesData = orders.map(order => ({
    date: new Date(order.createdAt).toLocaleDateString(),
    sales: order.totalPrice,
  }));

  const revenueData = orders.map(order => ({
    date: new Date(order.createdAt).toLocaleDateString(),
    revenue: order.totalPrice,
  }));

  // Calculate total metrics
  const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);
  const totalOrders = orders.length;
  const totalCustomers = orders.reduce((acc, order) => acc + (order.user ? 1 : 0), 0);

  return (
    <div className="p-6 bg-gray-100 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-[#4222C4]">Analytics</h1>
      <p className="text-gray-600">Gain insights with detailed Analytics and Reports here.</p>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Total Sales */}
        <MetricCard icon={<FaDollarSign className="text-3xl text-green-500" />} value={`$${totalSales}`} label="Total Sales" />

        {/* Total Orders */}
        <MetricCard icon={<FaShoppingCart className="text-3xl text-blue-500" />} value={totalOrders} label="Total Orders" />

        {/* Total Revenue */}
        <MetricCard icon={<FaChartLine className="text-3xl text-purple-500" />} value={`$${totalSales}`} label="Total Revenue" />

        {/* Total Customers */}
        <MetricCard icon={<FaUsers className="text-3xl text-yellow-500" />} value={totalCustomers} label="Total Customers" />
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <GraphCard title="Sales Overview" data={salesData} dataKey="sales" stroke="#8884d8" />
        <GraphCard title="Revenue Trends" data={revenueData} dataKey="revenue" stroke="#82ca9d" />
      </div>

      {/* Reports Section */}
   

    </div>
  );
};

// Reusable MetricCard Component
const MetricCard = ({ icon, value, label }) => (
  <div className="bg-white shadow-lg p-6 rounded-lg flex items-center space-x-4">
    {icon}
    <div>
      <h2 className="text-xl font-semibold text-gray-800">{value}</h2>
      <p className="text-gray-600">{label}</p>
    </div>
  </div>
);

// Reusable GraphCard Component
const GraphCard = ({ title, data, dataKey, stroke }) => (
  <div className="bg-white shadow-lg rounded-lg p-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={dataKey} stroke={stroke} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);
