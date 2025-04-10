import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Hero.css'; // We'll create this file

export function Hero() {
  const rotatingWords = [
    "Fewer Errors",
    "Less Overhead",
    "Instant Reconciliations",
    "Zero Bottlenecks",
    "Seamless Compliance"
  ];

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % rotatingWords.length);
        setIsAnimating(false);
      }, 750);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen pt-24">
      <div className="checkered-bg absolute inset-0 -z-10"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1152px' }}>
        <div className="flex items-center justify-center min-h-[calc(100vh-6rem)]">
          <div className="text-center w-full -mt-[270px]">
            <motion.h1 
              className="text-6xl font-bold tracking-tight text-black mb-8" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ fontFamily: 'Rubik, sans-serif', letterSpacing: '0.02em', fontSize: '4.125rem' }}
            >
              More Audits With
              <br />
              <div className="word-animation-container mt-2">
                <span 
                  className={`animated-word text-blue-600 italic ${isAnimating ? 'slide-out' : 'slide-in'}`}
                  style={{ 
                    fontFamily: 'Share Tech Mono, serif',
                    fontSize: '2.8rem'
                  }}
                >
                  {rotatingWords[currentWordIndex]}
                </span>
              </div>
            </motion.h1>
            <motion.p 
              className="text-2xl text-black mb-12 max-w-3xl mx-auto" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ letterSpacing: '0.02em', fontSize: '1.35rem' }}
            >
              Reimagine your audit process with AI that understands your business. Built for enterprise security and scale.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <a 
                href="https://cal.com/shubh.r/discuss"
                target="_blank" 
                rel="noopener noreferrer"
                className="group inline-flex items-center px-6 py-2 text-base font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                style={{ fontFamily: 'Share Tech Mono, serif' }}
              >
                Book Your Demo
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M14 5l7 7m0 0l-7 7m7-7H3" 
                  />
                </svg>
              </a>
              {/* <Link
                to="/demo"
                className="inline-flex items-center px-6 py-3 border border-primary-600 text-base font-medium rounded-lg text-primary-600 hover:bg-primary-50 transition-colors"
              >
                Try Extraction Demo
              </Link> */}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}