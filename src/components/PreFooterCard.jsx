import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShoppingBag, FiStar } from 'react-icons/fi';
import Container from './Container';

const papadCards = [
  {
    title: 'Classic Urad Papad',
    text: 'Traditional hand-rolled crunch with balanced spice and clean ingredients.',
  },
  {
    title: 'Masala Mix Papad',
    text: 'A flavorful blend for daily meals, snacks, and festive family platters.',
  },
  {
    title: 'Garlic Special Papad',
    text: 'Bold roasted flavor made for customers who love rich and spicy notes.',
  },
];

const PreFooterCard = () => {
  return (
    <section className="w-full bg-[#FFFDF7] pb-6 pt-4 sm:pb-8 sm:pt-5 lg:pb-10 lg:pt-6">
      <Container>
        <div className="relative w-full overflow-hidden rounded-2xl border border-saffron-400/30 bg-linear-to-r from-saffron-600 via-saffron-700 to-spice-600 shadow-[0_16px_50px_-18px_rgba(92,46,14,0.4)] sm:rounded-3xl">
          {/* Decorative blurs — inside overflow:hidden */}
          <div className="absolute -top-16 -right-14 h-48 w-48 rounded-full bg-white/15 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-amber-200/20 blur-3xl"></div>

          <div className="relative z-10 flex flex-col gap-6 px-4 py-6 sm:px-6 sm:py-7 lg:gap-7 lg:px-8 lg:py-8">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-7">
              <div className="min-w-0 space-y-4">
                <span className="type-kicker inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-saffron-100 backdrop-blur-sm">
                  <FiStar size={11} className="shrink-0 fill-saffron-200 text-saffron-200" />
                  Papad Collection
                </span>

                <div className="min-w-0">
                  <h2 className="text-3xl font-bold leading-tight text-white lg:text-4xl">
                    Signature Papad Picks For Every Meal
                  </h2>
                  <p className="type-copy-lg mt-3 leading-relaxed text-saffron-50/90">
                    Explore our best-loved papads with balanced flavors and quick actions for shopping or bulk orders.
                  </p>
                </div>
              </div>

              <div className="flex min-w-0 flex-wrap gap-2.5 lg:justify-end lg:pl-4">
                <Link
                  to="/shop"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-heading text-sm font-semibold whitespace-nowrap text-saffron-700 transition-colors hover:bg-saffron-50 sm:w-auto"
                >
                  <FiShoppingBag size={16} />
                  Shop Papads
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-5 py-3 font-heading text-sm font-semibold whitespace-nowrap text-white transition-colors hover:border-white/60 hover:bg-white/8 sm:w-auto"
                >
                  Bulk Order Inquiry
                  <FiArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {papadCards.map((item) => (
                <div
                  key={item.title}
                  className="h-full min-w-0 rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm sm:rounded-2xl sm:p-5"
                >
                  <h3 className="font-heading text-base font-semibold leading-snug text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 font-body text-sm leading-relaxed text-saffron-50/90">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default PreFooterCard;
