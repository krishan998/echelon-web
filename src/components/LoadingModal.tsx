import React, { useState, useEffect } from 'react';
import './LoadingModal.css';

export function LoadingModal() {
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Extracting data!</h2>
        <p className="timer-text">Time remaining: {timeLeft}s</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(30 - timeLeft) / 30 * 100}%` }}></div>
        </div>
      </div>
    </div>
  );
}