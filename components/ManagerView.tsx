import React, { useState, useMemo } from 'react';
import { Task, Member, Status, BrandInfo } from '../types';
import TaskFormModal from './TaskFormModal';
import SettingsModal from './SettingsModal';
import EditableCell from './EditableCell';
import NewTaskRow from './NewTaskRow';

interface ManagerViewProps {
  tasks: Task[];
  members: Member[];
  brands: BrandInfo[];
  formats: string[];
  assigners: Member[];
  onSetMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  onSetBrands: React.Dispatch<React.SetStateAction<BrandInfo[]>>;
  onSetFormats: React.Dispatch<React.SetStateAction<string[]>>;
  onSetAssigners: React.Dispatch<React.SetStateAction<Member[]>>;
  onAddTask: (task?: Omit<Task, 'id' | 'order' | 'status' | 'isArchived'>) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onCopyTask: (taskId: string) => void;
  onToggleTaskArchiveStatus: (taskId: string) => void;
}

const statusOptions: { value: Status; label: string; }[] = [
    { value: 'todo', label: 'Cần làm' },
    { value: 'inprogress', label: 'Đang làm' },
    { value: 'waitingfeedback', label: 'Chờ feedback' },
    { value: 'feedback', label: 'Chỉnh theo feedback' },
    { value: 'cancelled', label: 'Hủy bỏ' },
    { value: 'done', label: 'Hoàn thành' },
];

const statusDisplay: Record<Status, { text: string; classes: string }> = {
  todo: { text: 'Cần làm', classes: 'bg-blue-500/10 text-blue-300' },
  inprogress: { text: 'Đang làm', classes: 'bg-yellow-500/10 text-yellow-300' },
  waitingfeedback: { text: 'Chờ feedback', classes: 'bg-purple-500/10 text-purple-300' },
  feedback: { text: 'Chỉnh theo feedback', classes: 'bg-orange-500/10 text-orange-300' },
  cancelled: { text: 'Hủy bỏ', classes: 'bg-slate-600/20 text-slate-400' },
  done: { text: 'Hoàn thành', classes: 'bg-green-500/10 text-green-300' },
};

const formatDate = (dateString: string) => {
    if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString.split('T')[0])) return dateString;
    const [year, month, day] = dateString.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
};

const ManagerView: React.FC<ManagerViewProps> = ({ 
    tasks, members, brands, formats, assigners,
    onSetMembers, onSetBrands, onSetFormats, onSetAssigners,
    onAddTask, onUpdateTask, onDeleteTask, onCopyTask, onToggleTaskArchiveStatus
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');
  const [showArchive, setShowArchive] = useState(false);
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');
  const [editingCell, setEditingCell] = useState<{ taskId: string; field: keyof Task } | null>(null);
  const [editingLink, setEditingLink] = useState<{ taskId: string; text: string; url: string } | null>(null);
  const [editingTitle, setEditingTitle] = useState<{ taskId: string; title: string; link: string } | null>(null);
  
  const newTask = useMemo(() => tasks.find(t => t.id.startsWith('task-new-')), [tasks]);

  const brandOptions = useMemo(() => ['all', ...brands.map(b => b.name)], [brands]);
  const formatOptions = useMemo(() => formats.map(f => ({ value: f, label: f })), [formats]);
  const memberOptions = useMemo(() => members.map(m => ({ value: m.id, label: m.name })), [members]);
  const assignerOptions = useMemo(() => assigners.map(a => ({ value: a.id, label: a.name })), [assigners]);
  const brandEditableOptions = useMemo(() => brands.map(b => ({ value: b.name, label: b.name })), [brands]);


  const assigneeMap = useMemo(() => {
    return members.reduce((acc, member) => {
      acc[member.id] = member;
      return acc;
    }, {} as Record<string, Member>);
  }, [members]);

  const assignerMap = useMemo(() => {
    return assigners.reduce((acc, member) => {
      acc[member.id] = member;
      return acc;
    }, {} as Record<string, Member>);
  }, [assigners]);

  const brandMap = useMemo(() => {
    return brands.reduce((acc, brand) => {
        acc[brand.name] = brand;
        return acc;
    }, {} as Record<string, BrandInfo>);
  }, [brands]);

  const activeTasks = useMemo(() => tasks.filter(task => !task.isArchived && !task.id.startsWith('task-new-')), [tasks]);
  const archivedTasks = useMemo(() => tasks.filter(task => task.isArchived), [tasks]);
  
  const filteredAndSortedTasks = useMemo(() => {
    let filteredTasks = activeTasks;

    if (selectedBrand !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.brandName === selectedBrand);
    }

    if (selectedAssignee !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.assignedTo === selectedAssignee);
    }

    return [...filteredTasks].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  }, [activeTasks, selectedBrand, selectedAssignee]);

  const archiveFilterOptions = useMemo(() => {
    const years = new Set<string>();
    const months = new Set<string>();
    archivedTasks.forEach(task => {
        const deadline = new Date(task.deadline);
        if (!isNaN(deadline.getTime())) {
            years.add(deadline.getFullYear().toString());
            months.add((deadline.getMonth() + 1).toString());
        }
    });
    return {
        years: Array.from(years).sort((a, b) => parseInt(b) - parseInt(a)),
        months: Array.from(months).sort((a, b) => parseInt(a) - parseInt(b)),
    };
}, [archivedTasks]);

const filteredArchivedTasks = useMemo(() => {
    return archivedTasks.filter(task => {
        if (filterYear === 'all' && filterMonth === 'all') return true;
        const deadline = new Date(task.deadline);
        if (isNaN(deadline.getTime())) return false;

        const taskYear = deadline.getFullYear().toString();
        const taskMonth = (deadline.getMonth() + 1).toString();

        const yearMatch = filterYear === 'all' || taskYear === filterYear;
        const monthMatch = filterMonth === 'all' || taskMonth === filterMonth;

        return yearMatch && monthMatch;
    }).sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());
}, [archivedTasks, filterYear, filterMonth]);


  const handleOpenModal = (task: Task | null = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleFormSubmit = (taskData: Omit<Task, 'id' | 'order' | 'status' | 'isArchived'> | Task) => {
    if ('id' in taskData) {
      onUpdateTask(taskData as Task);
    } else {
      onAddTask(taskData);
    }
    handleCloseModal();
  };
  
  const handleLinkUpdate = (taskId: string) => {
    if (editingLink && editingLink.taskId === taskId) {
        const originalTask = tasks.find(t => t.id === taskId);
        if (originalTask && (originalTask.email !== editingLink.url || originalTask.emailText !== editingLink.text)) {
            onUpdateTask({ ...originalTask, email: editingLink.url.trim(), emailText: editingLink.text.trim() });
        }
        setEditingLink(null);
    }
  };
  
  const handleTitleUpdate = (taskId: string) => {
    if (editingTitle && editingTitle.taskId === taskId) {
        const originalTask = tasks.find(t => t.id === taskId);
        if (originalTask && (originalTask.title !== editingTitle.title || originalTask.link !== editingTitle.link)) {
            onUpdateTask({ ...originalTask, title: editingTitle.title.trim(), link: editingTitle.link.trim() });
        }
        setEditingTitle(null);
    }
  };

  const isEmail = (str: string) => str.includes('@') && !str.startsWith('http');
  
  const renderTable = (taskList: Task[], isArchive: boolean) => (
       <div className="bg-slate-800/50 rounded-lg shadow-xl overflow-x-auto border border-slate-700/50">
            <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-700/50">
                    <tr>
                    {['#', 'Thương hiệu', 'Tên công việc', 'Định dạng', 'Giao cho', 'Người giao', 'Liên hệ', 'Ngày nhận brief', 'Hạn chót', 'Ghi chú', 'Trạng thái', 'Hành động'].map(header => (
                        <th key={header} className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">{header}</th>
                    ))}
                    </tr>
                </thead>
                <tbody className="bg-slate-800 divide-y divide-slate-700">
                {taskList.map((task, index) => (
                    <tr key={task.id} className="hover:bg-slate-700/50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-400">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <EditableCell task={task} field="brandName" onUpdateTask={onUpdateTask} editingCell={editingCell} setEditingCell={setEditingCell} options={brandEditableOptions}>
                                <div className="flex items-center space-x-3">
                                    <img src={brandMap[task.brandName]?.avatar} alt={task.brandName} className="w-8 h-8 rounded-full object-cover" />
                                    <span>{task.brandName}</span>
                                </div>
                            </EditableCell>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm max-w-xs">
                             {editingTitle?.taskId === task.id ? (
                                <div className="flex flex-col gap-1">
                                    <input
                                        type="text"
                                        value={editingTitle.title}
                                        onChange={(e) => setEditingTitle({ ...editingTitle, title: e.target.value })}
                                        placeholder="Tên công việc"
                                        className="w-full bg-slate-600 border border-indigo-500 rounded-md p-1 text-white text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                                    />
                                    <input
                                        type="text"
                                        value={editingTitle.link}
                                        onChange={(e) => setEditingTitle({ ...editingTitle, link: e.target.value })}
                                        placeholder="URL liên kết (tùy chọn)"
                                        className="w-full bg-slate-600 border border-indigo-500 rounded-md p-1 text-white text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                                    />
                                    <div className="flex gap-2 justify-end mt-1">
                                        <button onClick={() => handleTitleUpdate(task.id)} className="text-xs text-indigo-400 hover:text-indigo-300">Lưu</button>
                                        <button onClick={() => setEditingTitle(null)} className="text-xs text-slate-400 hover:text-slate-300">Hủy</button>
                                    </div>
                                </div>
                            ) : (
                                <div 
                                    onClick={() => setEditingTitle({ taskId: task.id, title: task.title, link: task.link || '' })}
                                    className="group cursor-pointer w-full h-full p-1 -m-1 rounded flex items-center justify-between transition-colors hover:bg-slate-700/70"
                                >
                                    <div className="truncate pr-2">
                                        {task.link ? (
                                            <a 
                                                href={task.link} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-indigo-400 hover:text-indigo-300 hover:underline"
                                                onMouseDown={(e) => e.stopPropagation()}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {task.title}
                                            </a>
                                        ) : (
                                            task.title
                                        )}
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </div>
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm"><EditableCell task={task} field="format" onUpdateTask={onUpdateTask} editingCell={editingCell} setEditingCell={setEditingCell} options={formatOptions}>{task.format}</EditableCell></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <EditableCell task={task} field="assignedTo" onUpdateTask={onUpdateTask} editingCell={editingCell} setEditingCell={setEditingCell} options={memberOptions}>
                                {assigneeMap[task.assignedTo] ? (
                                    <div className="flex items-center space-x-3">
                                        <img src={assigneeMap[task.assignedTo].avatar} alt={assigneeMap[task.assignedTo].name} className="w-8 h-8 rounded-full object-cover" />
                                        <span>{assigneeMap[task.assignedTo].name}</span>
                                    </div>
                                ) : (
                                    'N/A'
                                )}
                            </EditableCell>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <EditableCell task={task} field="assignedBy" onUpdateTask={onUpdateTask} editingCell={editingCell} setEditingCell={setEditingCell} options={assignerOptions}>
                                {assignerMap[task.assignedBy] ? (
                                    <span>{assignerMap[task.assignedBy].name}</span>
                                ) : (
                                    'N/A'
                                )}
                            </EditableCell>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm min-w-[200px]">
                            {editingLink?.taskId === task.id ? (
                                <div className="flex flex-col gap-1">
                                    <input
                                        type="text"
                                        value={editingLink.text}
                                        onChange={(e) => setEditingLink({ ...editingLink, text: e.target.value })}
                                        placeholder="Chữ hiển thị"
                                        className="w-full bg-slate-600 border border-indigo-500 rounded-md p-1 text-white text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                                    />
                                    <input
                                        type="text"
                                        value={editingLink.url}
                                        onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                                        placeholder="URL hoặc email"
                                        className="w-full bg-slate-600 border border-indigo-500 rounded-md p-1 text-white text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                                    />
                                    <div className="flex gap-2 justify-end mt-1">
                                        <button onClick={() => handleLinkUpdate(task.id)} className="text-xs text-indigo-400 hover:text-indigo-300">Lưu</button>
                                        <button onClick={() => setEditingLink(null)} className="text-xs text-slate-400 hover:text-slate-300">Hủy</button>
                                    </div>
                                </div>
                            ) : (
                                <div 
                                    onClick={() => setEditingLink({ taskId: task.id, text: task.emailText || '', url: task.email || '' })}
                                    className="group cursor-pointer w-full h-full p-1 -m-1 rounded flex items-center justify-between transition-colors hover:bg-slate-700/70"
                                >
                                    <div className="truncate pr-2">
                                        {task.email ? (
                                            <a
                                                href={isEmail(task.email) ? `mailto:${task.email}` : task.email}
                                                onMouseDown={(e) => e.stopPropagation()}
                                                onClick={(e) => e.stopPropagation()}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title={task.email}
                                                className="text-indigo-400 hover:text-indigo-300 hover:underline"
                                            >
                                                {task.emailText || task.email}
                                            </a>
                                        ) : (
                                            <span className="text-slate-500">N/A</span>
                                        )}
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </div>
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm"><EditableCell task={task} field="briefDate" onUpdateTask={onUpdateTask} editingCell={editingCell} setEditingCell={setEditingCell} type="date">{formatDate(task.briefDate)}</EditableCell></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm"><EditableCell task={task} field="deadline" onUpdateTask={onUpdateTask} editingCell={editingCell} setEditingCell={setEditingCell} type="date">{formatDate(task.deadline)}</EditableCell></td>
                        <td className="px-6 py-4 text-sm max-w-[200px]"><EditableCell task={task} field="notes" onUpdateTask={onUpdateTask} editingCell={editingCell} setEditingCell={setEditingCell} type="textarea">{task.notes || <span className="text-slate-500">N/A</span>}</EditableCell></td>
                        <td className="px-6 py-4 whitespace-nowrap"><EditableCell task={task} field="status" onUpdateTask={onUpdateTask} editingCell={editingCell} setEditingCell={setEditingCell} options={statusOptions}><span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusDisplay[task.status].classes}`}>{statusDisplay[task.status].text}</span></EditableCell></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            {isArchive ? (
                                <button onClick={() => onToggleTaskArchiveStatus(task.id)} className="text-green-400 hover:text-green-300 transition-colors">Hiện</button>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <button onClick={() => onCopyTask(task.id)} title="Sao chép" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" /><path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h6a2 2 0 00-2-2H5z" /></svg>
                                    </button>
                                    <button onClick={() => handleOpenModal(task)} title="Sửa chi tiết" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                    </button>
                                    <button onClick={() => onToggleTaskArchiveStatus(task.id)} title="Ẩn" className="text-yellow-500 hover:text-yellow-400 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" /><path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                                    </button>
                                    <button onClick={() => onDeleteTask(task.id)} title="Xóa" className="text-red-500 hover:text-red-400 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    </button>
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
                {(!isArchive && newTask) && (
                    <NewTaskRow 
                        task={newTask}
                        members={members}
                        brands={brands}
                        formats={formats}
                        assigners={assigners}
                        onSave={onUpdateTask}
                        onCancel={onDeleteTask}
                    />
                )}
                {taskList.length === 0 && !newTask && !isArchive && (
                    <tr>
                        <td colSpan={12} className="text-center py-10 text-slate-400">Không có dữ liệu.</td>
                    </tr>
                )}
                 {taskList.length === 0 && isArchive && (
                    <tr>
                        <td colSpan={12} className="text-center py-10 text-slate-400">Không có dữ liệu.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">{showArchive ? 'Dữ liệu cũ' : 'Quản lý Công việc'}</h2>
        <div className="flex-shrink-0 flex flex-wrap items-center justify-end gap-2">
            <button
                onClick={() => setShowArchive(!showArchive)}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-all duration-200"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.5-11.5a.5.5 0 00-1 0v5.793l-2.146-2.147a.5.5 0 00-.708.708l3 3a.5.5 0 00.708 0l3-3a.5.5 0 00-.708-.708L10.5 12.293V6.5z" clipRule="evenodd" />
                </svg>
                <span>{showArchive ? 'Hiện tại' : 'Dữ liệu cũ'}</span>
            </button>
             <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-all duration-200"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0L8 5.12a1 1 0 01-1.42 1.42l-1.95-1.04a1 1 0 00-1.2.5l-2 3.46a1 1 0 00.52 1.2l1.95 1.04a1 1 0 010 1.74l-1.95 1.04a1 1 0 00-.52 1.2l2 3.46a1 1 0 001.2.5l1.95-1.04a1 1 0 011.42 1.42l-1.04 1.95a1 1 0 00.5 1.2l3.46 2a1 1 0 001.2-.5l1.04-1.95a1 1 0 011.74 0l1.04 1.95a1 1 0 001.2.5l3.46-2a1 1 0 00.5-1.2l-1.04-1.95a1 1 0 011.42-1.42l1.95 1.04a1 1 0 001.2-.5l2-3.46a1 1 0 00-.52-1.2l-1.95-1.04a1 1 0 010-1.74l1.95-1.04a1 1 0 00.52-1.2l-2-3.46a1 1 0 00-1.2-.5l-1.95 1.04a1 1 0 01-1.42-1.42l1.04-1.95a1 1 0 00-.5-1.2L13.47 3.17a1 1 0 00-1.98 0zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                <span>Cài đặt</span>
            </button>
        </div>
      </div>
      
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
        <div className="flex flex-wrap items-center gap-4">
            {showArchive ? (
                <>
                    <span className="text-sm font-medium text-slate-300">Lọc theo hạn chót:</span>
                    <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2">
                        <option value="all">Tất cả tháng</option>
                        {archiveFilterOptions.months.map(m => <option key={m} value={m}>Tháng {m}</option>)}
                    </select>
                    <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2">
                        <option value="all">Tất cả năm</option>
                        {archiveFilterOptions.years.map(y => <option key={y} value={y}>Năm {y}</option>)}
                    </select>
                </>
            ) : (
                <>
                    <div className="flex items-center space-x-2">
                        <label htmlFor="brand-filter" className="font-semibold text-slate-300">Thương hiệu:</label>
                        <select
                        id="brand-filter"
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                        >
                        {brandOptions.map(brandName => (
                            <option key={brandName} value={brandName}>
                            {brandName === 'all' ? 'Tất cả' : brandName}
                            </option>
                        ))}
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <label htmlFor="assignee-filter" className="font-semibold text-slate-300">Thành viên:</label>
                        <select
                        id="assignee-filter"
                        value={selectedAssignee}
                        onChange={(e) => setSelectedAssignee(e.target.value)}
                        className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                        >
                        <option value="all">Tất cả</option>
                        {members.map(member => (
                            <option key={member.id} value={member.id}>{member.name}</option>
                        ))}
                        </select>
                    </div>
                </>
            )}
        </div>
      </div>
      
      {showArchive 
        ? renderTable(filteredArchivedTasks, true)
        : renderTable(filteredAndSortedTasks, false)
      }

      {!showArchive && (
          <div className="mt-6 flex justify-end">
                <button
                onClick={() => onAddTask()}
                disabled={!!newTask}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-indigo-500/50 disabled:bg-slate-500 disabled:from-slate-500 disabled:to-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>Thêm công việc</span>
                </button>
          </div>
      )}

      {isModalOpen && (
        <TaskFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleFormSubmit}
          members={members}
          brands={brands}
          formats={formats}
          assigners={assigners}
          initialTaskData={editingTask}
        />
      )}

      {isSettingsModalOpen && (
          <SettingsModal
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
            members={members}
            brands={brands}
            formats={formats}
            assigners={assigners}
            onSetMembers={onSetMembers}
            onSetBrands={onSetBrands}
            onSetFormats={onSetFormats}
            onSetAssigners={onSetAssigners}
          />
      )}
    </div>
  );
};

export default ManagerView;