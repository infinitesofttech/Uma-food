import React, { useEffect, useState } from "react";
import { adminAPI } from "../api/adminApi";
import toast from "react-hot-toast";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await adminAPI.getUsers();
      setUsers(data || []);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="text-white">
      <h2 className="text-3xl font-bold mb-6">
        Users ({users.length})
      </h2>

      <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
        {loading ? (
          <div className="p-6 text-center">
            Loading users...
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-800">
              <tr>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Username</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Is_Admin</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-slate-700"
                >
                  <td className="p-4">{user.id}</td>
                  <td className="p-4">{user.username}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    {user.is_staff ? "Yes":"No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;