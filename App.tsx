
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import Explore from './components/Explore';
import Profile from './components/Profile';
import CreatePostModal from './components/CreatePostModal';
import Auth from './components/Auth';
import { Post, User, TabType, AuthUser } from './types';
import { INITIAL_POSTS, INITIAL_USERS } from './constants';

const AppContent: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.HOME);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('nexus_current_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsInitialized(true);
  }, []);

  const handleAuthSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    localStorage.setItem('nexus_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('nexus_current_user');
  };

  const handleCreatePost = (newPost: Omit<Post, 'id' | 'likes' | 'comments' | 'timestamp' | 'isLiked' | 'userName' | 'userHandle' | 'userAvatar' | 'userId'>) => {
    if (!currentUser) return;
    const post: Post = {
      ...newPost,
      id: `node-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userHandle: currentUser.handle,
      userAvatar: currentUser.avatar,
      likes: 0,
      comments: [],
      timestamp: '0x00 Now',
      isLiked: false
    };
    setPosts([post, ...posts]);
    setIsCreateModalOpen(false);
  };

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          isLiked: !p.isLiked,
          likes: p.isLiked ? p.likes - 1 : p.likes + 1
        };
      }
      return p;
    }));
  };

  const addComment = (postId: string, content: string) => {
    if (!currentUser) return;
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const newComment = {
          id: `tx-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          content,
          timestamp: 'Just now'
        };
        return {
          ...p,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    }));
  };

  const toggleFollow = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isFollowing: !u.isFollowing } : u));
  };

  if (!isInitialized) return null;

  if (!currentUser) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#0D0208] text-[#00FF41] flex flex-col selection:bg-[#00FF41] selection:text-[#0D0208]">
      <Header currentUser={currentUser} onLogout={handleLogout} />
      
      <main className="flex-1 max-w-7xl mx-auto w-full flex gap-6 px-4 md:px-6 py-6 overflow-hidden">
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onOpenCreate={() => setIsCreateModalOpen(true)} />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === TabType.HOME && (
            <Feed 
              posts={posts} 
              onLike={toggleLike} 
              onComment={addComment} 
              onOpenCreate={() => setIsCreateModalOpen(true)}
              currentUserAvatar={currentUser.avatar}
            />
          )}
          {activeTab === TabType.EXPLORE && <Explore />}
          {activeTab === TabType.PROFILE && <Profile user={currentUser} posts={posts.filter(p => p.userId === currentUser.id)} />}
        </div>

        <div className="hidden xl:block w-80 flex-shrink-0">
          <div className="bg-[#0D0208] matrix-border p-5 sticky top-6">
            <h3 className="font-bold text-lg mb-4 matrix-glow tracking-widest uppercase text-xs">Adjacent Nodes</h3>
            <div className="space-y-4">
              {users.map(user => (
                <div key={user.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} className="w-10 h-10 matrix-border grayscale hover:grayscale-0 transition-all" alt="" />
                    <div>
                      <div className="font-semibold text-xs tracking-tighter">{user.name}</div>
                      <div className="text-[10px] text-[#003B00] group-hover:text-[#00FF41] transition-colors">{user.handle}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleFollow(user.id)}
                    className={`text-[10px] uppercase font-bold px-3 py-1 transition-all border ${
                      user.isFollowing ? 'border-[#003B00] text-[#003B00] hover:border-[#00FF41] hover:text-[#00FF41]' : 'border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41] hover:text-[#0D0208]'
                    }`}
                  >
                    {user.isFollowing ? 'Linked' : 'Sync'}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-[#003B00]">
              <p className="text-[10px] text-[#003B00] uppercase tracking-[0.2em]">Reality.v4.0.1 // Simulation Active</p>
            </div>
          </div>
        </div>
      </main>

      <div className="lg:hidden bg-[#0D0208] border-t border-[#003B00] sticky bottom-0 left-0 right-0 z-40 flex justify-around items-center py-4">
        <button onClick={() => setActiveTab(TabType.HOME)} className={`p-2 ${activeTab === TabType.HOME ? 'matrix-glow' : 'opacity-40'}`}>
          <i className="fa-solid fa-terminal text-xl"></i>
        </button>
        <button onClick={() => setActiveTab(TabType.EXPLORE)} className={`p-2 ${activeTab === TabType.EXPLORE ? 'matrix-glow' : 'opacity-40'}`}>
          <i className="fa-solid fa-code-branch text-xl"></i>
        </button>
        <button onClick={() => setIsCreateModalOpen(true)} className="p-3 bg-[#00FF41] text-[#0D0208] shadow-[0_0_15px_#00FF41]">
          <i className="fa-solid fa-plus text-xl"></i>
        </button>
        <button onClick={() => setActiveTab(TabType.PROFILE)} className={`p-2 ${activeTab === TabType.PROFILE ? 'matrix-glow' : 'opacity-40'}`}>
          <i className="fa-solid fa-id-badge text-xl"></i>
        </button>
        <button onClick={handleLogout} className="p-2 opacity-40 hover:text-red-500 hover:opacity-100">
          <i className="fa-solid fa-power-off text-xl"></i>
        </button>
      </div>

      <CreatePostModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSubmit={handleCreatePost} 
        currentUser={currentUser}
      />
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
