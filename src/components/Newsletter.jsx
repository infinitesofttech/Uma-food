import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend } from 'react-icons/fi';
import Container from './Container';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <section className="section-space relative overflow-hidden bg-saffron-600">
      {/* Abstract Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute right-0 top-0 h-80 w-80 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/15 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-white/15 blur-[80px]"></div>
      </div>

      <Container size="narrow" className="relative z-10">
        <motion.div
          className="grid w-full gap-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-kicker block text-saffron-100">Stay Connected</span>
          <h2 className="section-title text-white">Get Exclusive Offers</h2>
          <p className="type-copy-lg text-saffron-50/90">
            Subscribe to our newsletter for special discounts, new flavor
            announcements, and traditional recipes delivered to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="relative mt-2 w-full">
            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-0">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3.5 font-body text-sm text-white backdrop-blur-md transition-all placeholder:text-saffron-100/70 focus:border-white/50 focus:bg-white/15 focus:outline-none sm:pr-36"
              />
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-5 font-heading text-sm font-semibold text-saffron-600 transition-all hover:bg-neutral-50 disabled:opacity-80 sm:absolute sm:bottom-1 sm:right-1 sm:top-1 sm:h-auto sm:w-auto sm:px-5"
              >
                {status === 'loading' ? (
                  <span className="w-4 h-4 border-2 border-saffron-600 border-t-transparent rounded-full animate-spin"></span>
                ) : status === 'success' ? (
                  <>Joined</>
                ) : (
                  <>
                    <FiSend size={14} />
                    Subscribe
                  </>
                )}
              </button>
            </div>
            <p className="mt-3 font-body text-xs leading-relaxed text-saffron-100/70">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
          </form>
        </motion.div>
      </Container>
    </section>
  );
};

export default Newsletter;
