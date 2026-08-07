import React, { useState } from 'react';
import {
  X,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Send,
  CheckCircle2,
  Trash2,
  Reply,
  Eye,
  Clock,
  AlertTriangle,
  Gift,
  DollarSign,
  Crown,
} from 'lucide-react';
import { SocialItem } from '../types';
import { VideoPlayer } from './VideoPlayer';

interface Props {
  item: SocialItem | null;
  onClose: () => void;
  onLikeToggle: (id: string) => void;
  onAddComment: (itemId: string, commentText: string) => void;
  onShareOpen?: (item: SocialItem) => void;
  onOpenReport?: (item: SocialItem) => void;
  onOpenGift?: (item: SocialItem) => void;
  onOpenTip?: (item: SocialItem) => void;
  onSubscribeCreator?: (handle: string) => void;
  onDeletePost?: (id: string) => void;
  currentUserHandle?: string;
  isOwner?: boolean;
}

export const PostDetailModal: React.FC<Props> = ({
  item,
  onClose,
  onLikeToggle,
  onAddComment,
  onShareOpen,
  onOpenReport,
  onOpenGift,
  onOpenTip,
  onSubscribeCreator,
  onDeletePost,
  currentUserHandle,
  isOwner = false,
}) => {
  const [commentInput, setCommentInput] = useState('');
  const [replyTo, setReplyTo] = useState<any>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [localComments, setLocalComments] = useState<any[]>(item?.comments || []);
  const [commentLikes, setCommentLikes] = useState<{[key:string]: {count:number, liked:boolean}}>({});

  if (!item) return null;
  const canDelete = isOwner || (currentUserHandle && item.author.handle === currentUserHandle);

  const handleCommentLike = (id: string) => {
    setCommentLikes(prev => {
      const cur = prev[id] || {count:0, liked:false};
      return {...prev, [id]: {count: cur.liked? Math.max(0, cur.count-1): cur.count+1, liked:!cur.liked}};
    });
  };

  const handleDeleteComment = (id: string) => {
    if(!confirm('Delete this comment?')) return;
    setLocalComments(prev=>prev.filter(c=>c.id!==id));
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const newC = {
      id: Date.now().toString(),
      author: 'You',
      avatar: 'https://i.pravatar.cc/150?u=you',
      text: replyTo? `@${replyTo.author} ${commentInput}` : commentInput,
      time: 'Just now',
      replyTo: replyTo?.id || null
    };
    setLocalComments(prev=>[...prev, newC]);
    onAddComment(item.id, newC.text);
    setCommentInput('');
    setReplyTo(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-[500px] h-[100dvh] sm:h-[92vh] bg-[#0A0A0F] sm:rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between p-3 border-b border-white/10 bg-[#0A0A0F]">
          <div className="flex items-center gap-2.5">
            <img src={item.author.avatar} className="w-8 h-8 rounded-full ring-1 ring-cyan-400" />
            <div>
              <div className="flex items-center gap-1"><span className="font-bold text-xs text-white">{item.author.name}</span>{item.author.verified && <CheckCircle2 className="w-3 h-3 text-cyan-400" />}</div>
              <span className="text-[10px] text-slate-400">{item.author.handle}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canDelete && onDeletePost && <button onClick={()=>{if(confirm('Delete video?')){onDeletePost(item.id); onClose();}}} className="p-2 rounded-full bg-red-500/20 text-red-400"><Trash2 className="w-4 h-4" /></button>}
            <button onClick={onClose} className="p-2 rounded-full bg-white/10 text-white"><X className="w-4 h-4" /></button>
          </div>
        </div>

        {/* VIDEO - Watch While Comment */}
        <div className="relative w-full aspect-[9/12] sm:aspect-video bg-black shrink-0">
          {item.videoUrl || item.image?.includes('.mp4') || item.mediaType==='video'? (
            <VideoPlayer item={item} onLikeToggle={onLikeToggle} aspectRatio="aspect-[9/12]" />
          ) : (
            <img src={item.image} className="w-full h-full object-cover" />
          )}
          {/* Like Over Video */}
          <button onClick={()=>onLikeToggle(item.id)} className="absolute bottom-3 right-3 w-10 h-10 bg-black/60 backdrop-blur rounded-full flex items-center justify-center">
            <Heart className={`w-5 h-5 ${item.isLiked?'fill-[#FF007A] text-[#FF007A]':'text-white'}`} />
          </button>
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur px-2.5 py-1 rounded-full text-[10px] text-white flex items-center gap-1.5"><Eye className="w-3 h-3" /> {item.views||0} • {item.likeCount} Likes</div>
        </div>

        {/* CAPTION */}
        <div className="p-3 bg-[#12121A] border-y border-white/5">
          <p className="text-xs text-slate-200 line-clamp-2">{item.text}</p>
          <div className="flex gap-2 mt-2">
            <button onClick={()=>onLikeToggle(item.id)} className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${item.isLiked?'bg-[#FF007A]/20 text-[#FF007A]':'bg-white/10 text-white/70'}`}><Heart className={`w-3.5 h-3.5 ${item.isLiked?'fill-[#FF007A]':''}`} /> {item.likeCount}</button>
            <button className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/70"><MessageCircle className="w-3.5 h-3.5" /> {localComments.length}</button>
            {onShareOpen && <button onClick={()=>onShareOpen(item)} className="p-1.5 rounded-full bg-white/10"><Share2 className="w-3.5 h-3.5 text-white" /></button>}
          </div>
        </div>

        {/* COMMENTS - With Like & Delete */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#0A0A0F]">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Comments • Watch & Comment</h4>
          {localComments.length===0 && <p className="text-center py-6 text-xs text-slate-500">No comments yet. Comment while watching! 👇</p>}
          {localComments.map((c:any)=>{
            const like = commentLikes[c.id] || {count:0, liked:false};
            return (
              <div key={c.id} className="flex gap-2 group">
                <img src={c.avatar} className="w-6 h-6 rounded-full shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="bg-[#1A1A25] rounded-2xl rounded-tl-sm px-3 py-2 border border-white/5">
                    <div className="flex justify-between"><span className="text-xs font-bold text-white">{c.author}</span><span className="text-[9px] text-slate-500">{c.time}</span></div>
                    <p className="text-xs text-slate-300 mt-1 break-words">{c.text}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-1 ml-1">
                    <button onClick={()=>handleCommentLike(c.id)} className={`flex items-center gap-1 text-[11px] ${like.liked?'text-[#FF007A] font-bold':'text-slate-400 hover:text-white'}`}><Heart className={`w-3 h-3 ${like.liked?'fill-[#FF007A]':''}`} /> {like.count>0? like.count : 'Like'}</button>
                    <button onClick={()=>setReplyTo(c)} className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"><Reply className="w-3 h-3" /> Reply</button>
                    <button onClick={()=>handleDeleteComment(c.id)} className="flex items-center gap-1 text-[11px] text-red-400/70 hover:text-red-400 opacity-0 group-hover:opacity-100"><Trash2 className="w-3 h-3" /> Delete</button>
                  </div>
                  {/* Replies */}
                  {localComments.filter((r:any)=>r.replyTo===c.id).map((r:any)=>{
                    const rLike = commentLikes[r.id] || {count:0, liked:false};
                    return (
                      <div key={r.id} className="flex gap-2 mt-2 ml-6">
                        <img src={r.avatar} className="w-5 h-5 rounded-full" />
                        <div className="flex-1 bg-[#14141E] rounded-xl px-3 py-1.5 border border-white/5">
                          <p className="text-[11px] font-bold text-white">{r.author}</p>
                          <p className="text-xs text-slate-300">{r.text}</p>
                          <div className="flex gap-2 mt-1">
                            <button onClick={()=>handleCommentLike(r.id)} className={`text-[10px] ${rLike.liked?'text-[#FF007A]':'text-slate-500'}`}><Heart className={`w-3 h-3 inline ${rLike.liked?'fill-[#FF007A]':''}`} /> {rLike.count||0}</button>
                            <button onClick={()=>handleDeleteComment(r.id)} className="text-[10px] text-red-400/60"><Trash2 className="w-3 h-3 inline" /></button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply Preview */}
        {replyTo && (
          <div className="px-3 py-2 bg-yellow-500/10 border-t border-yellow-500/20 flex justify-between items-center">
            <span className="text-xs text-yellow-400">Replying to @{replyTo.author}: {replyTo.text.slice(0,30)}...</span>
            <button onClick={()=>setReplyTo(null)} className="text-yellow-400"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* INPUT */}
        <form onSubmit={handleCommentSubmit} className="p-3 border-t border-white/10 bg-[#0A0A0F] flex gap-2">
          <input value={commentInput} onChange={e=>setCommentInput(e.target.value)} placeholder={replyTo?`Reply to ${replyTo.author}...`:'Add a comment... ❤️ Like available'} className="flex-1 bg-[#1A1A25] text-xs text-white px-4 py-3 rounded-full border border-white/10 focus:outline-none focus:border-cyan-400 placeholder:text-slate-500" />
          <button type="submit" className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-[#FF007A] text-white flex items-center justify-center"><Send className="w-4 h-4" /></button>
        </form>
      </div>
    </div>
  );
};
