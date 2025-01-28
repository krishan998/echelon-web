import React from 'react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <div className="bg-dark-950 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-6xl font-bold tracking-tight text-white mb-8">
          The all-in-one document<br />intelligence platform
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-3xl">
          Extract and process any document with AI that understands your business. Built for enterprise security and scale.
        </p>
        <div className="flex gap-4">
          <a
            href="https://cal.com/shubh.r/discuss"
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-dark-900 bg-primary-400 hover:bg-primary-500 transition-colors"
          >
            Get Started
          </a>
          <Link
            to="/demo"
            className="inline-flex items-center px-6 py-3 border border-primary-400 text-base font-medium rounded-md text-primary-400 hover:bg-dark-800 transition-colors"
          >
            Try Extraction Demo
          </Link>
        </div>
      </div>
    </div>
  );
}