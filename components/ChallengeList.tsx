
import React from 'react';
import { ChallengeItem } from '../types';
import ChallengeItemComponent from './ChallengeItem';

interface ChallengeListProps {
    challenges: ChallengeItem[];
    currentDate: string;
    onAddChallenge: () => void;
    onUpdateChallenge: (item: ChallengeItem) => void;
    onToggleChallengeAchievement: (challengeId: string, date: string) => void;
}

const ChallengeList: React.FC<ChallengeListProps> = ({ challenges, currentDate, onAddChallenge, onUpdateChallenge, onToggleChallengeAchievement }) => {
    return (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-slate-700">매일 도전</h2>
                <button
                    onClick={onAddChallenge}
                    disabled={challenges.length >= 5}
                    className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    도전 추가
                </button>
            </div>
            <div className="space-y-4">
                {challenges.length > 0 ? (
                    challenges.map(item => (
                        <ChallengeItemComponent
                            key={item.id}
                            item={item}
                            currentDate={currentDate}
                            onUpdate={onUpdateChallenge}
                            onToggleAchievement={onToggleChallengeAchievement}
                        />
                    ))
                ) : (
                    <p className="text-slate-500 text-center py-4">매일 도전할 항목을 추가해보세요!</p>
                )}
            </div>
        </div>
    );
};

export default ChallengeList;
