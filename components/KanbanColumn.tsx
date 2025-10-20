import React, { useMemo } from 'react';
import { Task, Status, Member } from '../types';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  status: Status;
  title: string;
  tasks: Task[];
  members: Member[];
  assigners: Member[];
  onDrop: (status: Status) => void;
  onDragStart: (task: Task) => void;
  onToggleTaskArchiveStatus: (taskId: string) => void;
  isDraggingOver: boolean;
}

const statusConfig = {
    todo: {
        bg: 'bg-blue-900/20',
        text: 'text-blue-300',
        border: 'border-blue-500',
        dropBg: 'bg-blue-500/20'
    },
    inprogress: {
        bg: 'bg-yellow-900/20',
        text: 'text-yellow-300',
        border: 'border-yellow-500',
        dropBg: 'bg-yellow-500/20'
    },
    waitingfeedback: {
        bg: 'bg-purple-900/20',
        text: 'text-purple-300',
        border: 'border-purple-500',
        dropBg: 'bg-purple-500/20'
    },
    feedback: {
        bg: 'bg-orange-900/20',
        text: 'text-orange-300',
        border: 'border-orange-500',
        dropBg: 'bg-orange-500/20'
    },
    cancelled: {
        bg: 'bg-slate-700/30',
        text: 'text-slate-400',
        border: 'border-slate-500',
        dropBg: 'bg-slate-500/20'
    },
    done: {
        bg: 'bg-green-900/20',
        text: 'text-green-300',
        border: 'border-green-500',
        dropBg: 'bg-green-500/20'
    }
}


const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, title, tasks, members, assigners, onDrop, onDragStart, onToggleTaskArchiveStatus, isDraggingOver }) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDrop(status);
  };
  
  const config = statusConfig[status];

  const sortedTasks = useMemo(() => {
    const taskList = [...tasks];
    if (status === 'todo') {
      // Sắp xếp các task có deadline gần nhất ở trên cùng (ngày xa nhất ở dưới cùng)
      taskList.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } else {
      taskList.sort((a, b) => a.order - b.order);
    }
    return taskList;
  }, [tasks, status]);

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`rounded-xl p-4 min-h-[300px] transition-colors duration-300 border-2 border-transparent ${config.bg} ${isDraggingOver ? config.dropBg + ' border-dashed ' + config.border : ''}`}
    >
      <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${config.border}`}>
        <h3 className={`font-bold text-lg ${config.text}`}>{title}</h3>
        <span className={`px-3 py-1 text-sm font-semibold rounded-full bg-slate-900/50 ${config.text}`}>
          {tasks.length}
        </span>
      </div>
      <div className="space-y-4">
        {sortedTasks.map(task => (
          <TaskCard key={task.id} task={task} members={members} assigners={assigners} onDragStart={onDragStart} onToggleTaskArchiveStatus={onToggleTaskArchiveStatus} />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;