
import React, { useState } from 'react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  onLike: () => void;
  onComment: (text: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment }) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(commentText);
    setCommentText('');
  };

  return (
    <article className="bg-[#0D0208] border border-[#003B00] hover:border-[#00FF41] transition-all group overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#003B00] group-hover:border-[#00FF41]/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={post.userAvatar} className="w-10 h-10 border border-[#003B00] grayscale brightness-50 group-hover:brightness-100 group-hover:grayscale-0 transition-all" alt={post.userName} />
          <div>
            <div className="font-bold text-xs uppercase tracking-widest group-hover:matrix-glow transition-all">{post.userName}</div>
            <div className="text-[9px] text-[#003B00] group-hover:text-[#00FF41]/60 flex items-center gap-2 uppercase">
              <span>{post.userHandle}</span>
              <span>//</span>
              <span>{post.timestamp}</span>
            </div>
          </div>
        </div>
        <button className="text-[#003B00] hover:text-[#00FF41]">
          <i className="fa-solid fa-code text-sm"></i>
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-xs leading-relaxed text-[#00FF41]/80 font-['Fira_Code'] whitespace-pre-wrap selection:bg-[#00FF41] selection:text-[#0D0208]">
          {post.content}
        </p>
      </div>

      {/* Image */}
      {post.image && (
        <div className="relative border-y border-[#003B00] bg-black group-hover:border-[#00FF41]/30">
          <img src={post.image} className="w-full h-auto grayscale opacity-40 group-hover:opacity-80 group-hover:grayscale-0 transition-all duration-700" alt="Data Visualization" loading="lazy" />
          <div className="absolute inset-0 pointer-events-none border border-transparent group-hover:border-[#00FF41]/20"></div>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-2 bg-[#001500]/30 border-t border-[#003B00] group-hover:border-[#00FF41]/30 flex items-center gap-6">
        <button 
          onClick={onLike}
          className={`flex items-center gap-2 py-2 transition-all ${post.isLiked ? 'text-red-500' : 'text-[#003B00] hover:text-[#00FF41]'}`}
        >
          <i className={`${post.isLiked ? 'fa-solid' : 'fa-solid'} fa-bolt text-sm`}></i>
          <span className="text-[10px] font-bold uppercase tracking-widest">{post.likes}</span>
        </button>

        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 py-2 text-[#003B00] hover:text-[#00FF41] transition-all"
        >
          <i className="fa-solid fa-comment-dots text-sm"></i>
          <span className="text-[10px] font-bold uppercase tracking-widest">{post.comments.length}</span>
        </button>

        <button className="flex items-center gap-2 py-2 text-[#003B00] hover:text-[#00FF41] transition-all ml-auto">
          <i className="fa-solid fa-share-nodes text-sm"></i>
          <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-widest">RELAY</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="bg-[#0D0208] p-4 border-t border-[#003B00]">
          <div className="space-y-4 mb-4">
            {post.comments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-6 h-6 border border-[#003B00] flex-shrink-0">
                    <img src={comment.userAvatar} className="w-full h-full grayscale" alt="" />
                </div>
                <div className="flex-1 bg-[#001500]/50 p-3 border border-[#003B00]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-bold text-[#00FF41] uppercase tracking-tighter">{comment.userName}</span>
                    <span className="text-[8px] text-[#003B00]">{comment.timestamp}</span>
                  </div>
                  <p className="text-[10px] text-[#00FF41]/70">{comment.content}</p>
                </div>
              </div>
            ))}
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
              <button 
                type="submit"
                disabled={!commentText.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00FF41] disabled:opacity-20"
              >
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </button>
            </div>
          </form>
        </div>
      )}
    </article>
  );
};

export default PostCard;
