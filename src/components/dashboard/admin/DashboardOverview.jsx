import { useDispatch, useSelector } from "react-redux";
import {
  FaDollarSign,
  FaUserFriends,
  FaStore,
  FaShoppingCart,
} from "react-icons/fa";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { fetchUsers } from '../../../store/actions/AlluserActions';
import { fetchStores } from "../../../store/actions/storeActions";
import { useEffect, useState } from "react";
import axios from "axios";


const DashboardOverview = () => {

  const dispatch = useDispatch();
    useEffect(() => {
      dispatch(fetchUsers());
      dispatch(fetchStores());
    }, [dispatch]);
    const totalUsers = useSelector((state) => state.users.totalUsers);
    const { stores } = useSelector((state) => state.store);
    const [storeSales, setStoreSales] = useState({});
    const [loadingSales, setLoadingSales] = useState(true);
    useEffect(() => {
      const fetchAllStoreSales = async () => {
        try {
          setLoadingSales(true);
          const salesPromises = stores.map(store => 
            axios.get(`${import.meta.env.VITE_APP}/api/v1/store/sales/${store._id}`)
          );
          console.log(salesPromises)
          
          const salesResults = await Promise.all(salesPromises);
          const salesData = {};
          
          salesResults.forEach((result, index) => {
            if (result.data.success) {
              salesData[stores[index]._id] = result.data.data;
            }
          });
          
          setStoreSales(salesData);
        } catch (error) {
          console.error('Error fetching store sales:', error);
        } finally {
          setLoadingSales(false);
        }
      };
  
      if (stores?.length > 0) {
        fetchAllStoreSales();
      }
    }, [stores]);

    const totalRevenue = Object.values(storeSales).reduce((acc, store) => acc + store.totalAmount, 0);
    const totalOrders = Object.values(storeSales).reduce((acc, store) => acc + store.totalOrders, 0);
  // Example Data
  const metrics = [
    // { label: "Total Revenue", value: `$${totalRevenue}`, icon: <FaDollarSign /> },
    { label: "Active Users", value: totalUsers, icon: <FaUserFriends /> },
    { label: "Active Shops", value: stores.length, icon: <FaStore /> },
    // { label: "Orders Processed", value: totalOrders, icon: <FaShoppingCart /> },
  ];

  
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const salesByMonth = new Array(12).fill(0);

// Fake monthly distribution of sales based on totalAmount
Object.values(storeSales).forEach(store => {
  const avgMonthlySales = store.totalAmount / 12; // تقسیم 12 مہینوں پر
  salesByMonth.forEach((_, index) => {
    salesByMonth[index] += avgMonthlySales; // ہر مہینے میں برابر بانٹ رہے ہیں
  });
});

const salesData = {
  labels: months,
  datasets: [
    {
      label: "Monthly Sales",
      data: salesByMonth,
      backgroundColor: "#4222C4",
      borderColor: "#4222C4",
      tension: 0.4,
      fill: true,
    },
  ],
};

  return (
    <div className="p-6 bg-gray-100">
      {/* Header */}
      <h1 className="text-3xl font-bold text-[#4222C4] mb-6">Dashboard Overview</h1>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-white shadow rounded-lg"
          >
            <div className="text-[#4222C4] text-3xl">{metric.icon}</div>
            <div>
              <p className="text-gray-600 font-medium">{metric.label}</p>
              <h3 className="text-xl font-bold text-gray-800">{metric.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="bg-white shadow rounded-lg p-6 h-[400px]">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Sales Trend</h2>
          <Line data={salesData} options={{ maintainAspectRatio: false }} height={300} />
        </div>

        {/* Revenue by Category Chart (Placeholder) */}
        <div className="bg-white shadow rounded-lg p-6 h-[400px]">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenue by Category</h2>
          <Line data={salesData} options={{ maintainAspectRatio: false }} height={300} />
        </div>
      </div>


    </div>
  );
};

export default DashboardOverview;
