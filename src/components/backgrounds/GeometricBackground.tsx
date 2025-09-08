import React from 'react';
import { motion } from 'framer-motion';

export function GeometricBackground() {
  const shapes = [
    { size: 120, x: 10, y: 20, color: 'from-gray-400/20 to-black/20', delay: 0 },
    { size: 80, x: 85, y: 15, color: 'from-gray-300/20 to-gray-600/20', delay: 0.5 },
    { size: 60, x: 20, y: 70, color: 'from-black/20 to-gray-500/20', delay: 1 },
    { size: 100, x: 75, y: 60, color: 'from-gray-200/20 to-gray-400/20', delay: 1.5 },
    { size: 90, x: 50, y: 40, color: 'from-gray-400/20 to-black/20', delay: 2 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute w-${shape.size} h-${shape.size} bg-gradient-to-br ${shape.color} rounded-full blur-xl`}
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            delay: shape.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Floating Lines */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute w-px h-32 bg-gradient-to-b from-black/30 to-transparent"
          style={{
            left: `${20 + i * 20}%`,
            top: `${30 + i * 10}%`,
          }}
          animate={{
            height: [32, 64, 32],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 6,
            delay: i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
