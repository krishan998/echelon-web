import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Shield, Lock, FileCheck, AlertCircle } from 'lucide-react';

export function CompliancePage() {
  const certifications = [
    {
      icon: Shield,
      title: "SOC 2 Type II",
      description: "Certified compliance with SOC 2 Type II security and availability principles."
    },
    {
      icon: Lock,
      title: "GDPR Compliance",
      description: "Full compliance with EU General Data Protection Regulation requirements."
    },
    {
      icon: FileCheck,
      title: "ISO 27001",
      description: "Certified information security management system (ISMS)."
    },
    {
      icon: AlertCircle,
      title: "HIPAA Compliance",
      description: "Compliant with healthcare data protection requirements."
    }
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      
      <main className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">
              Compliance & Certifications
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We maintain the highest standards of security and compliance to protect your data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-dark-800 rounded-lg p-8 border border-dark-700">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-dark-700 rounded-lg mr-4">
                    <cert.icon className="h-8 w-8 text-primary-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{cert.title}</h3>
                </div>
                <p className="text-gray-300">{cert.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-dark-800 rounded-lg p-8 border border-dark-700 mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">Compliance Framework</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Data Protection</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>• End-to-end encryption</li>
                  <li>• Regular security audits</li>
                  <li>• Access control policies</li>
                  <li>• Data retention policies</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Security Measures</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>• Multi-factor authentication</li>
                  <li>• Regular penetration testing</li>
                  <li>• Incident response plan</li>
                  <li>• Employee security training</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Need More Information?</h2>
            <p className="text-gray-300 mb-8">
              Contact us to learn more about our compliance standards and security measures.
            </p>
            <a
              href="https://cal.com/shubh. Continuing the CompliancePage.tsx file content from where it left off:

r/discuss"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 border border-primary-400 text-base font-medium rounded-md text-primary-400 hover:bg-dark-800 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}