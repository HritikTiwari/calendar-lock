
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
    
    {/* Diagonal Divider Line */}
    <line x1="20" y1="80" x2="80" y2="20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    
    {/* Top-Left Half: Sun */}
    <g transform="translate(30, 30)">
      <circle cx="0" cy="0" r="12" />
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <line x1="0" y1="-18" x2="0" y2="-24" />
        <line x1="-13" y1="-13" x2="-17" y2="-17" />
        <line x1="-18" y1="0" x2="-24" y2="0" />
        <line x1="-13" y1="13" x2="-17" y2="17" />
      </g>
    </g>
    
    {/* Bottom-Right Half: Moon and Stars */}
    <g transform="translate(65, 65)">
      <path d="M-5 -12 A15 15 0 1 0 12 5 A10 10 0 1 1 -5 -12" />
      {/* Stars */}
      <path d="M12 -8 l1.5 1.5 l1.5 -1.5 l-1.5 -1.5 z" />
      <path d="M18 -2 l1 1 l1 -1 l-1 -1 z" />
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
    
    {/* Rising Sun Body */}
    <path d="M25 70 A25 25 0 0 1 75 70 Z" />
    
    {/* Sun Rays */}
    <g stroke="currentColor" strokeWidth="4" strokeLinecap="round">
      <line x1="50" y1="40" x2="50" y2="25" />
      <line x1="30" y1="50" x2="20" y2="35" />
      <line x1="70" y1="50" x2="80" y2="35" />
      <line x1="20" y1="70" x2="10" y2="70" />
      <line x1="80" y1="70" x2="90" y2="70" />
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
    
    {/* Solid Crescent Moon */}
    <path 
      d="M65 30 A30 30 0 1 0 65 70 A22 22 0 1 1 65 30" 
    />
    
    {/* Optional stars for context */}
    <path d="M35 35 l2 2 l2 -2 l-2 -2 z" />
    <path d="M45 45 l1 1 l1 -1 l-1 -1 z" />
  </svg>
);
