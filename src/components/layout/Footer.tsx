import React from 'react';
import { Ship } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Ship className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">Nexbit</span>
            </div>
            <p className="text-gray-400">
              Transforming document processing with AI-powered intelligence.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-gray-400 hover:text-white">Features</Link></li>
              <li><Link to="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
              <li><Link to="/security" className="text-gray-400 hover:text-white">Security</Link></li>
              <li><Link to="/enterprise" className="text-gray-400 hover:text-white">Enterprise</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link to="/careers" className="text-gray-400 hover:text-white">Careers</Link></li>
              <li><a href="https://blog.nexbit.ai" className="text-gray-400 hover:text-white">Blog</a></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              <li><Link to="/security" className="text-gray-400 hover:text-white">Security</Link></li>
              <li><Link to="/compliance" className="text-gray-400 hover:text-white">Compliance</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">© 2024 Nexbit. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="https://twitter.com/nexbit" className="text-gray-400 hover:text-white">
              Twitter
            </a>
            <a href="https://linkedin.com/company/nexbit" className="text-gray-400 hover:text-white">
              LinkedIn
            </a>
            <a href="https://github.com/nexbit" className="text-gray-400 hover:text-white">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}