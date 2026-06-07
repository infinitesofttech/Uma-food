import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiX } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Notification = () => {
  const { notification: cartNotification, hideNotification: hideCartNotification } = useCart();
  const { notification: wishlistNotification, hideNotification: hideWishlistNotification } = useWishlist();
  const [isVisible, setIsVisible] = useState(false);

  const currentNotification = wishlistNotification || cartNotification;

  useEffect(() => {
    if (currentNotification) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000); // 3 seconds before sliding out

      return () => clearTimeout(timer);
    }
  }, [currentNotification]);

  return (
    <AnimatePresence>
      {isVisible && currentNotification && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed inset-x-0 top-24 z-60 flex justify-center px-4"
        >
          <div className="surface-card pointer-events-auto flex w-full items-start justify-between gap-3 px-4 py-3 sm:w-md sm:px-5 sm:py-3.5 select-none">
            <div className="flex min-w-0 items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                <FiCheckCircle size={14} className="text-emerald-500" />
              </div>
              <p className="font-body text-sm leading-relaxed text-neutral-900">
                {currentNotification}
              </p>
            </div>
            <button 
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => {
                  if (wishlistNotification) hideWishlistNotification();
                  else hideCartNotification();
                }, 200);
              }}
              className="mt-0.5 shrink-0 rounded-full bg-neutral-50 p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            >
              <FiX size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
