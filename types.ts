
export interface Task {
    id: string;
    title: string;
    priority: string;
    memo: string;
    completed: boolean;
    dueDate: string;
    dueTime: string;
}

export interface JourneyItem {
    id:string;
    title: string;
    scope: string;
    link: string;
    completed: boolean;
}

export interface RecurrenceRule {
    frequency: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
    daysOfWeek?: ('SU' | 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA')[];
}

export interface ScheduleItem {
    id: string;
    title: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    location: string;
    memo: string;
    link: string;
    completed: boolean;
    recurrence?: RecurrenceRule;
}

export interface ChallengeItem {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    time: string;
    goal: string;
    achievements: string[]; // array of 'YYYY-MM-DD' date strings
}

export interface Meditation {
    godsPresence: string;
}

export interface JournalEntry {
    meditation: Meditation;
    journeyItems: JourneyItem[];
}

export interface JournalData {
    [date: string]: JournalEntry;
}

export interface DailySchedules {
    date: string;
    schedules: ScheduleItem[];
}