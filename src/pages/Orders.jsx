import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatPrice } from "../utils/format";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../api/myOrderApi";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

 useEffect(() => {
  const fetchOrders = async () => {
    try {
      const data = await getMyOrders();
      // console.log("Orders:", data);
      setOrders(data);
    } catch (error) {
      // console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "FAILED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black m-4"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center mt-30 mb-20">
        <h2 className="text-2xl font-bold">No Orders Yet 🛒</h2>
        <p className="text-gray-500 mt-2">Start shopping to see your orders here</p>
        <button
          onClick={() => navigate("/shop")}
          className="mt-5 px-5 py-2 bg-black text-white rounded-lg"
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 mt-20">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      <div className="space-y-5">
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="border rounded-xl p-5 shadow-sm bg-white"
          >
            {/* TOP SECTION */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-lg">
                  Order 
                </h2>
                <p className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            {/* ITEMS */}
            <div className="mt-4 space-y-2">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm border-b pb-2"
                >
                  <span>
                    {item.food_item.name} × {item.quantity}
                  </span>
                  <span>
                    {formatPrice(item.food_item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="flex justify-between items-center mt-4">
              <p className="text-gray-600 text-sm">
                Payment ID: {order.razorpay_payment_id || "N/A"}
              </p>

              <button
                onClick={() => navigate(`/orders/${order.id}`)}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                View Details →
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Orders;