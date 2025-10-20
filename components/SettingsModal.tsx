import React, { useState } from 'react';
import { Member, BrandInfo } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  brands: BrandInfo[];
  formats: string[];
  assigners: Member[];
  onSetMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  onSetBrands: React.Dispatch<React.SetStateAction<BrandInfo[]>>;
  onSetFormats: React.Dispatch<React.SetStateAction<string[]>>;
  onSetAssigners: React.Dispatch<React.SetStateAction<Member[]>>;
}

const EditableListItem: React.FC<{
    item: string;
    onSave: (newValue: string) => void;
    onDelete: () => void;
}> = ({ item, onSave, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(item);

    const handleSave = () => {
        if (value.trim()) {
            onSave(value.trim());
            setIsEditing(false);
        } else {
            // If new value is empty, revert to original
            setValue(item);
            setIsEditing(false);
        }
    };

    return (
        <li className="flex items-center justify-between bg-slate-700/50 p-2 rounded-md">
            {isEditing ? (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                    className="bg-slate-600 text-white p-1 rounded w-full focus:ring-2 focus:ring-indigo-500 outline-none"
                    autoFocus
                />
            ) : (
                <span className="text-slate-200">{item}</span>
            )}
            <div className="flex items-center space-x-2 ml-2">
                <button onClick={() => {
                    if (isEditing) handleSave();
                    else setIsEditing(true)
                }} className="text-indigo-400 hover:text-indigo-300 transition-colors">
                    {isEditing ? 'Lưu' : 'Sửa'}
                </button>
                <button onClick={onDelete} className="text-red-500 hover:text-red-400 transition-colors">Xóa</button>
            </div>
        </li>
    );
};

const EditableMemberListItem: React.FC<{
    item: Member;
    onSave: (newValue: Member) => void;
    onDelete: () => void;
}> = ({ item, onSave, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(item.name);
    const [avatar, setAvatar] = useState(item.avatar);

    const handleSave = () => {
        if (name.trim()) {
            onSave({ ...item, name: name.trim(), avatar: avatar.trim() });
            setIsEditing(false);
        } else {
            setName(item.name);
            setIsEditing(false);
        }
    };
    
    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <li className="flex items-center justify-between bg-slate-700/50 p-2 rounded-md min-h-[52px]">
            {isEditing ? (
                <div className="flex items-center space-x-2 flex-grow min-w-0">
                    <label htmlFor={`avatar-upload-${item.id}`} className="cursor-pointer flex-shrink-0 group relative">
                        <img src={avatar} alt={name} className="w-9 h-9 rounded-full transition-opacity group-hover:opacity-75 object-cover" />
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        </div>
                        <input
                            id={`avatar-upload-${item.id}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-slate-600 text-white p-1 rounded w-full text-sm min-w-0 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Tên"
                    />
                </div>
            ) : (
                <div className="flex items-center space-x-3 overflow-hidden">
                    <img src={item.avatar} alt={item.name} className="w-9 h-9 rounded-full flex-shrink-0 object-cover" />
                    <span className="text-slate-200 truncate">{item.name}</span>
                </div>
            )}
            <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
                <button onClick={() => {
                    if (isEditing) handleSave();
                    else setIsEditing(true);
                }} className="text-indigo-400 hover:text-indigo-300 transition-colors">
                    {isEditing ? 'Lưu' : 'Sửa'}
                </button>
                <button onClick={onDelete} className="text-red-500 hover:text-red-400 transition-colors">Xóa</button>
            </div>
        </li>
    );
};

const EditableBrandListItem: React.FC<{
    item: BrandInfo;
    onSave: (newValue: BrandInfo) => void;
    onDelete: () => void;
}> = ({ item, onSave, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(item.name);
    const [avatar, setAvatar] = useState(item.avatar);

    const handleSave = () => {
        if (name.trim()) {
            onSave({ name: name.trim(), avatar: avatar.trim() });
            setIsEditing(false);
        } else {
            setName(item.name);
            setIsEditing(false);
        }
    };
    
    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <li className="flex items-center justify-between bg-slate-700/50 p-2 rounded-md min-h-[52px]">
            {isEditing ? (
                <div className="flex items-center space-x-2 flex-grow min-w-0">
                    <label htmlFor={`brand-avatar-upload-${item.name}`} className="cursor-pointer flex-shrink-0 group relative">
                        <img src={avatar} alt={name} className="w-9 h-9 rounded-full transition-opacity group-hover:opacity-75 object-cover" />
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        </div>
                        <input
                            id={`brand-avatar-upload-${item.name}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-slate-600 text-white p-1 rounded w-full text-sm min-w-0 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Tên thương hiệu"
                    />
                </div>
            ) : (
                <div className="flex items-center space-x-3 overflow-hidden">
                    <img src={item.avatar} alt={item.name} className="w-9 h-9 rounded-full flex-shrink-0 object-cover" />
                    <span className="text-slate-200 truncate">{item.name}</span>
                </div>
            )}
            <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
                <button onClick={() => {
                    if (isEditing) handleSave();
                    else setIsEditing(true);
                }} className="text-indigo-400 hover:text-indigo-300 transition-colors">
                    {isEditing ? 'Lưu' : 'Sửa'}
                </button>
                <button onClick={onDelete} className="text-red-500 hover:text-red-400 transition-colors">Xóa</button>
            </div>
        </li>
    );
};


const SettingsModal: React.FC<SettingsModalProps> = ({ 
    isOpen, onClose, 
    members, brands, formats, assigners,
    onSetMembers, onSetBrands, onSetFormats, onSetAssigners
}) => {
    const [newBrandName, setNewBrandName] = useState('');
    const [newFormat, setNewFormat] = useState('');
    const [newMemberName, setNewMemberName] = useState('');
    const [newAssignerName, setNewAssignerName] = useState('');

    const handleAdd = (type: 'brand' | 'format' | 'member' | 'assigner') => {
        if (type === 'brand' && newBrandName.trim() && !brands.find(b => b.name === newBrandName.trim())) {
             const newBrandData: BrandInfo = {
                name: newBrandName.trim(),
                avatar: `https://i.pravatar.cc/150?u=brand${Date.now()}`
            };
            onSetBrands(prev => [...prev, newBrandData]);
            setNewBrandName('');
        }
        if (type === 'format' && newFormat.trim() && !formats.includes(newFormat.trim())) {
            onSetFormats(prev => [...prev, newFormat.trim()]);
            setNewFormat('');
        }
        if (type === 'member' && newMemberName.trim()) {
            const newMemberData: Member = {
                id: `member-${Date.now()}`,
                name: newMemberName.trim(),
                avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
            };
            onSetMembers(prev => [...prev, newMemberData]);
            setNewMemberName('');
        }
        if (type === 'assigner' && newAssignerName.trim()) {
            const newAssignerData: Member = {
                id: `member-${Date.now()}`,
                name: newAssignerName.trim(),
                avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
            };
            onSetAssigners(prev => [...prev, newAssignerData]);
            setNewAssignerName('');
        }
    };

    const handleUpdate = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, index: number, newValue: T) => {
        setter(prev => {
            const updated = [...prev];
            updated[index] = newValue;
            return updated;
        });
    };

    const handleDelete = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, index: number) => {
        setter(prev => prev.filter((_, i) => i !== index));
    };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 glass-modal-bg flex items-center justify-center z-50">
      <div className="bg-slate-800/90 rounded-lg shadow-2xl p-6 w-full max-w-7xl m-4 max-h-[90vh] flex flex-col border border-slate-700">
        <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-3">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Cài đặt</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>
        
        <div className="overflow-y-auto flex-grow pr-2 -mr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                
                {/* Brands Column */}
                <div className="space-y-3 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                    <h3 className="font-bold text-lg text-blue-400">Thương hiệu</h3>
                    <ul className="space-y-2 max-h-96 overflow-y-auto">
                        {brands.map((brand, index) => (
                           <EditableBrandListItem
                                key={brand.name}
                                item={brand}
                                onSave={(newValue) => handleUpdate(onSetBrands, index, newValue)}
                                onDelete={() => handleDelete(onSetBrands, index)}
                           />
                        ))}
                    </ul>
                     <div className="flex space-x-2 pt-2 border-t border-slate-700">
                        <input type="text" value={newBrandName} onKeyPress={e => e.key === 'Enter' && handleAdd('brand')} onChange={e => setNewBrandName(e.target.value)} placeholder="Tên thương hiệu mới..." className="flex-grow bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"/>
                        <button onClick={() => handleAdd('brand')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 rounded-md transition-colors">Thêm</button>
                    </div>
                </div>

                {/* Formats Column */}
                <div className="space-y-3 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                    <h3 className="font-bold text-lg text-yellow-400">Định dạng</h3>
                    <ul className="space-y-2 max-h-96 overflow-y-auto">
                        {formats.map((format, index) => (
                             <EditableListItem 
                                key={index} 
                                item={format} 
                                onSave={(newValue) => handleUpdate(onSetFormats, index, newValue)}
                                onDelete={() => handleDelete(onSetFormats, index)}
                            />
                        ))}
                    </ul>
                    <div className="flex space-x-2 pt-2 border-t border-slate-700">
                        <input type="text" value={newFormat} onKeyPress={e => e.key === 'Enter' && handleAdd('format')} onChange={e => setNewFormat(e.target.value)} placeholder="Định dạng mới..." className="flex-grow bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"/>
                        <button onClick={() => handleAdd('format')} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold p-2 rounded-md transition-colors">Thêm</button>
                    </div>
                </div>

                {/* Members Column */}
                <div className="space-y-3 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                    <h3 className="font-bold text-lg text-green-400">Thành viên</h3>
                    <ul className="space-y-2 max-h-96 overflow-y-auto">
                        {members.map((member, index) => (
                           <EditableMemberListItem
                                key={member.id}
                                item={member}
                                onSave={(newValue) => handleUpdate(onSetMembers, index, newValue)}
                                onDelete={() => handleDelete(onSetMembers, index)}
                           />
                        ))}
                    </ul>
                     <div className="flex space-x-2 pt-2 border-t border-slate-700">
                         <input type="text" value={newMemberName} onKeyPress={e => e.key === 'Enter' && handleAdd('member')} onChange={e => setNewMemberName(e.target.value)} placeholder="Tên thành viên mới..." className="flex-grow bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"/>
                        <button onClick={() => handleAdd('member')} className="bg-green-600 hover:bg-green-700 text-white font-bold p-2 rounded-md transition-colors">Thêm</button>
                    </div>
                </div>

                {/* Assigners Column */}
                <div className="space-y-3 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                    <h3 className="font-bold text-lg text-purple-400">Người giao</h3>
                    <ul className="space-y-2 max-h-96 overflow-y-auto">
                        {assigners.map((assigner, index) => (
                           <EditableMemberListItem
                                key={assigner.id}
                                item={assigner}
                                onSave={(newValue) => handleUpdate(onSetAssigners, index, newValue)}
                                onDelete={() => handleDelete(onSetAssigners, index)}
                           />
                        ))}
                    </ul>
                     <div className="flex space-x-2 pt-2 border-t border-slate-700">
                         <input type="text" value={newAssignerName} onKeyPress={e => e.key === 'Enter' && handleAdd('assigner')} onChange={e => setNewAssignerName(e.target.value)} placeholder="Tên người giao..." className="flex-grow bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"/>
                        <button onClick={() => handleAdd('assigner')} className="bg-purple-600 hover:bg-purple-700 text-white font-bold p-2 rounded-md transition-colors">Thêm</button>
                    </div>
                </div>

            </div>
        </div>
         <div className="flex justify-end pt-4 mt-4 border-t border-slate-700">
            <button type="button" onClick={onClose} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;