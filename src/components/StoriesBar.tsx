import React, { useState } from 'react';
import { Plus, Sparkles, Play, Radio, Eye } from 'lucide-react';
import { SocialItem, UserProfile } from '../types';

interface StoriesBarProps {
  items: SocialItem[];
  currentUser: UserProfile;
  onOpenCreateStory: () => void;
  onOpenStoryDetail: (story: SocialItem) => void;
}

const SAMPLE_STORIES = [
  {
    id: 's-live-1',
    name: 'Aria Tech',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    media: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
    isLive: true,
    hasUnseen: true,
  },
  {
    id: 's-live-2',
    name: 'CyberSamurai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    media: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    isLive: false,
    hasUnseen: true,
  },
  {
    id: 's-live-3',
    name: 'Sarah J.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    media: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80',
    isLive: true,
    hasUnseen: true,
  },
  {
    id: 's-live-4',
    name: 'Tech Insider',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    media: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
    isLive: false,
    hasUnseen: false,
  },
  {
    id: 's-live-5',
    name: 'Creative Studio',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    media: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80',
    isLive: false,
    hasUnseen: false,
  },
];

export const StoriesBar: React.FC<StoriesBarProps> = ({
  items,
  currentUser,
  onOpenCreateStory,
  onOpenStoryDetail,
}) => {
  const storyPosts = items.filter((i) => i.column === 'story');

  return (
    <div className="w-full bg-[#0D0D18]/80 backdrop-blur-md border-b border-white/10 p-2.5 overflow-x-auto no-scrollbar select-none shrink-0">
      <div className="flex items-center space-x-3 min-w-max">
        {/* Add Story Button */}
        <div
          onClick={onOpenCreateStory}
          className="group relative flex flex-col items-center cursor-pointer shrink-0"
        >
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-dashed border-cyan-400/60 group-hover:border-cyan-300 p-0.5 bg-[#121220] transition-all group-hover:scale-105 shadow-lg">
            <img
              src={currentUser.avatar}
              alt="Your avatar"
              className="w-full h-full object-cover rounded-xl opacity-75 group-hover:opacity-100 transition-opacity"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="p-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-lg group-hover:scale-110 transition-transform">
                <Plus className="w-4 h-4 font-black" />
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-300 mt-1 group-hover:text-cyan-300 transition-colors">
            Your Story
          </span>
        </div>

        {/* Existing User Stories */}
        {storyPosts.map((item) => (
          <div
            key={item.id}
            onClick={() => onOpenStoryDetail(item)}
            className="group relative flex flex-col items-center cursor-pointer shrink-0"
          >
            <div className="relative p-[2.5px] rounded-2xl bg-gradient-to-tr from-rose-500 via-purple-500 to-cyan-400 group-hover:scale-105 transition-all shadow-md group-hover:shadow-cyan-500/30">
              <div className="w-13 h-13 sm:w-15 sm:h-15 w-14 h-14 rounded-xl overflow-hidden bg-slate-900 border-2 border-[#0A0A0F]">
                <img
                  src={item.image}
                  alt={item.text}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Author Avatar Badge */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border border-[#0A0A0F] overflow-hidden bg-slate-800 shadow">
                <img
                  src={item.author.avatar}
                  alt={item.author.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <span className="text-[10px] font-medium text-slate-300 mt-1 truncate max-w-[60px]">
              {item.author.name.split(' ')[0]}
            </span>
          </div>
        ))}

        {/* Sample Creator Stories / Live Streams */}
        {SAMPLE_STORIES.map((story) => (
          <div
            key={story.id}
            onClick={() => {
              const matchedItem = storyPosts[0];
              if (matchedItem) onOpenStoryDetail(matchedItem);
            }}
            className="group relative flex flex-col items-center cursor-pointer shrink-0"
          >
            <div
              className={`relative p-[2.5px] rounded-2xl transition-all group-hover:scale-105 shadow-md ${
                story.isLive
                  ? 'bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 animate-pulse'
                  : 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400'
              }`}
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 border-2 border-[#0A0A0F]">
                <img
                  src={story.media}
                  alt={story.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Live Badge */}
              {story.isLive && (
                <div className="absolute -top-1 px-1.5 py-0.2 bg-red-600 text-[8px] font-black text-white rounded-full uppercase tracking-wider shadow border border-white/20 flex items-center gap-0.5">
                  <Radio className="w-2 h-2 animate-ping" />
                  LIVE
                </div>
              )}

              {/* Avatar Badge */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border border-[#0A0A0F] overflow-hidden bg-slate-800 shadow">
                <img
                  src={story.avatar}
                  alt={story.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <span className="text-[10px] font-medium text-slate-300 mt-1 truncate max-w-[60px]">
              {story.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
