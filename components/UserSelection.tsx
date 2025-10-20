import React from 'react';
import { Member } from '../types';

interface UserSelectionProps {
  members: Member[];
  onSelectUser: (member: Member) => void;
}

const UserSelection: React.FC<UserSelectionProps> = ({ members, onSelectUser }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-center">
      <div className="w-full max-w-3xl">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-3 tracking-tight">Chào mừng bạn trở lại!</h1>
        <p className="text-lg text-slate-400 mb-12">Vui lòng chọn tên của bạn để bắt đầu.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {members.map(member => (
            <button 
              key={member.id} 
              onClick={() => onSelectUser(member)}
              className="group flex flex-col items-center p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:bg-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 transform hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
            >
              <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-full mb-4 border-4 border-slate-700 group-hover:border-indigo-500 transition-colors duration-300" />
              <span className="font-semibold text-slate-200">{member.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserSelection;
