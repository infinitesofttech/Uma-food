import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiSend,
  FiMessageSquare,
  FiPlus,
  FiMinus,
} from "react-icons/fi";
import Container from "../components/Container";
import PageLayout from "../components/PageLayout";
import { getContactSubjects, sendContactMessage } from "../api/contactApi";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [mapZoom, setMapZoom] = useState(13);

  const mapQuery = encodeURIComponent(
    "Uma Technofab Industrial Area Gujarat India"
  );
  const mapSrc = `https://maps.google.com/maps?q=${mapQuery}&t=&z=${mapZoom}&ie=UTF8&iwloc=&output=embed`;

  const handleZoomIn = () => {
    setMapZoom((prev) => Math.min(prev + 1, 20));
  };

  const handleZoomOut = () => {
    setMapZoom((prev) => Math.max(prev - 1, 1));
  };

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getContactSubjects();
        setSubjects(data);
      } catch (error) {
        // console.error("Failed to fetch subjects:", error);

        setSubjects([
          { id: "general", name: "General Inquiry" },
          { id: "order", name: "Order Related" },
          { id: "bulk", name: "Bulk Order / Wholesale" },
          { id: "feedback", name: "Feedback" },
        ]);
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await sendContactMessage(formData);

      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });

      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: FiMapPin,
      title: "Visit Us",
      details: ["Uma Technofab", "Industrial Area, Gujarat", "India - 360001"],
    },
    {
      icon: FiPhone,
      title: "Call Us",
      details: ["+91 98765 43210", "+91 98765 43211"],
    },
    {
      icon: FiMail,
      title: "Email Us",
      details: ["hello@umapapad.com", "orders@umapapad.com"],
    },
    {
      icon: FiClock,
      title: "Business Hours",
      details: ["Mon - Sat: 9AM - 6PM", "Sunday: Closed"],
    },
  ];

  const faqs = [
    {
      q: "What is the minimum order quantity?",
      a: "We accept orders starting from just 1 pack. For bulk orders (50+ packs), please contact us via the form above for special wholesale pricing.",
    },
    {
      q: "Do you deliver across India?",
      a: "Yes! We deliver to all pin codes across India using trusted courier partners. Standard delivery takes 3-5 business days.",
    },
    {
      q: "Are your papads suitable for vegans?",
      a: "Absolutely! All our papads are 100% vegan, made from plant-based lentils and natural spices with no animal products.",
    },
    {
      q: "What is the shelf life of Uma Papad?",
      a: "Our papads have a shelf life of 12 months when stored in an airtight container in a cool, dry place.",
    },
  ];

  return (
    <PageLayout>
      {/* Hero */}
      <Container className="page-hero-shell">
        <section className="page-hero page-hero-center bg-neutral-950">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/hero-banner.png"
              alt=""
              className="h-full w-full object-cover opacity-20 mask-image-gradient-b"
            />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-saffron-900/30 via-transparent to-transparent"></div>

          <div className="page-hero-body">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="page-hero-kicker bg-saffron-500/5 text-saffron-400">
                Get in Touch
              </span>
              <h1 className="page-hero-title mt-4">
                We&apos;d Love to{" "}
                <span className="text-gradient-gold">Hear</span> From You
              </h1>
              <p className="page-hero-copy">
                Have a question about our papads, want to place a bulk order, or
                just want to say hello? We&apos;re here for you.
              </p>
            </motion.div>
          </div>
        </section>
      </Container>

      <Container className="page-content">
        {/* Contact Info Cards */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:mb-12 lg:gap-5">
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="surface-card flex flex-col items-center p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_-12px_rgba(212,160,23,0.25)] sm:p-6"
            >
              <div className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-saffron-100 bg-saffron-50">
                <info.icon size={20} className="text-saffron-600" />
              </div>
              <h3 className="mb-3 font-heading text-base font-semibold text-neutral-900">
                {info.title}
              </h3>
              <div className="space-y-0.5">
                {info.details.map((detail, detailIndex) => (
                  <p
                    key={detailIndex}
                    className="font-body text-sm text-neutral-500"
                  >
                    {detail}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Form + Image */}
        <div className="surface-card mb-12 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="min-w-0 p-5 sm:p-6 md:p-7 lg:flex-[1.1] lg:p-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-saffron-100 bg-saffron-50">
                    <FiMessageSquare size={18} className="text-saffron-600" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-neutral-900 md:text-3xl">
                    Send a Message
                  </h2>
                </div>
                <p className="mb-6 font-body text-sm leading-relaxed text-neutral-500 md:text-base">
                  Fill out the form below and our team will get back to you
                  within 24 hours.
                </p>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center md:p-7"
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                      <FiSend size={24} className="text-emerald-600" />
                    </div>
                    <h3 className="mb-2 font-display text-xl font-bold text-emerald-800">
                      Message Sent!
                    </h3>
                    <p className="font-body text-base text-emerald-600">
                      Thank you for reaching out. We&apos;ll be in touch
                      shortly.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block font-heading text-xs font-semibold text-neutral-900">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Your name"
                          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-3 font-body text-sm transition-all placeholder:text-neutral-400 focus:border-saffron-400 focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-saffron-100/50"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block font-heading text-xs font-semibold text-neutral-900">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="your@email.com"
                          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-3 font-body text-sm transition-all placeholder:text-neutral-400 focus:border-saffron-400 focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-saffron-100/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block font-heading text-xs font-semibold text-neutral-900">
                        Subject
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        disabled={loadingSubjects}
                        className="w-full appearance-none rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-3 font-body text-sm text-neutral-700 transition-all focus:border-saffron-400 focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-saffron-100/50 disabled:opacity-50"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          backgroundPosition: "right 12px center",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "16px",
                        }}
                      >
                        <option value="" disabled>
                          {loadingSubjects
                            ? "Loading subjects..."
                            : "Select a subject"}
                        </option>
                        {subjects.map((subject) => (
                          <option key={subject.id} value={subject.id}>
                            {subject.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block font-heading text-xs font-semibold text-neutral-900">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder="Tell us how we can help..."
                        className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-3 font-body text-sm transition-all placeholder:text-neutral-400 focus:border-saffron-400 focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-saffron-100/50"
                      ></textarea>
                    </div>
                    {error && (
                      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                        {error}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 font-heading text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-saffron-600 hover:shadow-saffron-600/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiSend
                        size={15}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                )}
              </motion.div>
            </div>

            <div className="relative min-h-64 min-w-0 overflow-hidden bg-neutral-100 md:min-h-80 lg:flex-[0.9]">
              <iframe
                title="Uma Technofab Location"
                src={mapSrc}
                className="absolute left-0 -top-50 w-full h-[calc(100%+100px)] border-0"
                loading="lazy"
                allowFullScreen
              />

              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 via-neutral-900/20 to-transparent"></div>

              <div className="absolute top-4 right-4 z-10 flex flex-row gap-2 rounded-2xl bg-white/95 p-2 shadow-2xl backdrop-blur-md">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 transition hover:bg-saffron-50 hover:text-saffron-700 cursor-pointer"
                  aria-label="Zoom in"
                >
                  <FiPlus size={18} />
                </button>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 transition hover:bg-saffron-50 hover:text-saffron-700 cursor-pointer"
                  aria-label="Zoom out"
                >
                  <FiMinus size={18} />
                </button>
                
              </div>

              <div className="absolute bottom-5 left-5 right-5 md:bottom-6 md:left-6 md:right-6">
                <div className="flex items-center gap-3 rounded-2xl bg-white/95 p-4 shadow-2xl backdrop-blur-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-saffron-400 to-saffron-600 text-white shadow-lg shadow-saffron-500/20">
                    <FiMapPin size={16} />
                  </div>

                  <div>
                    <h4 className="mb-0.5 font-display text-base font-bold text-neutral-900">
                      Uma Papad Factory
                    </h4>

                    <p className="font-body text-xs leading-relaxed text-neutral-500">
                      Industrial Area, Gujarat, India
                      <br />A product of Uma Technofab
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="pt-4 md:pt-6">
          <motion.div
            className="section-intro mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title text-neutral-900">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="section-copy">
              Quick answers to common questions about our products and shipping.
            </p>
          </motion.div>

          <div className="grid gap-4">
            {faqs.map((faq, index) => (
              <motion.details
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-[0_2px_12px_-6px_rgba(0,0,0,0.03)] group"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-heading text-base font-semibold text-neutral-900 transition-colors hover:text-saffron-600 select-none md:px-6">
                  {faq.q}
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-50 transition-colors group-open:bg-saffron-50 group-open:text-saffron-600">
                    <span className="text-lg leading-none font-light transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </div>
                </summary>
                <div className="bg-neutral-50/50 px-5 pb-5 md:px-6 md:pb-5 md:pr-8">
                  <p className="border-t border-neutral-100 pt-2 font-body text-sm leading-relaxed text-neutral-600">
                    {faq.a}
                  </p>
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </Container>
    </PageLayout>
  );
};

export default ContactPage;
