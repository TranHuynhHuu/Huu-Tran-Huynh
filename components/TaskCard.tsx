import React, { useMemo } from 'react';
import { Task, Member } from '../types';

interface TaskCardProps {
  task: Task;
  members: Member[];
  assigners: Member[];
  onDragStart: (task: Task) => void;
  onToggleTaskArchiveStatus: (taskId: string) => void;
}

const formatDate = (dateString: string) => {
    if (!dateString) return dateString;
    const datePart = dateString.split('T')[0];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return datePart;
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, members, assigners, onDragStart, onToggleTaskArchiveStatus }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(task);
  };

  const assignedByMember = useMemo(() => {
    return assigners.find(m => m.id === task.assignedBy);
  }, [assigners, task.assignedBy]);
  
  const daysRemaining = useMemo(() => {
    const deadline = new Date(task.deadline);
    const today = new Date();
    deadline.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = deadline.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [task.deadline]);
  
  const deadlineColor = daysRemaining < 0 ? 'text-red-400' : daysRemaining <= 3 ? 'text-yellow-400' : 'text-slate-400';
  
  const isEmail = (str?: string) => str && str.includes('@') && !str.startsWith('http');
  const linkIsEmail = isEmail(task.email);
  
  const linkIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" /></svg>
  );

  const emailIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
  );

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-slate-800/80 p-4 rounded-lg shadow-lg cursor-grab active:cursor-grabbing border border-slate-700/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-500/50"
    >
      <div className="flex justify-between items-start mb-2">
         <p className="text-sm font-medium text-indigo-300">{task.brandName}</p>
        <div className="flex items-center space-x-2">
            {task.notes && (
                <div className="relative group flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="absolute bottom-full mb-2 w-64 bg-slate-900 text-slate-200 text-xs rounded py-2 px-3 right-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 border border-slate-700 shadow-lg">
                        <p className="font-semibold mb-1 border-b border-slate-600 pb-1">Ghi chú:</p>
                        <p className="whitespace-pre-wrap break-words">{task.notes}</p>
                        <div className="absolute -bottom-1 right-1/2 translate-x-1/2 w-2 h-2 bg-slate-900 transform rotate-45 border-r border-b border-slate-700"></div>
                    </div>
                </div>
            )}
            {task.email && (
                <a 
                    draggable="false"
                    href={linkIsEmail ? `mailto:${task.email}` : task.email}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    title={task.email} 
                    className="flex items-center space-x-1.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-indigo-300 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors"
                >
                    {linkIsEmail ? emailIcon : linkIcon}
                    <span>{task.emailText || (linkIsEmail ? 'Mail' : 'Link')}</span>
                </a>
            )}
             <button
                onClick={() => onToggleTaskArchiveStatus(task.id)}
                title="Ẩn công việc"
                className="text-slate-400 hover:text-yellow-400 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                  <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
      </div>

      <h4 className="font-bold text-md text-slate-100 break-words w-full mb-3">
        {task.link ? (
          <a href={task.link} target="_blank" rel="noopener noreferrer" className="hover:underline inline-flex items-center gap-1.5 group">
            <span>{task.title}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
          </a>
        ) : (
          task.title
        )}
      </h4>
      <p className="text-xs text-slate-400 mb-4 px-2 py-1 bg-slate-700/50 rounded-full inline-block">{task.format}</p>

      <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-700">
        <div className="flex items-center space-x-2 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${deadlineColor}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 10.586V6z" clipRule="evenodd" />
            </svg>
            <span className={deadlineColor}>
                {`Hạn chót: ${formatDate(task.deadline)}`}
            </span>
        </div>
        {assignedByMember && (
          <div className="text-xs text-slate-400 px-2 py-1 bg-slate-700/50 rounded-full" title={`Giao bởi: ${assignedByMember.name}`}>
            <span>{assignedByMember.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;