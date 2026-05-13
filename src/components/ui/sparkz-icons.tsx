import React from 'react';
import { cn } from '@/lib/utils';

export interface SparkzIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

// Glyph: Palm (Arc/Branch)
export const IconPalm = ({ className, size = 24, color = 'currentColor', ...props }: SparkzIconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={cn(className)} {...props}>
    <path d="M50 12 C 30 30 22 50 18 78 L 30 78 C 34 56 40 42 50 30 Z M50 12 C 50 32 50 56 50 80 M50 12 C 70 30 78 50 82 78" stroke={color} fill="none" strokeWidth="8" />
  </svg>
);

// Glyph: Quatrefoil (Mathematical/Logic)
export const IconQuatrefoil = ({ className, size = 24, color = 'currentColor', ...props }: SparkzIconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={cn(className)} {...props}>
    <g fill={color}>
      <rect x="38" y="38" width="24" height="24"/>
      <circle cx="50" cy="22" r="14"/>
      <circle cx="50" cy="78" r="14"/>
      <circle cx="22" cy="50" r="14"/>
      <circle cx="78" cy="50" r="14"/>
    </g>
  </svg>
);

// Glyph: Bolt (Challenge/Energy)
export const IconBolt = ({ className, size = 24, color = 'currentColor', ...props }: SparkzIconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={cn(className)} {...props}>
    <polygon points="58,10 22,52 44,52 38,90 76,46 54,46 60,10" fill={color}/>
  </svg>
);

// Glyph: Starburst (Science/Discovery)
export const IconStarburst = ({ className, size = 24, color = 'currentColor', ...props }: SparkzIconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={cn(className)} {...props}>
    <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M22 78 L78 22" stroke={color} strokeWidth="6" />
  </svg>
);

// Glyph: Arch (Reading/Gateway)
export const IconArch = ({ className, size = 24, color = 'currentColor', ...props }: SparkzIconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={cn(className)} {...props}>
    <path d="M14 90 L 14 50 A 36 36 0 0 1 86 50 L 86 90 L 70 90 L 70 60 A 20 20 0 0 0 30 60 L 30 90 Z" fill={color}/>
  </svg>
);

// Glyph: Sparkle (Music/Magic)
export const IconSparkle = ({ className, size = 24, color = 'currentColor', ...props }: SparkzIconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={cn(className)} {...props}>
    <polygon points="50,8 56,44 92,50 56,56 50,92 44,56 8,50 44,44" fill={color}/>
  </svg>
);

// Glyph: Disc (Logic/Order)
export const IconDisc = ({ className, size = 24, color = 'currentColor', ...props }: SparkzIconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={cn(className)} {...props}>
    <g>
      <circle cx="50" cy="50" r="40" fill={color}/>
      <line x1="22" y1="78" x2="78" y2="22" stroke="#0D2318" strokeWidth="6"/>
    </g>
  </svg>
);

// --- Legacy/App Mappings ---

export const IconHome = ({ className, ...props }: SparkzIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="square"
    strokeLinejoin="miter"
    className={cn('w-6 h-6', className)}
    {...props}
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const IconLearn = IconArch; // Reading/Learning map to Arch
export const IconChallenge = IconBolt; // Challenge map to Bolt
export const IconRewards = IconSparkle; // Rewards map to Sparkle
export const IconProfile = ({ className, ...props }: SparkzIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="square"
    strokeLinejoin="miter"
    className={cn('w-6 h-6', className)}
    {...props}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const IconDiamond = IconQuatrefoil; // Generic diamond map to Quatrefoil
export const IconSquare = ({ className, ...props }: SparkzIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="square"
    strokeLinejoin="miter"
    className={cn('w-6 h-6', className)}
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="0" ry="0" />
  </svg>
);

export const IconCircle = IconDisc;
export const IconTriangle = IconBolt;
