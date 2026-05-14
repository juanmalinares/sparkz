import React from 'react';
import { cn } from '@/lib/utils';

export interface SparkzLogoProps extends React.SVGProps<SVGSVGElement> {
  fill?: string;
  size?: number;
}

/**
 * SparkzMark - The official Sparkz logo component.
 * Bauhaus-inspired design with two polygons and a square base.
 */
export const SparkzLogo = ({ 
  fill = '#E5311D', 
  size = 40, 
  className,
  ...props 
}: SparkzLogoProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    className={cn('block', className)}
    {...props}
  >
    <rect x="4" y="4" width="92" height="92" rx="0" fill={fill}/>
    <polygon points="4,22 63,42 4,62" fill="#0D2318"/>
    <polygon points="96,38 37,58 96,78" fill="#0D2318"/>
  </svg>
);
