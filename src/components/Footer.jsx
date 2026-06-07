import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube, FiArrowRight, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import Container from './Container';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const shopLinks = ['All Products', 'Best Sellers', 'Combo Offers', 'Bulk Orders'];
  const companyLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Our Process', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Shipping Policy', path: '/shop' },
  ];

  return (
    <footer className="section-space-tight relative w-full border-t border-saffron-200/20 bg-linear-to-b from-neutral-900 via-neutral-950 to-black text-neutral-200">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-saffron-300/60 to-transparent"></div>

      <Container className="relative z-10">
        <div className="w-full rounded-2xl border border-white/8 bg-white/2 px-4 py-5 backdrop-blur-sm sm:rounded-3xl sm:px-6 sm:py-6 lg:px-8 lg:py-7">
          <div className="grid grid-cols-1 gap-7 lg:grid-cols-12 lg:gap-6">
            {/* Brand column */}
            <div className="lg:col-span-5 lg:pr-6">
              <Link to="/" className="mb-4 inline-flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white p-1">
                  <img src="/images/logo.png" alt="Uma Papad" className="h-full w-full object-contain" />
                </div>
                <span className="font-display text-[1.6rem] font-bold leading-[1.02] text-white sm:text-[1.8rem]">
                  <span className="text-gradient-gold">Uma</span> Papad
                </span>
              </Link>

              <p className="font-body text-sm leading-relaxed text-neutral-300">
                Authentic handcrafted papad made with traditional recipes, premium lentils, and clean ingredients for every family meal.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {[
                  { icon: FiInstagram, label: 'Instagram' },
                  { icon: FiFacebook, label: 'Facebook' },
                  { icon: FiTwitter, label: 'Twitter' },
                  { icon: FiYoutube, label: 'YouTube' },
                ].map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-neutral-300 transition-all hover:-translate-y-0.5 hover:border-saffron-300 hover:bg-saffron-400 hover:text-neutral-900"
                    aria-label={label}
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links columns */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-3 lg:gap-6">
              <div>
                <h4 className="mb-3 font-heading text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-saffron-100">Shop</h4>
                <ul className="space-y-2">
                  {shopLinks.map((label) => (
                    <li key={label}>
                      <Link to="/shop" className="group inline-flex items-center gap-1.5 font-body text-sm text-neutral-300 transition-colors hover:text-saffron-200">
                        <FiArrowRight size={10} className="text-saffron-400 transition-transform group-hover:translate-x-0.5" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="mb-3 font-heading text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-saffron-100">Company</h4>
                <ul className="space-y-2">
                  {companyLinks.map((link) => (
                    <li key={link.name}>
                      <Link to={link.path} className="group inline-flex items-center gap-1.5 font-body text-sm text-neutral-300 transition-colors hover:text-saffron-200">
                        <FiArrowRight size={10} className="text-saffron-400 transition-transform group-hover:translate-x-0.5" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="mb-3 font-heading text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-saffron-100">Get In Touch</h4>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2">
                    <FiMapPin className="mt-0.5 shrink-0 text-saffron-500" size={13} />
                    <span className="font-body text-sm leading-relaxed text-neutral-300">
                      Uma Technofab, Industrial Area,<br />Gujarat, India
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiPhone className="shrink-0 text-saffron-500" size={13} />
                    <span className="font-body text-sm text-neutral-300">+91 98765 43210</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiMail className="shrink-0 text-saffron-500" size={13} />
                    <a href="mailto:hello@umapapad.com" className="font-body text-sm text-neutral-300 transition-colors hover:text-saffron-200">
                      hello@umapapad.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col justify-between gap-2.5 border-t border-white/8 pt-4 text-center md:flex-row md:items-center md:text-left">
            <p className="font-body text-xs text-neutral-400">&copy; {currentYear} Uma Papad. All rights reserved. A product of Uma Technofab.</p>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 md:justify-end">
              {['Privacy Policy', 'Terms of Service', 'Shipping Policy', 'Refund Policy'].map((label) => (
                <a key={label} href="#" className="font-body text-xs text-neutral-400 transition-colors hover:text-saffron-200">
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
