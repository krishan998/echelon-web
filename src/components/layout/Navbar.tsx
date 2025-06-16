import React, { useState, useEffect } from 'react';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="w-full z-[100] py-4">
      <div className="container mx-auto px-6" style={{ maxWidth: '1152px' }}>
        <div className="flex justify-between items-center h-14">
          {/* Logo on the left */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group relative">
              <img 
                src={logo} 
                alt="Nexbit Logo" 
                className="h-8 w-8 md:h-8 md:w-8 h-7 w-7 relative group-hover:scale-105 group-hover:rotate-3 transition-all duration-300" 
              />
              <span className="ml-3 text-xl md:text-xl text-lg font-bold text-white relative" 
                style={{ 
                  fontFamily: 'Montserrat, sans-serif',
                  letterSpacing: '-0.01em',
                }}>
                Nexbit
              </span>
            </Link>
          </div>

          {/* Right side: Contact and SOC2 logo */}
          <div className="flex items-center gap-6">
            <a
              href="https://calendly.com/kp-nexbit/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2 text-base font-semibold text-white rounded-full transition-all duration-300"
              style={{ background: 'none', boxShadow: 'none' }}
            >
              Contact
            </a>
            <div className="relative group">
              <img 
                src="/images/soc2.png" 
                alt="SOC 2 Type II Compliant" 
                className="h-11 w-auto object-contain relative hover:scale-105 transition-all duration-300 bg-transparent" 
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}