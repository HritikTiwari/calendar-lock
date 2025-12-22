
import React, { useState, useEffect } from 'react';
import { 
  format, 
  endOfMonth, 
  eachDayOfInterval, 
  addMonths, 
  endOfWeek,
  addDays
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { DayType, EventBlock } from './types';
import { isDateInPast, generateId } from './utils';
import DateManagementSheet from './components/DateManagementSheet';
import ReminderEngine from './components/ReminderEngine';
import { FullDayIcon, HalfDayMorningIcon, HalfDayEveningIcon } from './components/Icons';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<EventBlock[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('photographer_diary_events');
    if (saved && JSON.parse(saved).length > 0) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse events", e);
      }
    } else {
      const today = new Date();
      const sampleData: EventBlock[] = [
        {
          id: generateId(),
          date: today.toISOString(),
          name: "Wedding: Simran & Raj",
          dayType: DayType.FULL_DAY,
          locationType: "LOCAL" as any,
          notes: "4 persons team",
          createdAt: Date.now()
        },
        {
          id: generateId(),
          date: addDays(today, 2).toISOString(),
          name: "Morning Maternity",
          dayType: DayType.HALF_DAY_MORNING,
          locationType: "LOCAL" as any,
          notes: "Single shooter",
          createdAt: Date.now()
        },
        {
          id: generateId(),
          date: addDays(today, 2).toISOString(),
          name: "Evening Party",
          dayType: DayType.HALF_DAY_EVENING,
          locationType: "LOCAL" as any,
          notes: "Flash setup required",
          createdAt: Date.now()
        },
        {
          id: generateId(),
          date: addDays(today, 4).toISOString(),
          name: "Studio Session",
          dayType: DayType.HALF_DAY_EVENING,
          locationType: "LOCAL" as any,
          notes: "Product shoot",
          createdAt: Date.now()
        },
        {
          id: generateId(),
          date: addDays(today, 4).toISOString(),
          name: "Gala Dinner",
          dayType: DayType.HALF_DAY_EVENING,
          locationType: "LOCAL" as any,
          notes: "Main stage only",
          createdAt: Date.now()
        }
      ];
      setEvents(sampleData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('photographer_diary_events', JSON.stringify(events));
  }, [events]);

  const startOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startOfGrid = addDays(startOfCurrentMonth, -startOfCurrentMonth.getDay());

  const days = eachDayOfInterval({ 
    start: startOfGrid, 
    end: endOfWeek(endOfMonth(currentDate)) 
  });

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsSheetOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col pb-24 sm:pb-0 font-sans">
      {/* Premium Header */}
      <header className="bg-white border-b px-4 sm:px-5 py-3 sm:py-5 sticky top-0 z-30 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-yellow-400 text-black p-2 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-md rotate-[-3deg]">
            <CalendarIcon size={20} className="sm:w-6 sm:h-6" strokeWidth={3} />
          </div>
          <div className="flex flex-col">
            <h1 className="font-black text-lg sm:text-xl leading-none tracking-tight text-gray-900 uppercase italic">Diary</h1>
            <span className="text-[7px] sm:text-[9px] font-black text-yellow-600 tracking-[0.15em] sm:tracking-[0.2em] uppercase">Calendar</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button 
            onClick={() => setCurrentDate(new Date())} 
            className="text-[8px] sm:text-[10px] font-black px-2 sm:px-4 py-1.5 sm:py-2 border-2 border-gray-100 rounded-lg sm:rounded-xl bg-white shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
          >
            TODAY
          </button>
          <div className="flex items-center bg-gray-100 rounded-xl sm:rounded-2xl p-0.5 sm:p-1 shadow-inner">
            <button onClick={() => setCurrentDate(addMonths(currentDate, -1))} className="p-1.5 sm:p-2 hover:bg-white rounded-lg sm:rounded-xl active:scale-90 transition-all"><ChevronLeft size={14} className="sm:w-4 sm:h-4" strokeWidth={3} /></button>
            <span className="px-1 sm:px-3 font-black text-[10px] sm:text-sm min-w-[70px] sm:min-w-[110px] text-center text-gray-800 uppercase tracking-tighter">{format(currentDate, 'MMM yyyy')}</span>
            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-1.5 sm:p-2 hover:bg-white rounded-lg sm:rounded-xl active:scale-90 transition-all"><ChevronRight size={14} className="sm:w-4 sm:h-4" strokeWidth={3} /></button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-2 sm:p-8 max-w-7xl mx-auto w-full">
        {/* Weekday Labels */}
        <div className="grid grid-cols-7 mb-2 sm:mb-4">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, i) => (
            <div key={i} className="text-center text-[8px] sm:text-[10px] font-black text-gray-300 tracking-[0.1em] sm:tracking-[0.25em]">{day}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-4">
          {days.map((day, i) => {
            const isOutsideMonth = format(day, 'MM') !== format(currentDate, 'MM');
            const dayEvents = events.filter(e => format(new Date(e.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
            const isPast = isDateInPast(day);
            const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            
            const typeCounts = {
              [DayType.FULL_DAY]: dayEvents.filter(e => e.dayType === DayType.FULL_DAY).length,
              [DayType.HALF_DAY_MORNING]: dayEvents.filter(e => e.dayType === DayType.HALF_DAY_MORNING).length,
              [DayType.HALF_DAY_EVENING]: dayEvents.filter(e => e.dayType === DayType.HALF_DAY_EVENING).length,
            };

            const hasAnyEvents = dayEvents.length > 0;
            const isTaller = dayEvents.length >= 2;

            return (
              <div
                key={i}
                onClick={() => !isOutsideMonth && handleDateClick(day)}
                className={`
                  relative p-1.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between group
                  ${isOutsideMonth ? 'opacity-0 sm:opacity-5 bg-transparent border-transparent cursor-default pointer-events-none' : 'bg-white border-gray-50 shadow-sm hover:border-yellow-400 hover:shadow-lg sm:hover:shadow-xl sm:hover:-translate-y-1 active:scale-[0.97]'}
                  ${isToday ? 'ring-2 ring-yellow-400 border-transparent bg-yellow-50/10' : ''}
                  ${isTaller ? 'min-h-[75px] sm:min-h-[150px]' : 'min-h-[65px] sm:min-h-[120px]'}
                `}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] sm:text-lg font-black ${isToday ? 'text-yellow-600' : isOutsideMonth ? 'text-transparent' : 'text-gray-400'}`}>
                    {format(day, 'd')}
                  </span>
                </div>

                {/* Per-type Indicator with +N */}
                <div className="flex flex-col gap-0.5 sm:gap-1.5 mt-auto pt-1">
                  {Object.entries(typeCounts).map(([type, count]) => {
                    if (count === 0) return null;
                    return (
                      <div key={type} className="flex items-center gap-0.5 sm:gap-1 bg-gray-50/50 sm:bg-transparent rounded-md px-1 py-0.5 sm:p-0">
                        <div className="scale-75 sm:scale-100 origin-left">
                          {type === DayType.FULL_DAY && <FullDayIcon isPast={isPast} size={14} />}
                          {type === DayType.HALF_DAY_MORNING && <HalfDayMorningIcon isPast={isPast} size={14} />}
                          {type === DayType.HALF_DAY_EVENING && <HalfDayEveningIcon isPast={isPast} size={14} />}
                        </div>
                        {count > 1 && (
                          <span className={`text-[7px] sm:text-[10px] font-black ${isPast ? 'text-gray-400' : 'text-yellow-600'}`}>
                            +{count - 1}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {hasAnyEvents && !isOutsideMonth && (
                   <div className={`absolute bottom-0 left-2 right-2 sm:left-4 sm:right-4 h-[2px] sm:h-[3px] rounded-full ${isPast ? 'bg-gray-200' : 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]'}`}></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-12 p-4 sm:p-8 bg-white rounded-2xl sm:rounded-[2.5rem] border-2 border-gray-50 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
          <div className="flex items-center gap-2 sm:gap-3 font-black text-[8px] sm:text-[10px] text-gray-500 uppercase tracking-widest bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl"><FullDayIcon size={14} /> FULL</div>
          <div className="flex items-center gap-2 sm:gap-3 font-black text-[8px] sm:text-[10px] text-gray-500 uppercase tracking-widest bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl"><HalfDayMorningIcon size={14} /> MORNING</div>
          <div className="flex items-center gap-2 sm:gap-3 font-black text-[8px] sm:text-[10px] text-gray-500 uppercase tracking-widest bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl"><HalfDayEveningIcon size={14} /> EVENING</div>
        </div>
      </main>

      {/* Floating Action Button - FIXED TS ERROR */}
      <button 
        onClick={() => handleDateClick(new Date())} 
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 bg-black text-white rounded-2xl sm:rounded-[1.75rem] shadow-[0_15px_40px_rgba(0,0,0,0.3)] flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-40 border-[3px] sm:border-[4px] border-white group"
      >
        <Plus strokeWidth={3} className="w-6 h-6 sm:w-8 sm:h-8 group-hover:rotate-180 transition-transform duration-500" />
      </button>

      {isSheetOpen && selectedDate && (
        <DateManagementSheet
          selectedDate={selectedDate}
          events={events.filter(e => format(new Date(e.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))}
          onSave={(e) => {
            setEvents(prev => {
              const idx = prev.findIndex(item => item.id === e.id);
              if (idx > -1) {
                const updated = [...prev];
                updated[idx] = e;
                return updated;
              }
              return [...prev, e];
            });
          }}
          onDelete={(id) => setEvents(prev => prev.filter(e => e.id !== id))}
          onClose={() => setIsSheetOpen(false)}
        />
      )}

      <ReminderEngine events={events} />
    </div>
  );
};

export default App;
