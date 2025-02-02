import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-black mb-6">
              About Nexbit
            </h1>
            <p className="text-xl text-black max-w-3xl mx-auto">
              We're on a mission to revolutionize document processing with artificial intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-black mb-6">Our Story</h2>
              <div className="prose prose-lg text-black">
                <p className="mb-4">
                  Founded in 2024, Nexbit emerged from a simple observation: businesses spend countless hours manually processing documents. We saw an opportunity to transform this tedious process with the power of AI.
                </p>
                <p className="mb-4">
                  Our team of AI experts and industry veterans came together with a shared vision: to create an intelligent document processing platform that would set new standards for accuracy, speed, and ease of use.
                </p>
                <p>
                  Today, Nexbit helps companies around the world automate their document processing, saving time and reducing errors while providing valuable insights from their documents.
                </p>
              </div>
            </div>
            <div className="bg-light-50 rounded-lg p-8 border border-light-200">
              <h3 className="text-2xl font-bold text-black mb-6">Our Values</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-semibold text-primary-600 mb-2">Innovation First</h4>
                  <p className="text-black">We constantly push the boundaries of what's possible with AI and document processing.</p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-primary-600 mb-2">Customer Success</h4>
                  <p className="text-black">Your success is our success. We're committed to providing exceptional support and solutions.</p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-primary-600 mb-2">Security & Trust</h4>
                  <p className="text-black">We maintain the highest standards of security to protect your sensitive data.</p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-primary-600 mb-2">Continuous Improvement</h4>
                  <p className="text-black">We're always learning and improving to provide better solutions for our customers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}