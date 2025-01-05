import React from 'react';
import { Ship } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Ship className="h-8 w-8 text-orange-500" />
              <span className="ml-2 text-xl font-bold">Nexbit</span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <a 
              href="https://cal.com/shubh.r/discuss" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              About
            </a>
            <a 
              href="https://cal.com/shubh.r/discuss" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              Contact
            </a>
            <div className="relative group">
              <button className="text-gray-600 hover:text-gray-900">
                Use Cases
                <span className="ml-1">▾</span>
              </button>
            </div>
            <a 
              href="https://cal.com/shubh.r/discuss"
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
            >
              Book Demo
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}