import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { GradientText } from '../components/common/AnimatedText';
import logoSrc from '../assets/logo.png';
import ctaImage from '../assets/ctaction.png';
import { GeometricBackground } from '../components/backgrounds/GeometricBackground';

// Typewriter component
const TypewriterText = ({ text, speed = 50, onComplete, className }: { text: string; speed?: number; onComplete?: () => void; className?: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return <span className={className}>{displayedText}</span>;
};

export function TeaserPage() {
  const [chatStep, setChatStep] = useState(1); // 1: user "Hey", 2: bot response, 3: typing, 4: user response, 5: bot final
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);
  const [paperHeight, setPaperHeight] = useState(50); // Dynamic height based on content

  // Auto-start chat animation with key press effects and dynamic paper growth
  useEffect(() => {
    // Step 1: Bot responds
    const timer1 = setTimeout(() => {
      setChatStep(2); // Show bot response
      setPaperHeight(80); // Grow paper for more content
      // Simulate key presses for "How can I help..."
      const keys = ['H', 'O', 'W'];
      keys.forEach((key, index) => {
        setTimeout(() => {
          setPressedKeys(prev => [...prev, key]);
          setTimeout(() => {
            setPressedKeys(prev => prev.filter(k => k !== key));
          }, 300);
        }, index * 200);
      });
    }, 3000);

    // Step 2: Show typing indicator
    const timer2 = setTimeout(() => {
      setChatStep(3); // Show typing indicator
    }, 6000);

    // Step 3: User responds
    const timer3 = setTimeout(() => {
      setChatStep(4); // Show user response
      setPaperHeight(120); // Grow paper for more content
      // Simulate key presses for "make my brand..."
      const keys = ['M', 'A', 'K', 'E'];
      keys.forEach((key, index) => {
        setTimeout(() => {
          setPressedKeys(prev => [...prev, key]);
          setTimeout(() => {
            setPressedKeys(prev => prev.filter(k => k !== key));
          }, 300);
        }, index * 250);
      });
    }, 8000);

    // Step 4: Bot final response
    const timer4 = setTimeout(() => {
      setChatStep(5); // Show bot final response
      setPaperHeight(180); // Full paper extending beyond typewriter
      // Simulate key presses for "Processing..."
      const keys = ['P', 'R', 'O', 'C', 'E'];
      keys.forEach((key, index) => {
        setTimeout(() => {
          setPressedKeys(prev => [...prev, key]);
          setTimeout(() => {
            setPressedKeys(prev => prev.filter(k => k !== key));
          }, 300);
        }, index * 200);
      });
    }, 13000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFDF6] overflow-hidden font-sf-pro">
      {/* Background Elements */}
      <GeometricBackground />
      
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 flex items-center justify-between px-6 sm:px-12 lg:px-40 xl:px-56 2xl:px-72 3xl:px-88 py-6"
      >
        {/* Logo and Name */}
        <div className="flex items-center gap-1">
          <img 
            src={logoSrc} 
            alt="Nexbit Logo" 
            className="w-8 h-8"
            style={{ filter: 'brightness(0) saturate(100%) invert(8%) sepia(3%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)' }}
          />
          <span className="text-xl font-medium text-gray-900">Nexbit</span>
        </div>

        {/* Contact Button */}
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href="https://calendly.com/kp-nexbit/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 text-black rounded-full font-medium hover:bg-gray-100 transition-colors"
        >
          <span>Contact</span>
        </motion.a>
      </motion.header>
      
      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center px-6 sm:px-12 lg:px-40 xl:px-56 2xl:px-72 3xl:px-88 -mt-16">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Side - Text Content */}
            <div className="text-center lg:text-left flex flex-col justify-center items-center lg:items-start mt-20 lg:mt-0">
              
              {/* Main Heading */}
              <div className="mb-6">
                <GradientText
                  text="Make Your Brand AI-Native in Minutes"
                  gradient="from-gray-900 via-black to-gray-800"
                  className="text-2xl md:text-4xl lg:text-4xl font-semibold tracking-tight leading-tight font-montserrat"
                />
              </div>

              {/* Subtitle */}
              <div className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                We're crafting something extraordinary. Be the first to experience what's coming.
              </div>
            </div>

            {/* Right Side - Vintage Typewriter Interface */}
            <div className="relative overflow-visible mt-28 lg:mt-0">
              <div className="bg-[#FFFDF6] p-2 md:p-8 overflow-visible">
                {/* Vintage Typewriter Machine */}
                <div className="relative">
                  {/* Authentic Vintage Typewriter Body */}
                  <div className="relative overflow-visible z-20" style={{ 
                    background: `
                      linear-gradient(145deg, #E6B896 0%, #D4A088 15%, #C98B7C 30%, #B8745F 50%, #A65B4A 70%, #8F4A39 85%, #7A3D2F 100%),
                      radial-gradient(ellipse at 25% 15%, rgba(255,255,255,0.2) 0%, transparent 40%),
                      radial-gradient(ellipse at 75% 85%, rgba(0,0,0,0.15) 0%, transparent 50%),
                      linear-gradient(0deg, rgba(0,0,0,0.1) 0%, transparent 20%, transparent 80%, rgba(255,255,255,0.1) 100%)
                    `,
                    borderRadius: '12px 12px 8px 8px',
                    padding: '20px 24px 18px 24px',
                    transform: 'perspective(1000px) rotateX(12deg) rotateY(-3deg)',
                    transformStyle: 'preserve-3d',
                    border: '2px solid rgba(0,0,0,0.2)',
                    boxShadow: `
                      0 30px 60px rgba(0,0,0,0.5),
                      0 20px 40px rgba(0,0,0,0.4),
                      0 10px 25px rgba(0,0,0,0.3),
                      inset 0 4px 12px rgba(255,255,255,0.15),
                      inset 0 -3px 8px rgba(0,0,0,0.2),
                      inset 3px 0 6px rgba(255,255,255,0.1),
                      inset -3px 0 6px rgba(0,0,0,0.1)
                    `
                  }}>
                    {/* Enhanced 3D Metal Texture Layers */}
                    <div 
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: `
                          linear-gradient(45deg, rgba(255,255,255,0.12) 0%, transparent 30%, rgba(0,0,0,0.08) 70%, transparent 100%),
                          linear-gradient(-45deg, transparent 0%, rgba(180,100,80,0.15) 20%, transparent 40%, rgba(60,30,20,0.12) 80%, transparent 100%),
                          radial-gradient(ellipse at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 40%),
                          radial-gradient(ellipse at 75% 75%, rgba(0,0,0,0.15) 0%, transparent 40%)
                        `
                      }}
                    ></div>
                    <div
                      className="absolute inset-0 opacity-30 pointer-events-none mix-blend-multiply rounded-lg"
                      style={{
                        backgroundImage: [
                          "radial-gradient(rgba(255,220,200,0.12) 0.4px, transparent 0.8px)",
                          "radial-gradient(rgba(80,40,30,0.10) 0.6px, transparent 1px)",
                          "radial-gradient(rgba(255,240,220,0.08) 1.2px, transparent 1.5px)",
                          "radial-gradient(rgba(100,50,35,0.08) 0.8px, transparent 1.2px)",
                          "repeating-linear-gradient(30deg, rgba(60,30,20,0.06) 0 1px, transparent 1px 4px)",
                          "repeating-linear-gradient(150deg, rgba(255,255,255,0.04) 0 0.5px, transparent 0.5px 3px)",
                          "repeating-linear-gradient(75deg, rgba(140,70,50,0.05) 0 2px, transparent 2px 6px)"
                        ].join(', '),
                        backgroundSize: "2px 2px, 3px 3px, 5px 5px, 4px 4px, 8px 8px, 6px 6px, 10px 10px",
                        backgroundPosition: "0 0, 1px 0, 0 1px, 2px 1px, 0 0, 1px 1px, 2px 2px",
                      }}
                    ></div>
                    {/* 3D Depth Enhancement */}
                    <div
                      className="absolute inset-0 pointer-events-none rounded-lg"
                      style={{
                        background: `
                          linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 25%, rgba(0,0,0,0.12) 75%, rgba(0,0,0,0.25) 100%),
                          radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 60%),
                          radial-gradient(ellipse at 80% 90%, rgba(0,0,0,0.2) 0%, transparent 50%)
                        `,
                        opacity: 0.7
                      }}
                    ></div>



                    {/* Ink Ribbon */}
                    <div className="absolute top-8 left-8 right-8 h-1 bg-gradient-to-r from-red-900 via-red-800 to-red-900 rounded-full shadow-sm z-25"></div>

                    {/* Platen Roller */}
                    <div 
                      className="absolute top-12 left-4 right-4 h-4 rounded-full shadow-lg z-30"
                      style={{
                        background: `
                          radial-gradient(ellipse at 50% 25%, #e0e0e0, #c0c0c0, #a0a0a0, #808080),
                          linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)
                        `,
                        transform: 'translateZ(3px)',
                        border: '1px solid #999',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255,255,255,0.3), inset 0 -1px 3px rgba(0,0,0,0.2)'
                      }}
                    >
                      {/* Enhanced Rubber texture lines */}
                      <div className="absolute inset-x-0 top-1 h-px bg-gray-600 opacity-40" style={{ transform: 'scaleY(0.5)' }}></div>
                      <div className="absolute inset-x-0 top-2 h-px bg-gray-500 opacity-25" style={{ transform: 'scaleY(0.5)' }}></div>
                      <div className="absolute inset-x-0 top-3 h-px bg-gray-600 opacity-40" style={{ transform: 'scaleY(0.5)' }}></div>
                      {/* Highlight on top */}
                      <div 
                        className="absolute inset-x-2 top-0 h-1 rounded-full opacity-60"
                        style={{
                          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent)'
                        }}
                      ></div>
                    </div>

                    {/* Paper Guides */}
                    <div className="absolute top-10 left-2 w-1 h-8 bg-gradient-to-b from-gray-600 to-gray-700 rounded-sm shadow-sm z-30"></div>
                    <div className="absolute top-10 right-2 w-1 h-8 bg-gradient-to-b from-gray-600 to-gray-700 rounded-sm shadow-sm z-30"></div>

                    {/* Type Bars (behind paper) */}
                    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 flex gap-1 z-15">
                      {Array.from({length: 8}).map((_, i) => (
                        <div key={i} className="w-1 h-6 bg-gradient-to-b from-gray-700 to-gray-800 rounded-sm transform rotate-12 shadow-sm"></div>
                      ))}
                    </div>

                    {/* Vintage Control Levers */}
                    <div className="absolute top-6 left-2 w-2 h-6 bg-gradient-to-b from-gray-600 to-gray-700 rounded-sm shadow-sm z-30">
                      <div className="absolute top-0 w-2 h-2 bg-gray-500 rounded-full"></div>
                    </div>
                    <div className="absolute top-6 right-2 w-2 h-6 bg-gradient-to-b from-gray-600 to-gray-700 rounded-sm shadow-sm z-30">
                      <div className="absolute top-0 w-2 h-2 bg-gray-500 rounded-full"></div>
                    </div>

                    {/* Authentic Rust and Wear Patterns */}
                    <div className="absolute top-4 left-8 w-8 h-3 bg-gradient-to-br from-amber-800 to-amber-900 opacity-40 rounded-sm blur-sm"></div>
                    <div className="absolute top-6 right-12 w-4 h-4 bg-gradient-to-br from-amber-700 to-red-900 opacity-35 rounded-full blur-sm"></div>
                    <div className="absolute bottom-6 left-6 w-12 h-2 bg-gradient-to-r from-transparent via-amber-800 to-transparent opacity-30 rounded-full"></div>
                    <div className="absolute bottom-4 right-8 w-6 h-6 bg-gradient-to-br from-amber-600 to-red-800 opacity-25 rounded-full blur-sm"></div>
                    <div className="absolute top-12 left-4 w-3 h-8 bg-gradient-to-b from-transparent via-amber-900 to-transparent opacity-20 rounded-sm"></div>
                    <div className="absolute top-8 right-6 w-2 h-2 bg-amber-900 opacity-40 rounded-full"></div>
                    <div className="absolute bottom-8 left-12 w-4 h-1 bg-gradient-to-r from-transparent via-red-900 to-transparent opacity-25 rounded-full"></div>
                    
                    {/* Edge Wear */}
                    <div className="absolute top-0 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-amber-800 to-transparent opacity-20 rounded-full"></div>
                    <div className="absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-amber-900 to-transparent opacity-25 rounded-full"></div>
                    <div className="absolute left-0 top-8 bottom-8 w-1 bg-gradient-to-b from-transparent via-amber-800 to-transparent opacity-20 rounded-full"></div>
                    <div className="absolute right-0 top-6 bottom-6 w-1 bg-gradient-to-b from-transparent via-amber-900 to-transparent opacity-25 rounded-full"></div>
                                    
                    
                  
                
                    {/* Paper Feeding Mechanism */}
                    <div className="relative mb-4 overflow-visible" style={{ height: '60px' }}>
                      {/* Paper Roll Inside Typewriter - More Realistic */}
                    
                      
                      {/* Paper Feed Guides */}
                      <div className="absolute top-16 left-6 w-1 h-6 bg-gradient-to-b from-gray-600 to-gray-700 rounded-sm shadow-sm z-25"></div>
                      <div className="absolute top-16 right-6 w-1 h-6 bg-gradient-to-b from-gray-600 to-gray-700 rounded-sm shadow-sm z-25"></div>
                      
                      {/* Dynamic Paper Growing Upward - Positioned Above Typewriter */}
                      <div 
                        className="bg-white rounded-sm border border-gray-200 absolute w-full"
                        style={{ 
                          height: `${paperHeight}px`,
                          top: `${-paperHeight + 20}px`, // Position above typewriter, grows upward
                          zIndex: 1,
                          left: '0',
                          right: '0',
                          opacity: 1,
                          transition: 'height 3s ease-out, top 3s ease-out',
                          border: '1px solid #FFFDF6'
                        }}
                      >
                        
                        {/* Content - grows with paper */}
                        <div className="text-black font-mono leading-relaxed p-2 md:p-4 text-xs md:text-sm">
                          {/* User Message 1 - Right aligned */}
                          <div className="mb-3 text-right">
                            <span className="text-black text-xs md:text-sm">Hey</span>
                          </div>
                          
                          {chatStep >= 2 && (
                            <div className="mb-3 text-left">
                              <TypewriterText 
                                text="How can I help you today?" 
                                speed={200}
                                className="text-black text-xs md:text-sm"
                              />
                            </div>
                          )}
                          {chatStep >= 3 && chatStep < 4 && (
                            <div className="mb-3 text-left">
                              <div className="w-1 h-4 bg-black animate-pulse"></div>
                            </div>
                          )}
                          {chatStep >= 4 && (
                            <div className="mb-3 text-right">
                              <TypewriterText 
                                text="make my brand AI native" 
                                speed={200}
                                className="text-black text-xs md:text-sm"
                              />
                            </div>
                          )}
                          {chatStep >= 5 && (
                            <div className="mb-3 text-left">
                              <TypewriterText 
                                text="Processing...... Done" 
                                speed={200}
                                className="text-black text-xs md:text-sm"
                              />
                            </div>
                          )}
                          {chatStep === 5 && (
                            <div className="flex items-center justify-left">
                              <div className="w-1 h-4 bg-black animate-pulse"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Authentic Vintage Typewriter Keys */}
                    <div className="relative z-10 mt-4">
                      {/* Number Row */}
                      <div className="flex justify-center gap-0.5 sm:gap-0.5 md:gap-1 mb-1">
                        {['1','2','3','4','5','6','7','8','9','0'].map((key) => (
                          <div 
                            key={key} 
                            className="relative"
                            style={{
                              transform: pressedKeys.includes(key) ? 'translateY(2px) translateZ(-1px)' : 'translateZ(2px)'
                            }}
                          >
                            {/* Key Stem */}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 sm:w-0.5 md:w-1 h-2 sm:h-2 md:h-3 bg-gradient-to-b from-gray-600 to-gray-800 rounded-sm"></div>
                            {/* Key Top */}
                            <div 
                              className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-black font-bold text-xs shadow-lg border transition-all duration-100`}
                              style={{
                                background: pressedKeys.includes(key) 
                                  ? 'radial-gradient(circle at 30% 30%, #e8e8e8, #d0d0d0, #b8b8b8)'
                                  : 'radial-gradient(circle at 30% 30%, #f5f5f5, #e0e0e0, #c8c8c8)',
                                borderColor: '#999',
                                boxShadow: pressedKeys.includes(key) 
                                  ? '0 1px 3px rgba(0,0,0,0.4), inset 0 1px 2px rgba(0,0,0,0.2)'
                                  : '0 3px 6px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4)'
                              }}
                            >
                              {key}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* QWERTY Row */}
                      <div className="flex justify-center gap-0.5 sm:gap-0.5 md:gap-1 mb-1">
                        {['Q','W','E','R','T','Y','U','I','O','P'].map((key) => (
                          <div 
                            key={key} 
                            className="relative"
                            style={{
                              transform: pressedKeys.includes(key) ? 'translateY(2px) translateZ(-1px)' : 'translateZ(2px)'
                            }}
                          >
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 sm:w-0.5 md:w-1 h-2 sm:h-2 md:h-3 bg-gradient-to-b from-gray-600 to-gray-800 rounded-sm"></div>
                            <div 
                              className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-black font-bold text-xs shadow-lg border transition-all duration-100`}
                              style={{
                                background: pressedKeys.includes(key) 
                                  ? 'radial-gradient(circle at 30% 30%, #e8e8e8, #d0d0d0, #b8b8b8)'
                                  : 'radial-gradient(circle at 30% 30%, #f5f5f5, #e0e0e0, #c8c8c8)',
                                borderColor: '#999',
                                boxShadow: pressedKeys.includes(key) 
                                  ? '0 1px 3px rgba(0,0,0,0.4), inset 0 1px 2px rgba(0,0,0,0.2)'
                                  : '0 3px 6px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4)'
                              }}
                            >
                              {key}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* ASDF Row */}
                      <div className="flex justify-center gap-0.5 sm:gap-0.5 md:gap-1 mb-1 ml-2 sm:ml-2 md:ml-3">
                        {['A','S','D','F','G','H','J','K','L'].map((key) => (
                          <div 
                            key={key} 
                            className="relative"
                            style={{
                              transform: pressedKeys.includes(key) ? 'translateY(2px) translateZ(-1px)' : 'translateZ(2px)'
                            }}
                          >
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 sm:w-0.5 md:w-1 h-2 sm:h-2 md:h-3 bg-gradient-to-b from-gray-600 to-gray-800 rounded-sm"></div>
                            <div 
                              className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-black font-bold text-xs shadow-lg border transition-all duration-100`}
                              style={{
                                background: pressedKeys.includes(key) 
                                  ? 'radial-gradient(circle at 30% 30%, #e8e8e8, #d0d0d0, #b8b8b8)'
                                  : 'radial-gradient(circle at 30% 30%, #f5f5f5, #e0e0e0, #c8c8c8)',
                                borderColor: '#999',
                                boxShadow: pressedKeys.includes(key) 
                                  ? '0 1px 3px rgba(0,0,0,0.4), inset 0 1px 2px rgba(0,0,0,0.2)'
                                  : '0 3px 6px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4)'
                              }}
                            >
                              {key}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* ZXCV Row */}
                      <div className="flex justify-center gap-0.5 sm:gap-0.5 md:gap-1 mb-2 ml-3 sm:ml-4 md:ml-6">
                        {['Z','X','C','V','B','N','M'].map((key) => (
                          <div 
                            key={key} 
                            className="relative"
                            style={{
                              transform: pressedKeys.includes(key) ? 'translateY(2px) translateZ(-1px)' : 'translateZ(2px)'
                            }}
                          >
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 sm:w-0.5 md:w-1 h-2 sm:h-2 md:h-3 bg-gradient-to-b from-gray-600 to-gray-800 rounded-sm"></div>
                            <div 
                              className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-black font-bold text-xs shadow-lg border transition-all duration-100`}
                              style={{
                                background: pressedKeys.includes(key) 
                                  ? 'radial-gradient(circle at 30% 30%, #e8e8e8, #d0d0d0, #b8b8b8)'
                                  : 'radial-gradient(circle at 30% 30%, #f5f5f5, #e0e0e0, #c8c8c8)',
                                borderColor: '#999',
                                boxShadow: pressedKeys.includes(key) 
                                  ? '0 1px 3px rgba(0,0,0,0.4), inset 0 1px 2px rgba(0,0,0,0.2)'
                                  : '0 3px 6px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4)'
                              }}
                            >
                              {key}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Space Bar */}
                      <div className="flex justify-center">
                        <div className="relative">
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-1 sm:w-1.5 md:w-2 h-2 sm:h-2.5 md:h-3 bg-gradient-to-b from-gray-600 to-gray-800 rounded-sm"></div>
                          <div 
                            className={`w-16 h-4 sm:w-20 sm:h-5 md:w-24 md:h-6 rounded-full flex items-center justify-center text-black font-bold text-xs shadow-lg border transition-all duration-100`}
                            style={{
                              background: pressedKeys.includes('SPACE') 
                                ? 'radial-gradient(ellipse at 50% 30%, #e8e8e8, #d0d0d0, #b8b8b8)'
                                : 'radial-gradient(ellipse at 50% 30%, #f5f5f5, #e0e0e0, #c8c8c8)',
                              borderColor: '#999',
                              boxShadow: pressedKeys.includes('SPACE') 
                                ? '0 1px 3px rgba(0,0,0,0.4), inset 0 1px 2px rgba(0,0,0,0.2)'
                                : '0 3px 6px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4)',
                              transform: pressedKeys.includes('SPACE') ? 'translateY(2px) translateZ(-1px)' : 'translateZ(2px)'
                            }}
                          >
                            SPACE
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Carriage Return Mechanism */}
                    <div className="absolute -left-3 top-8 w-8 h-8 bg-gradient-to-b from-gray-600 to-gray-700 rounded-full border-2 border-gray-500 shadow-xl z-30">
                      <div className="absolute inset-1 bg-gradient-to-b from-gray-700 to-gray-800 rounded-full">
                        <div className="absolute top-1 left-1 w-2 h-2 bg-gray-500 rounded-full"></div>
                      </div>
                      {/* Carriage lever */}
                      <div className="absolute -right-1 top-2 w-3 h-1 bg-gradient-to-r from-gray-600 to-gray-700 rounded-sm shadow-sm"></div>
                    </div>
                    <div className="absolute -right-3 top-8 w-8 h-8 bg-gradient-to-b from-gray-600 to-gray-700 rounded-full border-2 border-gray-500 shadow-xl z-30">
                      <div className="absolute inset-1 bg-gradient-to-b from-gray-700 to-gray-800 rounded-full">
                        <div className="absolute top-1 left-1 w-2 h-2 bg-gray-500 rounded-full"></div>
                      </div>
                      {/* Carriage lever */}
                      <div className="absolute -left-2 top-2 w-3 h-1 bg-gradient-to-r from-gray-700 to-gray-600 rounded-sm shadow-sm"></div>
                    </div>
                    


                    {/* Typewriter Bell */}
                    <div className="absolute top-2 right-8 w-3 h-3 bg-gradient-to-b from-yellow-300 to-yellow-400 rounded-full border border-yellow-500 shadow-sm z-30">
                      <div className="absolute inset-0.5 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-full"></div>
                    </div>

                    {/* Paper Bail Arms */}
                    <div className="absolute top-11 left-3 w-1 h-3 bg-gradient-to-b from-gray-600 to-gray-700 rounded-sm shadow-sm z-30"></div>
                    <div className="absolute top-11 right-3 w-1 h-3 bg-gradient-to-b from-gray-600 to-gray-700 rounded-sm shadow-sm z-30"></div>
                    
                    {/* Paper Bail Roller */}
                    <div className="absolute top-11 left-4 right-4 h-1 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full shadow-sm z-30"></div>

                    {/* Line Space Lever */}
                    <div className="absolute bottom-3 left-2 w-1 h-4 bg-gradient-to-b from-gray-600 to-gray-700 rounded-sm shadow-sm z-30">
                      <div className="absolute top-0 w-3 h-1 bg-gradient-to-r from-gray-600 to-gray-700 rounded-sm -left-1"></div>
                    </div>
                  </div>

                  {/* Wooden Surface - Enhanced */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-amber-800 to-amber-900 rounded-lg -z-10 shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-700/20 to-amber-900/40 rounded-lg"></div>
                    {/* Wood grain lines */}
                    <div className="absolute top-2 left-2 w-8 h-1 bg-amber-700 rounded"></div>
                    <div className="absolute top-4 right-4 w-6 h-1 bg-amber-700 rounded"></div>
                    <div className="absolute bottom-2 left-6 w-12 h-1 bg-amber-700 rounded"></div>
                    <div className="absolute top-6 left-8 w-4 h-1 bg-amber-600 rounded"></div>
                    <div className="absolute bottom-4 right-8 w-8 h-1 bg-amber-600 rounded"></div>
                    <div className="absolute top-8 left-12 w-6 h-1 bg-amber-700 rounded"></div>
                    <div className="absolute bottom-6 left-4 w-10 h-1 bg-amber-600 rounded"></div>
                  </div>
                </div>

                {/* Input Area - Show placeholder when chatStep === 0 */}
                {chatStep === 0 && (
                  <div className="flex items-center gap-3 mt-6">
                    <div className="flex-1 bg-white rounded-full px-4 py-3 shadow-sm border border-gray-200">
                      <p className="text-gray-400 text-sm">Type your message...</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* CTA Above Footer */}
      <section className="px-6 sm:px-12 lg:px-40 xl:px-56 2xl:px-72 3xl:px-88 py-12">
        <div className="bg-[#FFF7D9] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-7 md:gap-9 shadow-sm">
          {/* Left: Headings and Button */}
          <div className="flex-1">
            <div className="text-2xl md:text-3xl font-normal text-gray-600">Interested in knowing full potential of AI for your brand?</div>
            <a
              href="https://calendly.com/kp-nexbit/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center justify-center bg-[#181515] text-white px-7 py-3.5 rounded-lg font-medium hover:bg-black transition-colors"
            >
              Get in touch
            </a>
          </div>
          {/* Right: Image */}
          <div className="w-full md:w-[26rem] h-60 md:h-72 rounded-lg overflow-hidden">
            <img
              src={ctaImage}
              alt="Contact illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FFFDF6] border-t border-gray-100">

        {/* Main Footer Content */}
        <div className="px-6 sm:px-12 lg:px-40 xl:px-56 2xl:px-72 3xl:px-88 py-8 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            {/* Left Column - Brand Information */}
            <div className="text-center sm:text-left">
              <div className="font-semibold text-lg text-black mb-2">Nexbit</div>
            </div>

            {/* Middle Column - Navigation/Social Links */}
            <div className="text-center sm:text-left space-y-3">
              <a href="#" className="block text-gray-600 hover:text-black transition-colors">Get in touch</a>
              <a href="https://www.linkedin.com/company/nexbit-ai/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="block text-gray-600 hover:text-black transition-colors">LinkedIn</a>
              <a href="#" className="block text-gray-600 hover:text-black transition-colors">X</a>
            </div>

            {/* Right Column - Back to Top */}
            <div className="text-center sm:col-span-2 md:col-span-1 md:text-right">
              <a href="#" className="text-gray-600 hover:text-black transition-colors">Back to top ↑</a>
            </div>
          </div>
        </div>

        {/* Bottom Footer Section */}
        <div className="border-t border-gray-200 px-6 sm:px-12 lg:px-40 xl:px-56 2xl:px-72 3xl:px-88 py-4 md:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4 text-sm text-gray-500">
            <div className="text-center sm:text-left">Nexbit 2025</div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-center">
              <a href="#" className="hover:text-gray-700 transition-colors">Terms of use</a>
              <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
