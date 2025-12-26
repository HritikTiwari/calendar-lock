
import React, { useState, useEffect } from 'react';
import { 
  format, 
  endOfMonth, 
  eachDayOfInterval, 
  addMonths, 
  endOfWeek,
  addDays,
  isBefore,
  isAfter
} from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  List as ListIcon,
  LayoutGrid,
  MapPin,
  Clock,
  ChevronRight as ChevronRightSmall,
  X,
  Info
} from 'lucide-react';
import { DayType, EventBlock, LocationType } from './types';
import { isDateInPast, generateId } from './utils';
import DateManagementSheet from './components/DateManagementSheet';
import ReminderEngine from './components/ReminderEngine';
import { FullDayIcon, HalfDayMorningIcon, HalfDayEveningIcon } from './components/Icons';

type ViewMode = 'CALENDAR' | 'LIST';
type ListFilter = 'PAST' | 'TODAY' | 'UPCOMING';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('CALENDAR');
  const [listFilter, setListFilter] = useState<ListFilter>('TODAY');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<EventBlock[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showLegend, setShowLegend] = useState(true);

  useEffect(() => {
    // Check legend preference
    const legendPref = localStorage.getItem('diary_legend_hidden');
    if (legendPref === 'true') setShowLegend(false);

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
          locationType: LocationType.LOCAL,
          notes: "4 persons team",
          createdAt: Date.now()
        },
        {
          id: generateId(),
          date: today.toISOString(),
          name: "Reception: Malhotra Family",
          dayType: DayType.FULL_DAY,
          locationType: LocationType.LOCAL,
          notes: "2nd shooter required",
          createdAt: Date.now()
        },
        {
          id: generateId(),
          date: addDays(today, 2).toISOString(),
          name: "Pre-wedding: Goa Destination",
          dayType: DayType.FULL_DAY,
          locationType: LocationType.OUT_OF_CITY,
          notes: "Candid + Cinematic Team",
          createdAt: Date.now()
        },
        {
          id: generateId(),
          date: addDays(today, 2).toISOString(),
          name: "Couple Shoot: Rahul & Tina",
          dayType: DayType.HALF_DAY_MORNING,
          locationType: LocationType.LOCAL,
          notes: "Beach session",
          createdAt: Date.now()
        },
        {
          id: generateId(),
          date: addDays(today, 2).toISOString(),
          name: "Dinner Event: Corporate",
          dayType: DayType.HALF_DAY_EVENING,
          locationType: LocationType.LOCAL,
          notes: "Wait for client signal",
          createdAt: Date.now()
        },
        {
          id: generateId(),
          date: addDays(today, -5).toISOString(),
          name: "Engagement: Amit & Sneha",
          dayType: DayType.HALF_DAY_EVENING,
          locationType: LocationType.LOCAL,
          notes: "Single shooter",
          createdAt: Date.now()
        },
        {
          id: generateId(),
          date: addDays(today, 4).toISOString(),
          name: "Corporate Gala: Tech Mahindra",
          dayType: DayType.HALF_DAY_EVENING,
          locationType: LocationType.LOCAL,
          notes: "Flash setup required",
          createdAt: Date.now()
        },
        {
          id: generateId(),
          date: addDays(today, 10).toISOString(),
          name: "Birthday: Vivaan's 1st",
          dayType: DayType.HALF_DAY_MORNING,
          locationType: LocationType.LOCAL,
          notes: "Kids portraiture style",
          createdAt: Date.now()
        }
      ];
      setEvents(sampleData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('photographer_diary_events', JSON.stringify(events));
  }, [events]);

  const toggleLegend = () => {
    const newState = !showLegend;
    setShowLegend(newState);
    if (!newState) {
      localStorage.setItem('diary_legend_hidden', 'true');
    } else {
      localStorage.removeItem('diary_legend_hidden');
    }
  };

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

  const getFilteredEvents = () => {
    const tDate = new Date();
    tDate.setHours(0, 0, 0, 0);

    const past = events.filter(e => isBefore(new Date(e.date), tDate));
    const today = events.filter(e => {
      const d = new Date(e.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === tDate.getTime();
    });
    const upcoming = events.filter(e => isAfter(new Date(e.date), tDate));

    if (listFilter === 'PAST') return past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (listFilter === 'TODAY') {
      if (today.length === 0) return upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      return today.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    if (listFilter === 'UPCOMING') return upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return events;
  };

  const filteredEvents = getFilteredEvents();

  const getDayTypeLabel = (type: DayType) => {
    switch (type) {
      case DayType.FULL_DAY: return "Full Day (Day & Night)";
      case DayType.HALF_DAY_MORNING: return "Half Day (Morning)";
      case DayType.HALF_DAY_EVENING: return "Half Day (Evening)";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col pb-24 font-sans">
      {/* Header */}
      <header className="bg-white border-b px-3 sm:px-6 py-3 sm:py-5 sticky top-0 z-30 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-yellow-400 text-black p-1.5 sm:p-2.5 rounded-lg sm:rounded-2xl shadow-md rotate-[-3deg]">
            <CalendarIcon size={18} className="sm:w-6 sm:h-6" strokeWidth={3} />
          </div>
          <div className="flex flex-col">
            <h1 className="font-black text-base sm:text-xl leading-none tracking-tight text-gray-900 uppercase italic">Diary</h1>
            <span className="text-[6px] sm:text-[9px] font-black text-yellow-600 tracking-[0.1em] sm:tracking-[0.2em] uppercase">Soft Block</span>
          </div>
        </div>
        
        {/* Hid month navigation if List View is selected */}
        {viewMode === 'CALENDAR' && (
          <div className="flex items-center bg-gray-100 rounded-lg sm:rounded-2xl p-0.5 sm:p-1 shadow-inner animate-in fade-in duration-200">
            <button onClick={() => setCurrentDate(addMonths(currentDate, -1))} className="p-1 sm:p-2 hover:bg-white rounded-md sm:rounded-xl active:scale-90 transition-all"><ChevronLeft size={12} className="sm:w-4 sm:h-4" strokeWidth={3} /></button>
            <span className="px-1 sm:px-3 font-black text-[9px] sm:text-sm min-w-[60px] sm:min-w-[110px] text-center text-gray-800 uppercase tracking-tighter">
              {format(currentDate, 'MMM yy')}
            </span>
            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-1 sm:p-2 hover:bg-white rounded-md sm:rounded-xl active:scale-90 transition-all"><ChevronRight size={12} className="sm:w-4 sm:h-4" strokeWidth={3} /></button>
          </div>
        )}
      </header>

      <main className="flex-1 p-3 sm:p-8 max-w-7xl mx-auto w-full overflow-x-hidden flex flex-col">
        
        {viewMode === 'LIST' && (
          <div className="flex justify-center mb-6 sm:mb-10 animate-in slide-in-from-top-4 duration-300">
            <div className="bg-white p-1 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 flex items-center w-full sm:w-auto overflow-hidden">
              {['PAST', 'TODAY', 'UPCOMING'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setListFilter(filter as ListFilter)}
                  className={`flex-1 sm:flex-none px-3 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${
                    listFilter === filter 
                      ? 'bg-black text-white shadow-lg' 
                      : 'text-gray-400 hover:bg-gray-50 active:scale-95'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'CALENDAR' ? (
          <>
            <div className="grid grid-cols-7 mb-2 sm:mb-4">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i} className="text-center text-[8px] sm:text-[10px] font-black text-gray-300 tracking-[0.1em] sm:tracking-[0.25em]">
                  <span className="hidden sm:inline">{['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][i]}</span>
                  <span className="sm:hidden">{day}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-4 flex-1">
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
                      relative p-1 sm:p-4 rounded-lg sm:rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group
                      ${isOutsideMonth ? 'opacity-0 bg-transparent border-transparent cursor-default pointer-events-none' : 'bg-white border-gray-50 shadow-sm hover:border-yellow-400 active:scale-[0.97]'}
                      ${isToday ? 'ring-2 ring-yellow-400 border-transparent bg-yellow-50/10' : ''}
                      ${isTaller ? 'min-h-[70px] sm:min-h-[150px]' : 'min-h-[60px] sm:min-h-[120px]'}
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-[10px] sm:text-lg font-black ${isToday ? 'text-yellow-600' : isOutsideMonth ? 'text-transparent' : 'text-gray-300'}`}>
                        {format(day, 'd')}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 sm:gap-2 mt-auto pt-1 overflow-hidden">
                      {Object.entries(typeCounts).map(([type, count]) => {
                        if (count === 0) return null;
                        return (
                          <div key={type} className="flex items-center gap-1.5 bg-gray-50/80 sm:bg-transparent rounded-lg px-1 py-0.5 sm:p-0">
                            <div className="scale-[0.7] sm:scale-100 origin-left">
                              {type === DayType.FULL_DAY && <FullDayIcon isPast={isPast} size={22} />}
                              {type === DayType.HALF_DAY_MORNING && <HalfDayMorningIcon isPast={isPast} size={22} />}
                              {type === DayType.HALF_DAY_EVENING && <HalfDayEveningIcon isPast={isPast} size={22} />}
                            </div>
                            {/* Showing actual count (2, 3...) instead of +1 prefix */}
                            {count > 1 && (
                              <span className={`text-[8px] sm:text-[12px] font-black ${isPast ? 'text-gray-400' : 'text-yellow-600'}`}>
                                {count}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    {hasAnyEvents && !isOutsideMonth && (
                       <div className={`absolute bottom-0 left-1 right-1 sm:left-4 sm:right-4 h-[1.5px] sm:h-[3px] rounded-full ${isPast ? 'bg-gray-200' : 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]'}`}></div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full flex-1">
            {listFilter === 'TODAY' && events.filter(e => {
              const d = new Date(e.date);
              d.setHours(0, 0, 0, 0);
              const now = new Date();
              now.setHours(0, 0, 0, 0);
              return d.getTime() === now.getTime();
            }).length === 0 && filteredEvents.length > 0 && (
              <div className="bg-yellow-100 text-yellow-800 p-3 rounded-2xl mb-4 text-[10px] font-black uppercase tracking-widest text-center border border-yellow-200 shadow-sm">
                No events for today. Showing upcoming engagements
              </div>
            )}
            
            {filteredEvents.length === 0 ? (
              <div className="text-center py-16 sm:py-24 bg-white rounded-2xl sm:rounded-[2rem] border-2 border-dashed border-gray-100 px-4">
                <div className="bg-gray-50 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="text-gray-300 w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <p className="font-black text-gray-400 uppercase tracking-widest text-[10px] sm:text-sm">No Events Found</p>
                <p className="text-gray-300 font-bold text-[9px] sm:text-xs mt-1">Try switching tabs or add a new engagement</p>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <div 
                  key={event.id}
                  onClick={() => handleDateClick(new Date(event.date))}
                  className="bg-white p-3 sm:p-5 rounded-2xl sm:rounded-[2rem] border sm:border-2 border-gray-50 shadow-sm hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer group flex items-center gap-3 sm:gap-5"
                >
                  <div className="bg-gray-50 p-2 sm:p-4 rounded-lg sm:rounded-2xl shadow-inner border border-white shrink-0">
                    <div className="scale-[0.9] sm:scale-100">
                      {event.dayType === DayType.FULL_DAY && <FullDayIcon size={36} isPast={isDateInPast(new Date(event.date))} />}
                      {event.dayType === DayType.HALF_DAY_MORNING && <HalfDayMorningIcon size={36} isPast={isDateInPast(new Date(event.date))} />}
                      {event.dayType === DayType.HALF_DAY_EVENING && <HalfDayEveningIcon size={36} isPast={isDateInPast(new Date(event.date))} />}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 mb-0.5 sm:mb-1">
                      <span className="bg-yellow-100 text-yellow-700 text-[7px] sm:text-[8px] font-black px-1.5 sm:px-2 py-0.5 rounded-full uppercase">
                        {format(new Date(event.date), 'EEE, MMM d')}
                      </span>
                      {event.locationType === LocationType.OUT_OF_CITY && (
                        <span className="bg-indigo-50 text-indigo-500 text-[7px] sm:text-[8px] font-black px-1.5 sm:px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                          <MapPin size={7} /> OUTSTATION
                        </span>
                      )}
                    </div>
                    <h3 className="font-black text-sm sm:text-lg text-gray-900 truncate tracking-tight">{event.name}</h3>
                    <p className="text-gray-400 font-bold text-[8px] sm:text-[10px] uppercase tracking-wider">{getDayTypeLabel(event.dayType)}</p>
                  </div>

                  <div className="bg-gray-50 p-2 sm:p-3 rounded-full text-gray-300 shrink-0">
                    <ChevronRightSmall size={16} className="sm:w-5 sm:h-5" strokeWidth={3} />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* BOTTOM NAVIGATION */}
        <div className="mt-8 space-y-6">
          <div className="flex justify-center">
            <div className="flex items-center bg-gray-100 rounded-xl sm:rounded-2xl p-1 shadow-inner border border-gray-200">
              <button 
                onClick={() => setViewMode('CALENDAR')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg sm:rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  viewMode === 'CALENDAR' 
                    ? 'bg-white shadow-md text-yellow-600 scale-100' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <LayoutGrid size={16} strokeWidth={3} />
                <span>Calendar</span>
              </button>
              <button 
                onClick={() => setViewMode('LIST')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg sm:rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  viewMode === 'LIST' 
                    ? 'bg-white shadow-md text-yellow-600 scale-100' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <ListIcon size={16} strokeWidth={3} />
                <span>List View</span>
              </button>
            </div>
          </div>

          {showLegend ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-wrap items-center justify-center gap-4 sm:gap-8 p-6 bg-white rounded-xl sm:rounded-[2.5rem] border-2 border-gray-50 shadow-md relative overflow-hidden max-w-4xl mx-auto w-full group/legend">
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
              
              <button 
                onClick={toggleLegend}
                className="absolute top-2 right-2 p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-full transition-all"
                title="Dismiss Legend"
              >
                <X size={14} strokeWidth={3} />
              </button>

              <div className="flex items-center gap-2.5 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                <FullDayIcon size={20} />
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Full Day (Day & Night)</span>
              </div>
              
              <div className="flex items-center gap-2.5 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                <HalfDayMorningIcon size={20} />
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Half Day (Morning)</span>
              </div>
              
              <div className="flex items-center gap-2.5 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                <HalfDayEveningIcon size={20} />
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Half Day (Evening)</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <button 
                onClick={toggleLegend}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm text-gray-400 hover:text-yellow-600 transition-all active:scale-95"
              >
                <Info size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">Show Help Labels</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => handleDateClick(new Date())} 
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 bg-black text-white rounded-2xl sm:rounded-[1.75rem] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-40 border-4 border-white group"
        aria-label="Add new engagement"
      >
        <Plus strokeWidth={4} className="w-6 h-6 sm:w-8 sm:h-8 group-hover:rotate-90 transition-transform duration-300" />
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
