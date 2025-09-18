
import React from 'react';
import { ScheduleItem, RecurrenceRule } from '../types';

interface ScheduleItemComponentProps {
    item: ScheduleItem;
    onUpdate: (item: ScheduleItem) => void;
    onDelete: (itemId: string) => void;
}

const ScheduleItemComponent: React.FC<ScheduleItemComponentProps> = ({ item, onUpdate, onDelete }) => {
    const handleInputChange = (field: keyof ScheduleItem, value: string | boolean) => {
        onUpdate({ ...item, [field]: value });
    };

    const handleRecurrenceChange = (field: keyof RecurrenceRule, value: any) => {
        const newRecurrence = { ...(item.recurrence || { frequency: 'none' }), [field]: value };
        onUpdate({ ...item, recurrence: newRecurrence });
    };

    const dayLabels: { [key: string]: string } = { SU: '일', MO: '월', TU: '화', WE: '수', TH: '목', FR: '금', SA: '토' };
    const weekDays: ('SU' | 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA')[] = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

    return (
        <div className={`p-4 rounded-lg border flex flex-col gap-3 transition-all duration-300 ${item.completed ? 'bg-slate-100 border-slate-200 opacity-70' : 'bg-white border-slate-300'}`}>
            <div className="flex items-center gap-3">
                 <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={(e) => handleInputChange('completed', e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer flex-shrink-0"
                    aria-label="Complete schedule item"
                />
                <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="일정 제목"
                    className={`flex-grow text-lg font-semibold bg-transparent focus:outline-none focus:bg-slate-50 rounded p-1 -m-1 ${item.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}
                />
                 <button
                    onClick={() => onDelete(item.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
                    aria-label="Delete schedule item"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="http://www.w3.org/2000/svg" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 pl-8">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500 w-16 shrink-0">시작 날짜:</span>
                    <input
                        type="date"
                        value={item.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className={`flex-grow text-sm p-1.5 border-b bg-transparent focus:outline-none focus:border-indigo-500 ${item.completed ? 'text-slate-400' : 'text-slate-600'}`}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500 w-16 shrink-0">시작 시간:</span>
                    <input
                        type="time"
                        value={item.startTime}
                        onChange={(e) => handleInputChange('startTime', e.target.value)}
                        className={`flex-grow text-sm p-1.5 border-b bg-transparent focus:outline-none focus:border-indigo-500 ${item.completed ? 'text-slate-400' : 'text-slate-600'}`}
                    />
                </div>
                 <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500 w-16 shrink-0">종료 날짜:</span>
                    <input
                        type="date"
                        value={item.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className={`flex-grow text-sm p-1.5 border-b bg-transparent focus:outline-none focus:border-indigo-500 ${item.completed ? 'text-slate-400' : 'text-slate-600'}`}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500 w-16 shrink-0">종료 시간:</span>
                    <input
                        type="time"
                        value={item.endTime}
                        onChange={(e) => handleInputChange('endTime', e.target.value)}
                        className={`flex-grow text-sm p-1.5 border-b bg-transparent focus:outline-none focus:border-indigo-500 ${item.completed ? 'text-slate-400' : 'text-slate-600'}`}
                    />
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                    <span className="text-sm font-medium text-slate-500 w-16 shrink-0">반복:</span>
                    <select
                        value={item.recurrence?.frequency || 'none'}
                        onChange={(e) => {
                            const newFrequency = e.target.value as RecurrenceRule['frequency'];
                            const newRecurrence = { ...(item.recurrence || {}), frequency: newFrequency };
                            if (newFrequency !== 'weekly') {
                                delete newRecurrence.daysOfWeek;
                            }
                            onUpdate({ ...item, recurrence: newRecurrence });
                        }}
                        className={`flex-grow text-sm p-1.5 border-b bg-transparent focus:outline-none focus:border-indigo-500 ${item.completed ? 'text-slate-400' : 'text-slate-600'}`}
                    >
                        <option value="none">안 함</option>
                        <option value="daily">매일</option>
                        <option value="weekly">매주</option>
                        <option value="monthly">매월</option>
                        <option value="yearly">매년</option>
                    </select>
                </div>

                {item.recurrence?.frequency === 'weekly' && (
                    <div className="flex items-center gap-2 sm:col-span-2 sm:pl-20">
                        <div className="flex flex-wrap gap-1">
                            {weekDays.map((day) => {
                                const isChecked = item.recurrence?.daysOfWeek?.includes(day);
                                return (
                                    <button
                                        key={day}
                                        onClick={() => {
                                            const currentDays = item.recurrence?.daysOfWeek || [];
                                            const newDays = isChecked
                                                ? currentDays.filter(d => d !== day)
                                                : [...currentDays, day];
                                            handleRecurrenceChange('daysOfWeek', newDays);
                                        }}
                                        className={`w-8 h-8 rounded-full text-xs font-bold transition-colors flex items-center justify-center ${
                                            isChecked
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                        }`}
                                    >
                                        {dayLabels[day]}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
                 <div className="flex items-center gap-2 sm:col-span-2">
                    <span className="text-sm font-medium text-slate-500 w-16 shrink-0">장소:</span>
                    <input
                        type="text"
                        value={item.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="장소"
                        className={`flex-grow text-sm p-1.5 border-b bg-transparent focus:outline-none focus:border-indigo-500 ${item.completed ? 'text-slate-400' : 'text-slate-600'}`}
                    />
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                    <span className="text-sm font-medium text-slate-500 w-16 shrink-0">메모:</span>
                    <input
                        type="text"
                        value={item.memo}
                        onChange={(e) => handleInputChange('memo', e.target.value)}
                        placeholder="메모"
                        className={`flex-grow text-sm p-1.5 border-b bg-transparent focus:outline-none focus:border-indigo-500 ${item.completed ? 'text-slate-400' : 'text-slate-600'}`}
                    />
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                     <span className="text-sm font-medium text-slate-500 w-16 shrink-0">링크:</span>
                     <input
                        type="text"
                        value={item.link}
                        onChange={(e) => handleInputChange('link', e.target.value)}
                        placeholder="https://example.com"
                        className={`flex-grow text-sm p-1.5 border-b bg-transparent focus:outline-none focus:border-indigo-500 ${item.completed ? 'text-slate-400' : 'text-slate-600'}`}
                    />
                </div>
            </div>
        </div>
    );
};

export default ScheduleItemComponent;