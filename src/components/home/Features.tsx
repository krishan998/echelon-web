import React, { useState } from 'react';
import { FileText, Workflow, Lock } from 'lucide-react';
import './Features.css';

export function Features() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: "01",
      title: "Analyze",
      description: [
        "Extract information from Financial Statements",
        "Validate information with AI",
        "Run your custom rules",
        "Adapt to new document formats without retraining"
      ],
      icon: FileText
    },
    {
      id: "02",
      title: "Automate",
      description: [
        "Automate Data Matching",
        "Automate Request for Client Data",
        "Centralise All Client Documents",
        "Integrate human review where needed for accuracy"
      ],
      icon: Workflow
    },
    {
      id: "03",
      title: "Security",
      description: [
        "Bank-grade encryption and compliance with global standards",
        "Connect with your existing ERP and accounting systems",
        "No data leaves your infrastructure",
        "SSO integration with your identity provider"
      ],
      icon: Lock
    }
  ];

  return (
    <div className="relative bg-white -mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold tracking-tight text-black mb-16 text-center" 
            style={{ fontFamily: 'Rubik, sans-serif', letterSpacing: '0.02em', fontSize: '2.5rem' }}>
          Powerful Features for Modern Practices
        </h2>
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left side - Interactive List */}
          <div className="w-full md:w-1/2">
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className={`cursor-pointer transition-all duration-300 rounded-2xl ${
                    activeFeature === index ? 'bg-[#D4E7EC60]' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-xl font-mono font-bold text-black">
                        {feature.id}
                      </span>
                      <h3 className="text-xl font-semibold" style={{ fontFamily: 'Share Tech Mono, serif' }}>
                        {feature.title}
                      </h3>
                    </div>
                    
                    {/* Expandable content */}
                    <div className={`transition-all duration-300 overflow-hidden ${
                      activeFeature === index ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <ul className="space-y-3 text-gray-600 ml-12">
                        {feature.description.map((point, i) => (
                          <li key={i} className="list-disc">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Video */}
          <div className="w-full md:w-1/2 rounded-2xl overflow-hidden">
            <video 
              className="w-full h-full object-cover"
              autoPlay 
              loop 
              muted 
              playsInline
              style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.05))' }}
            >
              <source src="/videos/features-demo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}