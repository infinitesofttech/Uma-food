import React from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiCheckCircle, FiShield, FiSun } from 'react-icons/fi';
import Container from './Container';

const features = [
  {
    title: 'Handcrafted Tradition',
    desc: 'Each papad is hand-rolled by skilled artisans following authentic recipes passed down through generations.',
    icon: FiAward,
    gradient: 'from-amber-50 to-orange-50',
  },
  {
    title: 'Premium Ingredients',
    desc: 'We source only the finest lentils and spices from trusted Indian farms, ensuring unmatched quality.',
    icon: FiCheckCircle,
    gradient: 'from-green-50 to-emerald-50',
  },
  {
    title: 'Sun-Dried Perfection',
    desc: 'Naturally sun-dried using traditional methods to achieve that impeccable, signature crispy snap.',
    icon: FiSun,
    gradient: 'from-yellow-50 to-amber-50',
  },
  {
    title: 'Zero Preservatives',
    desc: '100% natural with absolutely no artificial preservatives, colors, or additives. Pure Indian taste.',
    icon: FiShield,
    gradient: 'from-blue-50 to-sky-50',
  },
];

const Features = () => {
  return (
    <section className="section-space bg-[#FFFDF7] relative overflow-hidden">
      <Container className="relative">
        <motion.div
          className="section-intro mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-kicker text-saffron-600">Why Choose Us</span>
          <h2 className="section-title text-neutral-900">
            Crafted with <span className="text-gradient">Care & Passion</span>
          </h2>
          <p className="section-copy">
            Every Uma Papad carries the essence of authentic Indian culinary heritage.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className={`h-full rounded-2xl border border-neutral-100 bg-linear-to-br ${feature.gradient} p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-saffron-100/50 sm:p-6`}>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                  <feature.icon size={20} className="text-saffron-600" />
                </div>
                <h3 className="font-display font-bold text-lg text-neutral-900 mb-2.5">
                  {feature.title}
                </h3>
                <p className="font-body text-neutral-500 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Features;
