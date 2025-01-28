import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Shield, Lock, Key, FileCheck } from 'lucide-react';

export function SecurityPage() {
  const securityFeatures = [
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description: "Our platform is built with security-first architecture, ensuring your data is protected at every level."
    },
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "All data is encrypted in transit and at rest using industry-standard AES-256 encryption."
    },
    {
      icon: Key,
      title: "Access Control",
      description: "Granular permission controls and role-based access management for your organization."
    },
    {
      icon: FileCheck,
      title: "Compliance & Certifications",
      description: "SOC 2 Type II certified, GDPR compliant, and regular security audits."
    }
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      
      <main className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">
              Security First, Always
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your data security is our top priority. We implement the highest standards of security measures to protect your sensitive information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="bg-dark-800 rounded-lg p-8 border border-dark-700">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-dark-700 rounded-lg mr-4">
                    <feature.icon className="h-8 w-8 text-primary-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                </div>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-dark-800 rounded-lg p-8 border border-dark-700">
            <h2 className="text-3xl font-bold text-white mb-6">Security Measures</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Infrastructure Security</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• AWS infrastructure with multiple availability zones</li>
                  <li>• Regular security patches and updates</li>
                  <li>• DDoS protection and WAF</li>
                  <li>• 24/7 infrastructure monitoring</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Data Protection</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• AES-256 encryption at rest</li>
                  <li>• TLS 1.3 for data in transit</li>
                  <li>• Regular backup procedures</li>
                  <li>• Data retention policies</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}