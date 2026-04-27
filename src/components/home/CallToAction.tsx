import React from 'react';
import { motion } from 'framer-motion';

export function CallToAction() {
  return (
    <section className="relative py-20">
      <div className="checkered-bg absolute inset-0"></div>
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-black"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ fontFamily: 'Rubik, sans-serif' }}
          >
            Ready to delight your clients and audit team?
          </motion.h2>
          <motion.p 
            className="text-lg md:text-xl text-gray-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Schedule a call with our founders, and we'll customize a demo for your unique needs.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <a
              href="https://cal.com/shubh.r/pulp-intro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 text-base font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-all duration-300 hover:scale-105"
              style={{ fontFamily: 'Montserrat, serif' }}
            >
              Book a demo
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 