
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { fixImgurUrl } from '@/lib/utils';

// Define a type for a single Pikachu instance
interface PikachuInstance {
  id: number;
  style: React.CSSProperties;
  className: string;
}

const PIKACHU_URL = 'https://imgur.com/mkPuvqH';
const ANIMATION_TYPES = ['bounceIn', 'spin', 'pulse'];

const PikachuAnimation = () => {
  const [pikachus, setPikachus] = useState<PikachuInstance[]>([]);

  // This effect runs once on mount to generate the instances
  useEffect(() => {
    const generatePikachus = () => {
      const newPikachus: PikachuInstance[] = [];
      const numberOfPikachus = 15;

      for (let i = 0; i < numberOfPikachus; i++) {
        const size = Math.random() * 120 + 80; // 80px to 200px
        const duration = Math.random() * 1.5 + 2; // 2s to 3.5s
        const animationType = ANIMATION_TYPES[Math.floor(Math.random() * ANIMATION_TYPES.length)];

        newPikachus.push({
          id: i,
          style: {
            top: `${Math.random() * 80}vh`,
            left: `${Math.random() * 85}vw`,
            width: `${size}px`,
            height: `${size}px`,
            animationDuration: `${duration}s`,
            animationDelay: `${Math.random() * 0.5}s`,
          },
          className: `animate-${animationType}`, // This will be used for specific keyframes if needed
        });
      }
      setPikachus(newPikachus);
    };

    generatePikachus();
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden="true"
    >
      {pikachus.map((pika) => (
        <div key={pika.id} className={cn('pikachu-instance', pika.className)} style={pika.style}>
            <Image 
                src={fixImgurUrl(PIKACHU_URL)} 
                alt="Happy Pikachu with sunglasses" 
                width={200} 
                height={200}
                className={cn('h-full w-full', {
                    'animate-spin': pika.className.includes('spin'),
                    'animate-pulse': pika.className.includes('pulse')
                })}
            />
        </div>
      ))}
    </div>
  );
};

export default PikachuAnimation;
