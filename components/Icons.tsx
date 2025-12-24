
import React from 'react';

interface IconProps {
  className?: string;
  isPast?: boolean;
  size?: number;
}

export const FullDayIcon = ({ className, isPast, size = 20 }: IconProps) => (
  <svg 
    viewBox="0 0 100 100" 
    width={size} 
    height={size} 
    className={`${className} ${isPast ? 'text-gray-300' : 'text-yellow-600'}`}
  >
    {/* Outline Circle */}
    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="4" fill="none" />
    
    {/* Left Half (Night) - Solid Fill */}
    <path d="M50 10 A40 40 0 0 0 50 90 Z" fill="currentColor" />
    
    {/* Crescent Moon in Night Half (White/Light Gray) */}
    <path 
      d="M40 38 A12 12 0 1 0 40 62 A9 9 0 1 1 40 38" 
      fill={isPast ? "#D1D5DB" : "white"} 
    />
    
    {/* Right Half (Day) - Sun Body and Rays */}
    {/* Sun Body (Semi-circle) */}
    <path d="M50 35 A15 15 0 0 1 50 65 Z" fill="currentColor" />
    
    {/* Sun Rays in Day Half */}
    <g stroke="currentColor" strokeWidth="4" strokeLinecap="round">
      <line x1="68" y1="50" x2="82" y2="50" />
      <line x1="63" y1="35" x2="74" y2="24" />
      <line x1="63" y1="65" x2="74" y2="76" />
      <line x1="55" y1="24" x2="58" y2="12" />
      <line x1="55" y1="76" x2="58" y2="88" />
    </g>
  </svg>
);

export const HalfDayMorningIcon = ({ className, isPast, size = 20 }: IconProps) => (
  <svg 
    viewBox="0 0 100 100" 
    width={size} 
    height={size} 
    className={`${className} ${isPast ? 'text-gray-300' : 'text-amber-500'}`}
  >
    {/* Rising Sun Body */}
    <path d="M20 75 A30 30 0 0 1 80 75 Z" fill="currentColor" />
    
    {/* Sun Rays */}
    <g stroke="currentColor" strokeWidth="5" strokeLinecap="round">
      <line x1="50" y1="35" x2="50" y2="15" />
      <line x1="30" y1="45" x2="18" y2="28" />
      <line x1="70" y1="45" x2="82" y2="28" />
      <line x1="15" y1="65" x2="5" y2="60" />
      <line x1="85" y1="65" x2="95" y2="60" />
    </g>
  </svg>
);

export const HalfDayEveningIcon = ({ className, isPast, size = 20 }: IconProps) => (
  <svg 
    viewBox="0 0 100 100" 
    width={size} 
    height={size} 
    className={`${className} ${isPast ? 'text-gray-300' : 'text-indigo-500'}`}
  >
    {/* Solid Crescent Moon */}
    <path 
      d="M70 20 A40 40 0 1 0 70 80 A28 28 0 1 1 70 20" 
      fill="currentColor" 
    />
  </svg>
);
