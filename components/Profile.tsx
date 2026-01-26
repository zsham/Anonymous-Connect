
import React, { useState, useEffect } from 'react';
import { User, Post, VisualProtocol } from '../types';
import PostCard from './PostCard';

interface ProfileProps {
  user: User;
  posts: Post[];
  onUpdateProfile?: (updates: Partial<User>) => void;
  onLike: (id: string) => void;
  onComment: (id: string, text: string, parentCommentId?: string, media?: string) => void;
  onView: (id: string) => void;
  onShare: (post: Post) => void;
  allUsers: User[];
}

const Profile: React.FC<ProfileProps> = ({ user, posts, onUpdateProfile, onLike, onComment, onView, onShare, allUsers }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.bio || '',
    avatar: user.avatar,
    coverImage: user.coverImage || `https://picsum.photos/seed/${user.handle}-cover/1200/400`,
    template: user.template || 'GREEN_ROOT' as VisualProtocol
  });

  // Keep form data in sync with the user prop when not editing
  useEffect(() => {
    if (!isEditing) {
      setFormData({
        name: user.name,
        bio: user.bio || '',
        avatar: user.avatar,
        coverImage: user.coverImage || `https://picsum.photos/seed/${user.handle}-cover/1200/400`,
        template: user.template || 'GREEN_ROOT'
      });
    }
  }, [user, isEditing]);

  const handlePatch = () => {
    if (onUpdateProfile) {
      onUpdateProfile({
        name: formData.name,
        bio: formData.bio,
        avatar: formData.avatar,
        coverImage: formData.coverImage,
        template: formData.template
      });
    }
    setIsEditing(false);
  };

  const regenerateAvatar = () => {
    setFormData(prev => ({
      ...prev,
      avatar: `https://picsum.photos/seed/${Date.now()}/200/200`
    }));
  };

  const regenerateCover = () => {
    setFormData(prev => ({
      ...prev,
      coverImage: `https://picsum.photos/seed/cover-${Date.now()}/1200/400`
    }));
  };

  const protocols: { id: VisualProtocol; label: string; color: string }[] = [
    { id: 'GREEN_ROOT', label: 'ROOT_PROTOCOL', color: '#00FF41' },
    { id: 'AMBER_ARCHIVE', label: 'ARCHIVE_MODE', color: '#FFB000' },
    { id: 'CYBER_PULSE', label: 'NEURAL_PULSE', color: '#00E5FF' },
    { id: 'CRITICAL_STRIKE', label: 'CRITICAL_ALERT', color: '#FF3131' }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Banner & Bio */}
      <div className="bg-[#0D0208] border border-[#003B00] overflow-hidden group">
        <div className="h-40 relative border-b border-[#003B00] bg-[#001500]">
          <img 
            src={isEditing ? formData.coverImage : (user.coverImage || `https://picsum.photos/seed/${user.handle}-cover/1200/400`)} 
            className={`w-full h-full object-cover grayscale transition-all duration-700 ${isEditing ? 'opacity-60 brightness-125' : 'opacity-30'}`} 
            alt="Cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0208] to-transparent"></div>
          
          {isEditing && (
            <button 
              onClick={regenerateCover}
              className="absolute top-4 right-4 bg-black/80 border border-[#00FF41] px-3 py-1.5 text-[#00FF41] text-[9px] font-bold uppercase tracking-widest hover:bg-[#00FF41] hover:text-black transition-all z-10"
            >
              <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>
              Regenerate_Environment
            </button>
          )}

          <div className="absolute inset-0 opacity-10 flex flex-wrap gap-2 p-2 overflow-hidden font-mono text-[8px] text-[#00FF41] select-none pointer-events-none">
            {Array.from({ length: 50 }).map((_, i) => (
              <span key={i}>{Math.random().toString(16).substring(2, 8)}</span>
            ))}
          </div>
        </div>
        
        <div className="px-8 pb-8 relative">
          <div className="flex justify-between items-end -mt-16 mb-6">
            <div className="relative group/avatar">
              <img 
                src={isEditing ? formData.avatar : user.avatar} 
                className={`w-32 h-32 border-4 border-[#0D0208] matrix-border grayscale bg-black transition-all ${isEditing ? 'brightness-125' : ''}`} 
                alt={user.name} 
              />
              {isEditing && (
                <button 
                  onClick={regenerateAvatar}
                  className="absolute bottom-2 right-2 bg-black border border-[#00FF41] p-1.5 text-[#00FF41] hover:bg-[#00FF41] hover:text-black transition-all"
                  title="Regenerate Identity Hash"
                >
                  <i className="fa-solid fa-arrows-rotate text-[10px]"></i>
                </button>
              )}
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 border border-red-900 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-900 hover:text-black transition-all"
                  >
                    Cancel_Sync
                  </button>
                  <button 
                    onClick={handlePatch}
                    className="px-6 py-2.5 bg-[#00FF41] border border-[#00FF41] text-[#0D0208] text-[10px] font-bold uppercase tracking-widest hover:shadow-[0_0_15px_#00FF41] transition-all"
                  >
                    Execute_Patch
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2.5 border border-[#003B00] text-[#00FF41] text-[10px] font-bold uppercase tracking-widest hover:bg-[#00FF41] hover:text-[#0D0208] transition-all"
                >
                  Update_System_ID
                </button>
              )}
            </div>
          </div>
          
          <div className="mb-6 space-y-4">
            {isEditing ? (
              <div className="space-y-6 max-w-md">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[8px] uppercase text-[#003B00] mb-1 font-bold">Node_Alias</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[#001500]/50 border border-[#003B00] px-3 py-2 text-[#00FF41] text-xs focus:border-[#00FF41] outline-none transition-all font-['Fira_Code'] uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] uppercase text-[#003B00] mb-1 font-bold">Protocol_Bio</label>
                    <textarea 
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className="w-full bg-[#001500]/50 border border-[#003B00] px-3 py-2 text-[#00FF41] text-xs focus:border-[#00FF41] outline-none transition-all font-['Fira_Code'] uppercase resize-none h-20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] uppercase text-[#003B00] mb-3 font-bold">Visual_Protocol_Selection</label>
                  <div className="grid grid-cols-2 gap-2">
                    {protocols.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setFormData({...formData, template: p.id})}
                        className={`p-3 border text-[9px] font-bold uppercase tracking-widest text-left transition-all ${
                          formData.template === p.id 
                            ? 'bg-[#003B00]/40 border-[#00FF41] text-[#00FF41]' 
                            : 'bg-black border-[#003B00] text-[#003B00] hover:border-[#00FF41]/50 hover:text-[#00FF41]/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2" style={{ backgroundColor: p.color }}></div>
                          <span>{p.label}</span>
                        </div>
                        {formData.template === p.id && <span className="text-[7px] text-[#00FF41] opacity-50 font-mono">[ACTIVE_SYNC]</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h1 className="text-2xl font-bold uppercase tracking-[0.2em] matrix-glow">{user.name}</h1>
                  <p className="text-[#003B00] font-bold text-xs mb-4 uppercase">{user.handle} // NODE_ACTIVE</p>
                </div>
                <p className="text-[#00FF41]/70 leading-relaxed max-w-md text-xs font-['Fira_Code'] uppercase">
                  {user.bio || 'Protocol idle. No status sequence detected.'}
                </p>
              </>
            )}
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
          <PostCard 
            key={post.id} 
            post={post} 
            onLike={() => onLike(post.id)} 
            onComment={(txt, parentId, media) => onComment(post.id, txt, parentId, media)} 
            onView={() => onView(post.id)}
            onShare={() => onShare(post)}
            currentUser={user}
            allUsers={allUsers}
          />
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
