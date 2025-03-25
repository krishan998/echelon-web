import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export function AboutPage() {
  return (
    <div className="min-h-screen checkered-bg">
      <Navbar />
      
      <main className="py-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="text-center mb-20">
            <h1 className="text-6xl font-extrabold text-gray-900 mb-6">
              About Nexbit
            </h1>
            <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Automating document processing with AI, making workflows faster, smarter, and more efficient.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Nexbit AI was founded in 2024 with a simple goal: to eliminate the inefficiencies of manual document processing. We saw businesses struggling with paperwork, spending hours on tasks that should take seconds. So, we built a solution that streamlines the process, giving businesses the power to extract insights and automate actions effortlessly.
              </p>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">What We Do</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Nexbit uses cutting-edge AI to analyze, extract, and process documents instantly. Whether it’s invoices, insurance claims, or contracts, our platform handles it all. Reducing errors, saving costs, and letting teams focus on what truly matters.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}