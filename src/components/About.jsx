import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import Container from './Container';

const About = () => {
  const highlights = [
    "Traditional recipes passed down through generations",
    "Premium quality lentils sourced from trusted farms",
    "Sun-dried naturally for the perfect texture",
    "No artificial preservatives or chemicals",
    "Handcrafted by skilled artisans",
    "FSSAI certified and hygienically packed"
  ];

  return (
    <section id="about" className="section-space relative overflow-hidden bg-white">
      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">

          {/* Image Side */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="/images/about.png"
                alt="Traditional Papad Making Process"
                className="w-full aspect-4/5 object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent"></div>
            </div>

            {/* Floating card */}
            <motion.div
              className="absolute -bottom-4 -right-2 rounded-2xl border-4 border-white/50 bg-white p-4 text-center shadow-[0_16px_40px_-16px_rgba(0,0,0,0.15)] sm:-bottom-6 sm:right-2 lg:-right-4 lg:p-5"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: 'spring' }}
            >
              <div className="text-3xl lg:text-4xl font-display font-bold text-gradient-gold mb-1.5">30+</div>
              <div className="text-xs font-heading font-bold uppercase tracking-widest leading-tight text-neutral-800">Years of<br />Trust</div>
            </motion.div>
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="section-kicker mb-4 block text-saffron-600">Our Heritage</span>
            <h2 className="section-title mb-5 text-left text-neutral-900 lg:mb-6">
              A Legacy of
              <span className="text-gradient"> Authentic Taste</span>
            </h2>
            <p className="type-copy-lg mb-4 text-neutral-600 sm:mb-5">
              At Uma Papad, we believe that every papad tells a story. Our journey began
              over three decades ago with a simple mission to bring the authentic taste
              of homemade papad to every Indian household.
            </p>
            <p className="type-copy mb-7 text-neutral-500 sm:mb-8">
              Using time-honored techniques and the finest ingredients, our artisans
              handcraft each papad with meticulous care. From selecting premium lentils
              to the traditional sun-drying process, every step preserves the rich flavor
              and satisfying crunch that Uma Papad is known for.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
              {highlights.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-2.5"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.4 }}
                >
                  <div className="w-5 h-5 rounded-full bg-saffron-50 flex items-center justify-center shrink-0 mt-0.5">
                    <FiCheckCircle className="text-saffron-500" size={13} />
                  </div>
                  <span className="font-body text-neutral-600 text-sm leading-relaxed">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default About;
