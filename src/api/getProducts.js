import axiosInstance from "./axiosInstance";

export const getProducts = async () => {
    try {
        const response = await axiosInstance.get("/menu/");
        return response.data;
    } catch (error) {
        console.error("Product API Error:", error);
        throw error;
    }
};

export const getProductBySlug = async (slug) => {
    try {
        const response = await axiosInstance.get(`/menu/${slug}/`);
        return response.data;
    } catch (error) {
        console.error("Product API Error:", error);
        throw error;

    }
};