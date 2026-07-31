import React, { useState } from 'react';
import {
  LayoutGrid,
  Zap,
  Tv,
  Sparkles,
  MessageSquare,
  RefreshCw,
  PlusCircle,
  TrendingUp,
  Users,
  Compass,
} from 'lucide-react';
import { ColumnId, SocialItem, UserProfile } from '../types';
import { COLUMNS } from '../data/mockData';
import { FeedCard } from './FeedCard';
import { ShortsCard } from './ShortsCard';
import { WatchCard } from './WatchCard';
import { StoryCard } from './StoryCard';
import { ChatCard } from './ChatCard';
import { StoriesBar } from './StoriesBar';
import { SkeletonLoader } from './SkeletonLoader';

interface ColumnsContainerProps {
  activeColumn: ColumnId | 'all';
  items: SocialItem[];
  currentUser: UserProfile;
  onLikeToggle: (id: string) => void;
  onOpenDetail: (item: SocialItem) => void;
  onSendMessage: (itemId: string, text: string) => void;
  onOpenCreateForColumn: (columnId: ColumnId) => void;
  onOpenShare?: (item: SocialItem) => void;
  onFollowToggle?: (handle: string) => void;
  onOpenReport?: (item: SocialItem) => void;
  onOpenGift?: (item: SocialItem) => void;
}

export const ColumnsContainer: React.FC<ColumnsContainerProps> = ({
  activeColumn,
  items,
  currentUser,
  onLikeToggle,
  onOpenDetail,
  onSendMessage,
  onOpenCreateForColumn,
  onOpenShare,
  onFollowToggle,
  onOpenReport,
  onOpenGift,
}) => {
  const [feedSubTab, setFeedSubTab] = useState<'forYou' | 'following' | 'trending'>('forYou');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getIcon = (iconName: string, color: string) => {
    const iconClass = "w-3.5 h-3.5 shrink-0";
    switch (iconName) {
      case 'LayoutGrid':
        return <LayoutGrid className={iconClass} style={{ color }} />;
      case 'Zap':
        return <Zap className={iconClass} style={{ color }} />;
      case 'Tv':
        return <Tv className={iconClass} style={{ color }} />;
      case 'Sparkles':
        return <Sparkles className={iconClass} style={{ color }} />;
      case 'MessageSquare':
        return <MessageSquare className={iconClass} style={{ color }} />;
      default:
        return <LayoutGrid className={iconClass} style={{ color }} />;
    }
  };

  const handleTriggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  // Determine which columns to render
  const visibleColumns =
    activeColumn === 'all'
      ? COLUMNS
      : COLUMNS.filter((c) => c.id === activeColumn);

  return (
    <div className="flex-1 min-h-0 w-full bg-[#0A0A0F] overflow-hidden flex relative">
      {visibleColumns.map((col, index) => {
        let columnItems = items.filter((item) => item.column === col.id);

        // Filter Feed by sub tabs
        if (col.id === 'feed') {
          if (feedSubTab === 'following') {
            columnItems = columnItems.filter((i) => i.author.isFollowing);
          } else if (feedSubTab === 'trending') {
            columnItems = [...columnItems].sort((a, b) => b.likeCount - a.likeCount);
          }
        }

        const isLast = index === visibleColumns.length - 1;

        return (
          <div
            key={col.id}
            className={`flex-1 flex flex-col min-w-0 h-full relative transition-all duration-300 ${
              !isLast ? 'border-r border-white/10' : ''
            }`}
          >
            {/* Column Header */}
            <div className="sticky top-0 z-20 bg-[#0D0D14]/95 backdrop-blur-md border-b border-white/10 px-3 py-2 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center space-x-2 min-w-0">
                <div className="p-1 rounded-md bg-white/5 border border-white/10">
                  {getIcon(col.iconName, col.color)}
                </div>
                <span className="font-extrabold text-[11px] uppercase tracking-[0.15em] text-slate-100 truncate">
                  {col.name}
                </span>
                <span
                  className="text-[9px] font-extrabold px-2 py-0.5 rounded-full border shadow-sm"
                  style={{
                    color: col.color,
                    backgroundColor: `${col.color}15`,
                    borderColor: `${col.color}30`,
                  }}
                >
                  {columnItems.length}
                </span>
              </div>

              {/* Action Buttons Header */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleTriggerRefresh}
                  className="p-1 text-slate-400 hover:text-cyan-400 hover:bg-white/10 rounded transition-colors"
                  title="Refresh Feed"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
                </button>

                <button
                  onClick={() => onOpenCreateForColumn(col.id)}
                  className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                  title={`Add post to ${col.name}`}
                >
                  <PlusCircle className="w-4 h-4" style={{ color: col.color }} />
                </button>
              </div>
            </div>

            {/* Sub-Tabs Selector for Main Feed Column */}
            {col.id === 'feed' && (
              <div className="bg-[#0A0A12] border-b border-white/10 px-2 py-1.5 flex items-center justify-around text-xs font-bold shrink-0">
                <button
                  onClick={() => {
                    setFeedSubTab('forYou');
                    handleTriggerRefresh();
                  }}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-all ${
                    feedSubTab === 'forYou'
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>For You</span>
                </button>

                <button
                  onClick={() => {
                    setFeedSubTab('following');
                    handleTriggerRefresh();
                  }}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-all ${
                    feedSubTab === 'following'
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-400/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Following</span>
                </button>

                <button
                  onClick={() => {
                    setFeedSubTab('trending');
                    handleTriggerRefresh();
                  }}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-all ${
                    feedSubTab === 'trending'
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-400/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Trending</span>
                </button>
              </div>
            )}

            {/* Stories Bar at top of Main Feed Column */}
            {col.id === 'feed' && (
              <StoriesBar
                items={items}
                currentUser={currentUser}
                onOpenCreateStory={() => onOpenCreateForColumn('story')}
                onOpenStoryDetail={(story) => onOpenDetail(story)}
              />
            )}

            {/* Column Independent Scrollable Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-3 min-h-0">
              {isRefreshing ? (
                <>
                  <SkeletonLoader />
                  <SkeletonLoader />
                </>
              ) : columnItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-52 text-slate-400 text-xs text-center p-4 bg-[#121220]/50 rounded-2xl border border-white/5 my-2">
                  <Sparkles className="w-8 h-8 mb-2 text-cyan-400/60 animate-bounce" />
                  <span className="font-bold text-slate-200">No posts in {col.name} column yet</span>
                  <p className="text-[10px] text-slate-500 max-w-xs mt-1">
                    Be the first to share something amazing in the {col.name} community!
                  </p>
                  <button
                    onClick={() => onOpenCreateForColumn(col.id)}
                    className="mt-3 px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-extrabold text-xs shadow-md"
                  >
                    + Create First {col.name}
                  </button>
                </div>
              ) : (
                [...columnItems]
                  .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
                  .map((item) => {
                    switch (col.id) {
                      case 'feed':
                        return (
                          <React.Fragment key={item.id}>
                            <FeedCard
                              item={item}
                              onLikeToggle={onLikeToggle}
                              onOpenDetail={onOpenDetail}
                              onOpenShare={onOpenShare}
                              onFollowToggle={onFollowToggle}
                              onOpenReport={onOpenReport}
                              onOpenGift={onOpenGift}
                            />
                          </React.Fragment>
                        );
                      case 'shorts':
                        return (
                          <ShortsCard
                            key={item.id}
                            item={item}
                            onLikeToggle={onLikeToggle}
                            onOpenDetail={onOpenDetail}
                            onOpenShare={onOpenShare}
                            onOpenReport={onOpenReport}
                            onOpenGift={onOpenGift}
                          />
                        );
                      case 'watch':
                        return (
                          <WatchCard
                            key={item.id}
                            item={item}
                            onLikeToggle={onLikeToggle}
                            onOpenDetail={onOpenDetail}
                            onOpenShare={onOpenShare}
                            onOpenReport={onOpenReport}
                            onOpenGift={onOpenGift}
                          />
                        );
                      case 'story':
                        return (
                          <StoryCard
                            key={item.id}
                            item={item}
                            onLikeToggle={onLikeToggle}
                            onOpenDetail={onOpenDetail}
                          />
                        );
                      case 'chat':
                        return (
                          <ChatCard
                            key={item.id}
                            item={item}
                            onLikeToggle={onLikeToggle}
                            onOpenDetail={onOpenDetail}
                            onSendMessage={onSendMessage}
                          />
                        );
                      default:
                        return null;
                    }
                  })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
