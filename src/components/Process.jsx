import React from 'react';
import { motion } from 'framer-motion';
import { FiDroplet, FiEdit3, FiPackage, FiSun } from 'react-icons/fi';
import Container from './Container';

const Process = () => {
  const steps = [
    {
      id: "01",
      title: "Select & Soak",
      desc: "Premium lentils are carefully selected and soaked overnight to achieve the perfect consistency.",
      icon: FiDroplet,
    },
    {
      id: "02",
      title: "Grind & Spice",
      desc: "The softened lentils are ground into a smooth paste and blended with our signature spice mix.",
      icon: FiEdit3,
    },
    {
      id: "03",
      title: "Roll & Shape",
      desc: "Expert artisans hand-roll each papad to achieve uniform thickness and the perfect round shape.",
      icon: FiPackage,
    },
    {
      id: "04",
      title: "Sun-Dry & Pack",
      desc: "Naturally sun-dried to crispy perfection, then packed hygienically to lock in the freshness.",
      icon: FiSun,
    }
  ];

  return (
    <section className="section-space bg-[#FFFDF7] relative overflow-hidden">
      <Container>
        <motion.div
          className="section-intro mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-kicker text-saffron-600">Our Process</span>
          <h2 className="section-title text-neutral-900">
            From Farm to <span className="text-gradient">Your Table</span>
          </h2>
          <p className="section-copy">
            Every Uma Papad goes through a meticulous 4-step craft process to ensure the highest quality.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-11 left-[10%] right-[10%] h-0.5 bg-linear-to-r from-neutral-200 via-saffron-300 to-neutral-200 z-0"></div>

          <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <div className="relative mb-5">
                  <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border-[5px] border-white bg-linear-to-br from-saffron-400 to-saffron-600 shadow-lg transition-transform duration-500 group-hover:scale-110">
                    <step.icon size={26} className="text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center font-display font-bold text-saffron-600 shadow-md border border-saffron-100 z-20 text-xs">
                    {step.id}
                  </div>
                </div>

                <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">{step.title}</h3>
                <p className="font-body text-neutral-500 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Process;
