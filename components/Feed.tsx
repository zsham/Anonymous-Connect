
import React, { useState } from 'react';
import PostCard from './PostCard';
import { Post } from '../types';

interface FeedProps {
  posts: Post[];
  onLike: (id: string) => void;
  onComment: (id: string, text: string) => void;
  onOpenCreate: () => void;
}

const Feed: React.FC<FeedProps> = ({ posts, onLike, onComment, onOpenCreate }) => {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {/* Quick Create Bar */}
      <div className="bg-[#0D0208] border border-[#003B00] p-4 flex items-center gap-4 group hover:border-[#00FF41] transition-all">
        <img src="https://picsum.photos/seed/hacker/200/200" className="w-10 h-10 border border-[#003B00] grayscale group-hover:grayscale-0 transition-all" alt="" />
        <button 
          onClick={onOpenCreate}
          className="flex-1 bg-[#001500]/50 text-left px-5 py-2 text-[#003B00] group-hover:text-[#00FF41] text-[10px] tracking-[0.2em] font-bold transition-colors uppercase"
        >
          Initialize_Stream_Input...
        </button>
        <div className="flex items-center gap-1 text-[#003B00]">
          <button className="p-2 hover:text-[#00FF41] transition-colors"><i className="fa-solid fa-terminal"></i></button>
          <button className="p-2 hover:text-[#00FF41] transition-colors"><i className="fa-solid fa-bug"></i></button>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {posts.map(post => (
          <PostCard 
            key={post.id} 
            post={post} 
            onLike={() => onLike(post.id)} 
            onComment={(text) => onComment(post.id, text)} 
          />
        ))}
        {posts.length === 0 && (
          <div className="text-center py-20 border border-dashed border-[#003B00]">
            <i className="fa-solid fa-ghost text-5xl text-[#001500] mb-4"></i>
            <h3 className="text-sm font-bold text-[#003B00] uppercase tracking-widest">Null_Void_Detected</h3>
            <p className="text-[#003B00] text-[10px] mt-2 uppercase">Connect to more nodes to intercept data.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
