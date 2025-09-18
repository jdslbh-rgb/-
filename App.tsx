
import React, { useState, useEffect } from 'react';
import { Task, Meditation, JournalEntry, JournalData, JourneyItem, ScheduleItem, DailySchedules, ChallengeItem } from './types';
import Header from './components/Header';
import TaskList from './components/TaskList';
import TimeTravel from './components/TimeTravel';
import SavedEntriesList from './components/SavedEntriesList';
import JourneyList from './components/JourneyList';
import ScheduleList from './components/ScheduleList';
import ChallengeList from './components/ChallengeList';

const App: React.FC = () => {
    const getTodayDateString = () => new Date().toISOString().split('T')[0];

    const [currentDate, setCurrentDate] = useState<string>(getTodayDateString());
    const [journalData, setJournalData] = useState<JournalData>({});
    const [tasks, setTasks] = useState<Task[]>([]);
    const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
    const [challenges, setChallenges] = useState<ChallengeItem[]>([]);
    const [reviewedDates, setReviewedDates] = useState<Set<string>>(new Set());
    const [lastViewedDate, setLastViewedDate] = useState<string | null>(null);

    useEffect(() => {
        try {
            const savedJournalDataString = localStorage.getItem('journalData');
            const savedTasksString = localStorage.getItem('taskData');
            const savedSchedulesString = localStorage.getItem('scheduleData');
            const savedChallengesString = localStorage.getItem('challengeData');
            const savedReviewedString = localStorage.getItem('reviewedDates');

            // FIX: Explicitly type loadedJournalData to ensure type safety.
            let loadedJournalData: JournalData = savedJournalDataString ? JSON.parse(savedJournalDataString) : {};
            
            // Data Migration: Simplify meditation object. This happens in memory.
            // The changes will be persisted on the next save by the user.
            Object.keys(loadedJournalData).forEach(date => {
                const entry = loadedJournalData[date];
                if (entry && entry.meditation) {
                    const oldMeditation = entry.meditation as any;
                    entry.meditation = {
                        godsPresence: oldMeditation.godsPresence || ''
                    };
                }
            });

            // FIX: Explicitly type loadedTasks as Task[] to ensure type safety with data from localStorage.
            let loadedTasks: Task[] = savedTasksString ? JSON.parse(savedTasksString) : [];

            // Data Migration: Move tasks from journal entries to their own list
            let wasMigrated = false;
            const journalDataAfterMigration = { ...loadedJournalData };

            Object.keys(journalDataAfterMigration).forEach(date => {
                const entry = journalDataAfterMigration[date];
                if (entry && (entry as any).tasks && Array.isArray((entry as any).tasks) && (entry as any).tasks.length > 0) {
                    const tasksToMigrate = (entry as any).tasks.map((task: any) => ({
                        id: task.id || Date.now().toString(),
                        title: task.title || '',
                        priority: task.priority || '중',
                        memo: task.memo || task.link || '',
                        completed: task.completed || false,
                        dueDate: date,
                        dueTime: '',
                    }));
                    
                    loadedTasks.push(...tasksToMigrate);
                    delete (journalDataAfterMigration[date] as any).tasks;
                    wasMigrated = true;
                }
            });

            if (wasMigrated) {
                const uniqueTasks = Array.from(new Map(loadedTasks.map(task => [task.id, task])).values());
                setTasks(uniqueTasks);
                setJournalData(journalDataAfterMigration);
                localStorage.setItem('taskData', JSON.stringify(uniqueTasks));
                localStorage.setItem('journalData', JSON.stringify(journalDataAfterMigration));
                console.log('Successfully migrated tasks from journal entries.');
            } else {
                setTasks(loadedTasks);
                setJournalData(loadedJournalData);
            }
            
            if (savedSchedulesString) {
                setSchedules(JSON.parse(savedSchedulesString));
            }
            if (savedChallengesString) {
                setChallenges(JSON.parse(savedChallengesString));
            }
            if (savedReviewedString) {
                setReviewedDates(new Set(JSON.parse(savedReviewedString)));
            }

        } catch (error) {
            console.error("Failed to load data from localStorage", error);
        }
    }, []);
    
    useEffect(() => {
        try {
            localStorage.setItem('reviewedDates', JSON.stringify(Array.from(reviewedDates)));
        // FIX: Corrected catch block syntax from `(error) =>` to `(error)`.
        } catch (error) {
            console.error("Failed to save reviewed dates to localStorage", error);
        }
    }, [reviewedDates]);
    
    useEffect(() => {
        try {
            localStorage.setItem('challengeData', JSON.stringify(challenges));
        } catch (error) {
            console.error("Failed to save challenges to localStorage", error);
        }
    }, [challenges]);


    const getEntryForDate = (date: string): JournalEntry => {
        return journalData[date] || {
            meditation: { godsPresence: '' },
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
        const newTask: Task = {
            id: Date.now().toString(),
            title: '',
            priority: '중',
            memo: '',
            completed: false,
            dueDate: currentDate,
            dueTime: '',
        };
        setTasks(prevTasks => [...prevTasks, newTask]);
    };

    const handleUpdateTask = (updatedTask: Task) => {
        setTasks(prevTasks => prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
    };

    const handleDeleteTask = (taskId: string) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
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
    
    const handleAddSchedule = () => {
        const newSchedule: ScheduleItem = {
            id: Date.now().toString(),
            title: '',
            startDate: currentDate,
            startTime: '',
            endDate: currentDate,
            endTime: '',
            location: '',
            memo: '',
            link: '',
            completed: false,
            recurrence: { frequency: 'none' },
        };
        setSchedules(prevSchedules => [...prevSchedules, newSchedule]);
    };

    const handleUpdateSchedule = (updatedSchedule: ScheduleItem) => {
        setSchedules(prevSchedules => 
            prevSchedules.map(schedule => 
                schedule.id === updatedSchedule.id ? updatedSchedule : schedule
            )
        );
    };

    const handleDeleteSchedule = (scheduleId: string) => {
        setSchedules(prevSchedules => prevSchedules.filter(schedule => schedule.id !== scheduleId));
    };

    const handleAddChallenge = () => {
        if (challenges.length >= 5) {
            alert('도전은 최대 5개까지 추가할 수 있습니다.');
            return;
        }
        const newChallenge: ChallengeItem = {
            id: Date.now().toString(),
            name: '',
            startDate: getTodayDateString(),
            endDate: '',
            time: '',
            goal: '',
            achievements: [],
        };
        setChallenges(prev => [...prev, newChallenge]);
    };

    const handleUpdateChallenge = (updatedChallenge: ChallengeItem) => {
        setChallenges(prev => prev.map(c => c.id === updatedChallenge.id ? updatedChallenge : c));
    };

    const handleToggleChallengeAchievement = (challengeId: string, date: string) => {
        setChallenges(prevChallenges =>
            prevChallenges.map(challenge => {
                if (challenge.id === challengeId) {
                    const achievements = challenge.achievements || [];
                    const dateIndex = achievements.indexOf(date);
                    const newAchievements =
                        dateIndex > -1
                            ? [...achievements.slice(0, dateIndex), ...achievements.slice(dateIndex + 1)]
                            : [...achievements, date];
                    return { ...challenge, achievements: newAchievements };
                }
                return challenge;
            })
        );
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
            localStorage.setItem('taskData', JSON.stringify(tasks));
            localStorage.setItem('scheduleData', JSON.stringify(schedules));

            const entry = getEntryForDate(currentDate);
            const hasMeditationContent = Object.values(entry.meditation).some(val => val.trim() !== '');
            const hasJourneyItems = entry.journeyItems.some(item => item.title.trim() !== '');
            
            if (!hasMeditationContent && !hasJourneyItems) {
                const newJournalData = { ...journalData };
                delete newJournalData[currentDate];
                setJournalData(newJournalData);
                localStorage.setItem('journalData', JSON.stringify(newJournalData));
                alert('항목이 비어 있어 삭제되었습니다. 할일 및 일정 데이터는 저장되었습니다.');
            } else {
                localStorage.setItem('journalData', JSON.stringify(journalData));
                alert('저장되었습니다.');
            }
        } catch (error) {
            console.error("Failed to save data to localStorage", error);
        }
    };

    const currentEntry = getEntryForDate(currentDate);
    const savedDates = Object.keys(journalData)
        .filter(date => {
            const entry = journalData[date];
            if (!entry) return false;
            const hasMeditationContent = Object.values(entry.meditation).some(val => val.trim() !== '');
            const hasJourneyItems = entry.journeyItems && entry.journeyItems.some(item => item.title.trim() !== '');
            return hasMeditationContent || hasJourneyItems;
        })
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    const today = getTodayDateString();

    const filteredTasks = tasks
        .filter(task => {
            if (!task.dueDate) return false;
            if (currentDate === today) {
                return task.dueDate >= today;
            } else {
                return task.dueDate === currentDate;
            }
        })
        .sort((a, b) => {
            const dateTimeA = new Date(`${a.dueDate}T${a.dueTime || '00:00'}`);
            const dateTimeB = new Date(`${b.dueDate}T${b.dueTime || '00:00'}`);
            if (dateTimeA.getTime() !== dateTimeB.getTime()) {
                return dateTimeA.getTime() - dateTimeB.getTime();
            }
            const priorityOrder: { [key: string]: number } = { '상': 1, '중': 2, '하': 3 };
            return (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
        });

    const generateTwoWeekSchedules = (): DailySchedules[] => {
        const periodSchedules: DailySchedules[] = [];
        
        const [startY, startM, startD] = currentDate.split('-').map(Number);
        const startOfPeriod = new Date(startY, startM - 1, startD);

        for (let i = 0; i < 14; i++) {
            const checkDate = new Date(startOfPeriod);
            checkDate.setDate(startOfPeriod.getDate() + i);
            const checkDateString = checkDate.toISOString().split('T')[0];

            const schedulesForDay = schedules.filter(schedule => {
                const [sy, sm, sd] = schedule.startDate.split('-').map(Number);
                const scheduleStartDate = new Date(sy, sm - 1, sd);
               
                if (checkDate < scheduleStartDate) {
                    return false;
                }
                
                const recurrence = schedule.recurrence;

                if (!recurrence || recurrence.frequency === 'none') {
                    const [ey, em, ed] = schedule.endDate.split('-').map(Number);
                    const scheduleEndDate = new Date(ey, em - 1, ed);
                    return checkDate >= scheduleStartDate && checkDate <= scheduleEndDate;
                }
            
                const dayMap: ('SU' | 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA')[] = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

                switch (recurrence.frequency) {
                    case 'daily':
                        return true;
                    case 'weekly': {
                        const checkDay = dayMap[checkDate.getDay()];
                        if (recurrence.daysOfWeek && recurrence.daysOfWeek.length > 0) {
                            return recurrence.daysOfWeek.includes(checkDay);
                        }
                        const startDay = dayMap[scheduleStartDate.getDay()];
                        return checkDay === startDay;
                    }
                    case 'monthly':
                        return checkDate.getDate() === scheduleStartDate.getDate();
                    case 'yearly':
                        return checkDate.getDate() === scheduleStartDate.getDate() && checkDate.getMonth() === scheduleStartDate.getMonth();
                    default:
                        return false;
                }
            });

            if (schedulesForDay.length > 0) {
                periodSchedules.push({
                    date: checkDateString,
                    schedules: schedulesForDay.sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00')),
                });
            }
        }
        return periodSchedules;
    };
    
    const twoWeekSchedules = generateTwoWeekSchedules();

    return (
        <div className="min-h-screen container mx-auto p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-5xl mx-auto">
                <Header 
                    date={currentDate}
                    meditation={currentEntry.meditation}
                    onMeditationChange={handleMeditationChange}
                />
                <TaskList
                    tasks={filteredTasks}
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
                <ScheduleList
                    schedules={twoWeekSchedules}
                    onAddSchedule={handleAddSchedule}
                    onUpdateSchedule={handleUpdateSchedule}
                    onDeleteSchedule={handleDeleteSchedule}
                />
                <ChallengeList
                    challenges={challenges}
                    currentDate={currentDate}
                    onAddChallenge={handleAddChallenge}
                    onUpdateChallenge={handleUpdateChallenge}
                    onToggleChallengeAchievement={handleToggleChallengeAchievement}
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