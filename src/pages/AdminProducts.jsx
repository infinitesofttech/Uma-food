import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminAPI } from "../api/adminApi";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiX } from "react-icons/fi";
import { getImageUrl } from "../utils/format";
const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: "" });
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [notification, setNotification] = useState("");
  const showNotification = (message) => {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  const [form, setForm] = useState({
    name: "",
    slug: "",
    price: "",
    original_price: "",
    stock: "",
    category: "",
    description: "",
    weight: "",
    tags: "",
    ingredients: "",
    nutrition: "",
    rating: 4.5,
    reviews: 0,
    image: null,
  });

  //  FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const data = await adminAPI.getProducts();
      setProducts(data || []);
    } catch (error) {
      toast.error("Failed to fetch products");
    }
  };

  //  FETCH CATEGORIES
  const fetchCategories = async () => {
    try {
      const data = await adminAPI.getCategories();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  //  HANDLE INPUT
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  //  SUBMIT
  const handleSubmit = async () => {
    if (!form.category) {
      showNotification("Please select category");
      return;
    }

    let nutritionParsed = {};
    try {
      nutritionParsed = form.nutrition ? JSON.parse(form.nutrition) : {};
    } catch {
      showNotification("Invalid nutrition JSON");
      return;
    }

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("slug", form.slug);
    formData.append("price", form.price);
    formData.append("original_price", form.original_price);
    formData.append("stock", form.stock);
    formData.append("category", form.category);
    formData.append("description", form.description);
    formData.append("weight", form.weight);
    formData.append("rating", form.rating);
    formData.append("reviews", form.reviews);

    formData.append(
      "tags",
      JSON.stringify(form.tags ? form.tags.split(",") : []),
    );
    formData.append(
      "ingredients",
      JSON.stringify(form.ingredients ? form.ingredients.split(",") : []),
    );
    formData.append("nutrition", JSON.stringify(nutritionParsed));

    if (form.image) {
      formData.append("image", form.image);
    }

    let res;

    if (editingId) {
      res = await adminAPI.updateProduct(editingId, formData, true);
      showNotification("Product updated successfully");
    } else {
      res = await adminAPI.addProduct(formData, true);
      showNotification("Product added successfully ");
    }

    console.log(res);

    if (!res || res.error) {
      showNotification("Error saving product");
      return;
    }

    fetchProducts();
    resetForm();
  };

  const resetForm = () => {
    setForm({
      name: "",
      slug: "",
      price: "",
      original_price: "",
      stock: "",
      category: "",
      description: "",
      weight: "",
      tags: "",
      ingredients: "",
      nutrition: "",
      rating: 4.5,
      reviews: 0,
      image: null,
    });
    setEditingId(null);
    setShowProductForm(false);
  };

  //  DELETE
  const handleDelete = async (id) => {
    // if (!window.confirm("Delete this product?")) return;

    try {
      await adminAPI.deleteProduct(id);
      showNotification("Product deleted ");
      fetchProducts();
    } catch (error) {
      toast.error("Delete failed ");
    }
  };

  // ✅ EDIT
  const handleEdit = (p) => {
    setEditingId(p.id);

    setForm({
      name: p.name || "",
      slug: p.slug || "",
      price: p.price || "",
      original_price: p.original_price || "",
      stock: p.stock || "",
      category: p.category?.id || p.category || "",
      description: p.description || "",
      weight: p.weight || "",
      tags: p.tags ? p.tags.join(",") : "",
      ingredients: p.ingredients ? p.ingredients.join(",") : "",
      nutrition: p.nutrition ? JSON.stringify(p.nutrition) : "",
      rating: p.rating || 4.5,
      reviews: p.reviews || 0,
      image: null,
    });

    setShowProductForm(true);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "No Category";
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
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white">
                {" "}
                Manage Products & Categories
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Add, edit, and manage your product catalog
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {/* <button
                            onClick={() => setShowCategoryForm(true)}
                            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                        >
                            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Category
                        </button> */}
              <button
                onClick={() => setShowProductForm(true)}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl cursor-pointer border border-slate-700"
              >
                <svg
                  className="w-5 h-5 inline mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Product
              </button>
            </div>
          </div>

          {/* PRODUCT FORM MODAL */}
          {showProductForm && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-800">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-white flex items-center">
                      <svg
                        className="w-6 h-6 mr-2 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      {editingId ? "Edit Product" : "Add New Product"}
                    </h2>
                    <button
                      onClick={() => {
                        setShowProductForm(false);
                        resetForm();
                      }}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-300">
                        Product Name
                      </label>
                      <input
                        name="name"
                        placeholder="Enter product name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-300">
                        Slug
                      </label>
                      <input
                        name="slug"
                        placeholder="product-slug"
                        value={form.slug}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-300">
                        Price (₹)
                      </label>
                      <input
                        name="price"
                        type="number"
                        placeholder="0.00"
                        value={form.price}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-300">
                        Original Price (₹)
                      </label>
                      <input
                        name="original_price"
                        type="number"
                        placeholder="0.00"
                        value={form.original_price}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-300">
                        Stock
                      </label>
                      <input
                        name="stock"
                        type="number"
                        placeholder="0"
                        value={form.stock}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-300">
                        Weight
                      </label>
                      <input
                        name="weight"
                        placeholder="e.g., 100g"
                        value={form.weight}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-300">
                        Category
                      </label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      >
                        <option value="" className="bg-slate-800">
                          Select Category
                        </option>
                        {categories.map((c) => (
                          <option
                            key={c.id}
                            value={c.id}
                            className="bg-slate-800"
                          >
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-300">
                        Rating
                      </label>
                      <input
                        name="rating"
                        type="number"
                        step="0.1"
                        placeholder="4.5"
                        value={form.rating}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-300">
                        Reviews
                      </label>
                      <input
                        name="reviews"
                        type="number"
                        placeholder="0"
                        value={form.reviews}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2 lg:col-span-3">
                      <label className="block text-sm font-medium text-slate-300">
                        Tags
                      </label>
                      <input
                        name="tags"
                        placeholder="tag1, tag2, tag3"
                        value={form.tags}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2 lg:col-span-3">
                      <label className="block text-sm font-medium text-slate-300">
                        Ingredients
                      </label>
                      <input
                        name="ingredients"
                        placeholder="ingredient1, ingredient2, ingredient3"
                        value={form.ingredients}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2 lg:col-span-3">
                      <label className="block text-sm font-medium text-slate-300">
                        Nutrition (JSON)
                      </label>
                      <textarea
                        name="nutrition"
                        placeholder='{"calories": 100, "protein": "5g"}'
                        value={form.nutrition}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2 lg:col-span-3">
                      <label className="block text-sm font-medium text-slate-300">
                        Description
                      </label>
                      <textarea
                        name="description"
                        placeholder="Product description"
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2 lg:col-span-3">
                      <label className="block text-sm font-medium text-slate-300">
                        Product Image
                      </label>
                      <input
                        type="file"
                        name="image"
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-cyan-400 hover:file:bg-slate-600"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-8 space-x-4 border-t border-slate-800 pt-6">
                    <button
                      onClick={() => {
                        setShowProductForm(false);
                        resetForm();
                      }}
                      className="px-6 py-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors font-medium border border-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-all duration-200 cursor-pointer font-medium shadow-lg hover:shadow-xl"
                    >
                      <svg
                        className="w-5 h-5 inline mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {editingId ? "Update Product" : "Add Product"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS LIST */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-2xl font-semibold mb-6 text-white flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              Products ({products.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-12 h-12 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-lg">
                    No products yet. Add one to get started!
                  </p>
                </div>
              ) : (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:bg-slate-800/70 transition-all duration-200 hover:shadow-xl hover:shadow-slate-900/20"
                  >
                    <div className="aspect-square bg-slate-700 relative overflow-hidden">
                      {product.image ? (
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          // onError={(e) => {
                          //     e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                          // }}
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-600 flex items-center justify-center">
                          <svg
                            className="w-16 h-16 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 bg-slate-900/80 text-cyan-400 rounded-lg hover:bg-slate-900 transition-colors"
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
                          onClick={() => handleDelete(product.id)}
                          className="p-2 bg-slate-900/80 text-red-400 rounded-lg hover:bg-red-900/20 transition-colors"
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
                      </div>
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            product.is_available
                              ? "bg-emerald-900/80 text-emerald-300 border border-emerald-700"
                              : "bg-red-900/80 text-red-300 border border-red-700"
                          }`}
                        >
                          {product.is_available ? "Available" : "Unavailable"}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-cyan-400">
                          ₹{product.price}
                        </span>
                        <span className="text-sm text-slate-400">
                          Stock: {product.stock}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded-full">
                          {getCategoryName(product.category)}
                        </span>
                        <div className="flex items-center space-x-1">
                          <svg
                            className="w-4 h-4 text-amber-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span className="text-sm text-slate-400">
                            {product.rating || "4.5"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProducts;
