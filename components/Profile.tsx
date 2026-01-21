
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
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 relative">
          <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")'}}></div>
        </div>
        <div className="px-8 pb-8 relative">
          <div className="flex justify-between items-end -mt-16 mb-6">
            <img 
              src={user.avatar} 
              className="w-32 h-32 rounded-3xl border-4 border-white shadow-2xl bg-white" 
              alt={user.name} 
            />
            <button className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all">
              Edit Profile
            </button>
          </div>
          
          <div className="mb-6">
            <h1 className="text-3xl font-black">{user.name}</h1>
            <p className="text-slate-500 font-medium mb-4">{user.handle}</p>
            <p className="text-slate-800 leading-relaxed max-w-md">
              {user.bio}
            </p>
          </div>

          <div className="flex items-center gap-8 border-t border-slate-100 pt-6">
            <div className="text-center">
              <div className="text-xl font-black">1.2k</div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-black">842</div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Following</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-black">{posts.length}</div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Connect Posts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white rounded-2xl border border-slate-200 p-1">
        <button className="flex-1 py-3 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl">Posts</button>
        <button className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Media</button>
        <button className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Likes</button>
      </div>

      {/* User's Posts */}
      <div className="space-y-6">
        {posts.map(post => (
          <PostCard key={post.id} post={post} onLike={() => {}} onComment={() => {}} />
        ))}
        {posts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <i className="fa-solid fa-plus text-2xl"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-600">Start sharing</h3>
            <p className="text-slate-400 text-sm mt-1">Your posts will appear here for the world to see.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
