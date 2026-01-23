
import React from 'react';
import { Group, Post, User } from '../types';
import PostCard from './PostCard';

interface GroupDetailProps {
  group: Group;
  posts: Post[];
  members: User[];
  isMember: boolean;
  onJoin: () => void;
  onLeave: () => void;
  onLike: (id: string) => void;
  onComment: (id: string, text: string, parentCommentId?: string, media?: string) => void;
  onShare: (post: Post) => void;
  onOpenCreate: () => void;
}

const GroupDetail: React.FC<GroupDetailProps> = ({ 
  group, posts, isMember, onJoin, onLeave, onLike, onComment, onShare, onOpenCreate 
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Cluster Header */}
      <div className="bg-[#0D0208] border border-[#003B00] overflow-hidden">
        <div className="h-48 relative border-b border-[#003B00] bg-[#001500]">
          <img src={group.coverImage} className="w-full h-full object-cover grayscale opacity-40" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0208] to-transparent"></div>
          <div className="absolute bottom-4 left-6 flex items-end gap-6">
            <img src={group.avatar} className="w-24 h-24 border border-[#00FF41] shadow-[0_0_15px_#00FF41]/20 grayscale hover:grayscale-0 transition-all" alt="" />
            <div className="pb-2">
              <h1 className="text-xl font-bold uppercase tracking-[0.3em] matrix-glow">{group.name}</h1>
              <p className="text-[10px] text-[#00FF41]/60 font-bold uppercase">{group.handle} // SECURE_CLUSTER</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="max-w-md">
              <p className="text-[10px] text-[#00FF41]/80 leading-relaxed font-['Fira_Code'] uppercase">
                {group.description || 'No specific directives initialized for this enclave.'}
              </p>
            </div>
            <button 
              onClick={isMember ? onLeave : onJoin}
              className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                isMember 
                  ? 'border border-red-900 text-red-500 hover:bg-red-900 hover:text-black' 
                  : 'bg-[#00FF41] text-[#0D0208] hover:shadow-[0_0_15px_#00FF41]'
              }`}
            >
              {isMember ? 'TERMINATE_SYNC' : 'HANDSHAKE_JOIN'}
            </button>
          </div>

          <div className="flex gap-8 border-t border-[#001500] pt-4">
            <div>
              <div className="text-xs font-bold">{group.memberIds.length}</div>
              <div className="text-[8px] text-[#003B00] uppercase font-bold tracking-tighter">Authorized_Nodes</div>
            </div>
            <div>
              <div className="text-xs font-bold">{posts.length}</div>
              <div className="text-[8px] text-[#003B00] uppercase font-bold tracking-tighter">Decrypted_Transmissions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cluster Feed */}
      {isMember ? (
        <div className="space-y-6">
          <div className="bg-[#001500]/30 border border-dashed border-[#003B00] p-4 text-center cursor-pointer hover:border-[#00FF41] transition-all" onClick={onOpenCreate}>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#003B00] hover:text-[#00FF41]">Initialize_Transmission_to_Enclave...</span>
          </div>
          {posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              onLike={() => onLike(post.id)} 
              onComment={(txt, parentId, media) => onComment(post.id, txt, parentId, media)} 
              onShare={() => onShare(post)}
            />
          ))}
          {posts.length === 0 && (
            <div className="text-center py-20 text-[#003B00] text-[10px] uppercase">Enclave buffer empty. Awaiting transmissions.</div>
          )}
        </div>
      ) : (
        <div className="bg-[#001500]/20 border border-red-900/30 p-12 text-center">
          <i className="fa-solid fa-lock text-3xl text-red-900/50 mb-4"></i>
          <h3 className="text-[10px] font-bold text-red-900 uppercase tracking-widest">Access_Denied</h3>
          <p className="text-red-900/50 text-[8px] mt-2 uppercase tracking-tighter">Synchronize with enclave to intercept data stream.</p>
        </div>
      )}
    </div>
  );
};

export default GroupDetail;
