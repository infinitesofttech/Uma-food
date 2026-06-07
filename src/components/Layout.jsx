import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Newsletter from './Newsletter';
// import PreFooterCard from './PreFooterCard';
import CartSidebar from './CartSidebar';
import Notification from './Notification';
import ScrollToTop from './ScrollToTop';

export const Layout = () => {
  return (
    <div className="site-shell flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <Notification />
      <CartSidebar />

      <main className="site-main flex-1">
        <Outlet />
      </main>

      <Newsletter />
      <Footer />
    </div>
    
  );
};

export default Layout;
