import React from 'react';
import { cn } from '@/lib/utils';

interface GeometricFieldProps {
  variant?: 'light' | 'dark';
  density?: 'low' | 'medium' | 'high';
  className?: string;
  animate?: boolean;
}

export function GeometricField({
  variant = 'dark',
  density = 'medium',
  className,
  animate = true,
}: GeometricFieldProps) {
  // Opacity adjustments based on variant
  const opacityBase = variant === 'dark' ? 0.15 : 0.08;
  const gridColor = variant === 'dark' ? 'var(--electric)' : 'var(--forest)';
  
  // Decide how many shapes to render based on density
  const shapeCount = density === 'low' ? 3 : density === 'medium' ? 5 : 8;

  return (
    <div className={cn('geo-field absolute inset-0 pointer-events-none overflow-hidden', className)}>
      {/* Bauhaus Grid Pattern */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ 
          opacity: opacityBase * 0.5,
          backgroundImage: `radial-gradient(circle, ${gridColor} 2px, transparent 2px)`,
          backgroundSize: '40px 40px'
        }} 
      />

      <svg
        className="w-full h-full absolute inset-0 z-10"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 100 100"
      >
        <g className={cn(animate && 'animate-geo-drift-slow')}>
          {/* Cobalt Circle (Dynamic) */}
          <circle
            cx="80"
            cy="20"
            r="30"
            fill="var(--primary)"
            opacity={opacityBase}
            className={cn(animate && 'animate-geo-drift')}
            style={{ animationDelay: '0s' }}
          />

          {/* Vermillion Triangle (Direction) */}
          <polygon
            points="10,80 40,30 70,80"
            fill="var(--destructive)"
            opacity={opacityBase}
            className={cn(animate && 'animate-geo-drift')}
            style={{ animationDelay: '-2s' }}
          />

          {/* Amber Square (Stability) */}
          <rect
            x="20"
            y="60"
            width="40"
            height="40"
            fill="var(--accent)"
            opacity={opacityBase}
            className={cn(animate && 'animate-geo-drift')}
            style={{ animationDelay: '-4s', transformOrigin: '40px 80px', transform: 'rotate(15deg)' }}
          />

          {shapeCount > 3 && (
            <>
              {/* Secondary Cobalt Triangle */}
              <polygon
                points="80,90 95,60 110,90"
                fill="var(--primary)"
                opacity={opacityBase * 0.8}
                className={cn(animate && 'animate-geo-drift')}
                style={{ animationDelay: '-1s' }}
              />
              {/* Secondary Amber Circle */}
              <circle
                cx="-10"
                cy="40"
                r="20"
                fill="var(--accent)"
                opacity={opacityBase * 0.8}
                className={cn(animate && 'animate-geo-drift')}
                style={{ animationDelay: '-5s' }}
              />
            </>
          )}

          {shapeCount > 5 && (
            <>
               {/* Tertiary Vermillion Rect */}
               <rect
                x="60"
                y="-10"
                width="25"
                height="60"
                fill="var(--destructive)"
                opacity={opacityBase * 0.5}
                className={cn(animate && 'animate-geo-drift')}
                style={{ animationDelay: '-3s', transformOrigin: '72px 20px', transform: 'rotate(-25deg)' }}
              />
               {/* Tertiary Teal Circle (Correct/Science vibe) */}
               <circle
                cx="40"
                cy="110"
                r="35"
                fill="var(--chart-1)"
                opacity={opacityBase * 0.6}
                className={cn(animate && 'animate-geo-drift')}
                style={{ animationDelay: '-6s' }}
              />
               {/* Tertiary Cobalt Square */}
               <rect
                x="90"
                y="100"
                width="15"
                height="15"
                fill="var(--primary)"
                opacity={opacityBase}
                className={cn(animate && 'animate-geo-drift')}
                style={{ animationDelay: '-7s', transformOrigin: '97px 107px', transform: 'rotate(45deg)' }}
              />
            </>
          )}
        </g>
      </svg>
    </div>
  );
}
