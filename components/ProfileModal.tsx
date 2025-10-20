import React, { useState, useRef, useEffect } from 'react';
import { Member } from '../types';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: Member;
    onSwitchUser: () => void;
    onUpdateMemberInfo: (memberId: string, updates: Partial<Member>) => void;
}

// Helper component for displaying info in view mode
const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value?: string }> = ({ icon, label, value }) => {
    if (!value) return null;
    
    const isLink = value.includes('@') || value.startsWith('http');
    let href = value;
    if (value.includes('@') && !value.startsWith('mailto:')) {
        href = `mailto:${value}`;
    }

    return (
        <div className="flex items-center space-x-4 py-2">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-slate-400 bg-slate-700/50 rounded-lg">
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-400">{label}</p>
                {isLink ? (
                     <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-100 truncate hover:text-indigo-400 hover:underline">
                        {value}
                    </a>
                ) : (
                    <p className="text-sm text-slate-100 truncate">{value}</p>
                )}
            </div>
        </div>
    );
};


const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, currentUser, onSwitchUser, onUpdateMemberInfo }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        facebook: currentUser.facebook || '',
        zalo: currentUser.zalo || '',
    });
    const [newAvatar, setNewAvatar] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: currentUser.name || '',
                email: currentUser.email || '',
                phone: currentUser.phone || '',
                facebook: currentUser.facebook || '',
                zalo: currentUser.zalo || '',
            });
            setNewAvatar(null);
            setIsEditing(false); // Always start in view mode
        }
    }, [currentUser, isOpen]);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const updates: Partial<Member> = {};
        if (newAvatar) {
            updates.avatar = newAvatar;
        }
        if (formData.name.trim() && formData.name.trim() !== currentUser.name) {
            updates.name = formData.name.trim();
        }
        if (formData.email !== (currentUser.email || '')) {
            updates.email = formData.email;
        }
        if (formData.phone !== (currentUser.phone || '')) {
            updates.phone = formData.phone;
        }
        if (formData.facebook !== (currentUser.facebook || '')) {
            updates.facebook = formData.facebook;
        }
        if (formData.zalo !== (currentUser.zalo || '')) {
            updates.zalo = formData.zalo;
        }

        if (Object.keys(updates).length > 0) {
            onUpdateMemberInfo(currentUser.id, updates);
        }
        setIsEditing(false); // Return to view mode after saving
    };

     const handleCancel = () => {
         // Reset form data to current user's data
        setFormData({
            name: currentUser.name || '',
            email: currentUser.email || '',
            phone: currentUser.phone || '',
            facebook: currentUser.facebook || '',
            zalo: currentUser.zalo || '',
        });
        setNewAvatar(null); // Discard avatar changes
        setIsEditing(false); // Switch back to view mode
    }

    const handleSwitchUserClick = () => {
        onClose();
        onSwitchUser();
    };

    const hasChanges =
        newAvatar !== null ||
        formData.name !== currentUser.name ||
        formData.email !== (currentUser.email || '') ||
        formData.phone !== (currentUser.phone || '') ||
        formData.facebook !== (currentUser.facebook || '') ||
        formData.zalo !== (currentUser.zalo || '');


    if (!isOpen) return null;

    const icons = {
        user: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>,
        email: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>,
        phone: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>,
        facebook: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12.39h2.54V10.49c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.22h-1.173c-1.239 0-1.625.775-1.625 1.562v1.875h2.477l-.423 2.5h-2.054v4.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" /></svg>,
        zalo: <svg className="h-5 w-5" viewBox="0 0 448 512"><path fill="currentColor" d="M224 64C136 64 64 136 64 224v64c0 88 72 160 160 160s160-72 160-160V160c0-53-43-96-96-96s-96 43-96 96v160c0 17.5 14.5 32 32 32s32-14.5 32-32V160c0-17.5-14.5-32-32-32s-32 14.5-32 32v64c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96H128c-17.5 0-32 14.5-32 32s14.5 32 32 32h96c53 0 96-43 96-96s-43-96-96-96z"/></svg>
    };

    return (
        <div className="fixed inset-0 glass-modal-bg flex items-center justify-center z-50">
            <div className="bg-slate-800/90 rounded-lg shadow-2xl p-6 md:p-8 w-full max-w-lg m-4 border border-slate-700 max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Tài khoản của tôi</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl leading-none">&times;</button>
                </div>
                
                <div className="flex-grow overflow-y-auto pr-4 -mr-4">
                    <div className="flex flex-col items-center space-y-4 mb-8">
                        <div className="relative group">
                            <img 
                                src={newAvatar || currentUser.avatar} 
                                alt={currentUser.name} 
                                className="w-28 h-28 rounded-full border-4 border-slate-600 object-cover" 
                            />
                            {isEditing && (
                                <>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        aria-label="Đổi ảnh đại diện"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/png, image/jpeg, image/gif"
                                        onChange={handleFileChange}
                                    />
                                </>
                            )}
                        </div>
                        {!isEditing && <h3 className="text-xl font-bold text-slate-100">{currentUser.name}</h3>}
                    </div>

                    {isEditing ? (
                        <div className="space-y-4">
                            {/* Edit Fields */}
                            <div className="relative">
                                <label htmlFor="name" className="absolute -top-2 left-2 inline-block bg-slate-800 px-1 text-xs font-medium text-slate-400">Tên</label>
                                <div className="flex items-center">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-600 bg-slate-700 text-slate-400 sm:text-sm h-11">{icons.user}</span>
                                    <input type="text" name="name" id="name" value={formData.name} onChange={handleFormChange} className="w-full h-11 bg-slate-700/50 border border-slate-600 rounded-r-md p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                            </div>
                            <div className="relative">
                                <label htmlFor="email" className="absolute -top-2 left-2 inline-block bg-slate-800 px-1 text-xs font-medium text-slate-400">Email</label>
                                <div className="flex items-center">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-600 bg-slate-700 text-slate-400 sm:text-sm h-11">{icons.email}</span>
                                    <input type="email" name="email" id="email" value={formData.email} onChange={handleFormChange} className="w-full h-11 bg-slate-700/50 border border-slate-600 rounded-r-md p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                            </div>
                            <div className="relative">
                                <label htmlFor="phone" className="absolute -top-2 left-2 inline-block bg-slate-800 px-1 text-xs font-medium text-slate-400">Số điện thoại</label>
                                <div className="flex items-center">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-600 bg-slate-700 text-slate-400 sm:text-sm h-11">{icons.phone}</span>
                                    <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleFormChange} className="w-full h-11 bg-slate-700/50 border border-slate-600 rounded-r-md p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                            </div>
                            <div className="relative">
                                <label htmlFor="facebook" className="absolute -top-2 left-2 inline-block bg-slate-800 px-1 text-xs font-medium text-slate-400">Facebook</label>
                                <div className="flex items-center">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-600 bg-slate-700 text-slate-400 sm:text-sm h-11">{icons.facebook}</span>
                                    <input type="url" name="facebook" id="facebook" value={formData.facebook} onChange={handleFormChange} placeholder="https://facebook.com/..." className="w-full h-11 bg-slate-700/50 border border-slate-600 rounded-r-md p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                            </div>
                            <div className="relative">
                                <label htmlFor="zalo" className="absolute -top-2 left-2 inline-block bg-slate-800 px-1 text-xs font-medium text-slate-400">Zalo</label>
                                <div className="flex items-center">
                                    <span className="inline-flex items-center justify-center px-3 rounded-l-md border border-r-0 border-slate-600 bg-slate-700 text-slate-400 sm:text-sm h-11 w-12">{icons.zalo}</span>
                                    <input type="text" name="zalo" id="zalo" value={formData.zalo} onChange={handleFormChange} placeholder="Tên hoặc SĐT Zalo" className="w-full h-11 bg-slate-700/50 border border-slate-600 rounded-r-md p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {/* Display Fields */}
                            <InfoRow icon={icons.email} label="Email" value={currentUser.email} />
                            <InfoRow icon={icons.phone} label="Số điện thoại" value={currentUser.phone} />
                            <InfoRow icon={icons.facebook} label="Facebook" value={currentUser.facebook} />
                            <InfoRow icon={icons.zalo} label="Zalo" value={currentUser.zalo} />
                        </div>
                    )}
                </div>

                <div className="mt-6 flex flex-col space-y-3 pt-6 border-t border-slate-700">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={!hasChanges}
                                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-indigo-500/50 disabled:bg-slate-500 disabled:from-slate-500 disabled:to-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                Lưu thay đổi
                            </button>
                             <button 
                                onClick={handleCancel}
                                className="w-full bg-slate-600/50 hover:bg-slate-600 text-slate-300 font-bold py-2.5 px-4 rounded-lg transition-colors"
                            >
                                Hủy
                            </button>
                        </>
                    ) : (
                         <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-indigo-500/50"
                            >
                                Chỉnh sửa thông tin
                            </button>
                            <button 
                                onClick={handleSwitchUserClick}
                                className="w-full bg-slate-600/50 hover:bg-slate-600 text-slate-300 font-bold py-2.5 px-4 rounded-lg transition-colors"
                            >
                                Đăng xuất
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;