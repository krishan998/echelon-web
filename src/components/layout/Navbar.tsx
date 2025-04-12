import React, { useState } from 'react';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-4 z-[100] w-full px-4">
      <div className="container mx-auto px-4 sm:px-6 py-1.5 bg-gray-50 rounded-full border border-gray-100 shadow-sm" style={{ maxWidth: '1152px' }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Nexbit Logo" className="h-7 w-7" />
              <span className="ml-1 text-xl font-bold text-black" style={{ 
                fontFamily: 'rubrik, sans-serif',
                letterSpacing: '0.02em',
                fontSize: '1.3rem'
              }}>
                Nexbit
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="flex space-x-.001" style={{ fontFamily: 'rubrik, sans-serif' }}>
              <Link to="/features" className="text-black px-4 py-0.5 rounded-2xl hover:bg-white transition-all duration-200 text-lg">
                Features
              </Link>
              <Link to="/about" className="text-black px-4 py-0.5 rounded-2xl hover:bg-white transition-all duration-200 text-lg">
                About
              </Link>
            </div>
            <img src="/images/soc.jpg" alt="SOC 2 Type II Compliant" className="h-9 w-auto object-contain" />
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-1.5 rounded-full hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation - Now outside the grey container */}
      {isMenuOpen && (
        <div className="md:hidden mt-4">
          <div className="container mx-auto px-4 sm:px-6" style={{ maxWidth: '1152px' }}>
            <div className="flex flex-col divide-y divide-gray-200 bg-white rounded-lg shadow-sm" style={{ fontFamily: 'rubrik, sans-serif' }}>
              <Link 
                to="/features" 
                className="text-black py-2.5 px-4 text-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                to="/about" 
                className="text-black py-2.5 px-4 text-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <a 
                href="https://blog.nexbit.ai" 
                className="text-black py-2.5 px-4 text-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </a>
              <div className="flex justify-center py-3.5">
                <img src="/images/soc.jpg" alt="SOC 2 Type II Compliant" className="h-10 w-auto object-contain" />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}