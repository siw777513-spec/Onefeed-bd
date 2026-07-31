import React from 'react';
import { X, Bell, Heart, MessageSquare, UserPlus, Sparkles } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_NOTIFS = [
  { id: 'n1', type: 'like', user: 'Maya Lin', action: 'liked your post in Shorts', time: '2m ago', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80' },
  { id: 'n2', type: 'comment', user: 'Gemma Cole', action: 'commented in Chat thread', time: '12m ago', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' },
  { id: 'n3', type: 'follow', user: 'Tech Horizon', action: 'started following your Feed', time: '1h ago', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80' },
  { id: 'n4', type: 'story', user: 'Sora Kim', action: 'posted a new Story update', time: '2h ago', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80' },
];

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-[#12121A] rounded-2xl border border-white/10 shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between p-3.5 border-b border-white/10 bg-[#0A0A0F]">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">Notifications</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 space-y-2 overflow-y-auto custom-scrollbar">
          {MOCK_NOTIFS.map((n) => (
            <div key={n.id} className="flex items-center space-x-3 p-2.5 rounded-xl bg-[#0A0A0F]/60 border border-white/5 hover:border-cyan-500/20 transition-all">
              <img src={n.avatar} alt={n.user} className="w-8 h-8 rounded-full object-cover ring-1 ring-cyan-500/30 shrink-0" referrerPolicy="no-referrer" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-200">
                  <span className="font-bold text-white">{n.user}</span> {n.action}
                </p>
                <span className="text-[10px] text-slate-500">{n.time}</span>
              </div>
              {n.type === 'like' && <Heart className="w-4 h-4 text-[#FF007A] fill-[#FF007A]" />}
              {n.type === 'comment' && <MessageSquare className="w-4 h-4 text-cyan-400" />}
              {n.type === 'follow' && <UserPlus className="w-4 h-4 text-emerald-400" />}
              {n.type === 'story' && <Sparkles className="w-4 h-4 text-amber-400" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
