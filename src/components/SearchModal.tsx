import React, { useState } from 'react';
import { X, Search, Sparkles } from 'lucide-react';
import { SocialItem } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: SocialItem[];
  onSelectPost: (item: SocialItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  items,
  onSelectPost,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = query.trim()
    ? items.filter(
        (item) =>
          item.text.toLowerCase().includes(query.toLowerCase()) ||
          item.author.name.toLowerCase().includes(query.toLowerCase()) ||
          item.tags?.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#12121A] rounded-2xl border border-white/10 shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[85vh]">
        <div className="p-3.5 border-b border-white/10 bg-[#0A0A0F] flex items-center space-x-2">
          <Search className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts, hashtags, or creators across 5 columns..."
            autoFocus
            className="flex-1 bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 overflow-y-auto custom-scrollbar space-y-2">
          {query.trim() === '' ? (
            <div className="text-center py-8 text-xs text-slate-500 flex flex-col items-center gap-2">
              <Sparkles className="w-6 h-6 text-cyan-500/40" />
              <span>Type to search across Feed, Shorts, Watch, Story & Chat</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No results found for "{query}"
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectPost(item);
                  onClose();
                }}
                className="flex items-center space-x-3 p-2 rounded-xl bg-[#0A0A0F]/60 border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer"
              >
                <img
                  src={item.image}
                  alt="Thumbnail"
                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white truncate">{item.author.name}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
                      {item.column}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 truncate mt-0.5">{item.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
