import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-black mb-8">Terms of Service</h1>
          
          <div className="space-y-8">
            <div className="bg-light-50 rounded-lg p-8 border border-light-200">
              <h2 className="text-2xl font-bold text-black mb-4">1. Agreement to Terms</h2>
              <p className="text-black">
                By accessing or using Nexbit's services, you agree to be bound by these Terms of Service and all applicable laws and regulations.
              </p>
            </div>

            <div className="bg-light-50 rounded-lg p-8 border border-light-200">
              <h2 className="text-2xl font-bold text-black mb-4">2. Description of Service</h2>
              <p className="text-black mb-4">
                Nexbit provides an AI-powered document processing platform that includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>Document data extraction</li>
                <li>Document processing automation</li>
                <li>API access</li>
                <li>Analytics and reporting</li>
              </ul>
            </div>

            <div className="bg-light-50 rounded-lg p-8 border border-light-200">
              <h2 className="text-2xl font-bold text-black mb-4">3. User Responsibilities</h2>
              <p className="text-black mb-4">You agree to:</p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>Provide accurate information</li>
                <li>Maintain the security of your account</li>
                <li>Comply with all applicable laws</li>
                <li>Not misuse or abuse the service</li>
              </ul>
            </div>

            <div className="bg-light-50 rounded-lg p-8 border border-light-200">
              <h2 className="text-2xl font-bold text-black mb-4">4. Intellectual Property</h2>
              <p className="text-black">
                All content and technology provided by Nexbit is protected by intellectual property laws. Users retain ownership of their data and documents.
              </p>
            </div>

            <div className="bg-light-50 rounded-lg p-8 border border-light-200">
              <h2 className="text-2xl font-bold text-black mb-4">5. Contact</h2>
              <p className="text-black mb-4">
                For any questions about these Terms of Service, please contact us:
              </p>
              <a
                href="https://cal.com/shubh.r/nexbit-intro"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}