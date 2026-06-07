import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiShoppingBag, FiMenu, FiX, FiHeart, FiUser } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import Container from "./Container";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isOverlayMode = isHome && !isScrolled;

  const navShell = isOverlayMode
    ? "border-b border-white/15 bg-neutral-950/50 shadow-none backdrop-blur-md"
    : "border-b border-neutral-200 bg-[#FFFDF7]/[0.96] shadow-[0_8px_30px_-18px_rgba(0,0,0,0.18)] backdrop-blur-xl";

  const navText = isOverlayMode ? "text-white/90" : "text-neutral-700";
  const navHover = isOverlayMode
    ? "hover:text-saffron-300"
    : "hover:text-saffron-600";
  const iconHoverBg = isOverlayMode ? "hover:bg-white/10" : "hover:bg-black/5";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const baseLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];
  const authLinks = isAuthenticated
    ? [{ name: "OrderHistory", path: "/orders" }]
    : // { name: 'Profile', path: '/profile' }
      [];

  const navLinks = [...baseLinks, ...authLinks];

  const handleAuthIconClick = () => {
    navigate(isAuthenticated ? "/profile" : "/login");
  };

  return (
    <>
      {loading ? null : (
        <nav
          className={`fixed inset-x-0 top-0 z-50 w-full transition-all duration-300 ${navShell}`}
        >
          <Container>
            <div className="flex h-18 items-center justify-between gap-3">
              {/* Logo */}
              <Link
                to="/"
                className="shrink-0 flex items-center gap-2.5 cursor-pointer group"
              >
                <img
                  src="/images/logo.png"
                  alt="Uma Papad"
                  className="h-9 w-9 rounded-full border-2 border-saffron-400/50 object-cover transition-colors group-hover:border-saffron-400"
                />
                <div className="flex min-w-0 items-center gap-1.5">
                  <span className="font-display text-[1.35rem] font-bold tracking-tight text-gradient-gold sm:text-[1.5rem]">
                    Uma
                  </span>
                  <span
                    className={`hidden sm:block text-[0.65rem] font-heading font-medium tracking-[0.2em] uppercase ${isOverlayMode ? "text-white/60" : "text-neutral-500"}`}
                  >
                    Papad
                  </span>
                </div>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden items-center gap-5 md:flex lg:gap-7">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative font-heading text-[0.88rem] font-medium tracking-[0.06em] transition-colors ${
                      location.pathname === link.path
                        ? isOverlayMode
                          ? "text-saffron-300"
                          : "text-saffron-500"
                        : `${navText} ${navHover}`
                    }`}
                  >
                    {link.name}
                    {location.pathname === link.path && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full ${isOverlayMode ? "bg-saffron-300" : "bg-saffron-500"}`}
                      />
                    )}
                  </Link>
                ))}
              </div>

              {/* Right Icons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/cart")}
                  className={`relative  cursor-pointer rounded-full p-2.5 transition-colors ${navText} ${navHover} ${iconHoverBg}`}
                >
                  <FiShoppingBag size={20} />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 bg-saffron-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                <Link
                  to="/wishlist"
                  className={`relative rounded-full p-2.5 transition-colors ${navText} ${navHover} ${iconHoverBg}`}
                >
                  <FiHeart size={20} />
                  <AnimatePresence>
                    {wishlistCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg"
                      >
                        {wishlistCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
                {!isAuthenticated && (
                  <button
                    onClick={handleAuthIconClick}
                    className={`rounded-full cursor-pointer p-2.5 transition-colors ${navText} ${navHover} ${iconHoverBg}`}
                    aria-label={"Login"}
                  >
                    <FiUser size={20} />
                  </button>
                )}

                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className={`px-3 py-1 cursor-pointer rounded-md text-sm font-medium transition ${navText} ${navHover} ${iconHoverBg}`}
                  >
                    Logout
                  </button>
                )}

                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`p-2 transition-colors md:hidden ${navText} ${navHover}`}
                >
                  {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
              </div>
            </div>
          </Container>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden bg-white/98 backdrop-blur-xl shadow-xl overflow-hidden border-t border-neutral-100"
              >
                <Container className="space-y-1.5 pb-5 pt-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`block rounded-xl px-4 py-2.5 font-heading text-[0.95rem] font-medium transition-colors ${
                        location.pathname === link.path
                          ? "text-saffron-600 bg-saffron-50"
                          : "text-neutral-800 hover:text-saffron-600 hover:bg-saffron-50/50"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </Container>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      )}
    </>
  );
};

export default Navbar;
