
import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { EventBlock } from '../types';
import { format, addDays } from 'date-fns';

interface ReminderEngineProps {
  events: EventBlock[];
}

const ReminderEngine: React.FC<ReminderEngineProps> = ({ events }) => {
  const [activeReminders, setActiveReminders] = useState<{ id: string; message: string; sub: string }[]>([]);

  useEffect(() => {
    const checkReminders = () => {
      // Using native Date for today start and addDays for tomorrow since startOfDay/subDays are missing
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = addDays(today, 1);
      const notifications: { id: string; message: string; sub: string }[] = [];

      events.forEach(event => {
        const eventDate = new Date(event.date);
        
        const eventDateStr = format(eventDate, 'yyyy-MM-dd');
        const todayStr = format(today, 'yyyy-MM-dd');
        const tomorrowStr = format(tomorrow, 'yyyy-MM-dd');

        // Event is Today (Flowchart Requirement)
        if (eventDateStr === todayStr) {
          notifications.push({
            id: `${event.id}-today`,
            message: `Event Today: ${event.name}`,
            sub: `You have a blocked date today. Please plan accordingly.`
          });
        }
        
        // Event is 1 Day Before (Flowchart Requirement)
        if (eventDateStr === tomorrowStr) {
          notifications.push({
            id: `${event.id}-tomorrow`,
            message: `Upcoming Tomorrow: ${event.name}`,
            sub: `Don't forget your blocked date for ${event.name} tomorrow.`
          });
        }
      });

      // Filter out duplicate notifications and only show most relevant
      setActiveReminders(notifications.slice(0, 3));
    };

    checkReminders();
    // Re-check every 30 minutes
    const interval = setInterval(checkReminders, 1000 * 60 * 30);
    return () => clearInterval(interval);
  }, [events]);

  if (activeReminders.length === 0) return null;

  return (
    <div className="fixed top-24 right-4 z-[100] flex flex-col gap-4 max-w-sm w-[90%] pointer-events-none">
      {activeReminders.map(reminder => (
        <div 
          key={reminder.id}
          className="pointer-events-auto bg-white/90 backdrop-blur-xl p-5 rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-white flex items-start gap-4 animate-in slide-in-from-right duration-500 overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-yellow-400"></div>
          <div className="bg-yellow-400 p-2.5 rounded-2xl shadow-sm rotate-[-5deg]">
            <Bell size={20} className="text-black" strokeWidth={3} />
          </div>
          <div className="flex-1">
            <p className="font-black text-gray-900 text-sm leading-tight">{reminder.message}</p>
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