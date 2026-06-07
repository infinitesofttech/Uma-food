import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiStar, FiSun } from 'react-icons/fi';
import Container from './Container';

const Hero = () => {
  return (
    <section id="home" className="relative flex min-h-[92svh] items-center overflow-hidden bg-neutral-950">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-banner.png"
          alt="Uma Papad - Premium Indian Papads"
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-r from-neutral-950 via-neutral-950/85 to-neutral-950/40"></div>
        <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-transparent to-neutral-950/60"></div>
      </div>

      {/* Decorative blurs — constrained inside the section */}
      <div className="absolute right-8 top-20 h-72 w-72 rounded-full bg-saffron-500/5 blur-3xl lg:right-20 lg:h-96 lg:w-96"></div>
      <div className="absolute bottom-20 left-8 h-56 w-56 rounded-full bg-saffron-400/5 blur-3xl lg:left-20 lg:h-72 lg:w-72"></div>

      {/* Content */}
      <Container className="relative z-10 flex w-full flex-col items-center gap-8 pb-20 pt-28 sm:pt-32 md:pt-36 lg:flex-row lg:gap-14 lg:pb-24 lg:pt-32">
        {/* Text column */}
        <motion.div
          className="min-w-0 text-center lg:flex-[1.06]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="page-hero-kicker w-fit bg-saffron-400/5 text-saffron-400 backdrop-blur-sm"
          >
            <FiStar size={12} className="fill-saffron-400" />
            Taste the Tradition Since 1995
          </motion.div>

          <h1 className="mb-6 text-balance font-display text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            The Art of
            <br className="hidden sm:block" />
            <span className="text-gradient-gold"> Perfect</span>
            <br />
            Crunch.
          </h1>

          <p className="type-copy-lg mb-9 text-neutral-300 lg:mb-10">
            Handcrafted with the finest ingredients, sun-dried to perfection. Experience authentic Indian papad made
            the way it should be, with tradition, passion, and love.
          </p>

          <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4 lg:mb-12">
            <Link
              to="/shop"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-saffron-500 to-saffron-600 px-8 py-4 font-heading font-semibold text-white shadow-lg shadow-saffron-500/25 transition-all hover:scale-[1.03] hover:from-saffron-400 hover:to-saffron-500 hover:shadow-saffron-500/40 sm:w-auto"
            >
              Explore Collection
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/about"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-4 font-heading font-semibold text-white backdrop-blur-sm transition-all hover:border-white/25 hover:bg-white/10 sm:w-auto"
            >
              Our Story
            </Link>
          </div>

          <motion.div
            className="flex flex-wrap justify-center gap-6 border-t border-white/10 pt-8 md:gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {[
              { value: '9+', label: 'Cities Served' },
              { value: '8', label: 'Unique Flavors' },
              { value: '50+', label: 'Happy Customers' },
            ].map((stat, index) => (
              <div key={index} className="min-w-28 text-center">
                <div className="font-display text-2xl font-bold text-saffron-400 sm:text-3xl">{stat.value}</div>
                <div className="mt-1 font-heading text-xs uppercase tracking-wider text-neutral-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Image column */}
        <motion.div
          className="relative mt-2 flex w-full min-w-0 items-center justify-center lg:mt-0 lg:flex-[0.94]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="absolute h-64 w-64 rounded-full border border-dashed border-saffron-500/15 animate-spin-slow sm:h-72 sm:w-72 lg:h-80 lg:w-80"></div>

          <div className="flex h-60 w-60 items-center justify-center rounded-full bg-linear-to-br from-saffron-400/10 to-saffron-900/20 backdrop-blur-sm animate-pulse-glow sm:h-72 sm:w-72 lg:h-80 lg:w-80">
            <div className="h-48 w-48 overflow-hidden rounded-full border-2 border-saffron-400/20 shadow-2xl sm:h-64 sm:w-64 lg:h-72 lg:w-72">
              <img
                src="/images/product-urad.png"
                alt="Uma Premium Papad"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>
          </div>

          <motion.div
            className="absolute right-2 top-4 flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-heading font-semibold uppercase tracking-wider text-saffron-300 shadow-xl backdrop-blur-md sm:right-6 sm:top-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, type: 'spring' }}
          >
            <FiSun size={14} className="shrink-0" />
            <p>100% Natural</p>
          </motion.div>

          <motion.div
            className="absolute bottom-4 left-2 flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-heading font-semibold uppercase tracking-wider text-saffron-300 shadow-xl backdrop-blur-md sm:bottom-8 sm:left-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, type: 'spring' }}
          >
            <FiShield size={14} className="shrink-0" />
            <p>No Preservatives</p>
          </motion.div>
        </motion.div>
      </Container>

      {/* Scroll indicator — only visible within the hero via absolute positioning */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white/20 pt-2">
          <div className="h-2.5 w-1 rounded-full bg-saffron-400"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
