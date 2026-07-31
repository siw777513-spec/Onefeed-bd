import React, { useState } from 'react';
import { X, Copy, Check, Share2, Send, MessageCircle, ExternalLink } from 'lucide-react';
import { SocialItem } from '../types';

interface ShareModalProps {
  item: SocialItem | null;
  onClose: () => void;
  lang?: 'en' | 'bn';
}

export const ShareModal: React.FC<ShareModalProps> = ({ item, onClose, lang = 'en' }) => {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const postUrl = `${window.location.origin}/#post-${item.id}`;
  const shareText = encodeURIComponent(`Check out this post by ${item.author.name} on OneFeed: "${item.text.slice(0, 60)}..."`);

  const handleCopy = () => {
    navigator.clipboard.writeText(postUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(postUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${shareText}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(postUrl)}`;

  const isBn = lang === 'bn';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-[#12121D] rounded-t-2xl sm:rounded-2xl border border-white/10 shadow-2xl p-4 text-slate-100 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Share2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white">
              {isBn ? 'পোস্ট শেয়ার করুন' : 'Share Post'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Post snippet */}
        <div className="my-3 p-2.5 rounded-xl bg-[#0A0A10] border border-white/5 flex items-center space-x-3">
          <img
            src={item.image}
            alt="Preview"
            className="w-12 h-12 rounded-lg object-cover shrink-0 border border-white/10"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{item.author.name}</p>
            <p className="text-[11px] text-slate-300 line-clamp-1">{item.text}</p>
            <span className="text-[9px] text-cyan-400 uppercase tracking-wider">{item.column}</span>
          </div>
        </div>

        {/* Quick share action grid */}
        <div className="grid grid-cols-4 gap-2 mb-4 text-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#1E2B22] hover:bg-[#25382B] border border-emerald-500/20 text-emerald-400 transition-all group"
          >
            <MessageCircle className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-semibold text-slate-200">WhatsApp</span>
          </a>

          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#172733] hover:bg-[#1E3445] border border-sky-500/20 text-sky-400 transition-all group"
          >
            <Send className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-semibold text-slate-200">Telegram</span>
          </a>

          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#18202E] hover:bg-[#202C40] border border-blue-500/20 text-blue-400 transition-all group"
          >
            <ExternalLink className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-semibold text-slate-200">Twitter</span>
          </a>

          <button
            onClick={handleCopy}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#281C30] hover:bg-[#342440] border border-purple-500/20 text-purple-400 transition-all group"
          >
            {copied ? (
              <Check className="w-5 h-5 mb-1 text-emerald-400" />
            ) : (
              <Copy className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
            )}
            <span className="text-[10px] font-semibold text-slate-200">
              {copied ? (isBn ? 'কপি হয়েছে!' : 'Copied!') : (isBn ? 'কপি লিঙ্ক' : 'Copy')}
            </span>
          </button>
        </div>

        {/* Direct Link Input */}
        <div className="flex items-center space-x-2 bg-[#0A0A10] p-1.5 rounded-xl border border-white/10">
          <input
            type="text"
            readOnly
            value={postUrl}
            className="w-full bg-transparent text-[10px] text-slate-300 px-2 focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shrink-0 transition-colors"
          >
            {copied ? (isBn ? 'কপিড' : 'Copied') : (isBn ? 'কপি' : 'Copy')}
          </button>
        </div>
      </div>
    </div>
  );
};
