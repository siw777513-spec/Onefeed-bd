import React from 'react';
import { Heart, Clock, Sparkles } from 'lucide-react';
import { SocialItem } from '../types';

interface StoryCardProps {
  item: SocialItem;
  onLikeToggle: (id: string) => void;
  onOpenDetail: (item: SocialItem) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ item, onLikeToggle, onOpenDetail }) => {
  return (
    <div
      onClick={() => onOpenDetail(item)}
      className="group relative bg-[#12121A]/90 hover:bg-[#161622] rounded-xl border border-white/10 overflow-hidden cursor-pointer shadow-md hover:border-amber-500/30 mb-3 select-none aspect-[3/4]"
    >
      {/* Background Story Image */}
      <img
        src={item.image}
        alt="Story update"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        referrerPolicy="no-referrer"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60" />

      {/* Top Header inside Story */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
        <div className="flex items-center space-x-1.5">
          <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-[#FF007A] to-purple-600">
            <img
              src={item.author.avatar}
              alt={item.author.name}
              className="w-6 h-6 rounded-full object-cover border border-[#0A0A0F]"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-[11px] font-bold text-white truncate max-w-[80px]">
            {item.author.name}
          </span>
        </div>

        {/* Time Remaining Pill */}
        <span className="flex items-center space-x-0.5 text-[9px] font-medium text-amber-300 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-amber-500/20">
          <Clock className="w-2.5 h-2.5" />
          <span>{item.timestamp}</span>
        </span>
      </div>

      {/* Center Sparkles Icon indicator */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
        <div className="w-10 h-10 rounded-full bg-amber-500/30 backdrop-blur-md flex items-center justify-center text-amber-300">
          <Sparkles className="w-5 h-5 animate-spin" />
        </div>
      </div>

      {/* Bottom Story Text & Like count */}
      <div className="absolute bottom-2 left-2 right-2 z-10 text-white">
        <p className="text-[11px] text-slate-100 line-clamp-2 leading-snug drop-shadow mb-1.5">
          {item.text}
        </p>

        <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-slate-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLikeToggle(item.id);
            }}
            className={`flex items-center space-x-1 hover:text-white ${
              item.isLiked ? 'text-[#FF007A] font-bold' : ''
            }`}
          >
            <Heart
              className={`w-3 h-3 ${item.isLiked ? 'fill-[#FF007A] text-[#FF007A]' : ''}`}
            />
            <span>{item.likeCount}</span>
          </button>

          <span className="text-[9px] text-amber-400 font-semibold bg-amber-500/10 px-1 rounded">
            Tap to view
          </span>
        </div>
      </div>
    </div>
  );
};
