import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiSliders, FiGrid, FiList } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import Container from "../components/Container";
import PageLayout from "../components/PageLayout";
import { getProducts } from "../api/getProducts";
import { getCategories } from "../api/getCategories";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Featured");
  const [viewMode, setViewMode] = useState("grid");

  const normaliseTextList = (values = []) =>
    values.map((value) => String(value).toLowerCase());

  const matchesDietaryFilters = (product) => {
    const tags = normaliseTextList(product.tags);
    const ingredients = normaliseTextList(product.ingredients);
    const searchable = [...tags, ...ingredients].join(" ");

    const veganMatch =
      !dietaryFilters.vegan ||
      searchable.includes("vegan") ||
      (!searchable.includes("egg") &&
        !searchable.includes("milk") &&
        !searchable.includes("cheese") &&
        !searchable.includes("butter") &&
        !searchable.includes("ghee") &&
        !searchable.includes("honey"));

    const glutenFreeMatch =
      !dietaryFilters.glutenFree ||
      searchable.includes("gluten free") ||
      (!searchable.includes("wheat") &&
        !searchable.includes("maida") &&
        !searchable.includes("flour") &&
        !searchable.includes("semolina") &&
        !searchable.includes("suji"));

    const noGarlicOnionMatch =
      !dietaryFilters.noGarlicOnion ||
      searchable.includes("no garlic") ||
      searchable.includes("no onion") ||
      searchable.includes("no garlic/onion") ||
      (!searchable.includes("garlic") && !searchable.includes("onion"));

    return veganMatch && glutenFreeMatch && noGarlicOnionMatch;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      setProducts(productsData);

      setCategories([{ id: "all", name: "All Products" }, ...categoriesData]);
    } catch (error) {
      // console.error(error);
      setError("Failed to load products and categories");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = [...products]
    .filter((product) => {
      const matchesCategory =
        activeCategory === "all" ||
        product.category === parseInt(activeCategory) ||
        product.category?.id === parseInt(activeCategory);

      const matchesSearch =
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (Array.isArray(product.tags) &&
          product.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ));

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "Price: Low to High":
          return Number(a.price) - Number(b.price);

        case "Price: High to Low":
          return Number(b.price) - Number(a.price);

        case "Rating":
          return (b.rating || 0) - (a.rating || 0);

        default:
          return 0;
      }
    });

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (loading) {
    return <div className="text-center py-10">Loading products...</div>;
  }
  return (
    <PageLayout>
      <Container className="page-hero-shell">
        <div className="page-hero bg-neutral-950">
          <div className="absolute inset-0 bg-[url('/images/hero-banner.png')] bg-cover bg-center opacity-20 mask-image-gradient-b"></div>
          <div className="absolute inset-0 bg-linear-to-r from-neutral-950 via-neutral-950/80 to-transparent"></div>

          <div className="page-hero-body">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="page-hero-kicker text-saffron-400 bg-saffron-500/5">
                Our Collection
              </span>
              <h1 className="page-hero-title mt-4">
                Shop perfectly{" "}
                <span className="text-gradient-gold">spiced</span>
              </h1>
              <p className="page-hero-copy">
                Discover our complete range of handcrafted papads. From classic
                to exotic, find your perfect crunch.
              </p>
            </motion.div>
          </div>
        </div>
      </Container>

      <Container className="page-content">
        {/* Search & Controls */}
        <div className="surface-card mb-7 grid gap-4 p-4 sm:p-5 md:mb-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-5">
          <div className="relative min-w-0">
            <FiSearch
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search papads, flavors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-full border border-neutral-200 bg-neutral-50/70 py-2.5 pl-11 pr-4 font-body text-sm text-neutral-800 transition-all placeholder:text-neutral-400 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100"
            />
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-3 lg:justify-end">
            <div className="flex min-w-0 items-center gap-2">
              <span className="font-body text-xs text-neutral-500 whitespace-nowrap">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="min-w-0 appearance-none rounded-full border border-neutral-200 bg-white py-2 pl-3 pr-8 font-heading text-xs font-medium text-neutral-800 transition-colors focus:border-saffron-400 focus:outline-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundPosition: "right 8px center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "14px",
                }}
              >
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
              </select>
            </div>

            <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-50 p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-md p-1.5 ${viewMode === "grid" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-400 hover:text-neutral-600"}`}
                aria-label="Grid view"
              >
                <FiGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`rounded-md p-1.5 ${viewMode === "list" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-400 hover:text-neutral-600"}`}
                aria-label="List view"
              >
                <FiList size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid w-full gap-7 lg:grid-cols-12">
          {/* Sidebar */}
          <div className="w-full lg:col-span-4 xl:col-span-3">
            <div className="surface-card p-5 lg:sticky lg:top-24">
              <div className="flex items-center gap-2.5 mb-5 pb-5 border-b border-neutral-100">
                <div className="w-9 h-9 bg-saffron-50 rounded-xl flex items-center justify-center shrink-0">
                  <FiSliders className="text-saffron-600" size={16} />
                </div>
                <h3 className="font-heading font-bold text-base text-neutral-900">
                  Filters
                </h3>
              </div>

              <h4 className="font-heading font-semibold text-xs text-neutral-900 mb-3 uppercase tracking-wider">
                Categories
              </h4>
              <ul className="space-y-1.5">
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => setActiveCategory(category.id.toString())}
                      className={`w-full flex items-center justify-between text-left px-3.5 py-2.5 rounded-xl font-heading text-sm transition-all ${
                        activeCategory === category.id.toString()
                          ? "bg-neutral-900 text-white font-medium shadow-md"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                      }`}
                    >
                      {category.name}
                      <span
                        className={`text-[10px] py-0.5 px-2 rounded-full font-semibold ${
                          activeCategory === category.id.toString()
                            ? "bg-white/20 text-white"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        {category.id === "all"
                          ? products.length
                          : products.filter(
                              (p) =>
                                Number(p.category) === Number(category.id) ||
                                Number(p.category?.id) === Number(category.id),
                            ).length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Products Grid */}
          <div className="w-full min-w-0 lg:col-span-8 xl:col-span-9">
            <div className="mb-5 flex justify-between items-end">
              <p className="font-body text-neutral-500 text-sm">
                Showing{" "}
                <strong className="font-heading text-neutral-900">
                  {filteredProducts.length}
                </strong>{" "}
                products
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid w-full grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-3"
                    : "grid w-full grid-cols-1 gap-5"
                }
              >
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="surface-card mt-4 p-8 text-center md:p-10">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-neutral-50 shadow-sm">
                  <FiSearch size={28} className="text-neutral-300" />
                </div>
                <h3 className="font-display font-bold text-2xl text-neutral-900 mb-2">
                  No products found
                </h3>
                <p className="font-body text-neutral-500 text-base">
                  We couldn't find any papads matching "{searchQuery}". Try a
                  different search.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                    // setDietaryFilters({
                    //   vegan: false,
                    //   glutenFree: false,
                    //   noGarlicOnion: false,
                    // });
                  }}
                  className="mt-6 font-heading font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-5 py-2.5 rounded-full transition-colors text-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </PageLayout>
  );
};

export default Shop;
