import React from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiUsers, FiHeart, FiGlobe } from 'react-icons/fi';
import PageLayout from '../components/PageLayout';
import Container from '../components/Container';

const AboutPage = () => {
  const milestones = [
    { year: '1995', title: 'The Journey Begins', desc: 'Founded with a small team passionate about authentic Indian papad.' },
    { year: '2002', title: 'First Factory', desc: 'Set up our first modern facility maintaining traditional methods.' },
    { year: '2010', title: 'Pan-India Reach', desc: 'Expanded distribution to cover all major Indian cities.' },
    { year: '2018', title: 'Innovation & Growth', desc: 'Launched 6 new flavors and modernized our sun-drying process.' },
    { year: '2024', title: 'Going Digital', desc: 'Launched our e-commerce platform to serve customers directly.' },
  ];

  const values = [
    { icon: FiAward, title: 'Quality First', desc: 'We never compromise on the quality of our ingredients or processes.' },
    { icon: FiUsers, title: 'Community Driven', desc: 'Empowering local artisans and supporting traditional livelihoods.' },
    { icon: FiHeart, title: 'Made with Love', desc: 'Every papad is crafted with genuine care and passion.' },
    { icon: FiGlobe, title: 'Sustainable', desc: 'Eco-friendly packaging and sustainable sourcing practices.' },
  ];

  return (
    <PageLayout>
      {/* Hero */}
      <Container className="page-hero-shell">
        <section className="page-hero page-hero-center bg-neutral-950">
          <div className="absolute inset-0 z-0">
            <img src="/images/about.png" alt="" className="h-full w-full object-cover opacity-20 mask-image-gradient-b" />
            <div className="absolute inset-0 bg-linear-to-r from-neutral-950 via-neutral-950/80 to-transparent"></div>
          </div>

          <div className="page-hero-body">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="page-hero-kicker bg-saffron-500/5 text-saffron-400">Our Story</span>
              <h1 className="page-hero-title mt-4">
                Crafting <span className="text-gradient-gold">Perfection</span> Since 1995
              </h1>
              <p className="page-hero-copy">
                Three decades of handcrafted excellence. Uma Papad is more than a brand. It is a legacy of authentic
                taste, traditional craftsmanship, and unwavering quality.
              </p>
            </motion.div>
          </div>
        </section>
      </Container>

      {/* Story section */}
      <section className="section-space">
        <Container>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img src="/images/about.png" alt="Our Heritage" className="w-full aspect-4/5 object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
              </div>

              <div className="absolute -bottom-4 -right-2 rounded-2xl border-4 border-[#FFFDF7] bg-saffron-500 p-5 text-white shadow-2xl sm:-bottom-6 sm:right-2 lg:p-7">
                <div className="mb-1.5 font-display text-3xl font-bold lg:text-4xl">30+</div>
                <div className="font-heading text-xs font-semibold uppercase tracking-wider lg:text-sm">Years of Trust</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="section-title mb-6 text-left text-neutral-900">
                Where Tradition Meets <span className="text-gradient">Excellence</span>
              </h2>
              <p className="type-copy-lg mb-5 text-neutral-600">
                Uma Papad was born from a simple belief: that the best food comes from the heart. Our founder started
                with a home kitchen and a dream to share authentic papad with the world.
              </p>
              <p className="type-copy-lg mb-5 text-neutral-600">
                Today, we're proud to serve over 50,000 families across India, while staying true to the traditional
                methods that make our papads special. Each one is still handcrafted, sun-dried, and packed with love.
              </p>
              <p className="type-copy-lg text-neutral-500">
                As a proud product of Uma Technofab, we combine decades of manufacturing expertise with artisanal food
                craftsmanship to deliver the highest quality papad to your table.
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Values section */}
      <section className="section-space-tight border-y border-neutral-100 bg-white">
        <Container>
          <motion.div
            className="section-intro mb-10 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-kicker text-saffron-600">What We Stand For</span>
            <h2 className="section-title text-neutral-900">
              Our <span className="text-gradient">Core Values</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl border border-neutral-100 bg-neutral-50 p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_-10px_rgba(212,160,23,0.15)]"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-neutral-100 bg-white shadow-sm">
                  <value.icon size={22} className="text-saffron-600" />
                </div>
                <h3 className="mb-2.5 font-display text-lg font-bold text-neutral-900">{value.title}</h3>
                <p className="section-copy text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Milestones section */}
      <section className="section-space bg-[#FFFDF7]">
        <Container>
          <motion.div
            className="section-intro mb-10 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-kicker text-saffron-600">Our Journey</span>
            <h2 className="section-title text-neutral-900">
              Key <span className="text-gradient">Milestones</span>
            </h2>
          </motion.div>

          <div className="relative space-y-6 md:space-y-8">
            <div className="absolute bottom-0 left-8 top-0 w-0.5 bg-linear-to-b from-saffron-200 via-saffron-400 to-transparent sm:left-9"></div>

            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative z-10 flex items-start gap-4 md:gap-6"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900 shadow-lg sm:h-18 sm:w-18">
                  <span className="font-display text-lg font-bold text-saffron-400">{milestone.year}</span>
                </div>
                <div className="grow rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm md:p-6">
                  <h3 className="mb-1.5 font-display text-xl font-bold text-neutral-900">{milestone.title}</h3>
                  <p className="section-copy text-sm">{milestone.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
    </PageLayout>
  );
};

export default AboutPage;
