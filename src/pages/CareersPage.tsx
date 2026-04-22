import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export function CareersPage() {
  const openings = [
    {
      title: "Senior Machine Learning Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "Full Stack Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "Technical Support Engineer",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time"
    }
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      
      <main className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">
              Join Our Team
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Help us revolutionize document processing and build the future of intelligent automation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-dark-800 rounded-lg p-8 border border-dark-700">
              <h3 className="text-2xl font-bold text-white mb-4">Innovation</h3>
              <p className="text-gray-300">
                Work on cutting-edge AI technology and solve complex challenges in document processing.
              </p>
            </div>
            <div className="bg-dark-800 rounded-lg p-8 border border-dark-700">
              <h3 className="text-2xl font-bold text-white mb-4">Growth</h3>
              <p className="text-gray-300">
                Continuous learning opportunities and career development in a rapidly growing company.
              </p>
            </div>
            <div className="bg-dark-800 rounded-lg p-8 border border-dark-700">
              <h3 className="text-2xl font-bold text-white mb-4">Impact</h3>
              <p className="text-gray-300">
                Make a real difference by helping businesses transform their document processing workflows.
              </p>
            </div>
          </div>

          <div className="bg-dark-800 rounded-lg p-8 border border-dark-700 mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">Open Positions</h2>
            <div className="space-y-6">
              {openings.map((job, index) => (
                <div key={index} className="border-b border-dark-600 last:border-0 pb-6 last:pb-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-gray-300">
                        <span>{job.department}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.type}</span>
                      </div>
                    </div>
                    <a
                      href="https://cal.com/shubh.r/nexbit-intro"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 md:mt-0 inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-dark-900 bg-primary-400 hover:bg-primary-500 transition-colors"
                    >
                      Apply Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Don't see a perfect fit?</h2>
            <p className="text-gray-300 mb-8">
              We're always looking for talented people to join our team. Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <a
              href="https://cal.com/shubh.r/nexbit-intro"
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