import React from 'react';

export function LoadingModal() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 mb-4">
              <div className="absolute w-full h-full">
                <div className="w-12 h-12 rounded-full absolute 
                  bg-coral-500 top-0 left-0 animate-orbit-1"></div>
                <div className="w-8 h-8 rounded-full absolute 
                  bg-coral-300 top-4 right-0 animate-orbit-2"></div>
              </div>
            </div>
          </div>
          <p className="text-xl font-medium text-center">
            Extracting data! This may take a minute or two...
          </p>
        </div>
      </div>
    </div>
  );
}