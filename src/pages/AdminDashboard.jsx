import React, { useEffect, useState } from "react";
import { adminAPI } from "../api/adminApi";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    users: 0,
    messages: 0,
  });
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
 

useEffect(() => {
  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getDashboardStats();
      setStats({
        orders: data.orders || 0,
        revenue: data.revenue || 0,
        users: data.users || 0,
        messages: data.messages || 0,
      });
    } catch (error) {
      setError(error.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  fetchStats();
}, []);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  return (
    <div className="space-y-6">

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Orders */}
        <div className="bg-slate-800 p-6 rounded-xl shadow">
          <p className="text-slate-400 text-sm">Total Orders</p>
          <h2 className="text-3xl font-bold text-white mt-2">
            {stats.orders}
          </h2>
        </div>

        {/* Revenue */}
        <div className="bg-slate-800 p-6 rounded-xl shadow">
          <p className="text-slate-400 text-sm">Revenue</p>
          <h2 className="text-3xl font-bold text-green-400 mt-2">
            {formatCurrency(stats.revenue)}
          </h2>
        </div>

        {/* Users */}
        <div className="bg-slate-800 p-6 rounded-xl shadow">
          <p className="text-slate-400 text-sm">Users</p>
          <h2 className="text-3xl font-bold text-blue-400 mt-2">
            {stats.users}
          </h2>
        </div>

        {/* Messages */}
        <div className="bg-slate-800 p-6 rounded-xl shadow">
          <p className="text-slate-400 text-sm">Messages</p>
          <h2 className="text-3xl font-bold text-yellow-400 mt-2">
            {stats.messages}
          </h2>
        </div>

      </div>
      

    </div>
  );
};

export default AdminDashboard;