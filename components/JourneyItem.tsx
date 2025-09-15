import React from 'react';
import { JourneyItem } from '../types';

interface JourneyItemComponentProps {
    item: JourneyItem;
    onUpdate: (item: JourneyItem) => void;
    onDelete: (itemId: string) => void;
}

const JourneyItemComponent: React.FC<JourneyItemComponentProps> = ({ item, onUpdate, onDelete }) => {
    const handleInputChange = (field: keyof JourneyItem, value: string | boolean) => {
        onUpdate({ ...item, [field]: value });
    };

    return (
        <div className={`p-3 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center gap-3 transition-all duration-300 ${item.completed ? 'bg-slate-100 border-slate-200' : 'bg-white border-slate-300'}`}>
            <div className="flex items-center w-full sm:w-auto">
                <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={(e) => handleInputChange('completed', e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer flex-shrink-0"
                    aria-label="Complete journey item"
                />
                <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="여정 제목"
                    className={`flex-grow sm:flex-initial sm:w-48 ml-3 text-md bg-transparent focus:outline-none focus:bg-slate-50 rounded p-1 -m-1 ${item.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}
                />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-grow w-full sm:w-auto">
                 <input
                    type="text"
                    value={item.scope}
                    onChange={(e) => handleInputChange('scope', e.target.value)}
                    placeholder="범위"
                    className={`w-full sm:w-32 text-sm p-1.5 border-b bg-transparent focus:outline-none focus:border-blue-500 ${item.completed ? 'text-slate-400' : 'text-slate-600'}`}
                />
                <input
                    type="text"
                    value={item.link}
                    onChange={(e) => handleInputChange('link', e.target.value)}
                    placeholder="링크"
                    className={`w-full sm:w-auto flex-grow text-sm p-1.5 border-b bg-transparent focus:outline-none focus:border-blue-500 ${item.completed ? 'text-slate-400' : 'text-slate-600'}`}
                />
            </div>
            <button
                onClick={() => onDelete(item.id)}
                className="text-slate-400 hover:text-red-500 transition-colors sm:ml-auto flex-shrink-0 self-center"
                aria-label="Delete journey item"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
};

export default JourneyItemComponent;