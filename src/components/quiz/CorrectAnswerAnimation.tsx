'use client';

import { useState, useEffect } from 'react';

// Define a type for a single fire instance
interface FireInstance {
  id: number;
  style: React.CSSProperties;
}

const CorrectAnswerAnimation = () => {
  const [fires, setFires] = useState<FireInstance[]>([]);

  // This effect runs once on mount to generate the fire instances
  useEffect(() => {
    const generateFires = () => {
      const newFires: FireInstance[] = [];
      const numberOfFires = 15; // Increased number of fires for a fuller effect

      for (let i = 0; i < numberOfFires; i++) {
        const size = Math.random() * 120 + 50; // Generate bigger sizes: 50px to 170px
        newFires.push({
          id: i,
          style: {
            // Position randomly on screen
            top: `${Math.random() * 80}vh`,
            left: `${Math.random() * 80}vw`,
            // Set random size
            width: `${size}px`,
            height: `${size}px`,
            // Slower, more varied animation duration
            animationDuration: `${Math.random() * 2 + 2.5}s`, // Duration between 2.5s and 4.5s
            // Add random animation delays
            animationDelay: `${Math.random() * 1}s`,
             // Apply varied max opacity for each instance
            opacity: Math.random() * 0.6 + 0.4, // Opacity between 0.4 and 1.0
          },
        });
      }
      setFires(newFires);
    };

    generateFires();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden="true"
    >
      {fires.map((fire) => (
        <div key={fire.id} className="fire" style={fire.style}>
          <div className="fire-left">
            <div className="main-fire"></div>
            <div className="particle-fire"></div>
          </div>
          <div className="fire-center">
            <div className="main-fire"></div>
            <div className="particle-fire"></div>
          </div>
          <div className="fire-right">
            <div className="main-fire"></div>
            <div className="particle-fire"></div>
          </div>
          <div className="fire-bottom">
            <div className="main-fire"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CorrectAnswerAnimation;
