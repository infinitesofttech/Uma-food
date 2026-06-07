import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiHeart, FiStar, FiEye, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice, getImageUrl } from '../utils/format';
import toast from 'react-hot-toast';


const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const getTagStyle = (tag) => {
    const styles = {
      bestseller: 'bg-saffron-500 text-white',
      new: 'bg-emerald-500 text-white',
      popular: 'bg-blue-500 text-white',
      premium: 'bg-purple-500 text-white',
      healthy: 'bg-green-500 text-white',
      spicy: 'bg-red-500 text-white',
      party: 'bg-pink-500 text-white',
    };
    return styles[tag] || 'bg-neutral-500 text-white';
  };

  const discount = Math.round(((product.original_price - product.price) / product.original_price) * 100);

  // Quantity control functions
  const handleQuantityChange = (value) => {
    const numValue = parseInt(value) || 1;
    const maxQuantity = Math.min(product.stock || 99, 99); // Max 99 or stock limit
    const validQuantity = Math.max(1, Math.min(numValue, maxQuantity));
    setQuantity(validQuantity);
  };

  const incrementQuantity = () => {
    const maxQuantity = Math.min(product.stock || 99, 99);
    if (quantity < maxQuantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (product.stock === 0) {
      toast.error("Item is out of stock ❌");
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available in stock`);
      setQuantity(product.stock);
      return;
    }

    try {
      setIsAddingToCart(true);
      await addToCart(product, quantity);
      // Reset quantity to 1 after successful addition
      setQuantity(1);
    } catch (error) {
      // console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="surface-card group relative flex h-full flex-col overflow-hidden transition-all duration-500 hover:shadow-[0_10px_35px_-8px_rgba(212,160,23,0.16)]"
    >
      <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-1.5">
        {product.tags?.slice(0, 1).map((tag, i) => (
          <span key={i} className={`${getTagStyle(tag)} rounded-full px-2.5 py-0.5 text-[10px] font-heading font-semibold uppercase tracking-wider`}>
            {tag}
          </span>
        ))}
        {discount > 0 && (
          <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-heading font-bold text-white">
            -{discount}%
          </span>
        )}
      </div>

      {/* Wishlist & Quick View */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
        <button
          onClick={() => toggleWishlist(product)}
          className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 shadow-md ${isInWishlist(product.id)
            ? 'bg-red-500 text-white'
            : 'bg-white/90 backdrop-blur text-neutral-400 hover:text-red-500 hover:bg-white'
            }`}
        >
          <FiHeart size={14} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
        </button>
        <Link
          to={`/product/${product.slug}`}
          className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur rounded-full text-neutral-400 hover:text-saffron-600 hover:bg-white transition-colors shadow-md"
        >
          <FiEye size={14} />
        </Link>
      </div>

      {/* Image */}
      <Link
        to={`/product/${product.slug}`}
        className="relative block aspect-square w-full cursor-pointer overflow-hidden bg-linear-to-b from-neutral-50 to-saffron-50/30"
      >
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {product.stock === 0 && (
          <span className="absolute top-2 left-40 text-white text-xs px-3 py-1 mt-0.5 ml-1 rounded-lg bg-red-500">
            Out of Stock
          </span>
        )}

      </Link>

      {/* Content */}
      <div className="flex min-w-0 grow flex-col p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-1">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                size={11}
                className={i < Math.floor(product.rating) ? 'text-saffron-400 fill-saffron-400' : 'text-neutral-200'}
              />
            ))}
          </div>
          <span className="text-xs text-neutral-400 font-heading">({product.reviews})</span>
        </div>

        <Link to={`/product/${product.slug}`} className="block min-w-0">
          <h3 className="mb-2 font-display text-lg font-bold leading-tight text-neutral-900 transition-colors hover:text-saffron-600 sm:text-xl">
            {product.name}
          </h3>
        </Link>
        <p className="mb-4 grow font-body text-sm leading-relaxed text-neutral-500 line-clamp-2">
          {product.shortDesc}
        </p>

        <div className="mt-auto flex flex-col gap-3 border-t border-neutral-100 pt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading font-bold text-lg text-neutral-900">{formatPrice(product.price)}</span>
            {product.original_price > product.price && (
              <span className="font-heading text-xs text-neutral-400 line-through">{formatPrice(product.original_price)}</span>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-neutral-600">Qty:</span>
            <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden">
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiMinus size={12} />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                min="1"
                max={Math.min(product.stock || 99, 99)}
                className="w-12 h-8 text-center border-0 focus:outline-none focus:ring-0 focus:border-0 text-sm font-medium"
              />
              <button
                onClick={incrementQuantity}
                disabled={quantity >= Math.min(product.stock || 99, 99)}
                className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiPlus size={12} />
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAddingToCart}
            className={`w-full h-9 rounded-lg flex items-center justify-center cursor-pointer gap-2 transition-all duration-300 transform active:scale-95 shadow-sm font-medium text-sm ${
              product.stock === 0
                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                : isAddingToCart
                ? "bg-saffron-400 cursor-not-allowed text-white"
                : "bg-neutral-900 text-white hover:bg-saffron-600 hover:scale-105"
              }`}
          >
            {isAddingToCart ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding...
              </>
            ) : (
              <>
                <FiShoppingBag size={14} />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
