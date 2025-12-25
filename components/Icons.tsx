
import React from 'react';

interface IconProps {
  className?: string;
  isPast?: boolean;
  size?: number;
}

// Unified color scheme: Theme Yellow for active, Gray for past.
const getIconColor = (isPast?: boolean) => isPast ? 'text-gray-300' : 'text-yellow-600';

export const FullDayIcon = ({ className, isPast, size = 20 }: IconProps) => (
  <svg 
    viewBox="0 0 100 100" 
    width={size} 
    height={size} 
    className={`${className} ${getIconColor(isPast)}`}
    fill="currentColor"
  >
    {/* Background Shape: Rounded Square */}
    <rect x="5" y="5" width="90" height="90" rx="20" fill="currentColor" fillOpacity="0.1" />
    
    {/* Diagonal Divider Line - Bolder */}
    <line x1="15" y1="85" x2="85" y2="15" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    
    {/* Top-Left Half: Sun - Bolder elements */}
    <g transform="translate(32, 32)">
      <circle cx="0" cy="0" r="14" />
      <g stroke="currentColor" strokeWidth="5" strokeLinecap="round">
        <line x1="0" y1="-22" x2="0" y2="-28" />
        <line x1="-15" y1="-15" x2="-20" y2="-20" />
        <line x1="-22" y1="0" x2="-28" y2="0" />
        <line x1="-15" y1="15" x2="-20" y2="20" />
      </g>
    </g>
    
    {/* Bottom-Right Half: Moon and Stars - Bolder elements */}
    <g transform="translate(68, 68)">
      <path d="M-6 -14 A18 18 0 1 0 14 6 A12 12 0 1 1 -6 -14" />
      {/* Stars - Bolder */}
      <path d="M14 -10 l2.5 2.5 l2.5 -2.5 l-2.5 -2.5 z" />
      <path d="M22 -2 l1.5 1.5 l1.5 -1.5 l-1.5 -1.5 z" />
    </g>
  </svg>
);

export const HalfDayMorningIcon = ({ className, isPast, size = 20 }: IconProps) => (
  <svg 
    viewBox="0 0 100 100" 
    width={size} 
    height={size} 
    className={`${className} ${getIconColor(isPast)}`}
    fill="currentColor"
  >
    {/* Background Shape: Rounded Square */}
    <rect x="5" y="5" width="90" height="90" rx="20" fill="currentColor" fillOpacity="0.1" />
    
    {/* Rising Sun Body - More prominent */}
    <path d="M20 72 A30 30 0 0 1 80 72 Z" />
    
    {/* Sun Rays - Bolder */}
    <g stroke="currentColor" strokeWidth="6" strokeLinecap="round">
      <line x1="50" y1="42" x2="50" y2="22" />
      <line x1="28" y1="52" x2="16" y2="35" />
      <line x1="72" y1="52" x2="84" y2="35" />
      <line x1="18" y1="72" x2="6" y2="72" />
      <line x1="82" y1="72" x2="94" y2="72" />
    </g>
  </svg>
);

export const HalfDayEveningIcon = ({ className, isPast, size = 20 }: IconProps) => (
  <svg 
    viewBox="0 0 100 100" 
    width={size} 
    height={size} 
    className={`${className} ${getIconColor(isPast)}`}
    fill="currentColor"
  >
    {/* Background Shape: Rounded Square */}
    <rect x="5" y="5" width="90" height="90" rx="20" fill="currentColor" fillOpacity="0.1" />
    
    {/* Solid Crescent Moon - Bolder/Thicker */}
    <path 
      d="M70 30 A35 35 0 1 0 70 70 A25 25 0 1 1 70 30" 
    />
    
    {/* Optional stars for context - Bolder */}
    <path d="M30 30 l3 3 l3 -3 l-3 -3 z" />
    <path d="M42 42 l2 2 l2 -2 l-2 -2 z" />
  </svg>
);
