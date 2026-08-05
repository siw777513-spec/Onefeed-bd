import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Share2, Disc, Play, Volume2, CheckCircle2, AlertTriangle, Gift, Eye } from 'lucide-react';
import { SocialItem } from '../types';
import { VideoPlayer } from './VideoPlayer';
import { db } from '../lib/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

interface ShortsCardProps {
  item: SocialItem; onLikeToggle: (id: string) => void; onOpenDetail: (item: SocialItem) => void; onOpenShare?: (item: SocialItem) => void; onOpenReport?: (item: SocialItem) => void; onOpenGift?: (item: SocialItem) => void;
}

export const ShortsCard: React.FC<ShortsCardProps> = ({ item, onLikeToggle, onOpenDetail, onOpenShare, onOpenReport, onOpenGift }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [heartAnim, setHeartAnim] = useState(false);
  const [views, setViews] = useState((item as any).views || 0);
  const cardRef = useRef<HTMLDivElement>(null);
  const viewedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting &&!viewedRef.current) {
        viewedRef.current = true;
        const key = `viewed_${item.id}`;
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, '1');
          setViews(v=>v+1);
          try { updateDoc(doc(db, "posts", item.id), { views: increment(1) }).catch(()=>{}); } catch {}
        }
      }
    }, { threshold: 0.7 });
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [item.id]);

  const handleDoubleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 600);
    if (!item.isLiked) onLikeToggle(item.id);
  };

  return (
    <div ref={cardRef} onClick={() => onOpenDetail(item)} onDoubleClick={handleDoubleTap} className="group relative bg-[#12121A]/90 hover:bg-[#161622] rounded-xl border border-white/10 overflow-hidden cursor-pointer shadow-lg mb-3 select-none aspect-[9/14]">
      {item.mediaType === 'video' || (item as any).videoUrl || item.image.includes('.mp4')? (
        <VideoPlayer item={item} onLikeToggle={onLikeToggle} aspectRatio="aspect-[9/14]" className="w-full h-full border-none rounded-none" />
      ) : (
        <img src={item.image} alt="Short video preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90" />
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-white z-10">
        <span className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FF007A]/80 text-white shadow-md backdrop-blur-md uppercase tracking-wider"><span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> Short • {views} <Eye className="w-3 h-3 ml-1"/></span>
        <button onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }} className="p-1.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60">{isPlaying? <Volume2 className="w-3 h-3" /> : <Play className="w-3 h-3" />}</button>
      </div>
      {heartAnim && <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"><Heart className="w-16 h-16 text-[#FF007A] fill-[#FF007A] animate-ping" /></div>}
      <div className="absolute right-2 bottom-12 flex flex-col items-center space-y-3 z-10">
        <button onClick={(e) => { e.stopPropagation(); onLikeToggle(item.id); }} className="flex flex-col items-center group/btn"><div className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white group-hover/btn:bg-[#FF007A]/30 transition-all"><Heart className={`w-4 h-4 ${item.isLiked? 'fill-[#FF007A] text-[#FF007A]' : 'text-white'}`} /></div><span className="text-[10px] text-white font-medium mt-0.5 drop-shadow">{item.likeCount > 999? `${(item.likeCount / 1000).toFixed(1)}k` : item.likeCount}</span></button>
        <button onClick={(e) => { e.stopPropagation(); onOpenDetail(item); }} className="flex flex-col items-center"><div className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-white/20 transition-all"><MessageCircle className="w-4 h-4" /></div><span className="text-[10px] text-white font-medium mt-0.5 drop-shadow">{item.commentCount}</span></button>
        <button onClick={(e) => { e.stopPropagation(); if (onOpenGift) onOpenGift(item); }} className="flex flex-col items-center"><div className="p-2 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 text-black shadow-lg shadow-amber-500/30 animate-bounce transition-all"><Gift className="w-4 h-4 text-black" /></div><span className="text-[9px] text-amber-300 font-extrabold mt-0.5 drop-shadow">Gift</span></button>
        <button onClick={(e) => { e.stopPropagation(); if (onOpenShare) onOpenShare(item); }} className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-white/20 transition-colors"><Share2 className="w-4 h-4" /></button>
        <button onClick={(e) => { e.stopPropagation(); if (onOpenReport) onOpenReport(item); }} className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-amber-500/30 text-amber-300 transition-colors"><AlertTriangle className="w-4 h-4" /></button>
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-slate-900 to-slate-700 p-1 border border-white/20 animate-spin text-cyan-400 flex items-center justify-center shadow-lg"><Disc className="w-4 h-4" /></div>
      </div>
      <div className="absolute bottom-2.5 left-2.5 right-12 z-10 text-white">
        <div className="flex items-center space-x-1.5 mb-1"><img src={item.author.avatar} alt={item.author.name} className="w-6 h-6 rounded-full object-cover ring-1 ring-[#FF007A]" referrerPolicy="no-referrer" /><span className="text-xs font-bold text-white truncate">{item.author.name}</span>{item.author.verified && <CheckCircle2 className="w-3 h-3 text-[#FF007A] fill-[#FF007A]/20 shrink-0" />}</div>
        <p className="text-[11px] text-slate-100 line-clamp-2 leading-tight drop-shadow mb-1.5">{item.text}</p>
      </div>
    </div>
  );
};
