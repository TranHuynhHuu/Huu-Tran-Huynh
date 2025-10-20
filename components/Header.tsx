import React, { useState } from 'react';
import { View, Member } from '../types';
import ProfileModal from './ProfileModal';

interface HeaderProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onSwitchUser: () => void;
  currentUser: Member;
  onUpdateMemberInfo: (memberId: string, updates: Partial<Member>) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, onSwitchUser, currentUser, onUpdateMemberInfo }) => {
  const isManagerView = currentView === 'manager';
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <>
      <header className="bg-slate-900/70 backdrop-blur-sm shadow-lg p-4 flex justify-between items-center border-b border-slate-700/50 sticky top-0 z-40">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-wide">Quản lý công việc Team Thiết kế</h1>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`font-semibold transition-colors ${!isManagerView ? 'text-indigo-400' : 'text-slate-400'}`}>Thành viên</span>
            <label htmlFor="view-toggle" className="flex items-center cursor-pointer">
              <div className="relative">
                <input 
                  id="view-toggle" 
                  type="checkbox" 
                  className="sr-only" 
                  checked={isManagerView}
                  onChange={() => onViewChange(isManagerView ? 'member' : 'manager')}
                />
                <div className="block bg-slate-700 w-14 h-8 rounded-full"></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out ${isManagerView ? 'transform translate-x-6 bg-gradient-to-r from-indigo-400 to-purple-500' : ''}`}></div>
              </div>
            </label>
            <span className={`font-semibold transition-colors ${isManagerView ? 'text-indigo-400' : 'text-slate-400'}`}>Quản lý</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
              <button 
                  onClick={() => setIsProfileModalOpen(true)}
                  className="text-sm text-slate-400 hover:text-indigo-400 transition-colors flex items-center space-x-2"
                  title="Tài khoản của tôi"
              >
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full border-2 border-slate-600" />
                  <span>{currentUser.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
              </button>
          </div>
        </div>
      </header>
      {isProfileModalOpen && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentUser={currentUser}
          onSwitchUser={onSwitchUser}
          onUpdateMemberInfo={onUpdateMemberInfo}
        />
      )}
    </>
  );
};

export default Header;