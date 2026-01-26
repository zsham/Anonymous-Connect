
import React, { useState, useEffect, useRef } from 'react';
import { Post, Comment, User } from '../types';
import { generatePostImage } from '../services/geminiService';

interface PostCardProps {
  post: Post;
  onLike: () => void;
  onComment: (text: string, parentCommentId?: string, media?: string) => void;
  onView: () => void;
  onShare: () => void;
  currentUser: User;
  allUsers: User[];
}

const EMOJI_CATEGORIES = [
  {
    label: 'PROTOCOL_FACE',
    symbols: ['😊', '😎', '👾', '🤖', '💀', '👽', '😈', '🤡', '🥵', '🥶', '😵', '🧐', '🤩', '🥳']
  },
  {
    label: 'SYSTEM_ACTION',
    symbols: ['🔥', '✨', '⚡️', '🦾', '💻', '🔐', '📡', '🔋', '💎', '🟢', '🔴', '⚠️', '☢️', '☣️']
  },
  {
    label: 'DATA_LINKS',
    symbols: ['🔗', '🧬', '🔮', '🛰️', '🛸', '🚀', '🔭', '🧪', '📱', '📟', '🕹️', '💾', '💿', '📼']
  }
];

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment, onView, onShare, currentUser, allUsers }) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [replyTargetId, setReplyTargetId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isGeneratingMog, setIsGeneratingMog] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<{ type: 'comment' | 'reply', id?: string } | null>(null);
  const [showViewerList, setShowViewerList] = useState(false);
  
  const cardRef = useRef<HTMLElement>(null);

  // Automatic View Tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onView();
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.6 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [post.id]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(commentText);
    setCommentText('');
    setShowEmojiPicker(null);
  };

  const handleSubmitReply = (e: React.FormEvent, parentId: string, media?: string) => {
    e.preventDefault();
    if (!replyText.trim() && !media) return;
    onComment(replyText, parentId, media);
    setReplyText('');
    setReplyTargetId(null);
    setShowEmojiPicker(null);
  };

  const handleMogGeneration = async (prompt: string, parentId: string) => {
    setIsGeneratingMog(true);
    try {
      const stickerPrompt = `A stylized matrix/cyberpunk holographic pixel art sticker representing: ${prompt || 'cyber connection'}`;
      const imgUrl = await generatePostImage(stickerPrompt);
      if (imgUrl) {
        onComment(replyText, parentId, imgUrl);
        setReplyText('');
        setReplyTargetId(null);
      }
    } catch (err) {
      console.error("MOG Generation Failed", err);
    } finally {
      setIsGeneratingMog(false);
    }
  };

  const handleEmojiSelect = (emoji: string, target: 'comment' | 'reply') => {
    if (target === 'comment') {
      setCommentText(prev => prev + emoji);
    } else {
      setReplyText(prev => prev + emoji);
    }
  };

  const EmojiPicker = ({ onSelect, target }: { onSelect: (e: string) => void, target: 'comment' | 'reply' }) => (
    <div className="absolute bottom-full right-0 mb-3 w-64 bg-[#0D0208] border-2 border-[#00FF41] shadow-[0_0_30px_rgba(0,255,65,0.4)] z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-[#00FF41] text-[#0D0208] px-3 py-1.5 flex justify-between items-center">
        <span className="text-[8px] font-black uppercase tracking-[0.2em]">Symbol_Matrix_v4.2</span>
        <button onClick={() => setShowEmojiPicker(null)} className="text-[10px]"><i className="fa-solid fa-xmark"></i></button>
      </div>
      
      <div className="max-h-72 overflow-y-auto custom-scrollbar p-3 space-y-4">
        {EMOJI_CATEGORIES.map((cat) => (
          <div key={cat.label}>
            <div className="text-[7px] text-[#00FF41]/50 mb-2 font-bold uppercase tracking-widest border-b border-[#00FF41]/10 pb-1">
              {cat.label}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cat.symbols.map(emoji => (
                <button 
                  key={emoji} 
                  type="button"
                  onClick={(e) => { e.preventDefault(); onSelect(emoji); }}
                  className="w-7 h-7 flex items-center justify-center hover:bg-[#00FF41]/20 hover:scale-125 transition-all text-base filter grayscale-[0.5] hover:grayscale-0"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ViewerListModal = () => {
    const viewers = allUsers.filter(u => post.viewerIds.includes(u.id));
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={() => setShowViewerList(false)}></div>
        <div className="bg-[#0D0208] w-full max-w-sm border border-[#00E5FF] shadow-[0_0_40px_rgba(0,229,255,0.2)] relative overflow-hidden flex flex-col max-h-[70vh]">
          <div className="p-4 border-b border-[#00E5FF] flex items-center justify-between bg-[#00E5FF]/10">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#00E5FF]">Intercept_Log_Authorized</h3>
            <button onClick={() => setShowViewerList(false)} className="text-[#00E5FF] hover:matrix-glow">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="p-4 overflow-y-auto custom-scrollbar space-y-3">
            <div className="text-[8px] text-[#00E5FF]/50 uppercase tracking-widest mb-4">Displaying_Nodes_Intercepted_Signal:</div>
            {viewers.length > 0 ? viewers.map(viewer => (
              <div key={viewer.id} className="flex items-center gap-3 p-2 bg-[#001500]/30 border border-[#00E5FF]/10 hover:border-[#00E5FF]/50 transition-all group">
                <img src={viewer.avatar} className="w-8 h-8 border border-[#00E5FF]/20 grayscale group-hover:grayscale-0" alt="" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#00E5FF]">{viewer.name}</div>
                  <div className="text-[7px] text-[#00E5FF]/40 uppercase">{viewer.handle} // HANDSHAKE_CONFIRMED</div>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 text-[10px] uppercase text-[#00E5FF]/30">Buffer clear. No interceptions detected.</div>
            )}
          </div>
          <div className="p-3 bg-[#000F1A] border-t border-[#00E5FF]/20 text-center">
            <span className="text-[6px] text-[#00E5FF]/40 uppercase tracking-tighter">Secure Telemetry Sequence 0x{post.id.slice(-4).toUpperCase()}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderComment = (comment: Comment, depth = 0) => {
    return (
      <div key={comment.id} className={`${depth > 0 ? 'ml-6 mt-3 border-l border-[#003B00] pl-4' : 'mb-4'}`}>
        <div className={`flex gap-3 group/comment`}>
          <div className="w-6 h-6 border border-[#003B00] flex-shrink-0 group-hover/comment:border-[#00FF41] transition-colors">
            <img src={comment.userAvatar} className="w-full h-full grayscale group-hover/comment:grayscale-0" alt="" />
          </div>
          <div className={`flex-1 bg-[#001500]/50 p-3 border border-[#003B00] group-hover/comment:border-[#00FF41]/30 transition-all ${comment.media ? 'border-r-2 border-[#00FF41]/40' : ''}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-bold text-[#00FF41] uppercase tracking-tighter">{comment.userName}</span>
              <span className="text-[8px] text-[#003B00]">{comment.timestamp}</span>
            </div>
            <p className="text-[10px] text-[#00FF41]/70 mb-2 leading-relaxed">{comment.content}</p>
            
            {comment.media && (
              <div className="mb-2 max-w-[120px] border border-[#00FF41]/20">
                <img src={comment.media} alt="MOG" className="w-full h-auto grayscale hover:grayscale-0 transition-all cursor-crosshair" />
                <div className="text-[6px] text-[#00FF41] uppercase bg-black/80 px-1 py-0.5 text-center">MOG_ATTACHMENT</div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setReplyTargetId(replyTargetId === comment.id ? null : comment.id)}
                className="text-[7px] font-black uppercase tracking-widest text-[#003B00] hover:text-[#00FF41] transition-colors"
              >
                [HANDSHAKE_REPLY]
              </button>
            </div>

            {replyTargetId === comment.id && (
              <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="mt-3 flex gap-2">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    autoFocus
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="REPLY_SIGNAL..." 
                    className="w-full bg-[#0D0208] border border-[#003B00] px-3 py-1.5 text-[9px] uppercase outline-none focus:border-[#00FF41]"
                  />
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1 items-center">
                    <div className="relative">
                      <button 
                        type="button"
                        onClick={() => setShowEmojiPicker(showEmojiPicker?.id === comment.id ? null : { type: 'reply', id: comment.id })}
                        className={`p-1.5 transition-all ${showEmojiPicker?.id === comment.id ? 'text-[#00FF41] matrix-glow' : 'text-[#00E5FF] opacity-60 hover:opacity-100'}`}
                        title="Open Symbol Matrix"
                      >
                        <i className="fa-regular fa-face-smile-beam"></i>
                      </button>
                      {showEmojiPicker?.type === 'reply' && showEmojiPicker?.id === comment.id && (
                        <EmojiPicker onSelect={(e) => handleEmojiSelect(e, 'reply')} target="reply" />
                      )}
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleMogGeneration(replyText, comment.id)}
                      disabled={isGeneratingMog}
                      className="text-[#00FF41] opacity-40 hover:opacity-100 transition-all p-1"
                      title="Generate MOG Sticker"
                    >
                      {isGeneratingMog ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-sparkles"></i>}
                    </button>
                    <button 
                      type="submit"
                      disabled={!replyText.trim()}
                      className="text-[#00FF41] disabled:opacity-20 p-1"
                    >
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-2">
            {comment.replies.map(reply => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderPostContent = (p: Post, isNested = false) => {
    return (
      <>
        <div className={`p-4 ${isNested ? 'bg-[#001500]/50' : 'border-b border-[#003B00]'} group-hover:border-[#00FF41]/50 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <img 
              src={p.userAvatar} 
              className={`${isNested ? 'w-8 h-8' : 'w-10 h-10'} border border-[#003B00] grayscale brightness-50 group-hover:brightness-100 group-hover:grayscale-0 transition-all`} 
              alt={p.userName} 
            />
            <div>
              <div className={`${isNested ? 'text-[10px]' : 'text-xs'} font-bold uppercase tracking-widest group-hover:matrix-glow transition-all`}>
                {p.userName}
              </div>
              <div className={`${isNested ? 'text-[7px]' : 'text-[9px]'} text-[#003B00] group-hover:text-[#00FF41]/60 flex items-center gap-2 uppercase`}>
                <span>{p.userHandle}</span>
                <span>//</span>
                <span>{p.timestamp}</span>
              </div>
            </div>
          </div>
          {!isNested && (
            <button className="text-[#003B00] hover:text-[#00FF41]">
              <i className="fa-solid fa-code text-sm"></i>
            </button>
          )}
        </div>

        <div className="p-5">
          <p className={`${isNested ? 'text-[10px]' : 'text-xs'} leading-relaxed text-[#00FF41]/80 font-['Fira_Code'] whitespace-pre-wrap selection:bg-[#00FF41] selection:text-[#0D0208]`}>
            {p.content}
          </p>
        </div>

        {p.image && (
          <div className={`relative ${isNested ? 'max-h-60' : ''} border-y border-[#003B00] bg-black group-hover:border-[#00FF41]/30`}>
            <img src={p.image} className={`w-full h-auto grayscale opacity-40 group-hover:opacity-80 group-hover:grayscale-0 transition-all duration-700 ${isNested ? 'max-h-60 object-cover' : ''}`} alt="Data" loading="lazy" />
          </div>
        )}

        {p.video && (
          <div className={`relative border-y border-[#003B00] bg-black aspect-video overflow-hidden group-hover:border-[#00FF41]/30`}>
            <video src={p.video} className="w-full h-full object-contain grayscale opacity-40 group-hover:opacity-80 group-hover:grayscale-0 transition-all" controls loop muted />
          </div>
        )}
      </>
    );
  };

  return (
    <article ref={cardRef} className="bg-[#0D0208] border border-[#003B00] hover:border-[#00FF41] transition-all group overflow-hidden">
      {renderPostContent(post)}

      {post.originalPost && (
        <div className="mx-5 mb-5 border border-dashed border-[#003B00] group-hover:border-[#00FF41]/30 relative">
          <div className="absolute -top-2 left-4 bg-[#0D0208] px-2 text-[7px] font-bold text-[#003B00] group-hover:text-[#00FF41] uppercase tracking-[0.2em]">
            RELAYED_SIGNAL_FROM: {post.originalPost.userHandle}
          </div>
          {renderPostContent(post.originalPost, true)}
        </div>
      )}

      <div className="px-4 py-2 bg-[#001500]/30 border-t border-[#003B00] group-hover:border-[#00FF41]/30 flex items-center gap-6">
        <button onClick={onLike} className={`flex items-center gap-2 py-2 transition-all ${post.isLiked ? 'text-red-500' : 'text-[#003B00] hover:text-[#00FF41]'}`}>
          <i className="fa-solid fa-bolt text-sm"></i>
          <span className="text-[10px] font-bold uppercase tracking-widest">{post.likes}</span>
        </button>

        <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 py-2 text-[#003B00] hover:text-[#00FF41] transition-all">
          <i className="fa-solid fa-comment-dots text-sm"></i>
          <span className="text-[10px] font-bold uppercase tracking-widest">{post.comments.length}</span>
        </button>

        {/* View Count / Intercept Tracker */}
        <button 
          onClick={() => post.userId === currentUser.id && setShowViewerList(true)}
          className={`flex items-center gap-2 py-2 transition-all ${post.userId === currentUser.id ? 'text-[#00E5FF] cursor-pointer hover:matrix-glow' : 'text-[#003B00]'}`}
        >
          <i className="fa-solid fa-eye text-sm"></i>
          <span className="text-[10px] font-bold uppercase tracking-widest">
            {post.viewerIds.length} {post.userId === currentUser.id ? 'SYNCED' : ''}
          </span>
        </button>

        <button onClick={onShare} className="flex items-center gap-2 py-2 text-[#003B00] hover:text-[#00FF41] transition-all ml-auto">
          <i className="fa-solid fa-share-nodes text-sm"></i>
          <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-widest">RELAY</span>
        </button>
      </div>

      {showComments && (
        <div className="bg-[#0D0208] p-4 border-t border-[#003B00]">
          <div className="space-y-4 mb-4">
            {post.comments.map(comment => renderComment(comment))}
          </div>

          <form onSubmit={handleSubmitComment} className="flex gap-3">
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="INPUT_TRANSMISSION..." 
                className="w-full bg-[#0D0208] border border-[#003B00] px-3 py-2 text-[10px] uppercase outline-none focus:border-[#00FF41]"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <div className="relative">
                  <button type="button" onClick={() => setShowEmojiPicker(showEmojiPicker?.type === 'comment' ? null : { type: 'comment' })} className={`p-1.5 transition-all ${showEmojiPicker?.type === 'comment' ? 'text-[#00FF41] matrix-glow' : 'text-[#00E5FF] opacity-60 hover:opacity-100'}`}>
                    <i className="fa-regular fa-face-smile-beam text-xs"></i>
                  </button>
                  {showEmojiPicker?.type === 'comment' && <EmojiPicker onSelect={(e) => handleEmojiSelect(e, 'comment')} target="comment" />}
                </div>
                <button type="submit" disabled={!commentText.trim()} className="text-[#00FF41] disabled:opacity-20 p-1.5">
                  <i className="fa-solid fa-arrow-right text-xs"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {showViewerList && <ViewerListModal />}
    </article>
  );
};

export default PostCard;
