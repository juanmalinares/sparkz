'use client';

import { useState, useEffect } from 'react';

// Define a type for a single snowflake instance
interface SnowflakeInstance {
  id: number;
  style: React.CSSProperties;
}

const IncorrectAnswerAnimation = () => {
  const [snowflakes, setSnowflakes] = useState<SnowflakeInstance[]>([]);

  // This effect runs once on mount to generate the snowflake instances
  useEffect(() => {
    const generateSnowflakes = () => {
      const newSnowflakes: SnowflakeInstance[] = [];
      const numberOfSnowflakes = 15;

      for (let i = 0; i < numberOfSnowflakes; i++) {
        const size = Math.random() * 80 + 20; // 20px to 100px
        const duration = Math.random() * 2 + 3; // 3s to 5s for dissolve
        
        newSnowflakes.push({
          id: i,
          style: {
            top: `${Math.random() * 85}vh`,
            left: `${Math.random() * 85}vw`,
            width: `${size}px`,
            height: `${size}px`,
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${duration}s`, // This will be used by the dissolve animation
          },
        });
      }
      setSnowflakes(newSnowflakes);
    };

    generateSnowflakes();
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden="true"
    >
      {snowflakes.map((flake) => (
         <div key={flake.id} className="snowflake-wrapper" style={flake.style}>
             <svg
                id="snowflake"
                width="100%"
                height="100%"
                viewBox="0 0 96 96"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g strokeLinecap="round" strokeWidth="8">
                  <line x1="48" y1="12" x2="48" y2="84" stroke="#E6F7FF" />
                  <line x1="12" y1="48" x2="84" y2="48" stroke="#B3E6FF" />
                  <line x1="22" y1="22" x2="74" y2="74" stroke="#8FD0FA" />
                  <line x1="74" y1="22" x2="22" y2="74" stroke="#B6E2FB" />
                  <line x1="48" y1="24" x2="44" y2="16" stroke="#D4F1FE" />
                  <line x1="48" y1="24" x2="52" y2="16" stroke="#C3EDFF" />
                  <line x1="48" y1="72" x2="44" y2="80" stroke="#D4F1FE" />
                  <line x1="48" y1="72" x2="52" y2="80" stroke="#C3EDFF" />
                  <line x1="24" y1="48" x2="16" y2="44" stroke="#C1E8FB" />
                  <line x1="24" y1="48" x2="16" y2="52" stroke="#A6DAF8" />
                  <line x1="72" y1="48" x2="80" y2="44" stroke="#C1E8FB" />
                  <line x1="72" y1="48" x2="80" y2="52" stroke="#A6DAF8" />
                </g>
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="rotate"
                  from="0 48 48"
                  to="360 48 48"
                  dur="4s"
                  repeatCount="indefinite"
                />
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="scale"
                  values="1;1.08;1"
                  keyTimes="0;0.5;1"
                  dur="2s"
                  repeatCount="indefinite"
                  additive="sum"
                />
              </svg>
         </div>
      ))}
    </div>
  );
};

export default IncorrectAnswerAnimation;
