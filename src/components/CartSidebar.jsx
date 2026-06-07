import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMinus, FiPlus, FiShoppingBag, FiArrowRight, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatPrice, getImageUrl } from '../utils/format';

const CartSidebar = () => {
  const { isCartOpen, setIsCartOpen, cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();
  const shipping = cartTotal >= 500 ? 0 : 40;
  const finalTotal = cartTotal + shipping;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 flex h-full w-full flex-col bg-white sm:w-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-[#FFFDF7] px-5 py-4 sm:px-6 sm:py-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-saffron-50">
                  <FiShoppingBag className="text-saffron-600" size={16} />
                </div>
                <h2 className="font-display font-bold text-lg text-neutral-900">Your Cart</h2>
                <span className="bg-neutral-100 text-neutral-600 text-[10px] font-heading font-semibold px-2 py-0.5 rounded-full">
                  {cartItems.length}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 rounded-full transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 bg-[#FFFDF7] p-5 sm:p-6">
              {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center pb-16 text-center">
                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-50">
                    <FiShoppingBag size={28} className="text-neutral-300" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-neutral-900 mb-1.5">Cart is empty</h3>
                  <p className="font-body text-neutral-500 text-sm mb-6">
                    Add some delicious papads to your cart.
                  </p>
                  <button onClick={() => setIsCartOpen(false)} className="text-saffron-600 font-heading text-sm font-semibold hover:text-saffron-700 underline underline-offset-4">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="surface-card flex gap-3 p-3 sm:p-4">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50 p-0.5">
                        <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="mb-0.5 flex items-start justify-between gap-2">
                          <h4 className="pr-2 font-heading text-sm font-semibold leading-snug text-neutral-900">{item.name}</h4>
                          <button onClick={() => removeFromCart(item.cartItemId)} className="text-neutral-300 hover:text-red-500 transition-colors p-0.5 -mr-0.5">
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                        <p className="font-body text-[10px] text-neutral-500 mb-2">{item.weight}</p>
                        <div className="mt-auto flex items-center justify-between gap-2">
                          <div className={`flex h-7 shrink-0 items-center rounded-full border bg-white 
  ${item.stock === 0 ? "opacity-50 pointer-events-none" : "border-neutral-200"}`}>
                            <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="w-7 h-full flex items-center justify-center text-neutral-500 hover:text-neutral-900"><FiMinus size={10} /></button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const newQuantity = parseInt(e.target.value) || 1;
                                const maxQuantity = Math.min(item.stock || 99, 99);
                                const validQuantity = Math.max(1, Math.min(newQuantity, maxQuantity));
                                updateQuantity(item.cartItemId, validQuantity);
                              }}
                              min="1"
                              max={Math.min(item.stock || 99, 99)}
                              className="w-8 h-full text-center font-heading font-semibold text-xs border-0 focus:outline-none focus:ring-0 focus:border-0 bg-transparent"
                            />
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1, item)}
                              disabled={item.stock === 0 || item.quantity >= item.stock}
                              className={`w-7 h-full flex items-center justify-center 
    ${item.stock === 0 || item.quantity >= item.stock
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-neutral-500 hover:text-neutral-900"
                                }`}
                            >
                              <FiPlus size={10} />
                            </button>
                          </div>
                          <span className="font-heading text-sm font-bold text-neutral-900">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="relative z-10 bg-white p-5 sm:p-6">
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Subtotal</span>
                    <span className="font-heading font-semibold text-neutral-900">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Shipping</span>
                    <span className="font-heading font-semibold text-emerald-600">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                  </div>
                  {cartTotal < 500 && (
                    <div className="mt-1.5 rounded-lg bg-saffron-50 px-2.5 py-1.5 font-body text-[10px] text-saffron-600">
                      Add {formatPrice(500 - cartTotal)} more for free shipping!
                    </div>
                  )}
                </div>
                <div className="mb-4 flex items-end justify-between">
                  <span className="font-body font-medium text-neutral-900 text-sm">Total</span>
                  <span className="font-display font-bold text-xl text-neutral-900">{formatPrice(finalTotal)}</span>
                </div>
                <Link
                  to="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-neutral-900 text-white font-heading text-sm font-semibold py-3.5 rounded-full hover:bg-saffron-600 transition-colors shadow-md group"
                >
                  Proceed to Checkout
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={14} />
                </Link>
                <div className="mt-3 text-center">
                  <button onClick={() => setIsCartOpen(false)} className="text-[10px] text-neutral-400 font-body hover:text-neutral-700 underline">Continue Shopping</button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
