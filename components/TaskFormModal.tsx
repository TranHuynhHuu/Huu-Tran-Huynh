import React, { useState, useEffect } from 'react';
import { Task, Member, BrandInfo } from '../types';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: Omit<Task, 'id' | 'order' | 'status' | 'isArchived'> | Task) => void;
  members: Member[];
  brands: BrandInfo[];
  formats: string[];
  assigners: Member[];
  initialTaskData?: Task | null;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, onSubmit, members, brands, formats, assigners, initialTaskData }) => {
    const getInitialDeadline = () => {
        const now = new Date();
        return now.toISOString().split('T')[0];
    };

    const [formData, setFormData] = useState({
        brandName: '',
        title: '',
        link: '',
        email: '',
        emailText: '',
        format: '',
        assignedBy: '',
        assignedTo: '',
        briefDate: new Date().toISOString().split('T')[0],
        deadline: getInitialDeadline(),
        status: 'todo',
        notes: '',
    });

  useEffect(() => {
    if (initialTaskData) {
      setFormData({
        brandName: initialTaskData.brandName,
        title: initialTaskData.title,
        link: initialTaskData.link || '',
        email: initialTaskData.email || '',
        emailText: initialTaskData.emailText || '',
        format: initialTaskData.format,
        assignedBy: initialTaskData.assignedBy,
        assignedTo: initialTaskData.assignedTo,
        briefDate: initialTaskData.briefDate.split('T')[0],
        deadline: initialTaskData.deadline.split('T')[0],
        status: initialTaskData.status,
        notes: initialTaskData.notes || '',
      });
    } else {
      setFormData({
        brandName: brands[0]?.name || '',
        title: '',
        link: '',
        email: '',
        emailText: '',
        format: formats[0] || '',
        assignedBy: assigners[0]?.id || '',
        assignedTo: members[0]?.id || '',
        briefDate: new Date().toISOString().split('T')[0],
        deadline: getInitialDeadline(),
        status: 'todo',
        notes: ''
      });
    }
  }, [initialTaskData, members, brands, formats, assigners]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialTaskData) {
      onSubmit({ ...initialTaskData, ...formData });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { status, ...newTaskData } = formData;
      onSubmit(newTaskData);
    }
  };
  
  const canSubmit = formData.brandName && formData.format && formData.assignedTo && formData.assignedBy && formData.title;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 glass-modal-bg flex items-center justify-center z-50">
      <div className="bg-slate-800/90 rounded-lg shadow-2xl p-8 w-full max-w-2xl m-4 overflow-y-auto max-h-[90vh] border border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">{initialTaskData ? 'Sửa công việc' : 'Thêm công việc mới'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="brandName" className="block text-sm font-medium text-slate-300 mb-1">Tên thương hiệu</label>
              <select name="brandName" value={formData.brandName} onChange={handleChange} required className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" disabled={brands.length === 0}>
                {brands.length === 0 ? <option>Vui lòng thêm thương hiệu trong Cài đặt</option> : brands.map(brand => <option key={brand.name} value={brand.name}>{brand.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="format" className="block text-sm font-medium text-slate-300 mb-1">Định dạng</label>
              <select name="format" value={formData.format} onChange={handleChange} required className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" disabled={formats.length === 0}>
                {formats.length === 0 ? <option>Vui lòng thêm định dạng trong Cài đặt</option> : formats.map(format => <option key={format} value={format}>{format}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Tên công việc</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="link" className="block text-sm font-medium text-slate-300 mb-1">Link liên kết (tùy chọn)</label>
              <input type="url" name="link" value={formData.link} onChange={handleChange} placeholder="https://example.com" className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Mail/Link liên hệ (tùy chọn)</label>
                    <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder="abc@example.com hoặc https://..." className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                <div>
                    <label htmlFor="emailText" className="block text-sm font-medium text-slate-300 mb-1">Chữ hiển thị (tùy chọn)</label>
                    <input type="text" name="emailText" value={formData.emailText} onChange={handleChange} placeholder="Vd: Gửi Mail Khách hàng" className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-1">Ghi chú (tùy chọn)</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Yêu cầu đặc biệt, thông tin bổ sung..." rows={3} className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
            </div>
            <div>
              <label htmlFor="assignedTo" className="block text-sm font-medium text-slate-300 mb-1">Giao cho</label>
              <select name="assignedTo" value={formData.assignedTo} onChange={handleChange} className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" disabled={members.length === 0}>
                {members.length === 0 ? <option>Vui lòng thêm thành viên trong Cài đặt</option> : members.map(member => <option key={member.id} value={member.id}>{member.name}</option>)}
              </select>
            </div>
             <div>
              <label htmlFor="assignedBy" className="block text-sm font-medium text-slate-300 mb-1">Người giao</label>
              <select name="assignedBy" value={formData.assignedBy} onChange={handleChange} className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" disabled={assigners.length === 0}>
                 {assigners.length === 0 ? <option>Vui lòng thêm người giao trong Cài đặt</option> : assigners.map(member => <option key={member.id} value={member.id}>{member.name}</option>)}
              </select>
            </div>
             {initialTaskData && (
                 <div>
                    <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-1">Trạng thái</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="todo">Cần làm</option>
                        <option value="inprogress">Đang làm</option>
                        <option value="waitingfeedback">Chờ feedback</option>
                        <option value="feedback">Chỉnh theo feedback</option>
                        <option value="cancelled">Hủy bỏ</option>
                        <option value="done">Hoàn thành</option>
                    </select>
                </div>
            )}
            <div>
              <label htmlFor="briefDate" className="block text-sm font-medium text-slate-300 mb-1">Ngày nhận Brief</label>
              <input type="date" name="briefDate" value={formData.briefDate} onChange={handleChange} required className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 calendar-picker-indicator-white"/>
            </div>
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-slate-300 mb-1">Hạn chót</label>
              <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} required className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 calendar-picker-indicator-white"/>
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Hủy</button>
            <button type="submit" disabled={!canSubmit} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-indigo-500/50 disabled:bg-slate-500 disabled:from-slate-500 disabled:to-slate-600 disabled:cursor-not-allowed disabled:shadow-none">{initialTaskData ? 'Lưu thay đổi' : 'Tạo công việc'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;