import React from 'react';

export function LoadingModal() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center">
          <div className="loading-spinner mb-4">
            <div className="spinner-circle"></div>
            <div className="spinner-circle-small"></div>
          </div>
          <p className="text-xl font-medium text-center">
            Extracting data! This may take a minute or two...
          </p>
        </div>
      </div>
    </div>
  );
}