import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useDispatch, useSelector } from 'react-redux';
import { getUserOrders } from '../../../store/actions/orderActions';
import FeedbackModal from '../../presentation/modals/FeedbackModal';

// Register the necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function UserOrders() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.userOrders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    try {
      dispatch(getUserOrders())
    } catch (error) {
      console.error('Error in useEffect:', error);
    }
  }, [dispatch]);


  const [timePeriod, setTimePeriod] = useState('daily');

  // Function to generate chart data based on selected time period
  const generateChartData = (orders, period) => {
    let filteredOrders = orders;

    if (period === 'weekly') {
      filteredOrders = orders.filter((order) => {
        const orderDate = new Date(order.date);
        return orderDate >= new Date(new Date().setDate(new Date().getDate() - 7));
      });
    } else if (period === 'monthly') {
      filteredOrders = orders.filter((order) => {
        const orderDate = new Date(order.date);
        return orderDate.getMonth() === new Date().getMonth();
      });
    } else if (period === 'yearly') {
      filteredOrders = orders.filter((order) => {
        const orderDate = new Date(order.date);
        return orderDate.getFullYear() === new Date().getFullYear();
      });
    }

    const dates = filteredOrders.map((order) => new Date(order.createdAt).toLocaleDateString());
    const orderCount = filteredOrders.length

    return {
      labels: dates,
      datasets: [{
        label: `Orders per ${period.charAt(0).toUpperCase() + period.slice(1)}`,
        data: orderCount,
        fill: true,
        borderColor: '#4222C4',
        backgroundColor: 'rgba(102, 187, 106, 0.2)',
        tension: 0.3,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#4222C4',
        borderWidth: 2,
      }],
    };
  };

  // Additional Metrics Calculation
  const calculateTotalOrders = () => orders?.length || 0;
  const calculateTotalInvestment = () => {
    if (!orders || !Array.isArray(orders)) return 0;
    return orders.reduce((total, order) => total + (order?.totalPrice || 0), 0);
  };
  const calculatePendingOrders = () => {
    if (!orders || !Array.isArray(orders)) return 0;
    return orders.filter((order) => order?.orderStatus === 'pending').length;
  };
  const calculateDeliveredOrders = () => {
    if (!orders || !Array.isArray(orders)) return 0;
    return orders.filter((order) => order?.orderStatus === 'delivered').length;
  };

  if (loading) {
    return <div>Loading...</div>;
  }


  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };


  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 bg-gray-50 mb-10">
        <div className="h-screen overflow-y-scroll p-4 sm:p-8">
          <h2 className="text-3xl font-semibold text-[#333333] mt-6 text-center">Your Orders Dashboard</h2>

          {/* Metrics Section */}
          <div className="metrics mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="metric-box p-6 bg-[#f9f9f9] rounded-lg shadow-md text-center border-l-4 border-[#4222C4]">
              <h3 className="text-lg font-semibold text-[#666666]">Total Orders</h3>
              <p className="text-3xl font-bold text-[#333333]">{calculateTotalOrders()}</p>
            </div>
            <div className="metric-box p-6 bg-[#f9f9f9] rounded-lg shadow-md text-center border-l-4 border-[#4222C4]">
              <h3 className="text-lg font-semibold text-[#666666]">Total Investment</h3>
              <p className="text-3xl font-bold text-[#333333]">D.A {calculateTotalInvestment().toFixed(2)}</p>
            </div>
            <div className="metric-box p-6 bg-[#f9f9f9] rounded-lg shadow-md text-center border-l-4 border-[#4222C4]">
              <h3 className="text-lg font-semibold text-[#666666]">Pending Orders</h3>
              <p className="text-3xl font-bold text-[#333333]">{calculatePendingOrders()}</p>
            </div>
            <div className="metric-box p-6 bg-[#f9f9f9] rounded-lg shadow-md text-center border-l-4 border-[#4222C4]">
              <h3 className="text-lg font-semibold text-[#666666]">Delivered Orders</h3>
              <p className="text-3xl font-bold text-[#333333]">{calculateDeliveredOrders()}</p>
            </div>
          </div>

          {/* Time Period Filter */}
          <div className="time-period-filter mt-6">
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className="bg-[#f1f1f1] border border-[#ddd] p-4 rounded-lg text-[#666666] focus:outline-none focus:ring-2 focus:ring-[#4222C4]"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {/* Order Chart Section */}
          {/* <div className='relative overflow-hidden p-4 h-[500px]  '>

          <div className="absolute left-0 top-0 order-chart my-8 overflow-scroll w-full">
            {orders.length > 0 && (
              <div className="relative h-80">
                <Line data={generateChartData(orders, timePeriod)} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  interaction: { mode: 'index', intersect: false },
                  scales: {
                    x: {
                      title: { display: true, text: 'Date' },
                      ticks: { color: '#777777' },
                    },
                    y: {
                      title: { display: true, text: 'Orders' },
                      ticks: { color: '#777777', beginAtZero: true },
                    },
                  },
                }} />
              </div>
            )}
          </div>
          </div> */}


          {/* Orders Table */}
          <div className='relative overflow-hidden p-4 h-[500px] mb-[100px]'>
      <div className="absolute left-0 top-0 Orders-table mt-8 overflow-scroll w-full ">
        {!orders || orders?.length === 0 ? (
          <p className="text-center text-[#999999]">No orders available</p>
        ) : (
          <table className="w-full bg-white shadow-md rounded-lg border border-[#ddd]">
            <thead className="bg-[#4222C4] text-white">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Items</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(orders) &&
                orders.map((order) => (
                  <tr key={order._id} className="border-b border-[#ddd]">
                    <td className="p-3">{order._id}</td>
                    <td className="p-3">{order.orderItems[0]?.name}</td>
                    <td className="p-3">D.A {order.totalPrice.toFixed(2)}</td>
                    <td className="p-3">{order.orderStatus}</td>
                    <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      <ul>
                        {order.orderItems.map((item, index) => (
                          <li key={index}>{item.name} x {item.quantity}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-3">
                      {order.orderStatus === "delivered" && (
                        <button
                          onClick={() => openModal(order)}
                          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-200"
                        >
                          Leave Feedback
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Feedback Modal */}
      {isModalOpen && selectedOrder && (
        <FeedbackModal closeModal={closeModal} selectedOrder={selectedOrder} />
      )}
    </div>


        </div>
      </div>
    </div>
  );
}