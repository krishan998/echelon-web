import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { ParticleBackground } from '../common/ParticleBackground';
import { AnimatedIllustration } from '../common/AnimatedIllustration';
import { ScrollAnimation } from '../common/ScrollAnimation';
import './Hero.css';

export function Hero() {
  return (
    <div className="relative min-h-screen pt-24 overflow-hidden">
      <ParticleBackground />
      
      {/* Content */}
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1152px' }}>
        <div className="flex items-center justify-center min-h-[calc(100vh-6rem)]">
          <div className="text-center w-full -mt-[230px]">
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mb-8 mt-4 md:mt-4 mt-[90px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="announcement-bar-wrapper">
                <a href="#" className="group inline-flex items-center px-5 py-2 md:px-5 md:py-2 px-3 py-1 rounded-full bg-white/90 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:bg-white transform transition-all duration-300 ease-out border-2 border-blue-200/60 backdrop-blur-sm">
                  <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs md:text-xs text-[8px] px-2 py-0.5 rounded-full mr-2 font-medium group-hover:from-blue-700 group-hover:to-blue-800 transition-all duration-300">NEW</span>
                  <span className="text-sm md:text-sm text-[11px] font-medium text-gray-800 group-hover:text-gray-900">We've launched AI-powered PBC!</span>
                </a>
              </div>
              <div className="announcement-bar-wrapper">
                <a href="#" className="group inline-flex items-center px-5 py-2 md:px-5 md:py-2 px-3 py-1 rounded-full bg-white/90 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:bg-white transform transition-all duration-300 ease-out border-2 border-amber-200/60 backdrop-blur-sm">
                  <span className="flex items-center justify-center w-6 h-6 md:w-6 md:h-6 w-4 h-4 mr-2">
                    <Zap className="w-4 h-4 md:w-4 md:h-4 w-3 h-3 text-amber-400 animate-pulse" strokeWidth={2.5} />
                  </span>
                  <span className="text-sm md:text-sm text-[11px] font-medium text-gray-800 group-hover:text-gray-900">AI Document analysis is live</span>
                </a>
              </div>
            </motion.div>

            <ScrollAnimation animation="fadeIn" className="mb-8">
              <h1 className="text-[2.25rem] md:text-[3.375rem] font-bold tracking-tight text-black gradient-text" 
                  style={{ fontFamily: 'Rubik, sans-serif', letterSpacing: '0.02em' }}>
                AI that makes <span className="text-blue-600">audits</span> effortless
              </h1>
            </ScrollAnimation>

            <ScrollAnimation animation="slideUp" delay={0.2} className="mb-12">
              <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto" 
                style={{ letterSpacing: '0.02em' }}>
                Reimagine your audit process with AI that understands your business. Built for enterprise security and scale.
              </p>
            </ScrollAnimation>

            <ScrollAnimation animation="scaleIn" delay={0.4}>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://cal.com/shubh.r/discuss"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 text-base font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{ fontFamily: 'Montserrat, serif' }}
                >
                  Book a demo
                </a>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
      </motion.div>
    </div>
  );
}