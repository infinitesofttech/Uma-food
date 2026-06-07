import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCreditCard, FiTruck, FiShield, FiCheck } from "react-icons/fi";
import Container from "../components/Container";
import PageLayout from "../components/PageLayout";
import { formatPrice, getImageUrl } from "../utils/format";
import { createOrder, verifyPayment } from "../api/checkoutApi";
import toast from "react-hot-toast";

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const shipping = cartTotal >= 500 ? 0 : 40;
  const finalTotal = cartTotal + shipping;
  
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Please login first to proceed with checkout");
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    const resScript = await loadRazorpayScript();

    if (!name.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!address.trim()) {
      toast.error("Please enter your delivery address");
      return;
    }

    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    if (phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    if (!resScript) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      const data = await createOrder({
      name,
      phone,
      address,
      cart: cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      })),
    });

      const orderId = data.order_id;

       const options = {
      key: data.key,
      amount: data.razorpay_order.amount,
      currency: "INR",
      name: "Uma Papad",
      description: "Order Payment",
      order_id: data.razorpay_order.id,

      handler: async function (response) {
        try {
          // 2️⃣ VERIFY PAYMENT
          const verifyData = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          toast.success("Payment successful");
          clearCart();
          navigate(`/orders/${orderId}`);
        } catch (err) {
          toast.error("Payment verification failed");
        }
      },

      prefill: {
        name,
        contact: phone,
      },

      theme: {
        color: "#F59E0B",
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  } catch (err) {
    // console.error(err);
    toast.error("Checkout failed");
  }
  };

  if (authLoading) {
    return (
      <PageLayout>
        <Container className="page-content">
          <div className="flex items-center justify-center min-h-[60vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500 mx-auto"></div>
              <p className="mt-4 text-neutral-600 font-body">
                Loading checkout...
              </p>
            </motion.div>
          </div>
        </Container>
      </PageLayout>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <PageLayout>
      <Container className="page-hero-shell">
        <div className="page-hero bg-neutral-950">
          <div className="absolute inset-0 bg-[url('/images/hero-banner.png')] bg-cover bg-center opacity-20 mask-image-gradient-b"></div>
          <div className="absolute inset-0 bg-linear-to-r from-neutral-950 via-neutral-950/80 to-transparent"></div>

          <div className="page-hero-body">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="page-hero-kicker text-saffron-400 bg-saffron-500/5">
                Secure Checkout
              </span>
              <h1 className="page-hero-title mt-4">
                Complete Your <span className="text-gradient-gold">Order</span>
              </h1>
              <p className="page-hero-copy">
                Review your items and provide delivery details to place your
                order.
              </p>
            </motion.div>
          </div>
        </div>
      </Container>

      <Container className="page-content">
        <div className="grid w-full gap-8 lg:grid-cols-12">
          {/* LEFT - FORM */}
          <div className="w-full lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="surface-card p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-saffron-50 rounded-xl flex items-center justify-center shrink-0">
                  <FiCreditCard className="text-saffron-600" size={20} />
                </div>
                <h2 className="font-display text-2xl font-bold text-neutral-900">
                  Delivery Details
                </h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block font-heading font-semibold text-sm text-neutral-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full h-12 px-4 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron-100 focus:border-saffron-400 transition-colors font-body text-neutral-800"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-heading font-semibold text-sm text-neutral-700 mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    placeholder="Enter your complete delivery address"
                    className="w-full p-4 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron-100 focus:border-saffron-400 transition-colors font-body text-neutral-800 resize-none"
                    rows={4}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-heading font-semibold text-sm text-neutral-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    className="w-full h-12 px-4 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron-100 focus:border-saffron-400 transition-colors font-body text-neutral-800"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="mt-8 w-full bg-neutral-900 text-white py-4 rounded-xl font-heading font-semibold hover:bg-saffron-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Place Order - ₹{finalTotal}
              </motion.button>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-neutral-100">
                {[
                  { icon: FiTruck, text: "Free delivery on orders over ₹500" },
                  { icon: FiShield, text: "Secure payment processing" },
                  { icon: FiCheck, text: "Order tracking available" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-neutral-600"
                  >
                    <item.icon
                      size={16}
                      className="text-saffron-500 shrink-0"
                    />
                    <span className="text-xs font-body">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT - ORDER SUMMARY */}
          <div className="w-full lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="surface-card p-6 sm:p-8 lg:sticky lg:top-24"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-saffron-50 rounded-xl flex items-center justify-center shrink-0">
                  <FiCheck className="text-saffron-600" size={20} />
                </div>
                <h2 className="font-display text-2xl font-bold text-neutral-900">
                  Order Summary
                </h2>
              </div>

              <div className="space-y-4 max-h-64 overflow-y-auto pr-2 mb-6">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-4 p-3 rounded-xl bg-neutral-50/50"
                  >
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-semibold text-neutral-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-sm text-neutral-500">{item.weight}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-neutral-600">
                          Qty: {item.quantity}
                        </span>
                        <span className="font-heading font-bold text-neutral-900">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-neutral-100 pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-body text-neutral-600">Subtotal</span>
                  <span className="font-heading font-semibold text-neutral-900">
                    {formatPrice(cartTotal)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-body text-neutral-600">Shipping</span>
                  <span
                    className={`font-heading font-semibold ${shipping === 0 ? "text-green-600" : "text-neutral-900"}`}
                  >
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>

                {cartTotal < 500 && (
                  <div className="bg-saffron-50 border border-saffron-100 rounded-lg p-3">
                    <p className="text-xs text-saffron-800 font-body">
                      Add {formatPrice(500 - cartTotal)} more for FREE delivery!
                      🚚
                    </p>
                  </div>
                )}

                <div className="border-t border-neutral-200 pt-3 flex justify-between items-center">
                  <span className="font-display text-lg font-bold text-neutral-900">
                    Total
                  </span>
                  <span className="font-display text-2xl font-bold text-saffron-600">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </PageLayout>
  );
};

export default Checkout;
