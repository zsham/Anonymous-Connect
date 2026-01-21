
import React from 'react';
import { CURRENT_USER } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-[#0D0208] border-b border-[#00FF41]/30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border border-[#00FF41] flex items-center justify-center text-[#00FF41] shadow-[0_0_10px_#00FF41]">
            <i className="fa-solid fa-square-root-variable text-xl"></i>
          </div>
          <span className="text-xl font-bold tracking-[0.3em] matrix-glow uppercase hidden sm:block">
            Anonymous_Connect
          </span>
        </div>

        <div className="flex-1 max-w-xl mx-8 hidden md:block">
          <div className="relative">
            <i className="fa-solid fa-chevron-right absolute left-4 top-1/2 -translate-y-1/2 text-[#00FF41] opacity-50"></i>
            <input 
              type="text" 
              placeholder="QUERY_SYSTEM..." 
              className="w-full bg-[#0D0208] border border-[#003B00] py-2 pl-10 pr-4 focus:border-[#00FF41] outline-none text-xs uppercase tracking-widest transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="relative p-2 text-[#00FF41] hover:matrix-glow">
            <i className="fa-solid fa-inbox text-xl"></i>
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#00FF41] shadow-[0_0_5px_#00FF41] rounded-full"></span>
          </button>
          <div className="flex items-center gap-4 cursor-pointer group">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold leading-tight uppercase tracking-tighter">{CURRENT_USER.name}</div>
              <div className="text-[8px] text-[#003B00] group-hover:text-[#00FF41] uppercase tracking-widest font-bold">Node_Active</div>
            </div>
            <img 
              src={CURRENT_USER.avatar} 
              className="w-10 h-10 border border-[#003B00] group-hover:border-[#00FF41] transition-all grayscale brightness-50 group-hover:brightness-100 group-hover:grayscale-0" 
              alt="Avatar" 
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
