import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MdDashboard } from "react-icons/md";
import {
  FiGrid,
  FiPackage,
  FiShoppingBag,
  FiMessageSquare,
  FiLogOut,
  FiUsers,
} from "react-icons/fi";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const [user, setUser] = useState(null);
  const { logout, user, loading } = useAuth();

  // 🔐 Protect admin routes
  useEffect(() => {
    if (!loading) {
      if (!user || !user.is_admin) {
        navigate("/login");
      }
    }
  }, [user, loading]);

  // 🚪 Logout
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // 🎯 Sidebar item style
  const linkClass = (path) =>
    `flex items-center px-5 py-3 rounded-lg cursor-pointer transition-all duration-200 font-medium ${
      location.pathname === path
        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
        : "text-gray-300 hover:text-white hover:bg-gray-800/50"
    }`;

  // Get page title from current route
  const getPageTitle = () => {
    if (location.pathname === "/admin") return "Dashboard";
    if (location.pathname === "/admin/products") return "Products";
    if (location.pathname === "/admin/orders") return "Orders";
    if (location.pathname === "/admin/categories") return "Categories";
    if (location.pathname === "/admin/users") return "Users";
    return "Admin Panel";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Loading admin...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* SIDEBAR */}
      <div className="w-72 bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col justify-between border-r border-gray-700">
        <div>
          {/* LOGO / HEADER */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Uma Papad
                </h2>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* NAVIGATION */}
          <div className="p-4 space-y-2">
            <p className="px-5 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Menu
            </p>

            <div
              onClick={() => navigate("/admin")}
              className={linkClass("/admin")}
            >
              <MdDashboard className="w-5 h-5 mr-3" />
              Dashboard
            </div>

            <div
              onClick={() => navigate("/admin/categories")}
              className={linkClass("/admin/categories")}
            >
              <FiGrid className="w-5 h-5 mr-3" />
              Categories
            </div>

            <div
              onClick={() => navigate("/admin/products")}
              className={linkClass("/admin/products")}
            >
              <FiPackage className="w-5 h-5 mr-3" />
              Products
            </div>

            <div
              onClick={() => navigate("/admin/orders")}
              className={linkClass("/admin/orders")}
            >
              <FiShoppingBag className="w-5 h-5 mr-3" />
              Orders
            </div>
            <div
              onClick={() => navigate("/admin/messages")}
              className={linkClass("/admin/messages")}
            >
              <FiMessageSquare className="w-5 h-5 mr-3" />
              Messages
            </div>
            <div
              onClick={() => navigate("/admin/users")}
              className={linkClass("/admin/users")}
            >
              <FiUsers className="w-5 h-5 mr-3" />
              Users
            </div>
          </div>
        </div>

        {/* LOGOUT */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center bg-red-500/80 hover:bg-red-600 text-white font-medium py-3 rounded-lg cursor-pointer  transition-all duration-200 transform hover:scale-105"
          >
            <FiLogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOPBAR */}
        <div className="bg-white/5 backdrop-blur-md border-b border-gray-700 px-8 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">{getPageTitle()}</h1>
            <p className="text-sm text-gray-400 mt-1">
              {location.pathname === "/admin" &&
                "View and manage your dashboard"}
              {location.pathname === "/admin/products" &&
                "Manage all your products"}
              {location.pathname === "/admin/orders" &&
                "View all customer orders"}
              {location.pathname === "/admin/categories" &&
                "Manage product categories"}
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">
                  {user?.username || "Loading..."}
                </p>
                <p className="text-xs text-gray-400">
                  {user?.is_admin ? "👨‍💼 Admin" : "👤 User"}
                </p>
              </div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.username?.charAt(0).toUpperCase() || "A"}
            </div>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto bg-gray-900">
          <div className="p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
