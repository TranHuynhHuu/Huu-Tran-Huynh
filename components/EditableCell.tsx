import React, { useState, useEffect, useRef } from 'react';
import { Task } from '../types';

type EditableCellProps = {
    task: Task;
    field: keyof Task;
    onUpdateTask: (updatedTask: Task) => void;
    editingCell: { taskId: string; field: keyof Task } | null;
    setEditingCell: (cell: { taskId: string; field: keyof Task } | null) => void;
    children: React.ReactNode;
    options?: { value: string; label: string }[];
    type?: 'text' | 'date' | 'datetime-local' | 'textarea' | 'email';
};

const EditableCell: React.FC<EditableCellProps> = ({
    task,
    field,
    onUpdateTask,
    editingCell,
    setEditingCell,
    children,
    options,
    type = 'text',
}) => {
    const [value, setValue] = useState<string>(task[field] as string || '');
    const inputRef = useRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(null);
    const isEditing = editingCell?.taskId === task.id && editingCell?.field === field;

    useEffect(() => {
        if (isEditing) {
            // Cập nhật giá trị ban đầu khi bắt đầu chỉnh sửa
            setValue(task[field] as string || '');
            inputRef.current?.focus();
        }
    }, [isEditing, field, task]);
    
    const handleSave = () => {
        if (value !== (task[field] as string)) {
            const updatedTask = { ...task, [field]: value };
            onUpdateTask(updatedTask);
        }
        setEditingCell(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && type !== 'textarea') {
            handleSave();
        } else if (e.key === 'Escape') {
            setValue(task[field] as string || '');
            setEditingCell(null);
        }
    };
    
    if (isEditing) {
        if (options) {
            return (
                <select
                    ref={inputRef as React.Ref<HTMLSelectElement>}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-slate-600 border border-indigo-500 rounded-md p-1 text-white focus:ring-2 focus:ring-indigo-400 outline-none"
                >
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            );
        }

        if (type === 'textarea') {
             return (
                <textarea
                    ref={inputRef as React.Ref<HTMLTextAreaElement>}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-slate-600 border border-indigo-500 rounded-md p-1 text-white focus:ring-2 focus:ring-indigo-400 outline-none text-sm"
                    rows={2}
                />
            );
        }

        return (
            <input
                ref={inputRef as React.Ref<HTMLInputElement>}
                type={type}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className={`w-full bg-slate-600 border border-indigo-500 rounded-md p-1 text-white focus:ring-2 focus:ring-indigo-400 outline-none ${type.includes('date') ? 'calendar-picker-indicator-white' : ''}`}
            />
        );
    }

    return (
        <div 
            onClick={() => setEditingCell({ taskId: task.id, field })} 
            className="group cursor-pointer w-full h-full p-1 -m-1 rounded flex items-center justify-between transition-colors hover:bg-slate-700/70"
        >
           <div className="truncate pr-2">{children}</div>
           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
           </svg>
        </div>
    );
};

export default EditableCell;