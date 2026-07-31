import React, { useState } from 'react';
import { Heart, Send, CheckCircle2, Image as ImageIcon, Smile, PhoneCall, Video } from 'lucide-react';
import { SocialItem } from '../types';

interface ChatCardProps {
  item: SocialItem;
  onLikeToggle: (id: string) => void;
  onOpenDetail: (item: SocialItem) => void;
  onSendMessage: (itemId: string, messageText: string) => void;
}

export const ChatCard: React.FC<ChatCardProps> = ({
  item,
  onLikeToggle,
  onOpenDetail,
  onSendMessage,
}) => {
  const [quickInput, setQuickInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!quickInput.trim()) return;
    onSendMessage(item.id, quickInput.trim());
    setQuickInput('');
  };

  const messages = item.messages || [
    { id: 'm-default', sender: 'other' as const, text: item.text, time: item.lastMessageTime || item.timestamp }
  ];

  return (
    <div
      onClick={() => onOpenDetail(item)}
      className="group relative bg-gradient-to-b from-[#141422] via-[#0F0F1A] to-[#0A0A12] rounded-xl border border-white/10 hover:border-cyan-400/50 p-2.5 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-cyan-500/10 mb-3 overflow-hidden select-none"
    >
      {/* Mobile Chat Header Bar */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
        <div className="flex items-center space-x-2 min-w-0">
          <div className="relative shrink-0 p-[1.5px] rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500">
            <img
              src={item.author.avatar}
              alt={item.author.name}
              className="w-7 h-7 rounded-full object-cover border border-[#0A0A0F]"
              referrerPolicy="no-referrer"
            />
            {item.author.online && (
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0A0A0F]" />
            )}
          </div>
          <div className="min-w-0 flex flex-col">
            <div className="flex items-center space-x-1">
              <span className="text-xs font-bold text-white truncate">
                {item.author.name}
              </span>
              {item.author.verified && (
                <CheckCircle2 className="w-3 h-3 text-cyan-400 fill-cyan-400/20 shrink-0" />
              )}
            </div>
            <span className="text-[9px] text-slate-400 truncate flex items-center gap-1">
              {item.chatStatus === 'typing' ? (
                <span className="text-cyan-400 font-semibold animate-pulse">typing...</span>
              ) : (
                <span className="text-emerald-400 font-medium">● Active now</span>
              )}
            </span>
          </div>
        </div>

        {/* Call & Unread Quick Action Icons */}
        <div className="flex items-center space-x-1.5 text-slate-400">
          <button onClick={(e) => e.stopPropagation()} className="p-1 hover:text-cyan-400 rounded hover:bg-white/5">
            <PhoneCall className="w-3 h-3" />
          </button>
          <button onClick={(e) => e.stopPropagation()} className="p-1 hover:text-cyan-400 rounded hover:bg-white/5">
            <Video className="w-3 h-3" />
          </button>
          {item.unreadCount && item.unreadCount > 0 ? (
            <span className="px-1.5 py-0.2 rounded-full bg-cyan-400 text-[9px] font-extrabold text-black shadow-sm">
              {item.unreadCount}
            </span>
          ) : null}
        </div>
      </div>

      {/* Mobile Chat Speech Bubbles Area */}
      <div className="space-y-2 my-2.5">
        {messages.slice(-2).map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end space-x-1.5 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'other' && (
              <img
                src={item.author.avatar}
                alt="avatar"
                className="w-5 h-5 rounded-full object-cover shrink-0 mb-0.5"
                referrerPolicy="no-referrer"
              />
            )}
            <div
              className={`max-w-[85%] px-2.5 py-1.5 rounded-2xl text-[11px] leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-none'
                  : 'bg-[#1C1C2B] text-slate-100 border border-white/10 rounded-bl-none'
              }`}
            >
              <p>{msg.text}</p>
              <span
                className={`block text-[8px] mt-0.5 text-right ${
                  msg.sender === 'user' ? 'text-cyan-100/70' : 'text-slate-400'
                }`}
              >
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {/* Attachment Image Preview if present */}
        {item.image && (
          <div className="relative rounded-lg overflow-hidden border border-white/10 aspect-[16/9] max-h-24 my-1">
            <img
              src={item.image}
              alt="Media"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[8px] text-cyan-300 flex items-center gap-1 backdrop-blur-sm">
              <ImageIcon className="w-2.5 h-2.5" /> Photo
            </div>
          </div>
        )}
      </div>

      {/* Mobile Input Reply Form */}
      <form
        onSubmit={handleSend}
        onClick={(e) => e.stopPropagation()}
        className="flex items-center space-x-1.5 mt-2 pt-2 border-t border-white/10"
      >
        <div className="flex-1 flex items-center bg-[#0A0A10] rounded-full border border-white/15 px-2 py-1 focus-within:border-cyan-400">
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="Type message..."
            className="w-full bg-transparent text-slate-100 text-[10px] focus:outline-none placeholder:text-slate-500"
          />
          <button type="button" className="text-slate-400 hover:text-amber-300 p-0.5">
            <Smile className="w-3 h-3" />
          </button>
        </div>

        <button
          type="submit"
          className="p-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:opacity-90 transition-opacity shrink-0 shadow-md"
        >
          <Send className="w-3 h-3 fill-black" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onLikeToggle(item.id);
          }}
          className={`p-1 transition-colors ${
            item.isLiked ? 'text-[#FF007A]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Heart
            className={`w-3.5 h-3.5 ${item.isLiked ? 'fill-[#FF007A] text-[#FF007A]' : ''}`}
          />
        </button>
      </form>
    </div>
  );
};
