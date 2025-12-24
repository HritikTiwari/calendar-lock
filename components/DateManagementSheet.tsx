
import React, { useState } from 'react';
import { X, Save, User, Phone, MapPin, ClipboardList, Trash2, Plus, ArrowLeft, ChevronRight, BellRing, Clock } from 'lucide-react';
import { DayType, LocationType, EventBlock } from '../types';
import { generateId } from '../utils';
import { FullDayIcon, HalfDayMorningIcon, HalfDayEveningIcon } from './Icons';

interface DateManagementSheetProps {
  selectedDate: Date;
  events: EventBlock[];
  onSave: (block: EventBlock) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const DateManagementSheet: React.FC<DateManagementSheetProps> = ({ 
  selectedDate, 
  events, 
  onSave, 
  onDelete, 
  onClose 
}) => {
  const [view, setView] = useState<'LIST' | 'FORM'>(events.length > 0 ? 'LIST' : 'FORM');
  const [editingBlock, setEditingBlock] = useState<EventBlock | null>(null);

  // Form States
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [dayType, setDayType] = useState<DayType>(DayType.FULL_DAY);
  const [locationType, setLocationType] = useState<LocationType>(LocationType.LOCAL);
  const [notes, setNotes] = useState('');
  const [customReminderDays, setCustomReminderDays] = useState<number | ''>('');

  const resetForm = () => {
    setName('');
    setMobile('');
    setDayType(DayType.FULL_DAY);
    setLocationType(LocationType.LOCAL);
    setNotes('');
    setCustomReminderDays('');
    setEditingBlock(null);
  };

  const handleEdit = (block: EventBlock) => {
    setEditingBlock(block);
    setName(block.name);
    setMobile(block.mobile || '');
    setDayType(block.dayType);
    setLocationType(block.locationType);
    setNotes(block.notes);
    setCustomReminderDays(block.customReminderDays ?? '');
    setView('FORM');
  };

  const handleAddNew = () => {
    resetForm();
    setView('FORM');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    onSave({
      id: editingBlock?.id || generateId(),
      date: selectedDate.toISOString(),
      name,
      mobile,
      dayType,
      locationType,
      notes,
      customReminderDays: typeof customReminderDays === 'number' ? customReminderDays : undefined,
      createdAt: editingBlock?.createdAt || Date.now()
    });
    
    if (events.length === 0 && !editingBlock) {
      onClose();
    } else {
      setView('LIST');
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    onDelete(id);
    if (events.length <= 1) {
      onClose();
    } else {
      setView('LIST');
    }
  };

  const getDayTypeLabel = (type: DayType) => {
    switch (type) {
      case DayType.FULL_DAY: return "Full Day (Day & Night)";
      case DayType.HALF_DAY_MORNING: return "Half Day (Morning)";
      case DayType.HALF_DAY_EVENING: return "Half Day (Evening)";
      default: return "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200 overflow-hidden">
      <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-300 max-h-[92vh] flex flex-col">
        
        {/* Header - Compact on mobile */}
        <div className="flex items-center justify-between px-6 py-5 border-b sticky top-0 bg-white z-10 shrink-0">
          <div className="flex flex-col">
            <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight leading-none mb-1">
              {view === 'LIST' ? 'Day Engagements' : (editingBlock ? 'Edit Block' : 'New Block')}
            </h3>
            <span className="text-xs sm:text-sm font-bold text-yellow-600">
              {selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {view === 'FORM' && events.length > 0 && (
              <button 
                onClick={() => setView('LIST')} 
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center active:scale-90 transition-all"
                aria-label="Back to list"
              >
                <ArrowLeft size={18} className="text-gray-600" />
              </button>
            )}
            <button 
              onClick={onClose} 
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center active:scale-90 transition-all"
              aria-label="Close"
            >
              <X size={18} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content Area - Scrollable */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {view === 'LIST' ? (
            <div className="space-y-4 pb-10">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Active Blocks</p>
              {events.map((event) => (
                <div 
                  key={event.id}
                  onClick={() => handleEdit(event)}
                  className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer hover:bg-white hover:border-yellow-200 group"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 shrink-0 group-hover:scale-110 transition-transform">
                    {event.dayType === DayType.FULL_DAY && <FullDayIcon size={24} />}
                    {event.dayType === DayType.HALF_DAY_MORNING && <HalfDayMorningIcon size={24} />}
                    {event.dayType === DayType.HALF_DAY_EVENING && <HalfDayEveningIcon size={24} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm text-gray-900 truncate leading-tight mb-1">{event.name}</p>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">{getDayTypeLabel(event.dayType)}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-yellow-400" />
                </div>
              ))}
              
              <button 
                onClick={handleAddNew}
                className="w-full py-5 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 font-black text-sm flex items-center justify-center gap-3 hover:border-yellow-400 hover:text-yellow-600 transition-all active:scale-[0.98]"
              >
                <Plus size={18} strokeWidth={3} /> Add Another Block
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 pb-10">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                  <User size={10} className="text-yellow-500" /> Client Name
                </label>
                <input
                  type="text" required autoFocus value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Wedding Shoot"
                  className="w-full px-5 py-4 rounded-xl sm:rounded-2xl border border-gray-200 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-50 outline-none font-bold placeholder:text-gray-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                    <Phone size={10} className="text-yellow-500" /> Reference No.
                  </label>
                  <input
                    type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)}
                    placeholder="Reference number"
                    className="w-full px-5 py-4 rounded-xl sm:rounded-2xl border border-gray-200 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-50 outline-none font-bold placeholder:text-gray-300 text-sm"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                    <Clock size={10} className="text-yellow-500" /> Custom Reminder
                  </label>
                  <input
                    type="number" 
                    value={customReminderDays} 
                    onChange={(e) => setCustomReminderDays(e.target.value === '' ? '' : parseInt(e.target.value))}
                    placeholder="Days before (7, 15...)"
                    min="1"
                    className="w-full px-5 py-4 rounded-xl sm:rounded-2xl border border-gray-200 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-50 outline-none font-bold placeholder:text-gray-300 text-sm"
                  />
                </div>
              </div>

              <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-100">
                <p className="text-[9px] font-black text-yellow-700 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <BellRing size={10} /> Notification Schedule
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                   <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1"><div className="w-1 h-1 bg-yellow-400 rounded-full"></div> 1 Day Before</span>
                   <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1"><div className="w-1 h-1 bg-yellow-400 rounded-full"></div> 3 Days Before</span>
                   {typeof customReminderDays === 'number' && (
                     <span className="text-[10px] font-black text-yellow-700 flex items-center gap-1 underline decoration-yellow-400 decoration-2 underline-offset-2">
                       {customReminderDays} Days Before
                     </span>
                   )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Shoot Coverage</label>
                <div className="grid grid-cols-1 gap-2">
                  {[DayType.FULL_DAY, DayType.HALF_DAY_MORNING, DayType.HALF_DAY_EVENING].map((type) => (
                    <button
                      key={type} type="button" onClick={() => setDayType(type)}
                      className={`flex items-center gap-3 px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl border text-[10px] sm:text-xs font-black transition-all ${
                        dayType === type ? 'bg-black text-white border-black shadow-lg scale-100' : 'bg-white text-gray-500 border-gray-200 active:scale-95'
                      }`}
                    >
                      <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center shrink-0">
                         {type === DayType.FULL_DAY && <FullDayIcon size={24} className={dayType === type ? 'text-white' : ''} />}
                         {type === DayType.HALF_DAY_MORNING && <HalfDayMorningIcon size={24} className={dayType === type ? 'text-white' : ''} />}
                         {type === DayType.HALF_DAY_EVENING && <HalfDayEveningIcon size={24} className={dayType === type ? 'text-white' : ''} />}
                      </div>
                      {getDayTypeLabel(type)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                  <MapPin size={10} className="text-yellow-500" /> Location Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[LocationType.LOCAL, LocationType.OUT_OF_CITY].map((loc) => (
                    <button
                      key={loc} type="button" onClick={() => setLocationType(loc)}
                      className={`py-3 rounded-lg sm:rounded-xl border text-[10px] font-black transition-all ${
                        locationType === loc ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-gray-400 border-gray-200'
                      }`}
                    >
                      {loc === LocationType.LOCAL ? 'LOCAL' : 'OUTSTATION'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                  <ClipboardList size={10} className="text-yellow-500" /> Requirements & Notes
                </label>
                <textarea
                  value={notes} onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Cinematic Team required..."
                  rows={2}
                  className="w-full px-5 py-4 rounded-xl sm:rounded-2xl border border-gray-200 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-50 outline-none resize-none font-bold placeholder:text-gray-300 text-sm"
                />
              </div>

              <div className="flex gap-3 pt-4 pb-4">
                {editingBlock && (
                  <button
                    type="button" onClick={() => handleDelete(editingBlock.id)}
                    className="w-16 sm:w-20 rounded-xl sm:rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 active:scale-95 transition-all flex items-center justify-center border border-red-100"
                    aria-label="Delete event"
                  >
                    <Trash2 size={24} />
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 bg-black text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] transition-all"
                >
                  <Save size={20} />
                  {editingBlock ? 'Save Changes' : 'Confirm Block'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default DateManagementSheet;
