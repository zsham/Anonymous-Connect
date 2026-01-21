
import React from 'react';
import { User, Post } from '../types';
import PostCard from './PostCard';

interface ProfileProps {
  user: User;
  posts: Post[];
}

const Profile: React.FC<ProfileProps> = ({ user, posts }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Banner & Bio */}
      <div className="bg-[#0D0208] border border-[#003B00] overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-[#001500] to-[#0D0208] relative border-b border-[#003B00]">
          <div className="absolute inset-0 opacity-10 flex flex-wrap gap-2 p-2 overflow-hidden font-mono text-[8px] text-[#00FF41] select-none pointer-events-none">
            {Array.from({ length: 50 }).map((_, i) => (
              <span key={i}>{Math.random().toString(16).substring(2, 8)}</span>
            ))}
          </div>
        </div>
        <div className="px-8 pb-8 relative">
          <div className="flex justify-between items-end -mt-16 mb-6">
            <img 
              src={user.avatar} 
              className="w-32 h-32 border-4 border-[#0D0208] matrix-border grayscale bg-black" 
              alt={user.name} 
            />
            <button className="px-6 py-2.5 border border-[#003B00] text-[#00FF41] text-[10px] font-bold uppercase tracking-widest hover:bg-[#00FF41] hover:text-[#0D0208] transition-all">
              Update_System_ID
            </button>
          </div>
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold uppercase tracking-[0.2em] matrix-glow">{user.name}</h1>
            <p className="text-[#003B00] font-bold text-xs mb-4 uppercase">{user.handle} // NODE_ACTIVE</p>
            <p className="text-[#00FF41]/70 leading-relaxed max-w-md text-xs font-['Fira_Code'] uppercase">
              {user.bio}
            </p>
          </div>

          <div className="flex items-center gap-8 border-t border-[#001500] pt-6">
            <div className="text-center">
              <div className="text-xl font-bold matrix-glow">1.2K</div>
              <div className="text-[8px] text-[#003B00] font-bold uppercase tracking-widest">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold matrix-glow">842</div>
              <div className="text-[8px] text-[#003B00] font-bold uppercase tracking-widest">Following</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold matrix-glow">{posts.length}</div>
              <div className="text-[8px] text-[#003B00] font-bold uppercase tracking-widest">Data_Packets</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#0D0208] border border-[#003B00] p-1">
        <button className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest text-[#0D0208] bg-[#00FF41]">Logs</button>
        <button className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest text-[#003B00] hover:text-[#00FF41] transition-colors">Assets</button>
        <button className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest text-[#003B00] hover:text-[#00FF41] transition-colors">Reactors</button>
      </div>

      {/* User's Posts */}
      <div className="space-y-6">
        {posts.map(post => (
          <PostCard key={post.id} post={post} onLike={() => {}} onComment={() => {}} />
        ))}
        {posts.length === 0 && (
          <div className="text-center py-20 border border-dashed border-[#003B00]">
            <div className="w-12 h-12 border border-[#001500] flex items-center justify-center mx-auto mb-4 text-[#001500]">
              <i className="fa-solid fa-plus text-xl"></i>
            </div>
            <h3 className="text-xs font-bold text-[#003B00] uppercase tracking-widest">Initialize_Stream</h3>
            <p className="text-[#003B00] text-[8px] mt-1 uppercase tracking-tighter">No packets detected in current node buffer.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
