import React, { useEffect, useState } from "react";
import { adminAPI } from "../api/adminApi";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

const AdminCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [notification, setNotification] = useState("");
  const showNotification = (message) => {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 3000);
  };
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);

  // FETCH
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getCategories();
      setCategories(data);
    } catch (err) {
      toast.error("Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // SUBMIT (CREATE / UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      showNotification("Category name is required");
      return;
    }

    try {
      setSubmitting(true);

      if (editingId) {
        await adminAPI.updateCategory(editingId, form);
        showNotification("Category updated successfully");
      } else {
        await adminAPI.createCategory(form);
        showNotification("Category created successfully");
      }

      setForm({ name: "" });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      toast.error("Failed to save category");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // EDIT
  const handleEdit = (category) => {
    setForm({
      name: category.name,
    });
    setEditingId(category.id);
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await adminAPI.deleteCategory(id);
      showNotification("Category deleted successfully");
      fetchCategories();
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

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
             
                <FiCheckCircle
                className="text-emerald-600"
                  size={18}
                />
      

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
      <div className="p-6 text-white">
        <h2 className="text-4xl font-bold text-white mb-5">
          Category Management
        </h2>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-4 rounded-lg mb-6 flex flex-col md:flex-row gap-3"
        >
          <input
            type="text"
            name="name"
            placeholder="Category Name"
            value={form.name}
            onChange={handleChange}
            className="p-2 rounded bg-gray-900 border border-gray-700 flex-1"
          />

          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 rounded font-semibold transition ${
              editingId
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {submitting ? "Saving..." : editingId ? "Update" : "Add Category"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setForm({ name: "" });
                setEditingId(null);
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
            >
              Cancel
            </button>
          )}
        </form>

        {/* TABLE */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-gray-300">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              No categories found
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-900 text-gray-300">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="border-t border-gray-700 hover:bg-gray-700/40"
                  >
                    <td className="p-3">{cat.id}</td>
                    <td className="p-3 font-medium">{cat.name}</td>

                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded"
                      >
                         <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                      </button>

                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded"
                      >
                         <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminCategory;
