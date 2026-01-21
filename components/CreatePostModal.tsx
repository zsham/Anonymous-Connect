
import React, { useState } from 'react';
import { generatePostDraft, generatePostImage } from '../services/geminiService';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: { content: string; image?: string }) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | undefined>();
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [topic, setTopic] = useState('');

  if (!isOpen) return null;

  const handleAIDraft = async () => {
    if (!topic.trim()) return;
    setIsGeneratingDraft(true);
    try {
      const draft = await generatePostDraft(topic);
      if (draft) setContent(draft);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const handleAIImage = async () => {
    if (!content.trim() && !topic.trim()) return;
    setIsGeneratingImage(true);
    try {
      const imgUrl = await generatePostImage(topic || content);
      if (imgUrl) setImage(imgUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit({ content, image });
    setContent('');
    setImage(undefined);
    setTopic('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="bg-[#0D0208] w-full max-w-xl border border-[#00FF41] shadow-[0_0_50px_rgba(0,255,65,0.2)] relative animate-in fade-in zoom-in duration-300">
        <div className="p-4 border-b border-[#00FF41] flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-[0.5em] matrix-glow">Initialize_Packet_Push</h2>
          <button onClick={onClose} className="text-[#00FF41] hover:matrix-glow">
            <i className="fa-solid fa-terminal"></i>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[75vh] custom-scrollbar">
          {/* AI Helper Bar */}
          <div className="mb-6 p-4 bg-[#001500]/50 border border-[#003B00]">
            <div className="flex items-center gap-2 mb-3">
              <i className="fa-solid fa-brain text-[#00FF41]"></i>
              <span className="text-[9px] font-bold text-[#00FF41] uppercase tracking-widest">Connect_AI_Bypass</span>
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="DEFINE_TOPIC..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="flex-1 bg-black border border-[#003B00] px-3 py-2 text-[10px] outline-none focus:border-[#00FF41] uppercase tracking-widest"
              />
              <button 
                onClick={handleAIDraft}
                disabled={isGeneratingDraft || !topic.trim()}
                className="bg-[#003B00] text-[#00FF41] px-4 py-2 text-[9px] font-bold uppercase hover:bg-[#00FF41] hover:text-[#0D0208] transition-all disabled:opacity-20"
              >
                {isGeneratingDraft ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Draft'}
              </button>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <img src="https://picsum.photos/seed/hacker/200/200" className="w-10 h-10 border border-[#003B00] grayscale" alt="" />
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="ENTER_DATA_STRING..."
              className="flex-1 bg-transparent border-none text-xs uppercase tracking-widest focus:ring-0 outline-none resize-none h-32 font-['Fira_Code'] placeholder:text-[#001500]"
            />
          </div>

          {image && (
            <div className="relative border border-[#003B00] mb-4 group overflow-hidden">
              <img src={image} className="w-full h-auto grayscale opacity-50 group-hover:opacity-100 transition-all" alt="Data Visualization" />
              <button 
                onClick={() => setImage(undefined)}
                className="absolute top-2 right-2 bg-black border border-red-900 text-red-500 p-2 hover:bg-red-900 hover:text-black transition-all"
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#001500]">
             <button 
              onClick={handleAIImage}
              disabled={isGeneratingImage}
              className="px-4 py-2 border border-[#003B00] text-[#00FF41] text-[9px] font-bold uppercase hover:border-[#00FF41] transition-all disabled:opacity-20"
            >
              {isGeneratingImage ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : <i className="fa-solid fa-image mr-2"></i>}
              Neural_Visual
            </button>
            <label className="px-4 py-2 border border-[#003B00] text-[#003B00] text-[9px] font-bold uppercase hover:text-[#00FF41] hover:border-[#00FF41] transition-all cursor-pointer">
              <i className="fa-solid fa-paperclip mr-2"></i>
              Attach_Asset
              <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setImage(reader.result as string);
                  reader.readAsDataURL(file);
                }
              }} />
            </label>
          </div>
        </div>

        <div className="p-6 bg-[#001500]/30 border-t border-[#00FF41] flex items-center justify-between">
          <div className="text-[9px] text-[#003B00] font-bold uppercase tracking-widest">
            NODE: <b>NEO_ROOT</b>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="px-8 py-3 bg-[#00FF41] text-[#0D0208] font-black uppercase tracking-[0.4em] text-xs hover:shadow-[0_0_20px_#00FF41] disabled:opacity-20 transition-all transform active:scale-95"
          >
            EXECUTE_PUSH
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
