
import { format } from 'date-fns';

// Using native Date logic because isBefore and startOfDay are missing in date-fns export
export const isDateInPast = (date: Date): boolean => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return d.getTime() < now.getTime();
};

export const getEventKey = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const generateId = () => Math.random().toString(36).substr(2, 9);