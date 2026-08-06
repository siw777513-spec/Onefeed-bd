import React, { useState } from "react";
import { PhoneContainer } from './components/PhoneContainer';
import { TopBar } from './components/TopBar';
import { ColumnsContainer } from './components/ColumnsContainer';
import { BottomNav } from './components/BottomNav';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { getStoredItems, getStoredProfile } from './utils/storage';

export default function App(){
  const [profile] = useState(()=>getStoredProfile());
  const [items] = useState(()=>getStoredItems().slice(0,5));
  const [activeColumn, setActiveColumn] = useState<any>('all');
  return (
    <PhoneContainer>
      <div className="flex flex-col h-full w-full bg-[#0A0A0F] text-slate-100 overflow-hidden">
        <TopBar currentUser={profile} unreadCount={0} isPhoneFrame={true} onTogglePhoneFrame={()=>{}} onOpenCreate={()=>{}} onOpenNotifications={()=>{}} onOpenSearch={()=>{}} onOpenSettings={()=>{}} onOpenProfile={()=>{}} onOpenWallet={()=>{}} onOpenFriends={()=>{}} onOpenDailyReward={()=>{}} onLogout={()=>{}} />
        <div className="flex-1 flex w-full min-h-0 overflow-hidden">
          <LeftSidebar currentUser={profile} onOpenDailyReward={()=>{}} onOpenWallet={()=>{}} onOpenFriends={()=>{}} />
          <ColumnsContainer activeColumn={activeColumn} items={items} currentUser={profile} onLikeToggle={()=>{}} onOpenDetail={()=>{}} onSendMessage={()=>{}} onOpenCreateForColumn={()=>{}} onOpenShare={()=>{}} onFollowToggle={()=>{}} onOpenReport={()=>{}} onOpenGift={()=>{}} />
          <RightSidebar onFollowToggle={()=>{}} onOpenChatWithUser={()=>{}} />
        </div>
        <BottomNav activeColumn={activeColumn} onSelectColumn={setActiveColumn} unreadChats={0} />
        <div style={{position:'absolute', top:0, left:0, background:'lime', color:'black', padding:'4px 8px', zIndex:9999}}>V19 OK</div>
      </div>
    </PhoneContainer>
  )
}
