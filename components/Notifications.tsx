
import React from 'react';
import { User } from '../types';

interface NotificationsProps {
  requests: User[];
  onAccept: (userId: string) => void;
  onReject: (userId: string) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ requests, onAccept, onReject }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-[#0D0208] border border-[#003B00] p-6 hover:border-[#00FF41] transition-all">
        <h2 className="text-sm font-bold mb-4 uppercase tracking-[0.4em] matrix-glow flex items-center gap-3">
          <i className="fa-solid fa-microchip animate-pulse"></i>
          Intercepted_Signals
        </h2>
        <p className="text-[10px] text-[#003B00] uppercase tracking-widest mb-6">
          Pending connection protocols awaiting authorization...
        </p>

        <div className="space-y-4">
          {requests.map((user) => (
            <div key={user.id} className="bg-[#001500]/30 border border-[#003B00] p-4 flex items-center justify-between group hover:border-[#00FF41]/50 transition-all">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src={user.avatar} 
                    className="w-12 h-12 border border-[#003B00] grayscale brightness-50 group-hover:brightness-100 group-hover:grayscale-0 transition-all" 
                    alt="" 
                  />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00FF41] animate-ping opacity-20"></div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-[#00FF41]">{user.name}</div>
                  <div className="text-[9px] text-[#003B00] uppercase">{user.handle} // REQUEST_SIGNAL</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => onAccept(user.id)}
                  className="px-4 py-2 border border-[#00FF41] text-[#0D0208] bg-[#00FF41] text-[9px] font-black uppercase tracking-widest hover:shadow-[0_0_15px_#00FF41] transition-all"
                >
                  Authorize
                </button>
                <button 
                  onClick={() => onReject(user.id)}
                  className="px-4 py-2 border border-red-900 text-red-500 text-[9px] font-black uppercase tracking-widest hover:bg-red-900 hover:text-black transition-all"
                >
                  Deny
                </button>
              </div>
            </div>
          ))}

          {requests.length === 0 && (
            <div className="text-center py-20 border border-dashed border-[#001500]">
              <i className="fa-solid fa-satellite-dish text-4xl text-[#001500] mb-4"></i>
              <h3 className="text-[10px] font-bold text-[#003B00] uppercase tracking-[0.3em]">No_Pending_Links</h3>
              <p className="text-[#001500] text-[8px] mt-2 uppercase">Frequency is clear. No unauthorized access attempts detected.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#0D0208] border border-[#003B00] p-6 opacity-40">
        <h3 className="text-[10px] font-bold mb-4 uppercase tracking-[0.2em] text-[#003B00]">Activity_Log</h3>
        <div className="text-[9px] font-['Fira_Code'] space-y-1">
          <div className="flex gap-2"><span className="text-[#003B00]">[0xAF2]</span><span>System check complete. Encryption: ACTIVE.</span></div>
          <div className="flex gap-2"><span className="text-[#003B00]">[0xBC1]</span><span>Neural pathway established. Waiting for handshake.</span></div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
