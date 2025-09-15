
import React from 'react';
import { Task } from '../types';

interface TaskItemProps {
    task: Task;
    onUpdate: (task: Task) => void;
    onDelete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
    // This allows graceful migration from old data structure (scope, link)
    const legacyTask = task as Task & { scope?: string; link?: string };

    const handleInputChange = (field: keyof Task, value: string | boolean) => {
        onUpdate({ ...task, [field]: value });
    };

    return (
        <div className={`p-3 rounded-lg border flex items-center gap-3 transition-all duration-300 flex-wrap sm:flex-nowrap ${task.completed ? 'bg-slate-100 border-slate-200' : 'bg-white border-slate-300'}`}>
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
                className={`flex-grow min-w-[150px] text-md bg-transparent focus:outline-none focus:bg-slate-50 rounded p-1 -m-1 ${task.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}
            />
            <select
                value={task.priority || legacyTask.scope || '중'}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className={`w-28 text-sm p-1.5 border rounded-md bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 flex-shrink-0 ${task.completed ? 'text-slate-400 bg-slate-50' : 'text-slate-700'}`}
                aria-label="Task priority"
            >
                <option value="상">중요도: 상</option>
                <option value="중">중요도: 중</option>
                <option value="하">중요도: 하</option>
            </select>
            <input
                type="text"
                value={task.memo || legacyTask.link || ''}
                onChange={(e) => handleInputChange('memo', e.target.value)}
                placeholder="메모"
                className={`w-40 text-sm p-1.5 border-b bg-transparent focus:outline-none focus:border-blue-500 flex-shrink-0 ${task.completed ? 'text-slate-400' : 'text-slate-600'}`}
            />
            <button
                onClick={() => onDelete(task.id)}
                className="text-slate-400 hover:text-red-500 transition-colors ml-auto flex-shrink-0"
                aria-label="Delete task"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
};

export default TaskItem;