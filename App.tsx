import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Task, Member, View, Status, BrandInfo } from './types';
import { DUMMY_MEMBERS, DUMMY_TASKS, INITIAL_BRANDS, INITIAL_FORMATS, INITIAL_ASSIGNERS } from './constants';
import Header from './components/Header';
import ManagerView from './components/ManagerView';
import MemberView from './components/MemberView';
import UserSelection from './components/UserSelection';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useLocalStorage<Member | null>('currentUser', null);
  const [view, setView] = useState<View>(currentUser ? 'member' : 'manager');

  const [members, setMembers] = useLocalStorage<Member[]>('members', DUMMY_MEMBERS);
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', DUMMY_TASKS);
  const [brands, setBrands] = useLocalStorage<BrandInfo[]>('brands', INITIAL_BRANDS);
  const [formats, setFormats] = useLocalStorage<string[]>('formats', INITIAL_FORMATS);
  const [assigners, setAssigners] = useLocalStorage<Member[]>('assigners', INITIAL_ASSIGNERS);
  
  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  const handleUserSelect = (member: Member) => {
    setCurrentUser(member);
    setView('member');
  };

  const handleSwitchUser = () => {
    setCurrentUser(null);
    setView('manager'); // Reset to default view after logging out
  };

  const addTask = (task?: Omit<Task, 'id' | 'order' | 'status' | 'isArchived'>) => {
    setTasks(prevTasks => {
      const newOrder = prevTasks.length > 0 ? Math.max(...prevTasks.map(t => t.order)) + 1 : 1;
      
      // Nếu có task data (từ modal), tạo task như bình thường
      if (task) {
        const newTask: Task = {
            ...task,
            id: `task-${Date.now()}`,
            order: newOrder,
            status: 'todo',
            isArchived: false,
        };
        return [...prevTasks, newTask];
      }
      
      // Nếu không, tạo một task trống để thêm trực tiếp vào bảng
      const newBlankTask: Task = {
        id: `task-new-${Date.now()}`, // ID đặc biệt cho hàng mới
        order: newOrder,
        brandName: brands[0]?.name || '',
        title: '',
        format: formats[0] || '',
        assignedBy: assigners[0]?.id || '',
        assignedTo: members[0]?.id || '',
        briefDate: new Date().toISOString().split('T')[0],
        deadline: new Date().toISOString().split('T')[0],
        status: 'todo',
        isArchived: false,
        link: '',
        email: '',
        emailText: '',
        notes: '',
      };
      return [...prevTasks, newBlankTask];
    });
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prevTasks => 
      prevTasks.map(task => (task.id === updatedTask.id ? { ...updatedTask, id: updatedTask.id.startsWith('task-new-') ? `task-${Date.now()}` : updatedTask.id } : task))
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const copyTask = (taskId: string) => {
    setTasks(prevTasks => {
      const originalTask = prevTasks.find(t => t.id === taskId);
      if (!originalTask) return prevTasks;

      const newOrder = prevTasks.length > 0 ? Math.max(...prevTasks.map(t => t.order)) + 1 : 1;
      const newTask: Task = {
        ...originalTask,
        id: `task-${Date.now()}`,
        title: `${originalTask.title} (Bản sao)`,
        status: 'todo',
        order: newOrder,
        isArchived: false,
      };
      return [...prevTasks, newTask];
    });
  };

  const updateTaskStatus = (taskId: string, newStatus: Status) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const updatedTask = { ...task, status: newStatus };
          // Tự động ẩn công việc khi chuyển sang trạng thái "Hoàn thành"
          if (newStatus === 'done') {
            updatedTask.isArchived = true;
          }
          return updatedTask;
        }
        return task;
      })
    );
  };
  
  const toggleTaskArchiveStatus = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const isUnarchiving = task.isArchived;
          const isDoneTask = task.status === 'done';
          
          // Khi hiện lại một công việc đã hoàn thành, chuyển trạng thái sang "Chỉnh theo feedback"
          if (isUnarchiving && isDoneTask) {
            return { ...task, isArchived: false, status: 'feedback' };
          }
          
          // Đối với các trường hợp khác, chỉ cần ẩn/hiện
          return { ...task, isArchived: !task.isArchived };
        }
        return task;
      })
    );
  };

  const updateMemberInfo = (memberId: string, updates: Partial<Member>) => {
    setMembers(prevMembers =>
      prevMembers.map(member =>
        member.id === memberId ? { ...member, ...updates } : member
      )
    );
    if (currentUser?.id === memberId) {
      setCurrentUser(prev => (prev ? { ...prev, ...updates } : null));
    }
  };


  if (!currentUser) {
    return <UserSelection members={members} onSelectUser={handleUserSelect} />;
  }

  return (
    <div className="min-h-screen text-slate-200 font-sans">
      <Header 
        currentView={view} 
        onViewChange={handleViewChange} 
        onSwitchUser={handleSwitchUser}
        currentUser={currentUser}
        onUpdateMemberInfo={updateMemberInfo}
      />
      <main className="p-4 md:p-8">
        {view === 'manager' ? (
          <ManagerView 
            tasks={tasks} 
            members={members} 
            brands={brands}
            formats={formats}
            assigners={assigners}
            onSetMembers={setMembers}
            onSetBrands={setBrands}
            onSetFormats={setFormats}
            onSetAssigners={setAssigners}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onCopyTask={copyTask}
            onToggleTaskArchiveStatus={toggleTaskArchiveStatus}
          />
        ) : (
          <MemberView 
            tasks={tasks} 
            members={members}
            assigners={assigners}
            onUpdateTaskStatus={updateTaskStatus}
            onToggleTaskArchiveStatus={toggleTaskArchiveStatus}
            selectedUser={currentUser}
          />
        )}
      </main>
    </div>
  );
};

export default App;