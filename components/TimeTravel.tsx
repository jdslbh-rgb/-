
import React from 'react';

interface TimeTravelProps {
    onDateChange: (daysAgo: number) => void;
    onReturnToToday: () => void;
    today: string;
    currentDate: string;
    reviewedDates: Set<string>;
}

const TimeTravel: React.FC<TimeTravelProps> = ({ onDateChange, onReturnToToday, today, currentDate, reviewedDates }) => {
    const timeIntervals = [1, 3, 7, 14, 30];

    const isToday = currentDate === today;

    return (
        <div className="mt-8 p-4 bg-white rounded-xl shadow-md border border-slate-200 flex flex-wrap items-center justify-center gap-2">
            {!isToday && (
                <button
                    onClick={onReturnToToday}
                    className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105"
                >
                    오늘로
                </button>
            )}
            {timeIntervals.map(days => {
                const date = new Date(today);
                date.setDate(date.getDate() - days);
                const dateString = date.toISOString().split('T')[0];
                const isReviewed = reviewedDates.has(dateString);

                const buttonClass = isReviewed
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-blue-500 hover:bg-blue-600';
                
                return (
                    <button
                        key={days}
                        onClick={() => onDateChange(days)}
                        className={`${buttonClass} text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200`}
                    >
                        {days}일 전
                    </button>
                );
            })}
        </div>
    );
};

export default TimeTravel;