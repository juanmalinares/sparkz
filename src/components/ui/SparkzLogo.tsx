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
  fill = '#6E6BF0',
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
    <rect x="4" y="4" width="92" height="92" rx="14" fill={fill}/>
    <polygon points="4,22 63,42 4,62" fill="#14161A"/>
    <polygon points="96,38 37,58 96,78" fill="#14161A"/>
  </svg>
);
