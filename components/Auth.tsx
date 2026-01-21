
import React, { useState, useEffect } from 'react';
import { AuthUser } from '../types';

interface AuthProps {
  onAuthSuccess: (user: AuthUser) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');
  const [terminalText, setTerminalText] = useState('');
  const [loading, setLoading] = useState(false);

  const fullText = isLogin 
    ? "PROTOCOL_REQUEST: IDENTIFY_NODE..." 
    : "PROTOCOL_REQUEST: INITIALIZE_NEW_IDENTITY...";

  useEffect(() => {
    let i = 0;
    setTerminalText('');
    const interval = setInterval(() => {
      setTerminalText((prev) => prev + fullText.charAt(i));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [isLogin]);

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const storedUsers = JSON.parse(localStorage.getItem('connect_users') || '[]');

      if (isLogin) {
        const foundUser = storedUsers.find(
          (u: AuthUser) => u.handle === handle && u.accessKey === accessKey
        );
        if (foundUser) {
          onAuthSuccess(foundUser);
        } else {
          setError('ERR_IDENTITY_MISMATCH: INVALID_CREDENTIALS');
        }
      } else {
        if (!name || !handle || !accessKey) {
          setError('ERR_INCOMPLETE_PAYLOAD: ALL_FIELDS_REQUIRED');
          setLoading(false);
          return;
        }
        if (storedUsers.some((u: AuthUser) => u.handle === handle)) {
          setError('ERR_HANDLE_COLLISION: NODE_ALREADY_EXISTS');
          setLoading(false);
          return;
        }

        const newUser: AuthUser = {
          id: `node-${Date.now()}`,
          name,
          handle: handle.startsWith('@') ? handle : `@${handle}`,
          avatar: `https://picsum.photos/seed/${handle}/200/200`,
          bio: 'System initialized. Waiting for input...',
          accessKey
        };

        storedUsers.push(newUser);
        localStorage.setItem('connect_users', JSON.stringify(storedUsers));
        onAuthSuccess(newUser);
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-[#0D0208] flex items-center justify-center p-4 z-[200]">
      <div className="w-full max-w-md border border-[#00FF41] bg-[#0D0208] shadow-[0_0_50px_rgba(0,255,65,0.1)] p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#00FF41]/20 overflow-hidden">
          <div className="h-full bg-[#00FF41] animate-[loading_2s_infinite]"></div>
        </div>

        <div className="mb-8 font-['Fira_Code']">
          <div className="text-[#00FF41] text-xs mb-2 opacity-50 uppercase tracking-widest">System_Access_v4.0.1</div>
          <div className="text-[#00FF41] text-lg font-bold matrix-glow min-h-[1.5rem]">
            {terminalText}<span className="animate-pulse">_</span>
          </div>
        </div>

        <form onSubmit={handleAction} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-[10px] uppercase text-[#003B00] mb-1 font-bold">Node_Alias</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#001500]/50 border border-[#003B00] px-4 py-3 text-[#00FF41] text-xs focus:border-[#00FF41] outline-none uppercase transition-all"
                placeholder="EX: NEO_ROOT"
                autoComplete="off"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] uppercase text-[#003B00] mb-1 font-bold">Node_Handle</label>
            <input 
              type="text" 
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full bg-[#001500]/50 border border-[#003B00] px-4 py-3 text-[#00FF41] text-xs focus:border-[#00FF41] outline-none transition-all"
              placeholder="@operator_01"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase text-[#003B00] mb-1 font-bold">Access_Key</label>
            <input 
              type="password" 
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              className="w-full bg-[#001500]/50 border border-[#003B00] px-4 py-3 text-[#00FF41] text-xs focus:border-[#00FF41] outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-red-500 text-[10px] font-bold uppercase tracking-tighter animate-pulse">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#00FF41] text-[#0D0208] font-black uppercase tracking-[0.4em] text-xs hover:shadow-[0_0_20px_#00FF41] transition-all disabled:opacity-50"
          >
            {loading ? 'EXECUTING...' : (isLogin ? 'EXECUTE_LOGIN' : 'INITIALIZE_IDENTITY')}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#003B00] text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-[10px] text-[#003B00] hover:text-[#00FF41] uppercase font-bold tracking-widest transition-colors"
          >
            {isLogin ? 'Switch_To: CREATE_NEW_IDENTITY' : 'Switch_To: EXISTING_IDENTITY_LOGIN'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Auth;
