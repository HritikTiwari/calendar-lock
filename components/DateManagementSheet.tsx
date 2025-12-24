
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
    setCustomReminderDays(block.customReminderDays || '');
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
      customReminderDays: customReminderDays === '' ? undefined : Number(customReminderDays),
      createdAt: editingBlock?.createdAt || Date.now()
    });
    
    if (events.length === 0 && !editingBlock) {
      onClose();
    } else {
      setView('LIST');
    }
  };

  const handleDelete = (id: string) => {
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex flex-col">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">
              {view === 'LIST' ? 'Day Engagements' : (editingBlock ? 'Edit Block' : 'New Block')}
            </h3>
            <span className="text-sm font-bold text-yellow-600">
              {selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {view === 'FORM' && events.length > 0 && (
              <button onClick={() => setView('LIST')} className="p-2.5 bg-gray-100 rounded-full active:scale-90">
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
            )}
            <button onClick={onClose} className="p-2.5 bg-gray-100 rounded-full active:scale-90">
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          
          {view === 'LIST' ? (
            <div className="space-y-4 pb-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Currently Blocked</p>
              {events.map((event) => (
                <div 
                  key={event.id}
                  onClick={() => handleEdit(event)}
                  className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer hover:border-yellow-200"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                    {event.dayType === DayType.FULL_DAY && <FullDayIcon size={24} />}
                    {event.dayType === DayType.HALF_DAY_MORNING && <HalfDayMorningIcon size={24} />}
                    {event.dayType === DayType.HALF_DAY_EVENING && <HalfDayEveningIcon size={24} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-gray-900 truncate">{event.name}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">{getDayTypeLabel(event.dayType)} • {event.locationType}</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300" />
                </div>
              ))}
              
              <button 
                onClick={handleAddNew}
                className="w-full p-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 font-bold flex items-center justify-center gap-2 hover:border-yellow-400 hover:text-yellow-600 transition-all"
              >
                <Plus size={20} /> Add Another Block
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 pb-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                  <User size={12} className="text-yellow-500" /> Client Name
                </label>
                <input
                  type="text" required autoFocus value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul & Neha Wedding"
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-50 outline-none font-bold placeholder:text-gray-300"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <Phone size={12} className="text-yellow-500" /> Mobile Number
                  </label>
                  <input
                    type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)}
                    placeholder="Optional reference"
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-50 outline-none font-bold placeholder:text-gray-300 text-sm"
                  />
                </div>
                
                {/* 3rd Custom Reminder Section */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <Clock size={12} className="text-yellow-500" /> Custom Reminder
                  </label>
                  <input
                    type="number" 
                    value={customReminderDays} 
                    onChange={(e) => setCustomReminderDays(e.target.value === '' ? '' : parseInt(e.target.value))}
                    placeholder="Days before (e.g. 7)"
                    min="1"
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-50 outline-none font-bold placeholder:text-gray-300 text-sm"
                  />
                </div>
              </div>

              <div className="bg-yellow-50/50 p-4 rounded-2xl border border-yellow-100">
                <p className="text-[10px] font-black text-yellow-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <BellRing size={12} /> Active Reminders
                </p>
                <ul className="text-[11px] font-bold text-gray-600 space-y-1">
                  <li className="flex items-center gap-2">• 1 Day Before (Default)</li>
                  <li className="flex items-center gap-2">• 3 Days Before (Default)</li>
                  {customReminderDays && customReminderDays !== '' && (
                    <li className="flex items-center gap-2 text-yellow-700 font-black">• {customReminderDays} Days Before (Custom)</li>
                  )}
                </ul>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Engagement Type</label>
                <div className="grid grid-cols-1 gap-2">
                  {[DayType.FULL_DAY, DayType.HALF_DAY_MORNING, DayType.HALF_DAY_EVENING].map((type) => (
                    <button
                      key={type} type="button" onClick={() => setDayType(type)}
                      className={`flex items-center gap-4 px-5 py-4 rounded-2xl border text-xs font-black transition-all ${
                        dayType === type ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200'
                      }`}
                    >
                      <div className="w-8 h-8 flex items-center justify-center">
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
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                  <MapPin size={12} className="text-yellow-500" /> Location
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[LocationType.LOCAL, LocationType.OUT_OF_CITY].map((loc) => (
                    <button
                      key={loc} type="button" onClick={() => setLocationType(loc)}
                      className={`py-3 rounded-xl border text-[10px] font-black transition-all ${
                        locationType === loc ? 'bg-gray-100 text-black border-black' : 'bg-white text-gray-500 border-gray-200'
                      }`}
                    >
                      {loc.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                  <ClipboardList size={12} className="text-yellow-500" /> Requirements
                </label>
                <textarea
                  value={notes} onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Cinematic + Candid | 2 persons"
                  rows={2}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-50 outline-none resize-none font-bold placeholder:text-gray-300"
                />
              </div>

              <div className="flex gap-3 pt-4">
                {editingBlock && (
                  <button
                    type="button" onClick={() => handleDelete(editingBlock.id)}
                    className="p-5 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 active:scale-95 transition-all"
                  >
                    <Trash2 size={24} />
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 bg-black text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] transition-all"
                >
                  <Save size={20} />
                  {editingBlock ? 'Update' : 'Save Block'}
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
