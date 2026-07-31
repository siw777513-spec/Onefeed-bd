import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  CheckCircle2,
  MoreHorizontal,
  Gift,
  Lock,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { SocialItem } from '../types';
import { VideoPlayer } from './VideoPlayer';

interface FeedCardProps {
  item: SocialItem;
  onLikeToggle: (id: string) => void;
  onOpenDetail: (item: SocialItem) => void;
  onOpenShare?: (item: SocialItem) => void;
  onFollowToggle?: (handle: string) => void;
  onOpenReport?: (item: SocialItem) => void;
  onOpenGift?: (item: SocialItem) => void;
}

export const FeedCard: React.FC<FeedCardProps> = ({
  item,
  onLikeToggle,
  onOpenDetail,
  onOpenShare,
  onFollowToggle,
  onOpenReport,
  onOpenGift,
}) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [doubleTapHeart, setDoubleTapHeart] = useState(false);
  const [isFollowing, setIsFollowing] = useState(item.author.isFollowing || false);
  const [lastTapTime, setLastTapTime] = useState(0);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.isLiked) {
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.7 },
        colors: ['#ff007a', '#ec4899', '#f43f5e'],
      });
    }
    onLikeToggle(item.id);
  };

  const handleDoubleTapMedia = (e: React.MouseEvent) => {
    const now = Date.now();
    if (now - lastTapTime < 300) {
      // Double tap triggered!
      if (!item.isLiked) {
        onLikeToggle(item.id);
      }
      setDoubleTapHeart(true);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#ff007a', '#ec4899', '#3b82f6'],
      });
      setTimeout(() => setDoubleTapHeart(false), 800);
    }
    setLastTapTime(now);
  };

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFollowing(!isFollowing);
    if (onFollowToggle) onFollowToggle(item.author.handle);
  };

  return (
    <div
      onClick={() => onOpenDetail(item)}
      className="group relative bg-[#121220]/90 backdrop-blur-md hover:bg-[#161628] rounded-2xl border border-white/10 hover:border-cyan-400/40 p-3 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-cyan-500/10 mb-3 overflow-hidden select-none"
    >
      {/* Top Accent Gradient Bar */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyan-400 via-purple-500 to-rose-500 opacity-60 group-hover:opacity-100 transition-opacity" />

      {/* Header Info */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="relative shrink-0 p-[2px] rounded-full bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 shadow-md">
            <img
              src={item.author.avatar}
              alt={item.author.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-[#0A0A0F]"
              referrerPolicy="no-referrer"
            />
            {item.author.online && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0A0A0F]" />
            )}
          </div>
          <div className="min-w-0 flex flex-col">
            <div className="flex items-center space-x-1">
              <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                {item.author.name}
              </span>
              {item.author.verified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 fill-cyan-400/20" />
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-mono truncate">{item.timestamp}</span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleFollow}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border transition-all ${
              isFollowing
                ? 'bg-white/10 text-slate-300 border-white/20'
                : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 hover:bg-cyan-500/30'
            }`}
          >
            {isFollowing ? 'Following' : '+ Follow'}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenReport) onOpenReport(item);
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            title="Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Media (Video or Image) */}
      {item.mediaType === 'video' || item.videoUrl || item.mediaId || item.image.startsWith('data:video') || item.image.includes('.mp4') ? (
        <div className="mb-2.5">
          <VideoPlayer
            item={item}
            onLikeToggle={onLikeToggle}
            aspectRatio="aspect-[4/3]"
          />
        </div>
      ) : (
        <div
          onClick={handleDoubleTapMedia}
          className="relative rounded-xl overflow-hidden bg-black/80 mb-2.5 aspect-[4/3] border border-white/10 group-hover:border-white/20 transition-all"
        >
          <img
            src={item.image}
            alt={item.text}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />

          {/* Lock / Paid Overlay */}
          {item.isPaidPost && (
            <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-amber-500/90 text-black font-black text-[10px] flex items-center gap-1 shadow-lg backdrop-blur-md">
              <Lock className="w-3 h-3" />
              <span>${item.unlockPriceCoins ? (item.unlockPriceCoins / 100).toFixed(2) : '0.50'}</span>
            </div>
          )}

          {/* Heart Burst on Double Tap */}
          {doubleTapHeart && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] animate-fade-in">
              <Heart className="w-20 h-20 text-[#FF007A] fill-[#FF007A] animate-ping" />
            </div>
          )}
        </div>
      )}

      {/* Caption Text */}
      <p className="text-xs text-slate-200 font-medium line-clamp-2 mb-2 leading-relaxed">
        {item.text}
      </p>

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {item.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="text-[9px] text-cyan-300 bg-cyan-500/15 px-2 py-0.5 rounded-full border border-cyan-400/30 font-semibold tracking-wide"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer Action Bar */}
      <div className="flex items-center justify-between text-slate-300 text-xs pt-2 border-t border-white/10">
        <button
          onClick={handleLikeClick}
          className={`flex items-center space-x-1.5 px-2 py-1 rounded-xl hover:bg-white/5 transition-all ${
            item.isLiked ? 'text-[#FF007A] font-extrabold' : 'hover:text-white'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              item.isLiked ? 'fill-[#FF007A] text-[#FF007A]' : ''
            }`}
          />
          <span className="font-mono text-[11px]">{item.likeCount.toLocaleString()}</span>
        </button>

        <button
          onClick={() => onOpenDetail(item)}
          className="flex items-center space-x-1.5 px-2 py-1 rounded-xl hover:bg-white/5 text-slate-300 hover:text-cyan-300 transition-colors"
        >
          <MessageCircle className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-[11px]">{item.commentCount}</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenGift) onOpenGift(item);
          }}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-amber-500/30 border border-amber-400/50 text-amber-300 hover:scale-105 transition-all text-[10px] font-black"
          title="Send Gift"
        >
          <Gift className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Gift</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setBookmarked(!bookmarked);
          }}
          className={`p-1.5 rounded-xl hover:bg-white/5 transition-colors ${
            bookmarked ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
          }`}
          title="Bookmark"
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-cyan-400' : ''}`} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenShare) onOpenShare(item);
          }}
          className="p-1.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
          title="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
