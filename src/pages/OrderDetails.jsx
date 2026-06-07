import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatPrice } from "../utils/format";
import { motion } from "framer-motion";
import { getOrderDetails } from "../api/myOrderApi";

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

   useEffect(() => {
    const fetchOrder = async () => {
        try {
            const data = await getOrderDetails(id);
            setOrder(data);
        } catch (error) {
            // console.error("Error fetching order details:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchOrder();
}, [id]);

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
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!order) {
        return <p className="text-center mt-10">Order not found</p>;
    }

    return (
        <div className="max-w-3xl mx-auto p-10 m-20">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-xl p-6 bg-white shadow"
            >
                {/* ORDER HEADER */}
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-2xl font-bold">
                        Order
                    </h1>

                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            order.status
                        )}`}
                    >
                        {order.status}
                    </span>
                </div>

                <p className="text-gray-500 mb-4">
                    {new Date(order.created_at).toLocaleString()}
                </p>

                {/* CUSTOMER DETAILS */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-1">
                    <p><span className="font-semibold">Name:</span> {order.name}</p>
                    <p><span className="font-semibold">Phone:</span> {order.phone}</p>
                    <p><span className="font-semibold">Address:</span> {order.address}</p>
                </div>

                {/* ITEMS */}
                <div className="space-y-3">
                    {order.items?.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between border-b pb-2 text-sm"
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

                {/* TOTAL */}
                <div className="mt-4 text-right font-semibold">
                    Total: {formatPrice(order.total_amount || order.total || 0)}
                </div>

                {/* PAYMENT INFO */}
                <div className="mt-4 text-sm text-gray-600">
                    Payment ID: {order.razorpay_payment_id || "N/A"}
                </div>
            </motion.div>
        </div>
    );
};

export default OrderDetails;