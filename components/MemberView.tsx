import React, { useState, useMemo } from 'react';
import { Task, Member, Status } from '../types';
import KanbanBoard from './KanbanBoard';

interface MemberViewProps {
  tasks: Task[];
  members: Member[];
  assigners: Member[];
  onUpdateTaskStatus: (taskId: string, newStatus: Status) => void;
  onToggleTaskArchiveStatus: (taskId: string) => void;
  selectedUser: Member;
}

const formatDate = (dateString: string) => {
    if (!dateString) return dateString;
    const datePart = dateString.split('T')[0];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return datePart;
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
};

const statusDisplay: Record<Status, { text: string; classes: string }> = {
  todo: { text: 'Cần làm', classes: 'bg-blue-500/10 text-blue-300' },
  inprogress: { text: 'Đang làm', classes: 'bg-yellow-500/10 text-yellow-300' },
  waitingfeedback: { text: 'Chờ feedback', classes: 'bg-purple-500/10 text-purple-300' },
  feedback: { text: 'Chỉnh theo feedback', classes: 'bg-orange-500/10 text-orange-300' },
  cancelled: { text: 'Hủy bỏ', classes: 'bg-slate-600/20 text-slate-400' },
  done: { text: 'Hoàn thành', classes: 'bg-green-500/10 text-green-300' },
};

const MemberView: React.FC<MemberViewProps> = ({ tasks, members, assigners, onUpdateTaskStatus, onToggleTaskArchiveStatus, selectedUser }) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [showHistory, setShowHistory] = useState(false);
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');

  const memberTasks = useMemo(() => {
    return tasks.filter(task => task.assignedTo === selectedUser.id);
  }, [tasks, selectedUser.id]);
  
  const currentTasks = useMemo(() => memberTasks.filter(task => !task.isArchived), [memberTasks]);
  const historyTasks = useMemo(() => memberTasks.filter(task => task.isArchived), [memberTasks]);

  const brands = useMemo(() => {
    const memberBrands = currentTasks.map(task => task.brandName);
    return ['all', ...Array.from(new Set(memberBrands))];
  }, [currentTasks]);

  const filteredCurrentTasks = useMemo(() => {
    if (selectedBrand === 'all') {
      return currentTasks;
    }
    return currentTasks.filter(task => task.brandName === selectedBrand);
  }, [currentTasks, selectedBrand]);

  const historyFilterOptions = useMemo(() => {
    const years = new Set<string>();
    const months = new Set<string>();
    historyTasks.forEach(task => {
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
  }, [historyTasks]);

  const filteredHistoryTasks = useMemo(() => {
    return historyTasks.filter(task => {
        if (filterYear === 'all' && filterMonth === 'all') return true;
        const deadline = new Date(task.deadline);
        if (isNaN(deadline.getTime())) return false;

        const taskYear = deadline.getFullYear().toString();
        const taskMonth = (deadline.getMonth() + 1).toString();

        const yearMatch = filterYear === 'all' || taskYear === filterYear;
        const monthMatch = filterMonth === 'all' || taskMonth === filterMonth;

        return yearMatch && monthMatch;
    }).sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());
  }, [historyTasks, filterYear, filterMonth]);

  const assignerMap = useMemo(() => {
    return assigners.reduce((acc, member) => {
      acc[member.id] = member;
      return acc;
    }, {} as Record<string, Member>);
  }, [assigners]);
  
  const isEmail = (str: string) => str.includes('@') && !str.startsWith('http');
  
  const renderHistoryTable = (taskList: Task[]) => (
       <div className="bg-slate-800/50 rounded-lg shadow-xl overflow-x-auto border border-slate-700/50">
            <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-700/50">
                    <tr>
                    {['#', 'Thương hiệu', 'Tên công việc', 'Định dạng', 'Người giao', 'Liên hệ', 'Ngày nhận brief', 'Hạn chót', 'Ghi chú', 'Trạng thái', 'Hành động'].map(header => (
                        <th key={header} className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">{header}</th>
                    ))}
                    </tr>
                </thead>
                <tbody className="bg-slate-800 divide-y divide-slate-700">
                {taskList.length > 0 ? taskList.map((task, index) => (
                    <tr key={task.id} className="hover:bg-slate-700/50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-400">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">{task.brandName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 max-w-xs truncate">
                            {task.link ? (
                                <a href={task.link} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 hover:underline">{task.title}</a>
                            ) : (
                                task.title
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{task.format}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{assignerMap[task.assignedBy]?.name || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {task.email ? (
                                <a href={isEmail(task.email) ? `mailto:${task.email}` : task.email} target="_blank" rel="noopener noreferrer" title={task.email} className="text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    <span className="truncate max-w-[120px]">{task.emailText || task.email}</span>
                                </a>
                            ) : (
                                <span className="text-slate-500">N/A</span>
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{formatDate(task.briefDate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{formatDate(task.deadline)}</td>
                        <td className="px-6 py-4 text-sm text-slate-400 max-w-[200px] truncate" title={task.notes}>
                            {task.notes || <span className="text-slate-500">N/A</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusDisplay[task.status].classes}`}>{statusDisplay[task.status].text}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button onClick={() => onToggleTaskArchiveStatus(task.id)} className="text-green-400 hover:text-green-300 transition-colors">Hiện</button>
                        </td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan={11} className="text-center py-10 text-slate-400">Không có dữ liệu.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
  );


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          {showHistory ? 'Lịch sử công việc' : 'Công việc của Tôi'}
        </h2>
        <div className="flex-shrink-0">
          <button
              onClick={() => setShowHistory(!showHistory)}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-all duration-200"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.5-11.5a.5.5 0 00-1 0v5.793l-2.146-2.147a.5.5 0 00-.708.708l3 3a.5.5 0 00.708 0l3-3a.5.5 0 00-.708-.708L10.5 12.293V6.5z" clipRule="evenodd" />
              </svg>
              <span>{showHistory ? 'Hiện tại' : 'Lịch sử'}</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
        <div className="flex flex-wrap items-center gap-4">
            {showHistory ? (
                <>
                    <span className="text-sm font-medium text-slate-300">Lọc theo hạn chót:</span>
                    <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2">
                        <option value="all">Tất cả tháng</option>
                        {historyFilterOptions.months.map(m => <option key={m} value={m}>Tháng {m}</option>)}
                    </select>
                    <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2">
                        <option value="all">Tất cả năm</option>
                        {historyFilterOptions.years.map(y => <option key={y} value={y}>Năm {y}</option>)}
                    </select>
                </>
            ) : (
                <div className="flex items-center space-x-2">
                  <label htmlFor="brand-filter-member" className="font-semibold text-slate-300">Thương hiệu:</label>
                  <select
                    id="brand-filter-member"
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  >
                    {brands.map(brand => (
                      <option key={brand} value={brand}>
                        {brand === 'all' ? 'Tất cả' : brand}
                      </option>
                    ))}
                  </select>
                </div>
            )}
        </div>
      </div>
      
      {showHistory 
        ? renderHistoryTable(filteredHistoryTasks)
        : <KanbanBoard tasks={filteredCurrentTasks} onUpdateTaskStatus={onUpdateTaskStatus} members={members} assigners={assigners} onToggleTaskArchiveStatus={onToggleTaskArchiveStatus} />
      }
    </div>
  );
};

export default MemberView;