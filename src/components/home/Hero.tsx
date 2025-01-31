import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function Hero() {
  const tasks = [
    "Paperwork,",
    "Data Entry,",
    "Fraud Detection,",
    "Policy Checks,",
    "Claim Reviews,",
    "Manual Approvals,"
  ];

  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const intervalTime = 4000; // Interval time in milliseconds

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTaskIndex((prevIndex) => (prevIndex + 1) % tasks.length);
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-light-50 pt-20 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-light-900 mb-8 animate-fade-up">
              Revolutionizing&nbsp;
              <span className="relative inline-block align-middle" style={{ height: '1.2em' }}>
                <span
                  className="scanner-line"
                  style={{
                    animation: `scan ${intervalTime}ms linear infinite`
                  }}
                ></span>
                <span
                  className="absolute left-0 top-0 text-5xl italic text-primary-600"
                  style={{
                    animation: `fadeLeftToRight ${intervalTime / 2}ms ease-out forwards`,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tasks[currentTaskIndex]}
                </span>
                <span className="invisible text-5xl">{tasks[0]}</span>
              </span>
              <br />one workflow at a time.
            </h1>
            <p className="text-xl text-light-700 mb-12 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
              Extract and process any document with AI that understands your business. Built for enterprise security and scale.
            </p>
            <div className="flex gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <a
                href="https://cal.com/shubh.r/discuss"
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Get Started
              </a>
              <Link
                to="/demo"
                className="inline-flex items-center px-6 py-3 border border-primary-600 text-base font-medium rounded-lg text-primary-600 hover:bg-primary-50 transition-colors"
              >
                Try Extraction Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeLeftToRight {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .scanner-line {
            position: absolute;
            top: 0;
            left: 0;
            width: 2px;
            height: 100%;
            background: linear-gradient(to bottom, transparent, #2563eb, transparent);
          }

          @keyframes scan {
            0% {
              left: 0;
            }
            100% {
              left: 100%;
            }
          }
        `}
      </style>
    </div>
  );
}