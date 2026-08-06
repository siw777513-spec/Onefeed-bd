import React, { useState } from "react";
import { PhoneContainer } from './components/PhoneContainer';
import { TopBar } from './components/TopBar';
import { getStoredProfile } from './utils/storage';

export default function App(){
  const [profile] = useState(()=>getStoredProfile());
  return (
    <PhoneContainer>
      <div style={{background:'#0A0A0F', minHeight:'100vh', color:'white'}}>
        <TopBar currentUser={profile} unreadCount={0} isPhoneFrame={true} onTogglePhoneFrame={()=>{}} onOpenCreate={()=>{}} onOpenNotifications={()=>{}} onOpenSearch={()=>{}} onOpenSettings={()=>{}} onOpenProfile={()=>{}} onOpenWallet={()=>{}} onOpenFriends={()=>{}} onOpenDailyReward={()=>{}} onLogout={()=>{}} />
        <div style={{padding:20, textAlign:'center'}}>
          <h1>ONEFEED V18 - TopBar Working ✅</h1>
          <p>যদি এটা দেখো, TopBar ঠিক আছে</p>
        </div>
      </div>
    </PhoneContainer>
  )
}
