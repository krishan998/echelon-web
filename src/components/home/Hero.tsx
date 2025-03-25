import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    <div className="checkered-bg pt-36 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-black mb-8 animate-fade-up" style={{ fontFamily: 'Share Tech Mono, serif', letterSpacing: '0.02em' }}>
              Do More Audits With
              <br />
              <div className="word-animation-container mt-2">
                <span 
                  className={`animated-word text-primary-600 italic ${isAnimating ? 'slide-out' : 'slide-in'}`}
                  style={{ 
                    fontFamily: 'Share Tech Mono, serif',
                  }}
                >
                  {rotatingWords[currentWordIndex]}
                </span>
              </div>
            </h1>
            <p className="text-xl text-black mb-12 max-w-3xl mx-auto animate-fade-up" style={{ fontFamily: 'Share Tech Mono, serif', letterSpacing: '0.02em', animationDelay: '0.2s' }}>
              Reimagine your audit process with AI that understands your business. Built for enterprise security and scale.
            </p>
            <div className="flex gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <a
                href="https://cal.com/shubh.r/discuss"
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Book Your Demo
              </a>
              {/* <Link
                to="/demo"
                className="inline-flex items-center px-6 py-3 border border-primary-600 text-base font-medium rounded-lg text-primary-600 hover:bg-primary-50 transition-colors"
              >
                Try Extraction Demo
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}