import React from 'react';
import { JourneyItem } from '../types';
import JourneyItemComponent from './JourneyItem';

interface JourneyListProps {
    journeyItems: JourneyItem[];
    onAddJourneyItem: () => void;
    onUpdateJourneyItem: (item: JourneyItem) => void;
    onDeleteJourneyItem: (itemId: string) => void;
}

const JourneyList: React.FC<JourneyListProps> = ({ journeyItems, onAddJourneyItem, onUpdateJourneyItem, onDeleteJourneyItem }) => {
    return (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-slate-700">오늘의 여정</h2>
                <button
                    onClick={onAddJourneyItem}
                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    추가
                </button>
            </div>
            <div className="space-y-4">
                {journeyItems.length > 0 ? (
                    journeyItems.map(item => (
                        <JourneyItemComponent
                            key={item.id}
                            item={item}
                            onUpdate={onUpdateJourneyItem}
                            onDelete={onDeleteJourneyItem}
                        />
                    ))
                ) : (
                    <p className="text-slate-500 text-center py-4">오늘의 여정을 추가해보세요!</p>
                )}
            </div>
        </div>
    );
};

export default JourneyList;