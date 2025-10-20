import React, { useState, useEffect } from 'react';
import { Task, Member, BrandInfo, Status } from '../types';

interface NewTaskRowProps {
    task: Task;
    members: Member[];
    brands: BrandInfo[];
    formats: string[];
    assigners: Member[];
    onSave: (task: Task) => void;
    onCancel: (taskId: string) => void;
}

const NewTaskRow: React.FC<NewTaskRowProps> = ({
    task,
    members,
    brands,
    formats,
    assigners,
    onSave,
    onCancel,
}) => {
    const [formData, setFormData] = useState<Task>(task);
    
    useEffect(() => {
        setFormData(task);
    }, [task]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (formData.title.trim() === '') {
            alert('Vui lòng nhập Tên công việc.');
            return;
        }
        onSave(formData);
    };
    
    const canSave = formData.title.trim() !== '' && formData.brandName && formData.format && formData.assignedTo && formData.assignedBy;

    return (
        <tr className="bg-slate-700/50">
            <td className="px-6 py-4 text-sm font-medium text-indigo-400">Mới</td>
            {/* Thương hiệu */}
            <td className="px-6 py-2">
                <select name="brandName" value={formData.brandName} onChange={handleChange} className="w-full bg-slate-600 border-slate-500 rounded p-1 text-white text-sm focus:ring-1 focus:ring-indigo-400 outline-none">
                     {brands.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
                </select>
            </td>
            {/* Tên công việc & Link */}
            <td className="px-6 py-2">
                 <div className="flex flex-col gap-1">
                    <input type="text" name="title" placeholder="Tên công việc..." value={formData.title} onChange={handleChange} className="w-full bg-slate-600 border-slate-500 rounded p-1 text-white text-sm focus:ring-1 focus:ring-indigo-400 outline-none"/>
                    <input type="url" name="link" placeholder="Link (tùy chọn)..." value={formData.link || ''} onChange={handleChange} className="w-full bg-slate-600 border-slate-500 rounded p-1 text-white text-sm focus:ring-1 focus:ring-indigo-400 outline-none"/>
                 </div>
            </td>
            {/* Định dạng */}
            <td className="px-6 py-2">
                <select name="format" value={formData.format} onChange={handleChange} className="w-full bg-slate-600 border-slate-500 rounded p-1 text-white text-sm focus:ring-1 focus:ring-indigo-400 outline-none">
                     {formats.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
            </td>
            {/* Giao cho */}
            <td className="px-6 py-2">
                <select name="assignedTo" value={formData.assignedTo} onChange={handleChange} className="w-full bg-slate-600 border-slate-500 rounded p-1 text-white text-sm focus:ring-1 focus:ring-indigo-400 outline-none">
                     {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
            </td>
            {/* Người giao */}
            <td className="px-6 py-2">
                 <select name="assignedBy" value={formData.assignedBy} onChange={handleChange} className="w-full bg-slate-600 border-slate-500 rounded p-1 text-white text-sm focus:ring-1 focus:ring-indigo-400 outline-none">
                     {assigners.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
            </td>
            {/* Liên hệ */}
            <td className="px-6 py-2">
                 <div className="flex flex-col gap-1">
                    <input type="text" name="emailText" placeholder="Chữ hiển thị..." value={formData.emailText || ''} onChange={handleChange} className="w-full bg-slate-600 border-slate-500 rounded p-1 text-white text-sm focus:ring-1 focus:ring-indigo-400 outline-none"/>
                    <input type="text" name="email" placeholder="Mail/Link..." value={formData.email || ''} onChange={handleChange} className="w-full bg-slate-600 border-slate-500 rounded p-1 text-white text-sm focus:ring-1 focus:ring-indigo-400 outline-none"/>
                 </div>
            </td>
            {/* Ngày nhận brief */}
            <td className="px-6 py-2">
                <input type="date" name="briefDate" value={formData.briefDate} onChange={handleChange} className="w-full bg-slate-600 border-slate-500 rounded p-1 text-white text-sm focus:ring-1 focus:ring-indigo-400 outline-none calendar-picker-indicator-white"/>
            </td>
            {/* Hạn chót */}
            <td className="px-6 py-2">
                <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full bg-slate-600 border-slate-500 rounded p-1 text-white text-sm focus:ring-1 focus:ring-indigo-400 outline-none calendar-picker-indicator-white"/>
            </td>
            {/* Ghi chú */}
            <td className="px-6 py-2">
                 <textarea name="notes" value={formData.notes || ''} onChange={handleChange} placeholder="Ghi chú..." rows={2} className="w-full bg-slate-600 border-slate-500 rounded p-1 text-white text-sm focus:ring-1 focus:ring-indigo-400 outline-none"/>
            </td>
            {/* Trạng thái */}
            <td className="px-6 py-4 text-sm text-blue-300">Cần làm</td>
            {/* Hành động */}
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                 <button onClick={handleSave} disabled={!canSave} className="text-green-400 hover:text-green-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors">Lưu</button>
                 <button onClick={() => onCancel(task.id)} className="text-red-500 hover:text-red-400 transition-colors">Hủy</button>
            </td>
        </tr>
    );
};

export default NewTaskRow;
