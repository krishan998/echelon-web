import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-black mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg">
            <div className="bg-light-50 rounded-lg p-8 border border-light-200 mb-8">
              <h2 className="text-2xl font-bold text-black mb-4">Introduction</h2>
              <p className="text-black">
                At Nexbit, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our document processing services.
              </p>
            </div>

            <div className="bg-light-50 rounded-lg p-8 border border-light-200 mb-8">
              <h2 className="text-2xl font-bold text-black mb-4">Information We Collect</h2>
              <ul className="space-y-4 text-black">
                <li>• Account information (name, email, company details)</li>
                <li>• Document content and metadata</li>
                <li>• Usage information and analytics</li>
                <li>• Technical information about your device and connection</li>
              </ul>
            </div>

            <div className="bg-light-50 rounded-lg p-8 border border-light-200 mb-8">
              <h2 className="text-2xl font-bold text-black mb-4">How We Use Your Information</h2>
              <ul className="space-y-4 text-black">
                <li>• Provide and improve our services</li>
                <li>• Process your documents and extract data</li>
                <li>• Communicate with you about our services</li>
                <li>• Ensure security and prevent fraud</li>
                <li>• Comply with legal obligations</li>
              </ul>
            </div>

            <div className="bg-light-50 rounded-lg p-8 border border-light-200 mb-8">
              <h2 className="text-2xl font-bold text-black mb-4">Data Security</h2>
              <p className="text-black">
                We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </div>

            <div className="bg-light-50 rounded-lg p-8 border border-light-200">
              <h2 className="text-2xl font-bold text-black mb-4">Contact Us</h2>
              <p className="text-black">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <a
                href="https://cal.com/shubh.r/nexbit-intro"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
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