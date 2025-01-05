import React from 'react';

export function DocumentUnderstanding() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="grid grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="bg-[#2B3B1C] rounded-lg p-8">
            <img 
              src="https://images.unsplash.com/photo-1634733988138-bf2c3a2a13fa?auto=format&fit=crop&q=80&w=600&h=800" 
              alt="Document example" 
              className="w-full rounded shadow-lg"
            />
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-bold mb-6">
            Understands any document
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Upload any document and our AI extracts the data you need. No more analyst or 3rd party data entry.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="text-blue-500 text-2xl">✦</div>
              <span className="text-lg">No Training Required</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-blue-500 text-2xl">✦</div>
              <span className="text-lg">Contextual Intelligence</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}