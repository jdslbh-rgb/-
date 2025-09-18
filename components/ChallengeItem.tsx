
import React, { useMemo } from 'react';
import { ChallengeItem } from '../types';

interface ChallengeItemComponentProps {
    item: ChallengeItem;
    currentDate: string;
    onUpdate: (item: ChallengeItem) => void;
    onToggleAchievement: (challengeId: string, date: string) => void;
}

const ChallengeItemComponent: React.FC<ChallengeItemComponentProps> = ({ item, currentDate, onUpdate, onToggleAchievement }) => {
    const handleInputChange = (field: keyof ChallengeItem, value: string) => {
        onUpdate({ ...item, [field]: value });
    };

    const handleReplaceChallenge = () => {
        if (window.confirm('종목을 교체하시겠습니까? 현재 도전의 달성 기록이 초기화됩니다.')) {
            const today = new Date().toISOString().split('T')[0];
            onUpdate({
                ...item,
                name: '',
                goal: '',
                time: '',
                startDate: today,
                endDate: '',
                achievements: [],
            });
        }
    };
    
    const achievementRate = useMemo(() => {
        if (!item.startDate) return 0;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startDate = new Date(item.startDate);
        startDate.setHours(0, 0, 0, 0);
        
        if (startDate > today) return 0;

        const endDate = item.endDate ? new Date(item.endDate) : today;
        endDate.setHours(0, 0, 0, 0);

        const effectiveEndDate = today < endDate ? today : endDate;

        if (effectiveEndDate < startDate) return 0;
        
        const totalDays = Math.round((effectiveEndDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        
        const achievedCount = (item.achievements || []).filter(dateStr => {
            const achievementDate = new Date(dateStr);
            achievementDate.setHours(0, 0, 0, 0);
            return achievementDate >= startDate && achievementDate <= effectiveEndDate;
        }).length;

        if (totalDays <= 0) return 0;
        
        return Math.round((achievedCount / totalDays) * 100);
    }, [item.startDate, item.endDate, item.achievements]);

    const isAchievedToday = (item.achievements || []).includes(currentDate);

    return (
        <div className="p-4 rounded-lg border border-slate-300 bg-white flex flex-col gap-3">
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={isAchievedToday}
                    onChange={() => onToggleAchievement(item.id, currentDate)}
                    className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer flex-shrink-0"
                    aria-label={`Mark challenge ${item.name} as complete for ${currentDate}`}
                />
                <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="도전 종목"
                    className="flex-grow text-lg font-semibold bg-transparent focus:outline-none focus:bg-slate-50 rounded p-1 -m-1 text-slate-800"
                />
                <button
                    onClick={handleReplaceChallenge}
                    className="text-xs bg-slate-200 text-slate-600 hover:bg-slate-300 font-semibold py-1 px-3 rounded-md transition-colors flex-shrink-0"
                    aria-label="Replace challenge"
                >
                    종목교체
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 pl-8">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500 w-20 shrink-0">도전 시작일:</span>
                    <input type="date" value={item.startDate} onChange={(e) => handleInputChange('startDate', e.target.value)} className="flex-grow text-sm p-1.5 border-b bg-transparent focus:outline-none focus:border-green-500 text-slate-600"/>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500 w-20 shrink-0">도전 종료일:</span>
                    <input type="date" value={item.endDate} onChange={(e) => handleInputChange('endDate', e.target.value)} className="flex-grow text-sm p-1.5 border-b bg-transparent focus:outline-none focus:border-green-500 text-slate-600"/>
                </div>
                 <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500 w-20 shrink-0">도전 시간:</span>
                    <input type="time" value={item.time} onChange={(e) => handleInputChange('time', e.target.value)} className="flex-grow text-sm p-1.5 border-b bg-transparent focus:outline-none focus:border-green-500 text-slate-600"/>
                </div>
                <div className="flex items-center gap-2">
                     <span className="text-sm font-medium text-slate-500 w-20 shrink-0">달성률:</span>
                    <div className="flex items-center w-full">
                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${achievementRate}%` }}></div>
                        </div>
                        <span className="text-sm font-semibold text-slate-600 ml-2 w-12 text-right">{achievementRate}%</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                    <span className="text-sm font-medium text-slate-500 w-20 shrink-0">도전 목표:</span>
                    <input type="text" value={item.goal} onChange={(e) => handleInputChange('goal', e.target.value)} placeholder="도전 목표" className="flex-grow text-sm p-1.5 border-b bg-transparent focus:outline-none focus:border-green-500 text-slate-600"/>
                </div>
            </div>
        </div>
    );
};

export default ChallengeItemComponent;
