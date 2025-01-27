import React from 'react';

export function DocumentUnderstanding() {
  return (
    <div className="bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-4xl font-bold text-center mb-16 text-blue-900">
          Transform How You Handle Documents
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="aspect-video mb-6 overflow-hidden rounded-lg bg-blue-100">
              <img 
                src="https://cdn.prod.website-files.com/5aa7081220a301f2a3644f3b/60a43b7699c64c1c6e19e476_shutterstock_122573227.jpg" 
                alt="AI document scanning"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">Intelligent Data Extraction</h3>
            <p className="text-gray-600">Our AI automatically identifies and extracts key information from any document format.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="aspect-video mb-6 overflow-hidden rounded-lg bg-blue-100">
              <img 
                src="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=800&h=600" 
                alt="Data processing visualization"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">Real-time Processing</h3>
            <p className="text-gray-600">Process thousands of documents simultaneously with our powerful cloud infrastructure.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="aspect-video mb-6 overflow-hidden rounded-lg bg-blue-100">
              <img 
                src="https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&q=80&w=800&h=600" 
                alt="Automated workflow"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">Automated Workflows</h3>
            <p className="text-gray-600">Build custom workflows that automatically route and process documents based on your rules.</p>
          </div>
        </div>

        <div className="bg-blue-900 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">
                Advanced Document Processing
              </h3>
              <p className="text-xl text-blue-100 mb-8">
                Our AI-powered platform handles complex documents with ease, providing accurate data extraction for any business need.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-blue-300 text-2xl">✦</div>
                  <span className="text-lg text-blue-50">Intelligent Layout Analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-blue-300 text-2xl">✦</div>
                  <span className="text-lg text-blue-50">Multi-Language Support</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-blue-300 text-2xl">✦</div>
                  <span className="text-lg text-blue-50">99.9% Accuracy Rate</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://cdn.prod.website-files.com/64be86eaa29fa71f24b00661/64be86eaa29fa71f24b00b59_energy%20and%20utility.webp" 
                alt="Advanced document processing"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}