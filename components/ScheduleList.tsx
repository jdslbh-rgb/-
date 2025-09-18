
import React from 'react';
import { ScheduleItem, DailySchedules } from '../types';
import ScheduleItemComponent from './ScheduleItem';

interface ScheduleListProps {
    schedules: DailySchedules[];
    onAddSchedule: () => void;
    onUpdateSchedule: (item: ScheduleItem) => void;
    onDeleteSchedule: (itemId: string) => void;
}

const ScheduleList: React.FC<ScheduleListProps> = ({ schedules, onAddSchedule, onUpdateSchedule, onDeleteSchedule }) => {
    return (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-slate-700">2주간의 일정</h2>
                <button
                    onClick={onAddSchedule}
                    className="flex items-center bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    일정 추가
                </button>
            </div>
            <div className="space-y-6">
                {schedules.length > 0 ? (
                    schedules.map(({ date, schedules: dailySchedules }) => {
                        const dateObj = new Date(date);
                        const timezoneOffset = dateObj.getTimezoneOffset() * 60000;
                        const adjustedDate = new Date(dateObj.getTime() + timezoneOffset);
                        const formattedDate = adjustedDate.toLocaleDateString('ko-KR', {
                            month: 'long',
                            day: 'numeric',
                            weekday: 'long',
                        });

                        return (
                            <div key={date}>
                                <h3 className="text-lg font-semibold text-slate-600 mb-3 pb-2 border-b border-slate-200">
                                    {formattedDate}
                                </h3>
                                <div className="space-y-4">
                                    {dailySchedules.map(item => (
                                        <ScheduleItemComponent
                                            key={item.id}
                                            item={item}
                                            onUpdate={onUpdateSchedule}
                                            onDelete={onDeleteSchedule}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-slate-500 text-center py-4">2주간 예정된 일정이 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default ScheduleList;
