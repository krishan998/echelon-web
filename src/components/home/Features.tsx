import React, { useEffect, useRef } from 'react';
import { FileText, FileSpreadsheet, Workflow, Network, Lock, Zap } from 'lucide-react';
import './Features.css';

export function Features() {
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    const features = featuresRef.current?.querySelectorAll('.feature-card-container');
    features?.forEach((feature) => observer.observe(feature));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
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
      title: "Enterprise Security",
      description: [
        "Bank-grade encryption and compliance with global standards",
        "Connect with your existing ERP and accounting systems",
        "No data leaves your infrastructure",
        "SSO integration with your identity provider"
      ],
      icon: Lock
    }
    // {
    //   title: "Enterprise Security",
    //   description: "Bank-grade encryption and compliance with global standards",
    //   icon: Lock
    // },
    // {
    //   title: "Real-time Processing",
    //   description: "Process documents in real-time with instant results",
    //   icon: Zap
    // },
    // {
    //   title: "Format Flexibility",
    //   description: "Export data in any format including Excel, JSON, and XML",
    //   icon: FileSpreadsheet
    // }
  ];

  return (
    <div className="checkered-bg py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={featuresRef}>
        <h2 className="text-3xl font-bold tracking-tight text-black mb-8 text-center animate-fade-up" style={{ fontFamily: 'Share Tech Mono, serif', letterSpacing: '0.02em' }}>
          Powerful Features for Modern Practices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {features.slice(0, 2).map((feature, index) => (
            <div 
              key={index} 
              className="feature-card-container opacity-0 h-64"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                perspective: '1000px'
              }}
            >
              <div className="feature-card relative w-full h-full transition-transform duration-700 transform-style-preserve-3d hover:rotate-y-180">
                {/* Front of card */}
                <div className="absolute w-full h-full bg-light-50 p-8 rounded-lg shadow-sm border border-light-200 backface-hidden flex flex-col items-center justify-center text-center">
                  <div className="p-4 bg-primary-100 rounded-lg mb-6">
                    <feature.icon className="h-10 w-10 text-primary-600" />
                  </div>
                  <h3 className="text-3xl font-semibold text-black mb-2" style={{ fontFamily: 'Share Tech Mono, serif' }}>{feature.title}</h3>
                </div>
                
                {/* Back of card */}
                <div className="absolute w-full h-full bg-primary-600 text-white p-8 rounded-lg shadow-sm border border-primary-500 backface-hidden rotate-y-180 flex flex-col items-center justify-center text-center">
                  <ul className="text-left list-disc pl-5 space-y-2">
                    {feature.description.map((point, i) => (
                      <li key={i} className="text-base font-medium" style={{ fontFamily: 'Share Tech Mono, serif' }}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
          
          {/* Third card centered */}
          {features.length > 2 && (
            <div className="md:col-span-2 flex justify-center">
              <div 
                className="feature-card-container opacity-0 h-64 w-full md:w-1/2"
                style={{ 
                  animationDelay: `0.2s`,
                  perspective: '1000px'
                }}
              >
                <div className="feature-card relative w-full h-full transition-transform duration-700 transform-style-preserve-3d hover:rotate-y-180">
                  {/* Front of card */}
                  <div className="absolute w-full h-full bg-light-50 p-8 rounded-lg shadow-sm border border-light-200 backface-hidden flex flex-col items-center justify-center text-center">
                    <div className="p-4 bg-primary-100 rounded-lg mb-6">
                      {React.createElement(features[2].icon, { className: "h-10 w-10 text-primary-600" })}
                    </div>
                    <h3 className="text-3xl font-semibold text-black mb-2" style={{ fontFamily: 'Share Tech Mono, serif' }}>{features[2].title}</h3>
                  </div>
                  
                  {/* Back of card */}
                  <div className="absolute w-full h-full bg-primary-600 text-white p-8 rounded-lg shadow-sm border border-primary-500 backface-hidden rotate-y-180 flex flex-col items-center justify-center">
                    <ul className="text-left list-disc pl-5 space-y-2">
                      {features[2].description.map((point, i) => (
                        <li key={i} className="text-base font-medium" style={{ fontFamily: 'Share Tech Mono, serif' }}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}