import React from 'react';
import { Task } from '../types';

interface TaskItemProps {
    task: Task;
    onUpdate: (task: Task) => void;
    onDelete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
    const handleInputChange = (field: keyof Task, value: string | boolean) => {
        onUpdate({ ...task, [field]: value });
    };

    return (
        <div className={`p-4 rounded-lg border flex flex-col gap-3 transition-all duration-300 ${task.completed ? 'bg-slate-100 border-slate-200 opacity-70' : 'bg-white border-slate-300'}`}>
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => handleInputChange('completed', e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer flex-shrink-0"
                    aria-label="Complete task"
                />
                <input
                    type="text"
                    value={task.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="할일 제목"
                    className={`flex-grow text-lg font-semibold bg-transparent focus:outline-none focus:bg-slate-50 rounded p-1 -m-1 ${task.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}
                />
                <button
                    onClick={() => onDelete(task.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
                    aria-label="Delete task"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 pl-8">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500 w-16 shrink-0">중요도:</span>
                    <select
                        value={task.priority}
                        onChange={(e) => handleInputChange('priority', e.target.value)}
                        className={`w-full text-sm p-1 border-b bg-transparent focus:outline-none focus:border-blue-500 ${task.completed ? 'text-slate-400 bg-slate-50' : 'text-slate-700'}`}
                        aria-label="Task priority"
                    >
                        <option value="상">상</option>
                        <option value="중">중</option>
                        <option value="하">하</option>
                    </select>
                </div>
                <div /> 
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500 w-16 shrink-0">마감 날짜:</span>
                    <input
                        type="date"
                        value={task.dueDate}
                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                        className={`flex-grow text-sm p-1.5 border-b bg-transparent focus:outline-none focus:border-blue-500 ${task.completed ? 'text-slate-400' : 'text-slate-600'}`}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500 w-16 shrink-0">마감 시간:</span>
                    <input
                        type="time"
                        value={task.dueTime}
                        onChange={(e) => handleInputChange('dueTime', e.target.value)}
                        className={`flex-grow text-sm p-1.5 border-b bg-transparent focus:outline-none focus:border-blue-500 ${task.completed ? 'text-slate-400' : 'text-slate-600'}`}
                    />
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                    <span className="text-sm font-medium text-slate-500 w-16 shrink-0">메모:</span>
                    <input
                        type="text"
                        value={task.memo}
                        onChange={(e) => handleInputChange('memo', e.target.value)}
                        placeholder="메모"
                        className={`flex-grow text-sm p-1.5 border-b bg-transparent focus:outline-none focus:border-blue-500 ${task.completed ? 'text-slate-400' : 'text-slate-600'}`}
                    />
                </div>
            </div>
        </div>
    );
};

export default TaskItem;
