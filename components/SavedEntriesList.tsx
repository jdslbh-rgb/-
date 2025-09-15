
import React from 'react';

interface SavedEntriesListProps {
    savedDates: string[];
    currentDate: string;
    onSelectDate: (date: string) => void;
}

const SavedEntriesList: React.FC<SavedEntriesListProps> = ({ savedDates, currentDate, onSelectDate }) => {
    if (savedDates.length === 0) {
        return (
            <div className="mt-8 bg-white p-6 rounded-xl shadow-md border border-slate-200">
                 <h2 className="text-2xl font-semibold text-slate-700 mb-4">저장된 날짜</h2>
                 <p className="text-slate-500">저장된 항목이 없습니다. 오늘의 여정을 기록하고 저장해보세요!</p>
            </div>
        );
    }

    return (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-700 mb-4">저장된 날짜</h2>
            <div className="flex flex-wrap gap-2">
                {savedDates.map(date => {
                    const isSelected = date === currentDate;
                    const dateObj = new Date(date);
                    // Adjust for timezone offset to prevent date changes
                    const timezoneOffset = dateObj.getTimezoneOffset() * 60000;
                    const adjustedDate = new Date(dateObj.getTime() + timezoneOffset);

                    const formattedDate = adjustedDate.toLocaleDateString('ko-KR', {
                        year: '2-digit',
                        month: 'numeric',
                        day: 'numeric',
                    });
                    
                    return (
                        <button
                            key={date}
                            onClick={() => onSelectDate(date)}
                            className={`py-1 px-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                                isSelected 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                        >
                            {formattedDate}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SavedEntriesList;
