import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { adminAPI } from "../api/adminApi";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiX } from "react-icons/fi";
const STATUS_OPTIONS = [
    "ALL",
    "PENDING",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "FAILED",
];

const statusStyles = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    SHIPPED: "bg-indigo-100 text-indigo-800",
    DELIVERED: "bg-emerald-100 text-emerald-800",
    CANCELLED: "bg-red-100 text-red-800",
    FAILED: "bg-rose-100 text-rose-800",
};



const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [statusUpdating, setStatusUpdating] = useState({});
    const [filterStatus, setFilterStatus] = useState("ALL");

  const [notification, setNotification] = useState("");
   const showNotification = (message) => {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 3000);
  };
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await adminAPI.getOrders();
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error("Failed to fetch orders ❌");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (id, status) => {
        setStatusUpdating((prev) => ({ ...prev, [id]: true }));
        try {
            await adminAPI.updateOrderStatus(id, status);
            showNotification("Order status updated");
            fetchOrders();
        } catch (error) {
            toast.error("Error updating order status ❌");
            console.error(error);
        } finally {
            setStatusUpdating((prev) => ({ ...prev, [id]: false }));
        }
    };

    const totals = useMemo(
        () => ({
            totalOrders: orders.length,
            totalRevenue: orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0),
            pending: orders.filter((order) => order.status === "PENDING").length,
            confirmed: orders.filter((order) => order.status === "CONFIRMED").length,
            delivered: orders.filter((order) => order.status === "DELIVERED").length,
            shipped: orders.filter((order) => order.status === "SHIPPED").length,
            cancelled: orders.filter((order) => order.status === "CANCELLED").length,
            failed: orders.filter((order) => order.status === "FAILED").length,
        }),
        [orders]
    );

    const filteredOrders = useMemo(() => {
        if (filterStatus === "ALL") return orders;
        return orders.filter((order) => order.status === filterStatus);
    }, [orders, filterStatus]);

    const formatCurrency = (value) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(value || 0);

    const formatDate = (value) => {
        if (!value) return "-";
        return new Date(value).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const statusCounts = [
        { label: "PENDING", count: totals.pending },
        { label: "CONFIRMED", count: totals.confirmed },
        { label: "SHIPPED", count: totals.shipped },
        { label: "DELIVERED", count: totals.delivered },
        { label: "CANCELLED", count: totals.cancelled },
        { label: "FAILED", count: totals.failed },
    ];

    return (
          <>
          <AnimatePresence>
            {notification && (
              <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                }}
                className="fixed inset-x-0 top-24 z-[9999] flex justify-center px-4"
              >
                <div className="bg-white shadow-xl rounded-xl px-5 py-4 flex items-center gap-3 max-w-md w-full">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <FiCheckCircle className="text-emerald-600" size={18} />
                  </div>
        
                  <p className="flex-1 text-gray-800 text-sm font-medium">
                    {notification}
                  </p>
        
                  <button
                    onClick={() => setNotification("")}
                    className="text-gray-500 hover:text-black"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        <div className="min-h-screen bg-slate-950 text-white p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* HEADER */}
                <div className="space-y-4">
                    <div>
                        <h1 className="text-4xl font-bold text-white">Order Management</h1>
                        <p className="text-slate-400 text-sm mt-1">Manage and track all orders from your store</p>
                    </div>
                </div>

                {/* TOP STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-lg">
                        <p className="text-slate-400 text-xs uppercase tracking-wide">Total Orders</p>
                        <h2 className="text-3xl font-bold mt-2">{totals.totalOrders}</h2>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-lg">
                        <p className="text-slate-400 text-xs uppercase tracking-wide">Total Revenue</p>
                        <h2 className="text-3xl font-bold mt-2 text-emerald-400">
                            {formatCurrency(totals.totalRevenue)}
                        </h2>
                    </div>
                </div>

                {/* STATUS FILTER CARDS */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">Filter by Status</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                        {statusCounts.map((item) => (
                            <div
                                key={item.label}
                                onClick={() => setFilterStatus(item.label)}
                                className={`cursor-pointer rounded-lg border p-3 text-center transition-all duration-200 ${
                                    filterStatus === item.label
                                        ? "bg-cyan-600 border-cyan-400 shadow-lg scale-105"
                                        : "bg-slate-900/70 border-slate-700 hover:bg-slate-800 hover:border-slate-600"
                                }`}
                            >
                                <p className="text-xs font-semibold text-slate-300 uppercase">{item.label}</p>
                                <p className="text-2xl font-bold mt-1">{item.count}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* TABLE SECTION */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <h3 className="text-lg font-semibold">
                            Orders <span className="text-slate-400 text-sm">({filteredOrders.length})</span>
                        </h3>
                        <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full w-fit">
                            Showing {filteredOrders.length} of {orders.length}
                        </span>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-800/50 border-b border-slate-700">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-300">Order ID</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-300">Customer</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-300">Amount</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-300">Status</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-300">Date</th>
                                    <th className="px-4 py-3 text-center font-semibold text-slate-300">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center p-8 text-slate-400">
                                            <div className="inline-block animate-spin">⚙️</div>
                                            <p className="mt-2">Loading orders...</p>
                                        </td>
                                    </tr>
                                ) : filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center p-8 text-slate-400">
                                            No orders found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id} className="border-b border-slate-800 hover:bg-slate-900/80 transition-colors">
                                            <td className="px-4 py-4 font-semibold text-white">#{order.id}</td>
                                            <td className="px-4 py-4 text-slate-200">{order.name}</td>
                                            <td className="px-4 py-4 text-emerald-400 font-semibold">
                                                {formatCurrency(order.total_amount)}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[order.status] || "bg-slate-700 text-slate-100"}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-slate-400 text-xs">
                                                {formatDate(order.created_at)}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                                        disabled={statusUpdating[order.id]}
                                                        className="bg-slate-800 border border-slate-700 text-slate-100 px-2 py-1 rounded text-xs hover:border-slate-600 transition disabled:opacity-50"
                                                    >
                                                        <option value="PENDING">PENDING</option>
                                                        <option value="CONFIRMED">CONFIRMED</option>
                                                        <option value="SHIPPED">SHIPPED</option>
                                                        <option value="DELIVERED">DELIVERED</option>
                                                        <option value="CANCELLED">CANCELLED</option>
                                                        <option value="FAILED">FAILED</option>
                                                    </select>
                                                    <button
                                                        onClick={() => setSelectedOrder(order)}
                                                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1 rounded text-xs font-semibold transition"
                                                    >
                                                        View
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MODAL */}
                {selectedOrder && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
                                <h2 className="text-2xl font-bold">Order #{selectedOrder.id}</h2>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-slate-400 hover:text-white text-2xl transition"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 space-y-6">
                                {/* Customer Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs uppercase text-slate-400 tracking-wide">Customer Name</p>
                                        <p className="text-lg font-semibold mt-1">{selectedOrder.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase text-slate-400 tracking-wide">Phone</p>
                                        <p className="text-lg font-semibold mt-1">{selectedOrder.phone}</p>
                                    </div>
                                </div>

                                {/* Address */}
                                <div>
                                    <p className="text-xs uppercase text-slate-400 tracking-wide">Shipping Address</p>
                                    <p className="text-slate-200 mt-1">{selectedOrder.address}</p>
                                </div>

                                {/* Order Details */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="bg-slate-800/50 p-4 rounded-lg">
                                        <p className="text-xs uppercase text-slate-400 tracking-wide">Total Amount</p>
                                        <p className="text-2xl font-bold text-emerald-400 mt-1">
                                            {formatCurrency(selectedOrder.total_amount)}
                                        </p>
                                    </div>
                                    <div className="bg-slate-800/50 p-4 rounded-lg">
                                        <p className="text-xs uppercase text-slate-400 tracking-wide">Status</p>
                                        <p className="text-lg font-semibold mt-1">{selectedOrder.status}</p>
                                    </div>
                                    <div className="bg-slate-800/50 p-4 rounded-lg">
                                        <p className="text-xs uppercase text-slate-400 tracking-wide">Order Date</p>
                                        <p className="text-sm font-semibold mt-1">{formatDate(selectedOrder.created_at)}</p>
                                    </div>
                                </div>

                                {/* Items */}
                                <div>
                                    <h3 className="font-semibold text-lg mb-3">Order Items</h3>
                                    <div className="space-y-2">
                                        {selectedOrder.items?.length ? (
                                            selectedOrder.items.map((item) => (
                                                <div key={item.id} className="bg-slate-800/50 border border-slate-700 p-3 rounded-lg flex justify-between items-center">
                                                    <div>
                                                        <p className="font-semibold text-slate-100">{item.food_item?.name || item.food_item_name || "Item"}</p>
                                                        <p className="text-xs text-slate-400 mt-1">Quantity: {item.quantity}</p>
                                                    </div>
                                                    <span className="bg-slate-700 px-3 py-1 rounded-full text-sm font-semibold">x{item.quantity}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-slate-400">No items in this order</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800 px-6 py-4">
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 rounded-lg transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </>
    );
}
export default AdminOrders;
