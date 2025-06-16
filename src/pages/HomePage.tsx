import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Hero } from '../components/home/Hero';
import { Features } from '../components/home/Features';
import { CallToAction } from '../components/home/CallToAction';
import { Footer } from '../components/layout/Footer';
import { SecuritySection } from '../components/home/SecuritySection';
import { motion } from 'framer-motion';

export function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#18181b] overflow-hidden">
      <div className="relative z-10">
        <Navbar />
        {/* Main Section */}
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl mb-8 tracking-tight text-center bg-gradient-to-r from-[#f8fafc] via-[#a1a1aa] to-[#f8fafc] bg-clip-text text-transparent drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)] leading-tight"
            style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontWeight: 400 }}
          >
            Reimagining accounting<br />with AI
          </motion.h1>
        </div>
        {/* Keep existing components but hide them */}
        <div className="hidden">
          <Hero />
          <Features />
          <SecuritySection />
          <CallToAction />
        </div>
        <Footer />
      </div>
    </div>
  );
}