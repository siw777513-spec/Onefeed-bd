import React, { useState } from 'react';
import {
  X,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Send,
  CheckCircle2,
  Disc,
  Play,
  Volume2,
  Eye,
  Clock,
  AlertTriangle,
  Gift,
  DollarSign,
  Crown,
  Trash2,
} from 'lucide-react';
import { SocialItem, Comment } from '../types';
import { VideoPlayer } from './VideoPlayer';

interface PostDetailModalProps {
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

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
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
  const [bookmarked, setBookmarked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  if (!item) return null;

  const canDelete = isOwner || (currentUserHandle && item.author.handle === currentUserHandle) || true; // true for testing, later remove

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(item.id, commentInput.trim());
    setCommentInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#12121A] rounded-2xl border border-white/10 shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-3.5 border-b border-white/10 bg-[#0A0A0F]/90">
          <div className="flex items-center space-x-2.5 min-w-0">
            <img
              src={item.author.avatar}
              alt={item.author.name}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-cyan-400"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center space-x-1">
                <span className="font-bold text-xs text-white truncate">{item.author.name}</span>
                {item.author.verified && (
                  <CheckCircle2 className="w-3 h-3 text-cyan-400 fill-cyan-400/20 shrink-0" />
                )}
              </div>
              <span className="text-[10px] text-slate-400">{item.author.handle} • {item.timestamp}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {canDelete && onDeletePost && (
              <button
                onClick={() => {
                  if(confirm('Are you sure you want to delete this video?')) {
                    onDeletePost(item.id);
                    onClose();
                  }
                }}
                className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                title="Delete Video"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            {onSubscribeCreator && (
              <button
                onClick={() => onSubscribeCreator(item.author.handle)}
                className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-300 text-black font-extrabold text-[10px] flex items-center space-x-1 shadow-md hover:scale-105 transition-transform"
              >
                <Crown className="w-3 h-3 text-black" />
                <span>Subscribe $2.99</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Scroll Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 space-y-3">
          {/* Main Expanded Media */}
          {item.mediaType === 'video' || item.videoUrl || item.mediaId || item.image.startsWith('data:video')? (
            <div className="relative rounded-xl overflow-hidden bg-black/60 aspect-[16/10] sm:aspect-video border border-white/10">
              <VideoPlayer
                item={item}
                onLikeToggle={onLikeToggle}
                aspectRatio="aspect-video"
              />
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden bg-black/60 aspect-[16/10] sm:aspect-video border border-white/10">
              <img
                src={item.image}
                alt="Expanded post content"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {item.column === 'shorts' && (
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <div className="flex items-center space-x-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-xs text-cyan-300">
                    <Disc className="w-3.5 h-3.5 text-[#FF007A] animate-spin" />
                    <span className="truncate max-w-[200px]">{item.soundTrack || 'Original Sound'}</span>
                  </div>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 rounded-full bg-black/60 text-white backdrop-blur-md"
                  >
                    {isPlaying? <Volume2 className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>
              )}
              {item.column === 'watch' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-12 h-12 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-xl">
                    <Play className="w-6 h-6 fill-white translate-x-0.5" />
                  </div>
                  {item.views && (
                    <span className="absolute top-3 left-3 bg-black/70 px-2 py-0.5 rounded-full text-[10px] text-slate-200 flex items-center gap-1">
                      <Eye className="w-3 h-3 text-purple-400" /> {item.views}
                    </span>
                  )}
                </div>
              )}
              {item.column === 'story' && (
                <div className="absolute top-3 right-3 bg-amber-500/80 text-black font-bold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {item.timestamp}
                </div>
              )}
            </div>
          )}

          {/* Caption */}
          <div className="bg-[#0A0A0F] rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-200 leading-relaxed">{item.text}</p>
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Stats Bar */}
          <div className="flex items-center justify-between py-2 px-1 border-y border-white/10 text-xs text-slate-300">
            <button
              onClick={() => onLikeToggle(item.id)}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                item.isLiked? 'text-[#FF007A] bg-[#FF007A]/10 font-bold' : 'hover:bg-white/5'
              }`}
            >
              <Heart className={`w-4 h-4 ${item.isLiked? 'fill-[#FF007A]' : ''}`} />
              <span>{item.likeCount.toLocaleString()} Likes</span>
            </button>

            <div className="flex items-center space-x-1.5 px-2.5 py-1 text-slate-400">
              <MessageCircle className="w-4 h-4" />
              <span>{item.comments?.length || item.commentCount} Comments</span>
            </div>

            {onOpenGift && (
              <button
                onClick={() => onOpenGift(item)}
                className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-pink-500/20 border border-amber-400/40 text-amber-300 font-extrabold flex items-center space-x-1 hover:scale-105 transition-all"
              >
                <Gift className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Gift</span>
              </button>
            )}

            {onOpenTip && (
              <button
                onClick={() => onOpenTip(item)}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-extrabold flex items-center space-x-1 hover:scale-105 transition-all"
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tip</span>
              </button>
            )}

            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-1.5 rounded-lg transition-colors ${
                bookmarked? 'text-cyan-400 bg-cyan-500/10' : 'hover:bg-white/5'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked? 'fill-cyan-400' : ''}`} />
            </button>

            <button
              onClick={() => onShareOpen && onShareOpen(item)}
              className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              title="Share Post"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenReport && onOpenReport(item)}
              className="p-1.5 rounded-lg hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 transition-colors"
              title="Report Post"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
          </div>

          {/* Comments Thread */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Comments
            </h4>

            {item.comments && item.comments.length > 0? (
              <div className="space-y-2">
                {item.comments.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-start space-x-2 bg-[#0A0A0F]/60 p-2.5 rounded-xl border border-white/5"
                  >
                    <img
                      src={c.avatar}
                      alt={c.author}
                      className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">{c.author}</span>
                        <span className="text-[10px] text-slate-500">{c.time}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5 leading-snug">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-slate-500 bg-[#0A0A0F]/40 rounded-xl">
                No comments yet. Be the first to share your thoughts!
              </div>
            )}
          </div>
        </div>

        {/* Add Comment Input Form */}
        <form
          onSubmit={handleCommentSubmit}
          className="p-3 border-t border-white/10 bg-[#0A0A0F] flex items-center space-x-2"
        >
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Add a comment to this post..."
            className="flex-1 bg-[#12121A] text-xs text-white px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-400 placeholder:text-slate-500"
          />
          <button
            type="submit"
            className="p-2 rounded-xl bg-gradient-to-r from-cyan-400 to-[#FF007A] text-white hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
