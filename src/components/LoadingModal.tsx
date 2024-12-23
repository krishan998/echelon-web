import React, { useEffect, useState } from 'react';
import './LoadingModal.css';

export function LoadingModal() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + (100 / 31) : 100));
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Document scanning animation */}
        <div className="loading-animation mb-6">
          <div className="document">
            <div className="magnifying-glass"></div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-6 relative overflow-hidden">
          <div
            className="bg-yellow-500 h-4 rounded-full"
            style={{ width: `${progress}%`, transition: 'width 1s linear' }}
          />
        </div>

        {/* Text */}
        <p className="text-lg font-medium text-gray-700 mt-4">
          Extracting data! This may take a minute or two...
        </p>
      </div>
    </div>
  );
}
