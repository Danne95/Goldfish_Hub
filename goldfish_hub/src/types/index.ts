export interface Birthday {
  id: string;
  name: string;
  date: string; // Format: DD/MM
}

export interface Task {
  id: string;
  text: string;
  notes: string;
  urgency: 'low' | 'medium' | 'high';
  targetDate?: string; // Optional target date
}

export interface RecurringEvent {
  id: string;
  text: string;
  periodicity: 'daily' | 'weekly' | 'monthly' | 'yearly';
  dayOfWeek?: string; // For weekly events
  specificDate?: string; // For monthly/yearly events in DD/MM format
  time?: string; // Format: HH:mm in 24-hour format
}

export type StorageKey = 'birthdays' | 'tasks' | 'recurringEvents'; 