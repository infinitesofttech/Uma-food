import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiRefreshCw, FiShield, FiStar, FiTruck } from 'react-icons/fi';
import Container from './Container';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai, Maharashtra",
      text: "\"Uma Papad reminds me of my grandmother's kitchen. The crunch, the flavor, the aroma - it's pure nostalgia in every bite. Absolutely the best papad I've had in years!\"",
      rating: 5,
      init: "PS"
    },
    {
      name: "Rajesh Patel",
      location: "Ahmedabad, Gujarat",
      text: "\"We've been ordering Uma Papad for our restaurant chain. The consistency in quality is remarkable. Our customers specifically ask for it by name!\"",
      rating: 5,
      init: "RP"
    },
    {
      name: "Meera Desai",
      location: "Pune, Maharashtra",
      text: "\"The Garlic Lasun Papad is a game-changer. So much flavor in every piece! I've tried many brands but Uma Papad stands out for its authentic taste.\"",
      rating: 5,
      init: "MD"
    },
    {
      name: "Amit Kumar",
      location: "Delhi",
      text: "\"Finally, a papad brand that delivers the real deal. The Jeera Special is my family's absolute favorite. Great quality and fast delivery too!\"",
      rating: 4,
      init: "AK"
    }
  ];

  return (
    <section className="section-space bg-neutral-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/testimonial-bg.png"
          alt=""
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/80 to-transparent"></div>
        <div className="absolute inset-0 bg-linear-to-b from-neutral-950 via-transparent to-transparent opacity-80"></div>
      </div>

      <Container className="relative z-10">
        <motion.div
          className="section-intro mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-kicker text-saffron-500">Customer Love</span>
          <h2 className="section-title text-white">
            What Our <span className="text-gradient-gold">Family</span> Says
          </h2>
          <p className="section-copy text-neutral-400">
            Trusted by thousands of families across India to make their meals complete.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex h-full flex-col rounded-2xl border border-white/5 bg-neutral-900/40 p-5 backdrop-blur-md transition-colors hover:border-saffron-500/30 sm:p-6"
            >
              <div className="mb-4 flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                  <FiStar
                    key={index}
                    size={14}
                    className={index < testimonial.rating ? "text-saffron-400 fill-saffron-400" : "text-neutral-600"}
                  />
                ))}
              </div>

              <p className="type-copy mb-5 grow text-neutral-300 text-sm leading-relaxed">
                {testimonial.text}
              </p>

              <div className="mt-auto flex items-center gap-3 border-t border-white/10 pt-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-saffron-400 to-saffron-600 font-display text-sm font-bold text-white shadow-lg">
                  {testimonial.init}
                </div>
                <div>
                  <h4 className="font-heading text-sm font-semibold text-white">{testimonial.name}</h4>
                  <p className="mt-0.5 font-body text-xs text-neutral-500">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-8 flex flex-wrap justify-center gap-4 border-t border-white/10 pt-6 opacity-70 md:mt-10 md:gap-5 md:pt-7"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.7 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          {[
            { icon: FiStar, label: 'Award Winning' },
            { icon: FiShield, label: 'Secure Payments' },
            { icon: FiTruck, label: 'Free Shipping 500+' },
            { icon: FiRefreshCw, label: 'Easy Returns' },
            { icon: FiCheckCircle, label: 'FSSAI Certified' },
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-1.5 font-heading text-[10px] sm:text-xs text-neutral-400 uppercase tracking-wider font-semibold">
              <badge.icon size={12} className="text-saffron-400" />
              {badge.label}
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default Testimonials;
