
import React, { useState, useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import Explore from './components/Explore';
import Profile from './components/Profile';
import CreatePostModal from './components/CreatePostModal';
import CreateGroupModal from './components/CreateGroupModal';
import Auth from './components/Auth';
import Notifications from './components/Notifications';
import Groups from './components/Groups';
import GroupDetail from './components/GroupDetail';
import { Post, User, TabType, AuthUser, Group } from './types';
import { INITIAL_POSTS, INITIAL_USERS } from './constants';

const AppContent: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.HOME);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('nexus_current_user');
    const storedUsers = JSON.parse(localStorage.getItem('connect_users') || '[]');
    const storedGroups = JSON.parse(localStorage.getItem('connect_groups') || '[]');
    
    const combinedUsers = [...INITIAL_USERS];
    storedUsers.forEach((u: User) => {
      if (!combinedUsers.find(c => c.id === u.id)) combinedUsers.push(u);
    });
    setAllUsers(combinedUsers);
    setGroups(storedGroups);

    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      const latest = combinedUsers.find(u => u.id === parsed.id) as AuthUser;
      setCurrentUser(latest || parsed);
    }
    setIsInitialized(true);
  }, []);

  const saveState = (updatedUsers: User[], updatedGroups: Group[], current?: AuthUser | null) => {
    setAllUsers(updatedUsers);
    setGroups(updatedGroups);
    if (current) {
      setCurrentUser(current);
      localStorage.setItem('nexus_current_user', JSON.stringify(current));
    }
    localStorage.setItem('connect_users', JSON.stringify(updatedUsers.filter(u => !INITIAL_USERS.find(i => i.id === u.id))));
    localStorage.setItem('connect_groups', JSON.stringify(updatedGroups));
  };

  const handleAuthSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    localStorage.setItem('nexus_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('nexus_current_user');
  };

  const handleCreatePost = (newPost: { content: string; image?: string; video?: string }) => {
    if (!currentUser) return;
    const post: Post = {
      ...newPost,
      id: `node-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userHandle: currentUser.handle,
      userAvatar: currentUser.avatar,
      groupId: activeTab === TabType.GROUP_DETAIL && activeGroupId ? activeGroupId : undefined,
      likes: 0,
      comments: [],
      timestamp: '0x00 Now',
      isLiked: false
    };
    setPosts([post, ...posts]);
    setIsCreateModalOpen(false);
  };

  const handleCreateGroup = (groupData: Omit<Group, 'id' | 'memberIds' | 'adminIds'>) => {
    if (!currentUser) return;
    const newGroup: Group = {
      ...groupData,
      id: `cluster-${Date.now()}`,
      memberIds: [currentUser.id],
      adminIds: [currentUser.id]
    };
    const updatedGroups = [...groups, newGroup];
    saveState(allUsers, updatedGroups, currentUser);
    setIsGroupModalOpen(false);
    setActiveGroupId(newGroup.id);
    setActiveTab(TabType.GROUP_DETAIL);
  };

  const toggleGroupJoin = (groupId: string, join: boolean) => {
    if (!currentUser) return;
    const updatedGroups = groups.map(g => {
      if (g.id === groupId) {
        const members = join 
          ? [...g.memberIds, currentUser.id] 
          : g.memberIds.filter(id => id !== currentUser.id);
        return { ...g, memberIds: members };
      }
      return g;
    });
    saveState(allUsers, updatedGroups, currentUser);
  };

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 };
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
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    }));
  };

  if (!isInitialized) return null;
  if (!currentUser) return <Auth onAuthSuccess={handleAuthSuccess} />;

  const pendingRequests = allUsers.filter(u => currentUser.incomingRequestIds?.includes(u.id));
  const activeGroup = groups.find(g => g.id === activeGroupId);

  return (
    <div className="min-h-screen bg-[#0D0208] text-[#00FF41] flex flex-col selection:bg-[#00FF41] selection:text-[#0D0208]">
      <Header currentUser={currentUser} onLogout={handleLogout} />
      
      <main className="flex-1 max-w-7xl mx-auto w-full flex gap-6 px-4 md:px-6 py-6 overflow-hidden">
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={(t) => { setActiveTab(t); setActiveGroupId(null); }} 
            onOpenCreate={() => setIsCreateModalOpen(true)} 
            notificationCount={pendingRequests.length}
          />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === TabType.HOME && (
            <Feed 
              posts={posts.filter(p => !p.groupId)} 
              onLike={toggleLike} 
              onComment={addComment} 
              onOpenCreate={() => setIsCreateModalOpen(true)}
              currentUserAvatar={currentUser.avatar}
            />
          )}
          {activeTab === TabType.EXPLORE && <Explore />}
          {activeTab === TabType.NOTIFICATIONS && (
            <Notifications requests={pendingRequests} onAccept={() => {}} onReject={() => {}} />
          )}
          {activeTab === TabType.PROFILE && <Profile user={currentUser} posts={posts.filter(p => p.userId === currentUser.id)} />}
          {activeTab === TabType.GROUPS && (
            <Groups 
              groups={groups} 
              onSelectGroup={(id) => { setActiveGroupId(id); setActiveTab(TabType.GROUP_DETAIL); }}
              onCreateGroup={() => setIsGroupModalOpen(true)}
              currentUserFriendIds={currentUser.friendIds || []}
            />
          )}
          {activeTab === TabType.GROUP_DETAIL && activeGroup && (
            <GroupDetail 
              group={activeGroup}
              posts={posts.filter(p => p.groupId === activeGroupId)}
              members={allUsers.filter(u => activeGroup.memberIds.includes(u.id))}
              isMember={activeGroup.memberIds.includes(currentUser.id)}
              onJoin={() => toggleGroupJoin(activeGroup.id, true)}
              onLeave={() => toggleGroupJoin(activeGroup.id, false)}
              onLike={toggleLike}
              onComment={addComment}
              onOpenCreate={() => setIsCreateModalOpen(true)}
            />
          )}
        </div>

        {/* Right Sidebar */}
        <div className="hidden xl:block w-80 flex-shrink-0">
          <div className="bg-[#0D0208] matrix-border p-5 sticky top-6">
            <h3 className="font-bold text-lg mb-4 matrix-glow tracking-widest uppercase text-xs">Joined_Clusters</h3>
            <div className="space-y-4">
              {groups.filter(g => g.memberIds.includes(currentUser.id)).slice(0, 5).map(g => (
                <div key={g.id} onClick={() => { setActiveGroupId(g.id); setActiveTab(TabType.GROUP_DETAIL); }} className="flex items-center gap-3 cursor-pointer group">
                  <img src={g.avatar} className="w-8 h-8 border border-[#003B00] group-hover:border-[#00FF41]" alt="" />
                  <div className="text-[10px] font-bold uppercase tracking-widest group-hover:text-[#00FF41]">{g.name}</div>
                </div>
              ))}
              {groups.filter(g => g.memberIds.includes(currentUser.id)).length === 0 && (
                <div className="text-[9px] text-[#003B00] uppercase">Isolated node. No active clusters.</div>
              )}
            </div>
            <button 
              onClick={() => setActiveTab(TabType.GROUPS)}
              className="w-full mt-6 py-2 text-[9px] font-bold border border-[#003B00] text-[#003B00] hover:border-[#00FF41] hover:text-[#00FF41] uppercase tracking-[0.2em]"
            >
              Browse_All_Nodes
            </button>
          </div>
        </div>
      </main>

      <div className="lg:hidden bg-[#0D0208] border-t border-[#003B00] sticky bottom-0 left-0 right-0 z-40 flex justify-around items-center py-4">
        <button onClick={() => setActiveTab(TabType.HOME)} className={`p-2 ${activeTab === TabType.HOME ? 'matrix-glow' : 'opacity-40'}`}><i className="fa-solid fa-terminal text-xl"></i></button>
        <button onClick={() => setActiveTab(TabType.GROUPS)} className={`p-2 ${activeTab === TabType.GROUPS ? 'matrix-glow' : 'opacity-40'}`}><i className="fa-solid fa-network-wired text-xl"></i></button>
        <button onClick={() => setIsCreateModalOpen(true)} className="p-3 bg-[#00FF41] text-[#0D0208] shadow-[0_0_15px_#00FF41]"><i className="fa-solid fa-plus text-xl"></i></button>
        <button onClick={() => setActiveTab(TabType.NOTIFICATIONS)} className={`p-2 relative ${activeTab === TabType.NOTIFICATIONS ? 'matrix-glow' : 'opacity-40'}`}><i className="fa-solid fa-microchip text-xl"></i></button>
        <button onClick={() => setActiveTab(TabType.PROFILE)} className={`p-2 ${activeTab === TabType.PROFILE ? 'matrix-glow' : 'opacity-40'}`}><i className="fa-solid fa-id-badge text-xl"></i></button>
      </div>

      <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreatePost} currentUser={currentUser} />
      <CreateGroupModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} onSubmit={handleCreateGroup} currentUser={currentUser} />
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
