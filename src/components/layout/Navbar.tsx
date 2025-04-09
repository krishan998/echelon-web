import React from 'react';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="fixed top-4 z-[100] w-full px-4">
      <div className="container mx-auto px-6 py-2 bg-gray-50 rounded-full border border-gray-100 shadow-sm" style={{ maxWidth: '1152px' }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Nexbit Logo" className="h-8 w-8" />
              <span className="ml-1 text-xl font-bold text-black" style={{ 
                fontFamily: 'rubrik, sans-serif',
                letterSpacing: '0.02em',
                fontSize: '1.4rem'
              }}>
                Nexbit
              </span>
            </Link>
          </div>
          <div className="flex items-center">
            <div className="flex space-x-4" style={{ fontFamily: 'rubrik, sans-serif' }}>
              <Link to="/features" className="text-black px-4 py-1 rounded-2xl hover:bg-white transition-all duration-200 text-lg">
                Features
              </Link>
              <Link to="/about" className="text-black px-4 py-1 rounded-2xl hover:bg-white transition-all duration-200 text-lg">
                About
              </Link>
              <a href="https://blog.nexbit.ai" className="text-black px-4 py-1 rounded-2xl hover:bg-white transition-all duration-200 text-lg">
                Blog
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}