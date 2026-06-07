import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import ProductCard from './ProductCard';
import Container from './Container';
import { getProducts } from '../api/getProducts';
  
const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

 useEffect(() => {
    fetchProducts();
  }, []);
const fetchProducts = async () => {
  try {
    const data = await getProducts();
    // console.log("Products:", data);
    setProducts(data);
  } catch (error) {
    // console.error(error);
    setError("Failed to load products");
  }
};
  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!products) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <section id="products" className="section-space bg-white relative">
      <Container>
        <motion.div
          className="section-intro mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-kicker text-saffron-600">Our Collection</span>
          <h2 className="section-title text-neutral-900">
            Crispy <span className="text-gradient">Creations</span>
          </h2>
          <p className="section-copy">
            Explore our range of perfectly crafted papads. Each variety brings a different
            symphony of spices to your palate.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        <motion.div
          className="mt-10 text-center md:mt-12"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 border-2 border-neutral-900 text-neutral-900 font-heading font-semibold py-3 px-7 rounded-full hover:bg-neutral-900 hover:text-white transition-all duration-300"
          >
            View All Flavors
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </Container>
    </section>
  );
};

export default Products;
