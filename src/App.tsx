import { useState } from 'react';
import { ColumnId, SocialItem } from './types';
import { getStoredItems, getStoredProfile } from './utils/storage';
import { PhoneContainer } from './components/PhoneContainer';
import { TopBar } from './components/TopBar';
import { ColumnsContainer } from './components/ColumnsContainer';
import { BottomNav } from './components/BottomNav';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';

export default function App(){
  const [profile] = useState(()=>{ try{return getStoredProfile()}catch{return {name:'Sakib', handle:'@sakib', avatar:''} as any} });
  const [items, setItems] = useState<SocialItem[]>(()=>{ try{return getStoredItems()}catch{return []} });
  const [activeColumn, setActiveColumn] = useState<ColumnId | 'all'>('all');
  return (
    <PhoneContainer>
      <div className="flex flex-col h-full w-full bg-[#0A0A0F] text-slate-100 overflow-hidden">
        <TopBar currentUser={profile} unreadCount={0} isPhoneFrame={true} onTogglePhoneFrame={()=>{}} onOpenCreate={()=>alert('Create Post - পরে যোগ হবে')} onOpenNotifications={()=>{}} onOpenSearch={()=>{}} onOpenSettings={()=>{}} onOpenProfile={()=>{}} onOpenWallet={()=>{}} onOpenFriends={()=>{}} onOpenDailyReward={()=>{}} onLogout={()=>{}} />
        <div className="flex-1 flex w-full min-h-0 overflow-hidden">
          <LeftSidebar currentUser={profile} onOpenDailyReward={()=>{}} onOpenWallet={()=>{}} onOpenFriends={()=>{}} />
          <ColumnsContainer activeColumn={activeColumn} items={items} currentUser={profile} onLikeToggle={()=>{}} onOpenDetail={()=>{}} onSendMessage={()=>{}} onOpenCreateForColumn={()=>{}} onOpenShare={()=>{}} onFollowToggle={()=>{}} onOpenReport={()=>{}} onOpenGift={()=>{}} />
          <RightSidebar onFollowToggle={()=>{}} onOpenChatWithUser={()=>{}} />
        </div>
        <BottomNav activeColumn={activeColumn} onSelectColumn={setActiveColumn} unreadChats={0} />
        <div style={{position:'fixed',bottom:5,left:5,background:'lime',color:'black',padding:4,fontSize:12,zIndex:99999}}>FEED OK - NO LOGIN</div>
      </div>
    </PhoneContainer>
  )
}
