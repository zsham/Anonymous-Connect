
import React, { useState } from 'react';
import { smartSearch } from '../services/geminiService';

const Explore: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ text: string; sources: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const searchResult = await smartSearch(query);
      setResult(searchResult);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const trendingTopics = [
    { tag: '#WHITE_RABBIT', count: '1.2M hits' },
    { tag: '#ZERO_DAY', count: '89K hits' },
    { tag: '#CYBER_SPACE', count: '56K hits' },
    { tag: '#BLUE_PILL_LIES', count: '45K hits' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Search Header */}
      <div className="bg-[#0D0208] border border-[#003B00] p-6 hover:border-[#00FF41] transition-all">
        <h2 className="text-sm font-bold mb-4 uppercase tracking-[0.4em] matrix-glow">Query_The_Network</h2>
        <form onSubmit={handleSearch} className="relative">
          <i className="fa-solid fa-chevron-right absolute left-5 top-1/2 -translate-y-1/2 text-[#00FF41]"></i>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH_REALITY..." 
            className="w-full bg-[#001500]/50 border border-[#003B00] py-4 pl-12 pr-24 focus:border-[#00FF41] outline-none text-[10px] tracking-widest uppercase transition-all"
          />
          <button 
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#00FF41] text-[#0D0208] px-4 py-2 text-[10px] font-bold uppercase hover:shadow-[0_0_10px_#00FF41] transition-all disabled:opacity-20"
          >
            {isLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Execute'}
          </button>
        </form>
      </div>

      {/* AI Search Results */}
      {result && (
        <div className="bg-[#001500]/30 border border-[#00FF41] p-6 shadow-[0_0_20px_rgba(0,255,65,0.1)] animate-pulse-slow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 border border-[#00FF41] flex items-center justify-center text-[#00FF41]">
              <i className="fa-solid fa-brain"></i>
            </div>
            <div>
              <h3 className="font-bold text-[10px] text-[#00FF41] uppercase tracking-[0.2em]">Connect_AI_Insight</h3>
              <p className="text-[8px] text-[#003B00] uppercase font-bold">Priority_Data_Relay_Active</p>
            </div>
          </div>
          <div className="text-[10px] text-[#00FF41] leading-relaxed bg-black/50 p-4 border border-[#003B00] mb-4 font-['Fira_Code'] whitespace-pre-wrap">
            {result.text}
          </div>
          {result.sources.length > 0 && (
            <div>
              <p className="text-[8px] font-bold text-[#003B00] uppercase tracking-widest mb-2">Validated_Sources</p>
              <div className="flex flex-wrap gap-2">
                {result.sources.map((source, idx) => (
                  <a 
                    key={idx} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-transparent px-3 py-1 border border-[#003B00] text-[8px] font-bold text-[#00FF41]/60 hover:text-[#00FF41] hover:border-[#00FF41] transition-all"
                  >
                    <i className="fa-solid fa-link"></i>
                    {source.title || 'EXTERNAL_NODE'}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Trending Section */}
      <div className="bg-[#0D0208] border border-[#003B00]">
        <div className="p-4 border-b border-[#003B00] flex items-center justify-between">
          <h3 className="font-bold text-[10px] uppercase tracking-widest">Neural_Frequencies</h3>
          <button className="text-[#003B00] text-[9px] font-bold hover:text-[#00FF41] uppercase">View_Archive</button>
        </div>
        <div className="divide-y divide-[#003B00]">
          {trendingTopics.map((topic, i) => (
            <div key={i} className="p-4 hover:bg-[#001500]/50 cursor-pointer transition-colors group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[8px] text-[#003B00] font-bold uppercase">Trending_Topic</span>
                <i className="fa-solid fa-hashtag text-[#003B00]"></i>
              </div>
              <div className="font-bold text-[11px] text-[#00FF41]/70 group-hover:text-[#00FF41] transition-colors tracking-widest">{topic.tag}</div>
              <div className="text-[8px] text-[#003B00] mt-1 uppercase font-bold">{topic.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
