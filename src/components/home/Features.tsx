import React, { useState } from 'react';
import { FileText, Workflow, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollAnimation } from '../common/ScrollAnimation';
import './Features.css';

export function Features() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: "01",
      title: "AI-PBC",
      description: [
        "Automate document collection with AI-powered PBC",
        "Centralize requests to reduce follow-ups",
        "Use AI to securely collect and validate documents",
        "Boost sample quality and streamline audits"
      ],
      icon: Workflow,
      color: "from-purple-500/20 to-purple-600/20",
      video: "/videos/pbc.mp4"
    },
    {
      id: "02",
      title: "Analyze",
      description: [
        "Extract information from Financial Statements",
        "Validate information with AI",
        "Run your custom rules",
        "Adapt to new document formats without retraining"
      ],
      icon: FileText,
      color: "from-blue-500/20 to-blue-600/20",
      video: "/videos/analyse.mp4"
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
      icon: Lock,
      color: "from-emerald-500/20 to-emerald-600/20",
      video: "/videos/security.mov"
    }
  ];

  return (
    <div className="features-section" id="features">
      <div className="features-background">
        <motion.div 
          className="feature-shape feature-shape-1"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 15, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="feature-shape feature-shape-2"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -15, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      <div className="features-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation animation="fadeIn" className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-black mb-6" 
              style={{ fontFamily: 'Rubik, sans-serif', letterSpacing: '0.02em', fontSize: '2.5rem' }}>
            Powerful Features for Modern Practices
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience a new way of working with our innovative features designed for modern audit practices.
          </p>
        </ScrollAnimation>
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left side - Interactive List */}
          <div className="w-full md:w-1/2">
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <div
                    className={`cursor-pointer transition-all duration-500 rounded-2xl hover:shadow-lg ${
                      activeFeature === index 
                        ? 'bg-gradient-to-br ' + feature.color + ' scale-[1.02]' 
                        : 'hover:bg-gradient-to-br ' + feature.color + ' hover:scale-[1.02]'
                    }`}
                    onClick={() => setActiveFeature(index)}
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-xl font-mono font-bold text-black/80">
                          {feature.id}
                        </span>
                        <h3 className="text-xl font-semibold text-black">
                          {feature.title}
                        </h3>
                      </div>
                      
                      {/* Expandable content */}
                      <div className={`transition-all duration-500 overflow-hidden ${
                        activeFeature === index ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        <ul className="space-y-3 text-gray-600 ml-12">
                          {feature.description.map((point, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: i * 0.1 }}
                              className="list-disc"
                            >
                              {point}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right side - Video */}
          <motion.div 
            className="w-full md:w-1/2 rounded-2xl overflow-hidden bg-gray-50 mt-[20px]"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="aspect-video w-full h-full relative rounded-2xl overflow-hidden shadow-2xl">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeFeature === index ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                  style={{ display: activeFeature === index ? 'block' : 'none' }}
                >
                  <video 
                    className="w-full h-full object-cover"
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    key={feature.video}
                  >
                    <source src={feature.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}