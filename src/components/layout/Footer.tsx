import React from 'react';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-1 mb-4">
            <img src={logo} alt="Nexbit Logo" className="h-8 w-8" />
              <span className="text-xl font-bold text-black">Nexbit</span>
            </div>
            <p className="text-black">
              Transforming document processing with AI-powered intelligence.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-black hover:text-primary-600">Features</Link></li>
              <li><Link to="/security" className="text-black hover:text-primary-600">Security</Link></li>
              <li><a href="https://cal.com/shubh.r/discuss" target="_blank" rel="noopener noreferrer" className="text-black hover:text-primary-600">Contact Sales</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-black hover:text-primary-600">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-black hover:text-primary-600">Terms of Service</Link></li>
              <li><Link to="/security" className="text-black hover:text-primary-600">Security</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-light-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-black">© 2025 Nexbit. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="https://twitter.com/nexbit" className="text-black hover:text-primary-600">
              Twitter
            </a>
            <a href="https://linkedin.com/company/nexbit-ai" className="text-black hover:text-primary-600">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}