import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiArrowRight } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import Container from '../components/Container';
import PageLayout from '../components/PageLayout';
import { useAuth } from "../context/AuthContext";
const WishlistPage = () => {
  const { wishlistItems, clearWishlist, isLoggedIn } = useWishlist();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <PageLayout>
        <Container className="page-content text-center mt-20">
          <h2 className="text-2xl font-bold">Please login first 🔐</h2>
          <p className="text-gray-500 mt-2">
            You need to login to view your wishlist
          </p>
          <Link
            to="/login"
            className="mt-5 inline-block px-5 py-2 bg-black text-white rounded-lg"
          >
            Go to Login
          </Link>
        </Container>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Container className="page-hero-shell">
        <div className="page-hero bg-neutral-950">
          <div className="absolute inset-0 bg-[url('/images/hero-banner.png')] bg-cover bg-center opacity-20 mask-image-gradient-b"></div>
          <div className="absolute inset-0 bg-linear-to-r from-neutral-950 via-neutral-950/80 to-transparent"></div>

          <div className="page-hero-body">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="page-hero-kicker text-saffron-400 bg-saffron-500/5">
                Your Collection
              </span>
              <h1 className="page-hero-title mt-4">
                My <span className="text-gradient-gold">Wishlist</span>
              </h1>
              <p className="page-hero-copy">
                Save your favorite papads for later. Add them to your cart anytime.
              </p>
            </motion.div>
          </div>
        </div>
      </Container>

      <Container className="page-content">
        {wishlistItems.length > 0 ? (
          <>
            <div className="mb-7 flex justify-between items-center md:mb-8">
              <p className="font-body text-neutral-500 text-sm">
                You have <strong className="font-heading text-neutral-900">{wishlistItems.length}</strong> item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
              </p>
              <button
                onClick={clearWishlist}
                className="font-heading font-semibold text-neutral-600 hover:text-red-500 text-sm transition-colors"
              >
                Clear all
              </button>
            </div>

            <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {wishlistItems.map((item, index) => (
              <ProductCard
                key={item.id}
                product={item.food_item}   // ✅ FIX
                wishlistItemId={item.id}   // ✅ IMPORTANT
                index={index}
              />
              ))}
            </div>
          </>
        ) : (
          <div className="surface-card mt-4 p-12 text-center md:p-16">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-neutral-50 shadow-sm mx-auto">
              <FiHeart size={40} className="text-neutral-300" />
            </div>
            <h3 className="font-display font-bold text-3xl text-neutral-900 mb-3">Your wishlist is empty</h3>
            <p className="font-body text-neutral-500 text-base mb-8 max-w-md mx-auto">
              Looks like you haven't added any papads to your wishlist yet. Start exploring our collection!
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 font-heading font-semibold text-white bg-neutral-900 hover:bg-saffron-600 px-6 py-3 rounded-full transition-colors"
            >
              Continue Shopping
              <FiArrowRight size={16} />
            </Link>
          </div>
        )}
      </Container>
    </PageLayout>
  );
};

export default WishlistPage;
