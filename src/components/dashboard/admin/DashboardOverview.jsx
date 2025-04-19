import { useDispatch, useSelector } from "react-redux";
import {
  FaStore,
  FaShoppingCart,
  FaUser,
  FaStoreAlt,
} from "react-icons/fa";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale } from "chart.js";
import "chart.js/auto";
import { fetchUsers } from '../../../store/actions/AlluserActions';
import { fetchStores } from "../../../store/actions/storeActions";
import { useEffect, useState } from "react";
import axios from "axios";
import { IoCash } from "react-icons/io5";

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale);

const DashboardOverview = () => {
  const dispatch = useDispatch();

  const totalUsers = useSelector((state) => state.users.totalUsers);
  const { stores } = useSelector((state) => state.store);

  const [storeSales, setStoreSales] = useState([]);
  const [loadingSales, setLoadingSales] = useState(true);
  const [selectedStore, setSelectedStore] = useState("all");

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchStores());
  }, [dispatch]);

  useEffect(() => {
    const fetchSales = async () => {
      if (!stores || stores.length === 0) return;

      try {
        let salesData = [];

        if (selectedStore === "all") {
          const salesPromises = stores.map((store) =>
            axios.get(`${import.meta.env.VITE_APP}/api/v1/store/sales/${store._id}`)
          );
          const salesResults = await Promise.all(salesPromises);

          const combinedMonthlySales = {};

          salesResults.forEach((result) => {
            const storeMonthlyData = Array.isArray(result.data.data) ? result.data.data : [];
            storeMonthlyData.forEach((monthData) => {
              const key = `${monthData.year}-${monthData.month}`;
              if (!combinedMonthlySales[key]) {
                combinedMonthlySales[key] = {
                  totalAmount: 0,
                  totalOrders: 0,
                  totalProducts: 0,
                  year: monthData.year,
                  month: monthData.month,
                };
              }
              combinedMonthlySales[key].totalAmount += monthData.totalAmount;
              combinedMonthlySales[key].totalOrders += monthData.totalOrders;
              combinedMonthlySales[key].totalProducts += monthData.totalProducts;
            });
          });

          salesData = Object.values(combinedMonthlySales);
        } else {
          const res = await axios.get(`${import.meta.env.VITE_APP}/api/v1/store/sales/${selectedStore}`);
          salesData = res.data.data || [];
        }

        const sortedData = salesData.sort((a, b) => a.year - b.year || a.month - b.month);
        setStoreSales(sortedData);
        setLoadingSales(false);
      } catch (error) {
        console.error("Error fetching sales:", error);
        setLoadingSales(false);
      }
    };

    fetchSales();
  }, [stores, selectedStore]);

  const totalRevenue = storeSales.reduce((acc, item) => acc + (item.totalAmount || 0), 0);
  const totalOrders = storeSales.reduce((acc, item) => acc + (item.totalOrders || 0), 0);
  const totalProducts = storeSales.reduce((acc, item) => acc + (item.totalProducts || 0), 0);

  const salesByMonth = new Array(12).fill(0);
  storeSales.forEach(({ month, totalAmount }) => {
    if (month >= 1 && month <= 12) {
      salesByMonth[month - 1] += totalAmount;
    }
  });

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Revenue",
        data: salesByMonth,
        fill: false,
        borderColor: "#6366f1",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-[#4222C4] mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <div className="text-[#4222C4] border border-[#4222c42a] bg-[#4222C4] bg-opacity-10 p-4 rounded-xl shadow hover:shadow-lg transform hover:scale-105 transition-all">
        <p className="text-sm flex items-center gap-2"><FaUser /> Total Users</p>
        <h3 className="text-xl font-semibold text-green-400"> {totalUsers}</h3>
      </div>
      <div className="text-[#4222C4] border border-[#4222c42a] bg-[#4222C4] bg-opacity-10 p-4 rounded-xl shadow hover:shadow-lg transform hover:scale-105 transition-all">
        <p className="text-sm flex items-center gap-2"><FaStoreAlt /> Total Shop</p>
        <h3 className="text-xl font-semibold text-green-400"> {stores?.length}</h3>
      </div>
      </div>

      {/* Store Selector */}
      <div className="mb-6">
        <label className="block mb-1 text-sm text-gray-700">Select Store:</label>
        <select
          className="bg-gray-200 text-[#4222C4] border border-[#4222c42a] px-3 py-2 rounded w-full"
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
        >
          <option value="all">All Stores</option>
          {stores.map((store) => (
            <option key={store._id} value={store._id}>
              {store.name}
            </option>
          ))}
        </select>
      </div>

      {loadingSales ? (
        <div className="text-center text-gray-600">Loading sales data...</div>
      ) : (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="text-[#4222C4] border border-[#4222c42a] bg-[#4222C4] bg-opacity-10 p-4 rounded-xl shadow hover:shadow-lg transform hover:scale-105 transition-all">
              <p className="text-sm flex items-center gap-2"><IoCash /> Total Revenue</p>
              <h3 className="text-xl font-semibold text-green-400">A.D. {totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="text-[#4222C4] border border-[#4222c42a] bg-[#4222C4] bg-opacity-10 p-4 rounded-xl shadow hover:shadow-lg transform hover:scale-105 transition-all">
              <p className="text-sm flex items-center gap-2"><FaShoppingCart /> Total Orders</p>
              <h3 className="text-xl font-semibold text-blue-400">{totalOrders}</h3>
            </div>
            <div className="text-[#4222C4] border border-[#4222c42a] bg-[#4222C4] bg-opacity-10 p-4 rounded-xl shadow hover:shadow-lg transform hover:scale-105 transition-all">
              <p className="text-sm flex items-center gap-2"><FaStore /> Total Products</p>
              <h3 className="text-xl font-semibold text-yellow-400">{totalProducts}</h3>
            </div>
          </div>

          {/* Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow rounded-lg p-6 h-[400px]">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Sales Trend</h2>
              <Line data={chartData} options={{ maintainAspectRatio: false }} height={300} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardOverview;
