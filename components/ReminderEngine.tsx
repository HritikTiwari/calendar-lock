
import React, { useEffect, useState } from 'react';
import { Bell, X, CalendarClock } from 'lucide-react';
import { EventBlock } from '../types';
import { format, addDays, subDays, differenceInCalendarDays } from 'date-fns';

interface ReminderEngineProps {
  events: EventBlock[];
}

const ReminderEngine: React.FC<ReminderEngineProps> = ({ events }) => {
  const [activeReminders, setActiveReminders] = useState<{ id: string; message: string; sub: string; type: string }[]>([]);

  useEffect(() => {
    const checkReminders = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const notifications: { id: string; message: string; sub: string; type: string }[] = [];

      events.forEach(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        
        const daysUntil = differenceInCalendarDays(eventDate, today);

        // 1. Event is Today
        if (daysUntil === 0) {
          notifications.push({
            id: `${event.id}-today`,
            message: `Event TODAY: ${event.name}`,
            sub: `Don't forget your shoot scheduled for today.`,
            type: 'URGENT'
          });
        }
        
        // 2. Reminder 1: 1 Day Before (Default)
        if (daysUntil === 1) {
          notifications.push({
            id: `${event.id}-1day`,
            message: `1 Day Reminder: ${event.name}`,
            sub: `Event is tomorrow. Double check your gear and team.`,
            type: 'DEFAULT'
          });
        }

        // 3. Reminder 2: 3 Days Before (Default)
        if (daysUntil === 3) {
          notifications.push({
            id: `${event.id}-3days`,
            message: `3 Day Reminder: ${event.name}`,
            sub: `Shoot coming up in 3 days. Confirm client details.`,
            type: 'DEFAULT'
          });
        }

        // 4. Reminder 3: Custom X Days Before (User Defined)
        if (event.customReminderDays && daysUntil === event.customReminderDays) {
          // Prevent overlapping with 1 or 3 day defaults if user set custom to 1 or 3
          if (daysUntil !== 1 && daysUntil !== 3) {
            notifications.push({
              id: `${event.id}-custom`,
              message: `${event.customReminderDays} Days Reminder: ${event.name}`,
              sub: `Early reminder for your upcoming engagement.`,
              type: 'CUSTOM'
            });
          }
        }
      });

      // Filter and limit to avoid UI clutter
      setActiveReminders(notifications.slice(0, 5));
    };

    checkReminders();
    // Re-check every 15 minutes to stay accurate
    const interval = setInterval(checkReminders, 1000 * 60 * 15);
    return () => clearInterval(interval);
  }, [events]);

  if (activeReminders.length === 0) return null;

  return (
    <div className="fixed top-24 right-4 z-[100] flex flex-col gap-4 max-w-sm w-[90%] pointer-events-none">
      {activeReminders.map(reminder => (
        <div 
          key={reminder.id}
          className={`pointer-events-auto bg-white/95 backdrop-blur-xl p-5 rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border-2 flex items-start gap-4 animate-in slide-in-from-right duration-500 overflow-hidden relative ${
            reminder.type === 'URGENT' ? 'border-red-100' : 'border-white'
          }`}
        >
          <div className={`absolute top-0 left-0 w-1.5 h-full ${
            reminder.type === 'URGENT' ? 'bg-red-500' : 
            reminder.type === 'CUSTOM' ? 'bg-indigo-500' : 'bg-yellow-400'
          }`}></div>
          
          <div className={`${
            reminder.type === 'URGENT' ? 'bg-red-500' : 
            reminder.type === 'CUSTOM' ? 'bg-indigo-500' : 'bg-yellow-400'
          } p-2.5 rounded-2xl shadow-sm rotate-[-5deg]`}>
            {reminder.type === 'CUSTOM' ? (
              <CalendarClock size={20} className="text-white" strokeWidth={3} />
            ) : (
              <Bell size={20} className={reminder.type === 'URGENT' ? 'text-white' : 'text-black'} strokeWidth={3} />
            )}
          </div>

          <div className="flex-1">
            <p className={`font-black text-sm leading-tight ${reminder.type === 'URGENT' ? 'text-red-600' : 'text-gray-900'}`}>
              {reminder.message}
            </p>
            <p className="text-[11px] text-gray-500 font-bold mt-1.5 leading-relaxed">{reminder.sub}</p>
          </div>

          <button 
            onClick={() => setActiveReminders(prev => prev.filter(r => r.id !== reminder.id))}
            className="text-gray-300 hover:text-black transition-colors"
          >
            <X size={18} strokeWidth={3} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ReminderEngine;
