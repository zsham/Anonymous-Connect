
import React, { useState } from 'react';
import { User, Group } from '../types';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (group: Omit<Group, 'id' | 'memberIds' | 'adminIds'>) => void;
  currentUser: User;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, onSubmit, currentUser }) => {
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState(`https://picsum.photos/seed/${Math.random()}/200/200`);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !handle) return;
    onSubmit({
      name,
      handle: handle.startsWith('&') ? handle : `&${handle}`,
      description,
      avatar,
      coverImage: `https://picsum.photos/seed/${handle}/1200/400`
    });
    setName('');
    setHandle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-[#0D0208] w-full max-w-lg border border-[#00FF41] relative animate-in zoom-in duration-300">
        <div className="p-4 border-b border-[#00FF41] flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-[0.5em] matrix-glow">Initialize_Cluster_Enclave</h2>
          <button onClick={onClose} className="text-[#00FF41] hover:matrix-glow"><i className="fa-solid fa-xmark"></i></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-['Share_Tech_Mono']">
          <div className="flex items-center gap-6 mb-6">
            <img src={avatar} className="w-20 h-20 border border-[#00FF41] grayscale" alt="Preview" />
            <button 
              type="button"
              onClick={() => setAvatar(`https://picsum.photos/seed/${Date.now()}/200/200`)}
              className="text-[10px] uppercase font-bold text-[#003B00] hover:text-[#00FF41]"
            >
              [Regenerate_Identity_Hash]
            </button>
          </div>

          <div>
            <label className="block text-[10px] uppercase text-[#00FF41] mb-1">Enclave_Designation</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black border border-[#003B00] px-3 py-2 text-xs text-[#00FF41] focus:border-[#00FF41] outline-none"
              placeholder="e.g. CYBER_UNDERGROUND"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase text-[#00FF41] mb-1">Cluster_Handle</label>
            <input 
              type="text" 
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full bg-black border border-[#003B00] px-3 py-2 text-xs text-[#00FF41] focus:border-[#00FF41] outline-none"
              placeholder="&ops_zero"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase text-[#00FF41] mb-1">Protocol_Directives</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-black border border-[#003B00] px-3 py-2 text-xs text-[#00FF41] focus:border-[#00FF41] outline-none h-24"
              placeholder="Enter enclave mission parameters..."
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full py-4 bg-[#00FF41] text-[#0D0208] font-black uppercase tracking-[0.4em] text-xs hover:shadow-[0_0_20px_#00FF41] transition-all"
            >
              Construct_Enclave
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
