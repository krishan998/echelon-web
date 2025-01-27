import React from 'react';
import { Ship } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="bg-blue-900 border-b border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Ship className="h-8 w-8 text-blue-300" />
              <span className="ml-2 text-xl font-bold text-white">Nexbit</span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <a 
              href="https://cal.com/shubh.r/discuss" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-100 hover:text-white transition-colors"
            >
              About
            </a>
            <a 
              href="https://cal.com/shubh.r/discuss" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-100 hover:text-white transition-colors"
            >
              Contact
            </a>
            <div className="relative group">
              <button className="text-blue-100 hover:text-white transition-colors">
                Use Cases
                <span className="ml-1">▾</span>
              </button>
            </div>
            <a 
              href="https://cal.com/shubh.r/discuss"
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-900 bg-blue-100 hover:bg-white transition-colors"
            >
              Book Demo
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}