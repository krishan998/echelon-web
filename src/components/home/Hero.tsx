import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <div className="bg-white pt-20 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-black mb-8 animate-fade-up" style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.02em' }}>
              Do More <span className="italic text-primary-600">Audits</span> with Less <span className="italic text-primary-600">Caffeine</span>
            </h1>
            <p className="text-xl text-black mb-12 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
              Extract and process any document with AI that understands your business. Built for enterprise security and scale.
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