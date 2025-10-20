import React, { useState } from 'react';
import { Task, Status, Member } from '../types';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
  tasks: Task[];
  members: Member[];
  assigners: Member[];
  onUpdateTaskStatus: (taskId: string, newStatus: Status) => void;
  onToggleTaskArchiveStatus: (taskId: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, members, assigners, onUpdateTaskStatus, onToggleTaskArchiveStatus }) => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDrop = (newStatus: Status) => {
    if (draggedTask) {
      onUpdateTaskStatus(draggedTask.id, newStatus);
      setDraggedTask(null);
    }
  };

  const columns: { status: Status; title: string }[] = [
    { status: 'todo', title: 'Cần làm' },
    { status: 'inprogress', title: 'Đang làm' },
    { status: 'waitingfeedback', title: 'Chờ feedback' },
    { status: 'feedback', title: 'Chỉnh theo feedback' },
    { status: 'cancelled', title: 'Hủy bỏ' },
    { status: 'done', title: 'Hoàn thành' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {columns.map(({ status, title }) => (
        <KanbanColumn
          key={status}
          status={status}
          title={title}
          tasks={tasks.filter(task => task.status === status)}
          members={members}
          assigners={assigners}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
          onToggleTaskArchiveStatus={onToggleTaskArchiveStatus}
          isDraggingOver={draggedTask !== null && draggedTask.status !== status}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;