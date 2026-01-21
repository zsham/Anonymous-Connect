
import React from 'react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenCreate: () => void;
  notificationCount?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onOpenCreate, notificationCount = 0 }) => {
  const navItems = [
    { id: TabType.HOME, icon: 'fa-terminal', label: 'ROOT_FEED' },
    { id: TabType.EXPLORE, icon: 'fa-code-branch', label: 'QUERY_WORLD' },
    { id: TabType.NOTIFICATIONS, icon: 'fa-microchip', label: 'INTERCEPTS', badge: notificationCount > 0 ? notificationCount.toString() : null },
    { id: TabType.PROFILE, icon: 'fa-id-badge', label: 'IDENTITY_NODE' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="matrix-border bg-[#0D0208]/80 p-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-between p-3 transition-all group border-b border-[#003B00] last:border-b-0 ${
              activeTab === item.id 
                ? 'bg-[#00FF41] text-[#0D0208] font-bold' 
                : 'text-[#00FF41]/60 hover:text-[#00FF41] hover:bg-[#003B00]/30'
            }`}
          >
            <div className="flex items-center gap-4">
              <i className={`fa-solid ${item.icon} text-lg`}></i>
              <span className="text-[10px] tracking-[0.2em] font-bold uppercase">{item.label}</span>
            </div>
            {item.badge && (
              <span className="bg-red-900 text-white text-[8px] px-1.5 border border-red-500 animate-pulse font-bold">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <button 
        onClick={onOpenCreate}
        className="w-full py-4 bg-[#00FF41] text-[#0D0208] font-black uppercase tracking-[0.3em] text-xs shadow-[0_0_20px_#00FF41]/30 hover:shadow-[0_0_30px_#00FF41] transform active:scale-95 transition-all flex items-center justify-center gap-3"
      >
        <i className="fa-solid fa-plus-square"></i>
        <span>Push_Packet</span>
      </button>

      <div className="p-5 border border-[#003B00] relative overflow-hidden group">
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <i className="fa-solid fa-wand-magic-sparkles text-[#00FF41]"></i>
            <h4 className="font-bold text-[10px] uppercase tracking-widest text-[#00FF41]">AI_OVERRIDE</h4>
          </div>
          <p className="text-[9px] text-[#00FF41]/50 leading-relaxed mb-4 uppercase tracking-tighter">
            System requires content input. Use Neural AI to bypass writer blocks. 
          </p>
          <button className="w-full py-2 bg-transparent text-[#00FF41] text-[9px] font-bold border border-[#00FF41]/30 hover:border-[#00FF41] transition-all uppercase tracking-widest">
            Execute_Assistant
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
