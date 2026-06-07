import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft, FiTruck, FiShield, FiPercent } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, getImageUrl } from '../utils/format';
import Container from '../components/Container';
import PageLayout from '../components/PageLayout';

const CartPage = () => {
  const { cartItems, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const shipping = cartTotal >= 500 ? 0 : 40;
  const finalTotal = cartTotal + shipping;
  const navigate = useNavigate();
  

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      alert("Please login first to proceed with checkout");
      navigate("/login");
      return;
    }

    navigate("/checkout");
  };

  return (
    <PageLayout>
      <Container className="page-hero-shell">
        <section className="page-hero page-hero-center bg-neutral-950">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-saffron-900/25 via-transparent to-transparent"></div>
          </div>
          <div className="page-hero-body">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="page-hero-title">Shopping <span className="text-gradient-gold">Cart</span></h1>
              <p className="page-hero-copy">
                {cartCount > 0 ? `${cartCount} item${cartCount !== 1 ? 's' : ''} in your cart` : 'Your cart is empty'}
              </p>
            </motion.div>
          </div>
        </section>
      </Container>

      <Container className="page-content">
        {cartItems.length === 0 ? (
          <motion.div className="surface-card py-14 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-neutral-50 shadow-sm">
              <FiShoppingBag size={40} className="text-neutral-300" />
            </div>
            <h2 className="mb-3 font-display text-2xl font-bold text-neutral-900">Nothing here yet!</h2>
            <p className="mb-8 font-body text-base text-neutral-500">Your shopping cart is currently empty.</p>
            <Link to="/shop" className="group inline-flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-3.5 font-heading font-semibold text-white shadow-lg transition-all hover:bg-saffron-600">
              <FiArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Browse Products
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-7 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="mb-5 flex items-center justify-between border-b border-neutral-200 pb-3">
                <h2 className="font-display text-xl font-bold text-neutral-900">Cart Items</h2>
                <button onClick={clearCart} className="rounded-full bg-red-50 px-3 py-1.5 font-heading text-xs text-red-500 hover:bg-red-100">Clear All</button>
              </div>
              <div className="space-y-4">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -50 }} className="surface-card flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
                      <Link to={`/product/${item.slug}`} className="h-28 w-full shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50 p-1 sm:w-28">
                        <img src={getImageUrl(item.image)} alt={item.name} className="h-full w-full rounded-lg object-cover" />
                      </Link>
                      <div className="flex grow flex-col min-w-0">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <Link to={`/product/${item.slug}`} className="block font-display text-lg font-bold text-neutral-900 hover:text-saffron-600">{item.name}</Link>
                            <p className="mb-1 font-heading text-xs text-neutral-500">{item.weight}</p>
                            <span className="inline-block rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-xs font-heading font-bold text-neutral-700">{formatPrice(item.price)} each</span>
                          </div>
                          <div className="flex items-center gap-3 sm:flex-col sm:items-end lg:flex-row lg:gap-5">
                            <div className="flex h-10 w-28 items-center justify-between rounded-full border border-neutral-200 bg-neutral-50 px-1">
                              <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-500 shadow-sm hover:text-neutral-900"><FiMinus size={12} /></button>
                              <input
                                type="number"
                                min="1"
                                max={item.stock}
                                value={item.quantity}
                                onChange={(e) => {
                                  const newQuantity = parseInt(e.target.value) || 1;
                                  if (newQuantity >= 1 && newQuantity <= item.stock) {
                                    updateQuantity(item.cartItemId, newQuantity);
                                  }
                                }}
                                className="w-12 text-center font-heading text-sm font-bold bg-transparent border-none outline-none focus:ring-0 focus:outline-none focus:border-0"
                              />
                              <button
                                onClick={() => {
                                  if (item.stock <= item.quantity) {
                                    alert("Out of stock");
                                    return;
                                  }
                                  updateQuantity(item.cartItemId, item.quantity + 1);
                                }}
                                disabled={item.stock === 0}
                                className={`flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm
    ${item.stock === 0 ? "text-gray-300 cursor-not-allowed" : "text-neutral-500 hover:text-neutral-900"}
  `}
                              >
                                <FiPlus size={12} />
                              </button>
                            </div>
                            <span className="font-display text-xl font-bold text-neutral-900">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(item.cartItemId)} className="mt-2 flex items-center gap-1.5 self-start text-neutral-300 hover:text-red-500 sm:self-end">
                          <FiTrash2 size={14} /><span className="text-xs font-heading">Remove</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <Link to="/shop" className="group mt-6 inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-saffron-600 hover:text-saffron-700">
                <FiArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Continue Shopping
              </Link>
            </div>

            <div className="lg:col-span-4">
              <div className="surface-card p-5 lg:sticky lg:top-24 lg:p-6">
                <h3 className="mb-5 border-b border-neutral-100 pb-3 font-display text-xl font-bold text-neutral-900">Order Summary</h3>
                <div className="space-y-3 border-b border-neutral-100 pb-5">
                  <div className="flex justify-between text-sm"><span className="text-neutral-500">Subtotal</span><span className="font-heading font-bold text-neutral-900">{formatPrice(cartTotal)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-neutral-500">Shipping</span><span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-heading font-bold text-emerald-600">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
                </div>
                {cartTotal < 500 && (
                  <div className="mt-4 flex gap-2 rounded-xl border border-saffron-100/50 bg-saffron-50 p-3">
                    <FiPercent size={14} className="shrink-0 text-saffron-600 mt-0.5" />
                    <p className="text-xs text-saffron-800">Add <strong>{formatPrice(500 - cartTotal)}</strong> more for free shipping!</p>
                  </div>
                )}
                <div className="flex items-end justify-between py-5">
                  <div><span className="block font-heading font-bold text-neutral-900">Total</span><span className="text-[10px] text-neutral-400">Incl. taxes</span></div>
                  <span className="font-display text-3xl font-bold text-neutral-900">{formatPrice(finalTotal)}</span>
                </div>
                <button
                  onClick={handleCheckoutClick}
                  disabled={authLoading}
                  className="mb-4 flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 py-3.5 text-sm font-heading font-semibold text-white shadow-lg hover:bg-saffron-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading ? "Checking..." : "Proceed to Checkout"}
                </button>
                <div className="space-y-3 border-t border-neutral-100 pt-4">
                  {[{ icon: FiTruck, text: 'Free shipping on orders over Rs. 500' }, { icon: FiShield, text: '100% secure payment' }].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-neutral-500">
                      <item.icon size={12} className="shrink-0 mt-0.5 text-neutral-400" />
                      <span className="text-xs">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </PageLayout>
  );
};

export default CartPage;
