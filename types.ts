
export enum DayType {
  FULL_DAY = 'FULL_DAY',
  HALF_DAY_MORNING = 'HALF_DAY_MORNING',
  HALF_DAY_EVENING = 'HALF_DAY_EVENING'
}

export enum LocationType {
  LOCAL = 'LOCAL',
  OUT_OF_CITY = 'OUT_OF_CITY'
}

export interface EventBlock {
  id: string;
  date: string; // ISO string
  name: string;
  mobile?: string;
  dayType: DayType;
  locationType: LocationType;
  notes: string;
  createdAt: number;
}

export interface Reminder {
  id: string;
  eventId: string;
  message: string;
  type: 'ONE_DAY_BEFORE' | 'DAY_OF';
  date: string;
}
