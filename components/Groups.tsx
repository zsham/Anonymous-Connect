
import React from 'react';
import { Group } from '../types';

interface GroupsProps {
  groups: Group[];
  onSelectGroup: (groupId: string) => void;
  onCreateGroup: () => void;
  currentUserFriendIds: string[];
}

const Groups: React.FC<GroupsProps> = ({ groups, onSelectGroup, onCreateGroup }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between bg-[#0D0208] border border-[#003B00] p-6 hover:border-[#00FF41] transition-all">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.4em] matrix-glow">Clusters_Network</h2>
          <p className="text-[10px] text-[#003B00] uppercase mt-1 tracking-widest">Active decentralized enclaves</p>
        </div>
        <button 
          onClick={onCreateGroup}
          className="bg-transparent border border-[#00FF41] text-[#00FF41] px-4 py-2 text-[10px] font-bold uppercase hover:bg-[#00FF41] hover:text-[#0D0208] transition-all"
        >
          Initialize_New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map(group => (
          <div 
            key={group.id} 
            onClick={() => onSelectGroup(group.id)}
            className="group cursor-pointer bg-[#0D0208] border border-[#003B00] hover:border-[#00FF41] transition-all overflow-hidden"
          >
            <div className="h-20 bg-[#001500] relative overflow-hidden">
              <img src={group.coverImage} className="w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0208] to-transparent"></div>
            </div>
            <div className="p-4 -mt-10 relative">
              <img src={group.avatar} className="w-12 h-12 border border-[#00FF41] mb-2 bg-[#0D0208] grayscale group-hover:grayscale-0 transition-all" alt="" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#00FF41] group-hover:matrix-glow">{group.name}</h3>
              <p className="text-[9px] text-[#003B00] mb-3">{group.handle}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-[8px] text-[#003B00] uppercase font-bold">{group.memberIds.length} Linked_Nodes</span>
                <span className="text-[8px] border border-[#003B00] px-2 py-0.5 text-[#003B00] group-hover:text-[#00FF41] group-hover:border-[#00FF41]">OPEN_SYNC</span>
              </div>
            </div>
          </div>
        ))}

        {groups.length === 0 && (
          <div className="col-span-full py-20 text-center border border-dashed border-[#001500]">
            <i className="fa-solid fa-network-wired text-4xl text-[#001500] mb-4"></i>
            <h3 className="text-[10px] font-bold text-[#003B00] uppercase tracking-[0.3em]">Grid_Silent</h3>
            <p className="text-[#001500] text-[8px] mt-2 uppercase">No established clusters detected in current sector.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;
