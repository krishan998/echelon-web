import React from 'react';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="bg-white border-b border-light-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Nexbit Logo" className="h-8 w-8" />
              <span className="ml-1 text-xl font-bold text-black" style={{ 
                fontFamily: 'Share Tech Mono, serif',
                letterSpacing: '0.02em',
                fontSize: '1.4rem'
              }}>
                Nexbit AI
              </span>
            </Link>
          </div>
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="flex space-x-8" style={{ fontFamily: 'Share Tech Mono, serif' }}>
              <Link to="/features" className="text-black hover:text-primary-600 transition-colors text-lg">
                Features
              </Link>
              {/* <Link to="/security" className="text-black hover:text-primary-600 transition-colors">
                Security
              </Link> */}
              <Link to="/about" className="text-black hover:text-primary-600 transition-colors text-lg">
                About
              </Link>
              <a href="https://blog.nexbit.ai" className="text-black hover:text-primary-600 transition-colors text-lg">
                Blog
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="https://cal.com/shubh.r/discuss" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              style={{ fontFamily: 'Share Tech Mono, serif' }}
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}