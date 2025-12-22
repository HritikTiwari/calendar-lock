
import React from 'react';
import { Sun, Moon, Sunrise } from 'lucide-react';

interface IconProps {
  className?: string;
  isPast?: boolean;
  size?: number;
}

export const FullDayIcon = ({ className, isPast, size = 20 }: IconProps) => (
  <Sun 
    className={`${className} ${isPast ? 'text-gray-300' : 'text-yellow-500'}`} 
    fill={isPast ? "currentColor" : "#EAB308"} 
    size={size} 
  />
);

export const HalfDayMorningIcon = ({ className, isPast, size = 20 }: IconProps) => (
  <Sunrise 
    className={`${className} ${isPast ? 'text-gray-300' : 'text-amber-500'}`} 
    size={size} 
  />
);

export const HalfDayEveningIcon = ({ className, isPast, size = 20 }: IconProps) => (
  <Moon 
    className={`${className} ${isPast ? 'text-gray-300' : 'text-indigo-400'}`} 
    fill={isPast ? "currentColor" : "#818CF8"} 
    size={size} 
  />
);
