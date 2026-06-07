import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import About from '../components/About';
import Products from '../components/Products';
import Process from '../components/Process';
import Testimonials from '../components/Testimonials';
import PageLayout from '../components/PageLayout';
import CategorySlider from '../components/CategorySlider';
import PreFooterCard from '../components/PreFooterCard';

const Home = () => {
  return (
    <PageLayout frame="none">
      <Hero />
      <Features />
      <CategorySlider/>
      <About />
      <PreFooterCard />
      <Products />
      <Process />
      <Testimonials />
    </PageLayout>
  );
};

export default Home;
