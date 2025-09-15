export interface Task {
    id: string;
    title: string;
    priority: string;
    memo: string;
    completed: boolean;
}

export interface JourneyItem {
    id: string;
    title: string;
    scope: string;
    link: string;
    completed: boolean;
}

export interface Meditation {
    scripture: string;
    godsPresence: string;
    reflection: string;
    prayer: string;
}

export interface JournalEntry {
    meditation: Meditation;
    tasks: Task[];
    journeyItems: JourneyItem[];
}

export interface JournalData {
    [date: string]: JournalEntry;
}