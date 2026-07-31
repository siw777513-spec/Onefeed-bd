import React from 'react';
import { Play, Heart, MessageCircle, Share2, Eye, CheckCircle2, AlertTriangle, Gift } from 'lucide-react';
import { SocialItem } from '../types';
import { VideoPlayer } from './VideoPlayer';

interface WatchCardProps {
  item: SocialItem;
  onLikeToggle: (id: string) => void;
  onOpenDetail: (item: SocialItem) => void;
  onOpenShare?: (item: SocialItem) => void;
  onOpenReport?: (item: SocialItem) => void;
  onOpenGift?: (item: SocialItem) => void;
}

export const WatchCard: React.FC<WatchCardProps> = ({
  item,
  onLikeToggle,
  onOpenDetail,
  onOpenShare,
  onOpenReport,
  onOpenGift,
}) => {
  const isLive = item.duration === 'LIVE';


  return (
    <div
      onClick={() => onOpenDetail(item)}
      className="group relative bg-[#12121A]/90 hover:bg-[#161622] rounded-xl border border-white/10 p-2.5 transition-all duration-200 cursor-pointer shadow-md hover:border-purple-500/30 mb-3 overflow-hidden select-none"
    >
      {/* Video Thumbnail or Player */}
      {item.mediaType === 'video' || item.videoUrl || item.mediaId || item.image.startsWith('data:video') ? (
        <div className="mb-2">
          <VideoPlayer
            item={item}
            onLikeToggle={onLikeToggle}
            aspectRatio="aspect-video"
          />
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden bg-black/50 mb-2 aspect-video">
          <img
            src={item.image}
            alt={item.text}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
            <div className="w-10 h-10 rounded-full bg-purple-600/80 backdrop-blur-md text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-white translate-x-0.5" />
            </div>
          </div>

          {/* Duration or LIVE Badge */}
          <div className="absolute bottom-2 right-2">
            {isLive ? (
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-600 text-white uppercase tracking-wider flex items-center gap-1 shadow">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                LIVE
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-black/80 backdrop-blur-md text-white">
                {item.duration || '10:00'}
              </span>
            )}
          </div>

          {/* View Count Badge */}
          {item.views && (
            <div className="absolute top-2 left-2 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-medium text-slate-200">
              <Eye className="w-3 h-3 text-purple-400" />
              <span>{item.views}</span>
            </div>
          )}
        </div>
      )}

      {/* Author & Title */}
      <div className="flex items-start space-x-2 mb-2">
        <img
          src={item.author.avatar}
          alt={item.author.name}
          className="w-7 h-7 rounded-full object-cover ring-1 ring-purple-500/40 shrink-0 mt-0.5"
          referrerPolicy="no-referrer"
        />
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-semibold text-slate-100 line-clamp-2 leading-snug">
            {item.text}
          </h4>
          <div className="flex items-center space-x-1 mt-1 text-[10px] text-slate-400">
            <span className="font-medium text-slate-300 truncate">{item.author.name}</span>
            {item.author.verified && (
              <CheckCircle2 className="w-3 h-3 text-purple-400 fill-purple-400/20 shrink-0" />
            )}
            <span>•</span>
            <span className="shrink-0">{item.timestamp}</span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1.5 border-t border-white/5">
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
            className={`w-3.5 h-3.5 ${item.isLiked ? 'fill-[#FF007A] text-[#FF007A]' : ''}`}
          />
          <span>{item.likeCount.toLocaleString()}</span>
        </button>

        <div className="flex items-center space-x-1 hover:text-white">
          <MessageCircle className="w-3.5 h-3.5" />
          <span>{item.commentCount}</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenGift) onOpenGift(item);
          }}
          className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600/30 to-amber-500/30 border border-amber-400/50 text-amber-300 hover:scale-105 transition-all text-[10px] font-extrabold"
          title="Send Gift"
        >
          <Gift className="w-3 h-3 text-amber-400 animate-pulse" />
          <span>Gift</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenShare) onOpenShare(item);
          }}
          className="hover:text-white p-1 rounded hover:bg-white/5 transition-colors"
          title="Share Video"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenReport) onOpenReport(item);
          }}
          className="hover:text-amber-400 p-1 rounded hover:bg-white/5 transition-colors"
          title="Report Video"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
