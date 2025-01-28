import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { FileText, Database, Shield, Zap, Workflow, Network } from 'lucide-react';

export function FeaturesPage() {
  const features = [
    {
      icon: FileText,
      title: "Intelligent Document Processing",
      description: "Our AI-powered OCR technology accurately extracts data from any document format with 99.9% accuracy. Support for invoices, receipts, forms, and more.",
      details: ["Multi-language support", "Template-free processing", "Automatic field detection"]
    },
    {
      icon: Database,
      title: "Flexible Data Export",
      description: "Export extracted data in multiple formats to integrate seamlessly with your existing systems and workflows.",
      details: ["JSON/XML/CSV exports", "API integration", "Custom mapping support"]
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security measures ensure your sensitive documents and data remain protected at all times.",
      details: ["End-to-end encryption", "SOC 2 compliance", "Access controls"]
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Process thousands of documents simultaneously with near-instant results and automatic validation.",
      details: ["Parallel processing", "Auto-scaling", "Real-time validation"]
    },
    {
      icon: Workflow,
      title: "Custom Workflows",
      description: "Build automated document processing workflows with conditional logic and human-in-the-loop verification.",
      details: ["Visual workflow builder", "Custom rules engine", "Approval workflows"]
    },
    {
      icon: Network,
      title: "System Integration",
      description: "Connect directly with your existing systems including ERP, CRM, and accounting software.",
      details: ["REST API", "Webhook support", "Pre-built connectors"]
    }
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      
      <main className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">
              Powerful Features for Modern Businesses
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Transform your document processing with our comprehensive suite of intelligent features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-dark-800 rounded-lg p-8 border border-dark-700">
                <div className="inline-block p-3 bg-dark-700 rounded-lg mb-6">
                  <feature.icon className="h-8 w-8 text-primary-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-gray-400">
                      <span className="mr-2 text-primary-400">•</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}