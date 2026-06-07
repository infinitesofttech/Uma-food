import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiHeart, FiMinus, FiPlus, FiStar, FiTruck, FiShield, FiRefreshCw, FiChevronRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import Container from '../components/Container';
import { formatPrice, getImageUrl } from '../utils/format';
import PageLayout from '../components/PageLayout';
import { getProductBySlug, getProducts } from '../api/getProducts';

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const stock = product?.stock ?? 0;

  useEffect(() => {
  fetchProductData();
}, [slug]);

const fetchProductData = async () => {
  try {
    const productData = await getProductBySlug(slug);

    setProduct(productData);

    const allProducts = await getProducts();

    const related = allProducts
      .filter((item) => item.slug !== slug)
      .slice(0, 4);

    setRelatedProducts(related);
  } catch (error) {
    // console.error(error);
  }
};
  if (product === null) {
    return <div className="text-center mt-10">Loading...</div>;
  }
  

  const discount = Math.round(((product.original_price - product.price) / product.original_price) * 100);

  return (
    <PageLayout>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-neutral-100 py-3 mb-8">
        <Container>
          <div className="flex items-center gap-1.5 text-sm font-body">
            <Link to="/" className="text-neutral-400 hover:text-saffron-600 transition-colors">Home</Link>
            <FiChevronRight size={12} className="text-neutral-300" />
            <Link to="/shop" className="text-neutral-400 hover:text-saffron-600 transition-colors">Shop</Link>
            <FiChevronRight size={12} className="text-neutral-300" />
            <span className="text-neutral-800 font-medium">{product.name}</span>
          </div>
        </Container>
      </div>

      <Container className="page-content">
        {/* Product grid */}
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2 xl:gap-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="surface-card group sticky top-24 overflow-hidden bg-linear-to-b from-neutral-50 to-saffron-50/50">
              {discount > 0 && (
                <div className="absolute left-6 top-6 z-10 rounded-full bg-red-500 px-3 py-1 text-[10px] font-heading font-bold text-white shadow-lg">Save {discount}%</div>
              )}
              <img src={getImageUrl(product.image)} alt={product.name} className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105 cursor-zoom-in" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-col gap-1 py-1">
            <div className="mb-3 flex flex-wrap gap-1.5">
              {product.tags.map((tag, i) => (
                <span key={i} className="rounded-full border border-saffron-100 bg-saffron-50 px-3 py-1 text-[10px] font-heading font-bold uppercase tracking-widest text-saffron-700">{tag}</span>
              ))}
            </div>

            <h1 className="type-title-2 mb-3 text-balance text-neutral-900">{product.name}</h1>

            <div className="mb-4 flex items-center gap-2.5 border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} size={15} className={i < Math.floor(product.rating) ? 'fill-saffron-400 text-saffron-400' : 'text-neutral-200'} />
                ))}
              </div>
              <span className="font-heading text-xs font-medium text-neutral-500">{product.rating} ({product.reviews} reviews)</span>
            </div>

            <div className="mb-5 flex items-end gap-2.5">
              <span className="font-display text-3xl font-bold text-neutral-900">{formatPrice(product.price)}</span>
              {product.original_price > product.price && (
                <span className="mb-0.5 font-heading text-lg text-neutral-400 line-through">{formatPrice(product.original_price)}</span>
              )}
              {discount > 0 && (
                <span className="mb-1 ml-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-heading font-bold text-emerald-600">{discount}% OFF</span>
              )}
            </div>

            <p className="type-copy-lg mb-6 text-neutral-600">{product.description}</p>

            <div className="mb-5">
              <span className="mb-2 block font-heading text-xs font-bold uppercase tracking-wider text-neutral-900">Weight</span>
              <span className="inline-flex items-center justify-center rounded-lg border-2 border-neutral-200 bg-white px-5 py-2 text-sm font-heading font-medium text-neutral-700 hover:border-saffron-400 cursor-pointer transition-colors">{product.weight}</span>
            </div>

            <div className="mb-6 flex flex-col gap-4 border-b border-neutral-100 pb-6 sm:flex-row">
              <div className="flex h-12 w-full shrink-0 items-center justify-between rounded-full border border-neutral-200 bg-neutral-50 px-1.5 sm:w-32">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-500 shadow-sm hover:text-neutral-900"
                >
                  <FiMinus size={13} />
                </button>
                <span className="w-6 select-none text-center font-heading font-bold">{quantity}</span>
                <button
                  onClick={() => {
                    if (stock === 0) {
                      alert("Out of stock");
                      return;
                    }

                    if (quantity >= stock) {
                      alert("You cannot add more than available stock");
                      return;
                    }

                    setQuantity(quantity + 1);
                  }}
                  disabled={stock === 0}
                  className={`flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm
    ${stock === 0 ? "text-gray-300 cursor-not-allowed" : "text-neutral-500 hover:text-neutral-900"}
  `}
                >
                  <FiPlus size={13} />
                </button>
              </div>
              <button
                onClick={() => addToCart(product, quantity)}
                disabled={stock === 0}
                className={`flex h-12 grow items-center justify-center gap-2.5 rounded-full px-6 font-heading text-sm font-semibold text-white shadow-lg transition-all
    ${stock === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-neutral-900 hover:bg-saffron-600"}
  `}
              >
                <FiShoppingBag size={16} />
                {stock === 0 ? "Out of Stock" : `Add to Cart - ${formatPrice(product.price * quantity)}`}
              </button>
              <button className="h-12 w-12 shrink-0 rounded-full border-2 border-neutral-200 text-neutral-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-colors">
                <FiHeart size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { icon: FiTruck, label: 'Free Shipping', sub: 'Orders over Rs. 500' },
                { icon: FiShield, label: 'Quality Assured', sub: 'FSSAI Certified' },
                { icon: FiRefreshCw, label: 'Easy Returns', sub: '7-Day Policy' },
              ].map((f, i) => (
                <div key={i} className="rounded-xl border border-neutral-100 bg-neutral-50 p-3 text-center">
                  <f.icon size={20} className="mb-2 text-saffron-500" />
                  <div className="font-heading text-xs font-bold text-neutral-900">{f.label}</div>
                  <div className="font-body text-[10px] text-neutral-500">{f.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="mb-7 flex flex-wrap gap-5 border-b border-neutral-200">
            {[
              { id: 'description', label: 'Description' },
              { id: 'ingredients', label: 'Ingredients' },
              { id: 'nutrition', label: 'Nutrition' },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative px-1 pb-3 font-heading text-sm font-semibold transition-colors ${activeTab === tab.id ? 'text-saffron-600' : 'text-neutral-400 hover:text-neutral-800'}`}>
                {tab.label}
                {activeTab === tab.id && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-lg bg-saffron-500" />}
              </button>
            ))}
          </div>

          <div className="min-h-32">
            {activeTab === 'description' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="mb-4 font-body text-base leading-relaxed text-neutral-600">{product.description}</p>
                <p className="font-body text-base leading-relaxed text-neutral-600">Every batch of {product.name} is tested for quality and authentic taste. We follow a strict no-preservative policy.</p>
              </motion.div>
            )}
            {activeTab === 'ingredients' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing, i) => (
                    <span key={i} className="flex items-center gap-1.5 rounded-full border border-saffron-100 bg-white px-4 py-2 text-sm font-heading font-medium text-neutral-700 shadow-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-saffron-400"></div>{ing}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
            {activeTab === 'nutrition' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {Object.entries(product.nutrition).map(([key, value]) => (
                    <div key={key} className="flex flex-col items-center rounded-xl border border-neutral-100 bg-neutral-50 p-4 text-center hover:border-saffron-200 transition-colors">
                      <div className="mb-1 font-display text-2xl font-bold text-neutral-900">{value}</div>
                      <div className="font-heading text-[10px] font-semibold uppercase tracking-widest text-neutral-500">{key}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Related */}
        <div className="mt-12 border-t border-neutral-100 pt-10">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <span className="mb-2 block font-heading text-xs font-semibold uppercase tracking-widest text-saffron-500">Explore More</span>
              <h2 className="font-display text-2xl font-bold text-neutral-900 md:text-3xl">You May Also Like</h2>
            </div>
            <Link to="/shop" className="hidden items-center gap-1.5 font-heading text-sm font-semibold text-saffron-600 hover:text-saffron-700 sm:inline-flex">View All <FiChevronRight size={14} /></Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((item, i) => (<ProductCard key={item.id} product={item} index={i} />))}
          </div>
        </div>
      </Container>
    </PageLayout>
  );
};

export default ProductDetail;
