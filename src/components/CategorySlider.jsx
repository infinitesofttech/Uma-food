import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "./Container";
import { getCategories } from "../api/getCategories";
import spicy from "../assets/spicy.png";
import sweet from "../assets/sweet.png";
import special from "../assets/special.png";
import masala from "../assets/masala.png";
import classic from "../assets/classic.png";
import flavoured from "../assets/flavoured.png";

const getCategoryImage = (categoryName = "") => {
  const name = categoryName.toLowerCase();

  if (name.includes("spicy")) return spicy;
  if (name.includes("flavoured")) return flavoured;
  if (name.includes("masala")) return masala;
  if (name.includes("special")) return special;
  if (name.includes("sweet")) return sweet;

  return classic;
};

const CategorySlider = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const sectionRefs = useRef([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();

      setCategories(data || []);

      if (data?.length > 0) {
        setActiveCategory(data[0]);
      }
    } catch (error) {
      console.error("Category Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!categories.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setActiveCategory(categories[index]);
          }
        });
      },
      {
        threshold: 0.6,
      }
    );

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [categories]);

  if (loading) {
    return (
      <div className="py-20 text-center text-lg font-medium">
        Loading Categories...
      </div>
    );
  }

  return (
    <section id="categories" className="bg-[#FFFDF7] py-12">
      <Container>
        {/* Heading */}
        <div className="mb-12 text-center lg:mb-20">
          <span className="section-kicker block text-saffron-600">
            Our Categories
          </span>

          <h2 className="section-title mt-4 text-neutral-900">
            Explore Our
            <span className="text-gradient"> Papad Range</span>
          </h2>

          <p className="type-copy mx-auto mt-5 max-w-2xl text-neutral-600">
            Discover authentic flavours crafted using traditional recipes and
            premium ingredients.
          </p>

          <p className="mt-8 animate-bounce text-sm font-bold uppercase tracking-[0.25em] text-neutral-500">
            ↓ Scroll Down Here ↓
          </p>
        </div>

        <div className="grid lg:grid-cols-2">
          {/* LEFT IMAGE */}
          <div className="hidden lg:block">
            <div className="sticky top-0 flex h-screen items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeCategory?.id || "default"}
                  src={
                    activeCategory
                      ? getCategoryImage(activeCategory.name)
                      : classic
                  }
                  alt={activeCategory?.name || "Papad Category"}
                  initial={{
                    opacity: 0,
                    scale: 0.85,
                    rotate: -5,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 1.1,
                    rotate: 5,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                  className="
                    w-[240px]
                    md:w-[280px]
                    lg:w-[300px]
                    xl:w-[360px]
                    object-contain
                    drop-shadow-xl
                  "
                />
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div>
            {categories.map((category, index) => (
              <section
                key={category.id}
                data-index={index}
                ref={(el) => (sectionRefs.current[index] = el)}
                className="min-h-[80vh] flex items-center justify-center"
              >
                <div className="w-full max-w-[700px] px-8">
                  <motion.h2
                    animate={{
                      opacity: activeCategory?.id === category.id ? 1 : 0.15,
                      scale: activeCategory?.id === category.id ? 1 : 0.9,
                      y: activeCategory?.id === category.id ? 0 : 40,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                    className={`
                      text-center
                      font-display
                      font-bold
                      leading-tight
                      text-4xl
                      md:text-5xl
                      lg:text-6xl
                      xl:text-7xl
                      transition-all
                      duration-300
                      ${activeCategory?.id === category.id
                        ? "text-gradient"
                        : "text-neutral-300"
                      }
                    `}
                  >
                    {category.name}
                  </motion.h2>
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* MOBILE VIEW */}
        <div className="mt-8 space-y-10 lg:hidden">
          {categories.map((category) => (
            <div key={category.id} className="text-center">
              <img
                src={getCategoryImage(category.name)}
                alt={category.name}
                className="mx-auto h-32 w-32 object-contain"
              />

              <h3 className="mt-4 text-2xl font-bold text-neutral-900">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default CategorySlider;