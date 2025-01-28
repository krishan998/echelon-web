import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      
      <main className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">
              About Nexbit
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're on a mission to revolutionize document processing with artificial intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
              <div className="prose prose-lg text-gray-300">
                <p className="mb-4">
                  Founded in 2023, Nexbit emerged from a simple observation: businesses spend countless hours manually processing documents. We saw an opportunity to transform this tedious process with the power of AI.
                </p>
                <p className="mb-4">
                  Our team of AI experts and industry veterans came together with a shared vision: to create an intelligent document processing platform that would set new standards for accuracy, speed, and ease of use.
                </p>
                <p>
                  Today, Nexbit helps companies around the world automate their document processing, saving time and reducing errors while providing valuable insights from their documents.
                </p>
              </div>
            </div>
            <div className="bg-dark-800 rounded-lg p-8 border border-dark-700">
              <h3 className="text-2xl font-bold text-white mb-6">Our Values</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-semibold text-primary-400 mb-2">Innovation First</h4>
                  <p className="text-gray-300">We constantly push the boundaries of what's possible with AI and document processing.</p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-primary-400 mb-2">Customer Success</h4>
                  <p className="text-gray-300">Your success is our success. We're committed to providing exceptional support and solutions.</p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-primary-400 mb-2">Security & Trust</h4>
                  <p className="text-gray-300">We maintain the highest standards of security to protect your sensitive data.</p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-primary-400 mb-2">Continuous Improvement</h4>
                  <p className="text-gray-300">We're always learning and improving to provide better solutions for our customers.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-dark-800 rounded-lg p-8 border border-dark-700">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary-400 mb-2">1M+</div>
                <div className="text-xl text-white mb-1">Documents Processed</div>
                <div className="text-gray-400">Daily</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-400 mb-2">500+</div>
                <div className="text-xl text-white mb-1">Enterprise Clients</div>
                <div className="text-gray-400">Worldwide</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-400 mb-2">99.9%</div>
                <div className="text-xl text-white mb-1">Accuracy Rate</div>
                <div className="text-gray-400">In Data Extraction</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}