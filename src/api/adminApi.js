import axiosInstance from "./axiosInstance";

export const adminAPI = {
  // Dashboard
  getDashboardStats: async () => {
    try {
      const response = await axiosInstance.get("/api/admin/dashboard/");
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to load dashboard data");
    }
  },

  // Check Admin
  checkAdmin: async () => {
    try {
      const response = await axiosInstance.get(
        "/api/admin/check-admin/"
      );
      return response.data;
    } catch (error) {
      handleApiError(error, "Admin check failed");
    }
  },

  // Products
  getProducts: async () => {
    try {
      const response = await axiosInstance.get(
        "/api/admin/products/"
      );
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to fetch products");
    }
  },

  getProduct: async (id) => {
    try {
      const response = await axiosInstance.get(
        `/api/admin/products/${id}/`
      );
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to fetch product");
    }
  },

  addProduct: async (formData) => {
  try {
    const response = await axiosInstance.post(
      "/api/admin/products/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to add product");
  }
},
updateProduct: async (id, formData) => {
  try {
    const response = await axiosInstance.put(
      `/api/admin/products/${id}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to update product");
  }
},


deleteProduct: async (id) => {
  try {
    const response = await axiosInstance.delete(
      `/api/admin/products/${id}/`
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to delete product");
  }
},
  // Orders
  getOrders: async () => {
    try {
      const response = await axiosInstance.get(
        "/api/admin/orders/"
      );
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to fetch orders");
    }
  },

  getOrder: async (id) => {
    try {
      const response = await axiosInstance.get(
        `/api/admin/orders/${id}/`
      );
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to fetch order");
    }
  },

 updateOrderStatus: async (id, status) => {
  try {
    const response = await axiosInstance.put(
      `/api/admin/orders/${id}/status/`,
      { status }
    );

    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to update order status");
  }
},
  // Users
  getUsers: async () => {
    try {
      const response = await axiosInstance.get(
        "/api/admin/users/"
      );

      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to fetch users");
    }
  },

  // Categories
  getCategories: async () => {
    try {
      const response = await axiosInstance.get(
        "/api/admin/categories/"
      );

      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to fetch categories");
    }
  },
  createCategory: async (data) => {
  try {
    const response = await axiosInstance.post(
      "/api/admin/categories/",
      data
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to create category");
  }
},
updateCategory: async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `/api/admin/categories/${id}/`,
      data
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to update category");
  }
},
deleteCategory: async (id) => {
  try {
    const response = await axiosInstance.delete(
      `/api/admin/categories/${id}/`
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to delete category");
  }
},

  // Messages
  getMessages: async () => {
    try {
      const response = await axiosInstance.get(
        "/api/admin/messages/"
      );

      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to fetch messages");
    }
  },

  markMessageRead: async (id) => {
    try {
      const response = await axiosInstance.patch(
        `/api/admin/messages/${id}/read/`
      );

      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to update message");
    }
  },
  // Contact Subjects
getSubjects: async () => {
  try {
    const response = await axiosInstance.get(
      "/api/admin/contact-subjects/"
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch subjects");
  }
},

addSubject: async (name) => {
  try {
    const response = await axiosInstance.post(
      "/api/admin/contact-subjects/",
      { name }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to add subject");
  }
},

deleteSubject: async (id) => {
  try {
    const response = await axiosInstance.delete(
      `/api/admin/contact-subjects/${id}/`
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to delete subject");
  }
},
};

