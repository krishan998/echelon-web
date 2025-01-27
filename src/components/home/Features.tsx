import React from 'react';
import { FileText, FileSpreadsheet, Workflow, Network, Lock, Zap } from 'lucide-react';

export function Features() {
  const features = [
    {
      title: "Smart Data Extraction",
      description: "Extract data from any document type with high accuracy",
      icon: FileText
    },
    {
      title: "Custom Workflows",
      description: "Build automated workflows with human-in-the-loop verification",
      icon: Workflow
    },
    {
      title: "Direct Integration",
      description: "Connect directly with your existing systems and databases",
      icon: Network
    },
    {
      title: "Enterprise Security",
      description: "Bank-grade encryption and compliance with global standards",
      icon: Lock
    },
    {
      title: "Real-time Processing",
      description: "Process documents in real-time with instant results",
      icon: Zap
    },
    {
      title: "Format Flexibility",
      description: "Export data in any format including Excel, JSON, and XML",
      icon: FileSpreadsheet
    }
  ];

  return (
    <div className="bg-blue-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Powerful Features for Modern Businesses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-blue-800 p-6 rounded-lg shadow-lg border border-blue-700 hover:bg-blue-700 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-blue-900 rounded-lg">
                  <feature.icon className="h-6 w-6 text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              </div>
              <p className="text-blue-100">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}