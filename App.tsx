import React, { useState, useEffect } from 'react';
import { Task, Meditation, JournalEntry, JournalData, JourneyItem } from './types';
import Header from './components/Header';
import TaskList from './components/TaskList';
import TimeTravel from './components/TimeTravel';
import SavedEntriesList from './components/SavedEntriesList';
import JourneyList from './components/JourneyList';

const App: React.FC = () => {
    const getTodayDateString = () => new Date().toISOString().split('T')[0];

    const [currentDate, setCurrentDate] = useState<string>(getTodayDateString());
    const [journalData, setJournalData] = useState<JournalData>({});
    const [reviewedDates, setReviewedDates] = useState<Set<string>>(new Set());
    const [lastViewedDate, setLastViewedDate] = useState<string | null>(null);

    useEffect(() => {
        try {
            const savedData = localStorage.getItem('journalData');
            if (savedData) {
                setJournalData(JSON.parse(savedData));
            }
            const savedReviewed = localStorage.getItem('reviewedDates');
            if (savedReviewed) {
                setReviewedDates(new Set(JSON.parse(savedReviewed)));
            }
        } catch (error) {
            console.error("Failed to load data from localStorage", error);
        }
    }, []);
    
    useEffect(() => {
        try {
            localStorage.setItem('reviewedDates', JSON.stringify(Array.from(reviewedDates)));
        } catch (error) {
            console.error("Failed to save reviewed dates to localStorage", error);
        }
    }, [reviewedDates]);

    const getEntryForDate = (date: string): JournalEntry => {
        return journalData[date] || {
            meditation: { scripture: '', godsPresence: '', reflection: '', prayer: '' },
            tasks: [],
            journeyItems: [],
        };
    };

    const updateEntryForDate = (date: string, newEntry: JournalEntry) => {
        setJournalData(prevData => ({
            ...prevData,
            [date]: newEntry,
        }));
    };

    const handleMeditationChange = (updatedMeditation: Meditation) => {
        const entry = getEntryForDate(currentDate);
        updateEntryForDate(currentDate, { ...entry, meditation: updatedMeditation });
    };

    const handleAddTask = () => {
        const entry = getEntryForDate(currentDate);
        const newTask: Task = {
            id: Date.now().toString(),
            title: '',
            priority: '중',
            memo: '',
            completed: false,
        };
        updateEntryForDate(currentDate, { ...entry, tasks: [...entry.tasks, newTask] });
    };

    const handleUpdateTask = (updatedTask: Task) => {
        const entry = getEntryForDate(currentDate);
        const newTasks = entry.tasks.map(task => (task.id === updatedTask.id ? updatedTask : task));
        updateEntryForDate(currentDate, { ...entry, tasks: newTasks });
    };

    const handleDeleteTask = (taskId: string) => {
        const entry = getEntryForDate(currentDate);
        const newTasks = entry.tasks.filter(task => task.id !== taskId);
        updateEntryForDate(currentDate, { ...entry, tasks: newTasks });
    };
    
    const handleAddJourneyItem = () => {
        const entry = getEntryForDate(currentDate);
        const newJourneyItem: JourneyItem = {
            id: Date.now().toString(),
            title: '',
            scope: '',
            link: '',
            completed: false,
        };
        updateEntryForDate(currentDate, { ...entry, journeyItems: [...entry.journeyItems, newJourneyItem] });
    };

    const handleUpdateJourneyItem = (updatedJourneyItem: JourneyItem) => {
        const entry = getEntryForDate(currentDate);
        const newJourneyItems = entry.journeyItems.map(item => (item.id === updatedJourneyItem.id ? updatedJourneyItem : item));
        updateEntryForDate(currentDate, { ...entry, journeyItems: newJourneyItems });
    };

    const handleDeleteJourneyItem = (journeyItemId: string) => {
        const entry = getEntryForDate(currentDate);
        const newJourneyItems = entry.journeyItems.filter(item => item.id !== journeyItemId);
        updateEntryForDate(currentDate, { ...entry, journeyItems: newJourneyItems });
    };

    const changeDate = (newDate: string) => {
        setLastViewedDate(currentDate);
        setCurrentDate(newDate);
    };

    const handleDateChange = (daysAgo: number) => {
        const today = new Date(getTodayDateString());
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() - daysAgo);
        changeDate(targetDate.toISOString().split('T')[0]);
    };

    const handleReturnToToday = () => {
        const todayStr = getTodayDateString();
        if (currentDate !== todayStr && lastViewedDate) {
             const today = new Date(getTodayDateString());
             const lastViewed = new Date(currentDate);
             const diffTime = today.getTime() - lastViewed.getTime();
             const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

             if ([1, 3, 7, 14, 30].includes(diffDays)) {
                setReviewedDates(prev => new Set(prev).add(currentDate));
             }
        }
        setCurrentDate(todayStr);
        setLastViewedDate(null);
    };
    
    const handleSaveData = () => {
        try {
            const entry = getEntryForDate(currentDate);
            const hasMeditationContent = Object.values(entry.meditation).some(val => val.trim() !== '');
            const hasTasks = entry.tasks.some(task => task.title.trim() !== '');
            const hasJourneyItems = entry.journeyItems.some(item => item.title.trim() !== '');

            if (!hasMeditationContent && !hasTasks && !hasJourneyItems) {
                const newJournalData = { ...journalData };
                delete newJournalData[currentDate];
                setJournalData(newJournalData);
                localStorage.setItem('journalData', JSON.stringify(newJournalData));
                alert('항목이 비어 있어 삭제되었습니다.');
            } else {
                localStorage.setItem('journalData', JSON.stringify(journalData));
                alert('저장되었습니다.');
            }
        } catch (error) {
            console.error("Failed to save journal data to localStorage", error);
        }
    };

    const currentEntry = getEntryForDate(currentDate);
    const savedDates = Object.keys(journalData)
        .filter(date => {
            const entry = journalData[date];
            if (!entry) return false;
            const hasMeditationContent = Object.values(entry.meditation).some(val => val.trim() !== '');
            const hasTasks = entry.tasks.some(task => task.title.trim() !== '');
            const hasJourneyItems = entry.journeyItems && entry.journeyItems.some(item => item.title.trim() !== '');
            return hasMeditationContent || hasTasks || hasJourneyItems;
        })
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());


    return (
        <div className="min-h-screen container mx-auto p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <Header 
                    date={currentDate}
                    meditation={currentEntry.meditation}
                    onMeditationChange={handleMeditationChange}
                />
                <TaskList
                    tasks={currentEntry.tasks}
                    onAddTask={handleAddTask}
                    onUpdateTask={handleUpdateTask}
                    onDeleteTask={handleDeleteTask}
                />
                <JourneyList
                    journeyItems={currentEntry.journeyItems}
                    onAddJourneyItem={handleAddJourneyItem}
                    onUpdateJourneyItem={handleUpdateJourneyItem}
                    onDeleteJourneyItem={handleDeleteJourneyItem}
                />
                <TimeTravel 
                    onDateChange={handleDateChange}
                    onReturnToToday={handleReturnToToday}
                    today={getTodayDateString()}
                    currentDate={currentDate}
                    reviewedDates={reviewedDates}
                />

                <div className="mt-8 text-center">
                    <button
                        onClick={handleSaveData}
                        className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                        저장 / 수정
                    </button>
                </div>
                
                <SavedEntriesList
                    savedDates={savedDates}
                    currentDate={currentDate}
                    onSelectDate={changeDate}
                />
            </div>
        </div>
    );
};

export default App;