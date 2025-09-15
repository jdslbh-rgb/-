import React from 'react';
import { Meditation } from '../types';

interface HeaderProps {
    date: string;
    meditation: Meditation;
    onMeditationChange: (meditation: Meditation) => void;
}

const Header: React.FC<HeaderProps> = ({ date, meditation, onMeditationChange }) => {
    const handleInputChange = (field: keyof Meditation, value: string) => {
        onMeditationChange({ ...meditation, [field]: value });
    };
    
    const formattedDate = new Date(date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    });

    return (
        <header className="mb-8">
            <h1 className="text-4xl font-bold text-slate-800 text-center mb-2">[제장로의 Ha-Up Room]</h1>
            <p className="text-center text-slate-500 text-lg mb-6">{formattedDate}</p>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                <h2 className="text-2xl font-semibold mb-4 text-slate-700">오늘의 묵상</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="scripture" className="block text-sm font-medium text-slate-600 mb-1">오늘의 본문</label>
                        <input
                            id="scripture"
                            type="text"
                            value={meditation.scripture}
                            onChange={(e) => handleInputChange('scripture', e.target.value)}
                            placeholder="예: 요한복음 3장 16절"
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>
                    <div>
                        <label htmlFor="godsPresence" className="block text-sm font-medium text-slate-600 mb-1">오늘 동행할 하나님</label>
                        <textarea
                            id="godsPresence"
                            rows={3}
                            value={meditation.godsPresence}
                            onChange={(e) => handleInputChange('godsPresence', e.target.value)}
                            placeholder="오늘 본문을 통해 만난 하나님은 어떤 분이신가요?"
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>
                    <div>
                        <label htmlFor="reflection" className="block text-sm font-medium text-slate-600 mb-1">묵상</label>
                        <textarea
                            id="reflection"
                            rows={3}
                            value={meditation.reflection}
                            onChange={(e) => handleInputChange('reflection', e.target.value)}
                            placeholder="본문을 통해 깨달은 점을 기록하세요."
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>
                    <div>
                        <label htmlFor="prayer" className="block text-sm font-medium text-slate-600 mb-1">기도</label>
                        <textarea
                            id="prayer"
                            rows={3}
                            value={meditation.prayer}
                            onChange={(e) => handleInputChange('prayer', e.target.value)}
                            placeholder="묵상을 바탕으로 기도문을 작성하세요."
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;