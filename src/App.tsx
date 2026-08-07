import { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import StoriesBar from './components/StoriesBar';
import FeedCard from './components/FeedCard';
import ShortsCard from './components/ShortsCard';
import WatchCard from './components/WatchCard';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import CreatePostModal from './components/CreatePostModal';
import LoginModal from './components/LoginModal';
import ProfileModal from './components/ProfileModal';
import NotificationModal from './components/NotificationModal';
import ChatCard from './components/ChatCard';
import WalletModal from './components/WalletModal';
import SearchModal from './components/SearchModal';
import SettingsModal from './components/SettingsModal';

// --- PROFILE PAGE WITH YOUR DESIGN ---
function ProfilePage({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('feed');
  const stats = [
    { label: 'লাইক', value: '12.3K' },
    { label: 'ফ্রেন্ড', value: '1.2K' },
    { label: 'ফলোয়ার', value: '45.6K' },
    { label: 'সাবস্ক্রাইবার', value: '9.1K' },
  ];
  const tabs = [
    { id: 'feed', label: 'ফিড', icon: '🎞️' },
    { id: 'short', label: 'সর্ট', icon: '🎞️' },
    { id: 'watch', label: 'ওয়াচ', icon: '🎬' },
    { id: 'story', label: 'স্টরি', icon: '🎞️' },
  ];

  const videos = [
    { id: 1, title: 'My First Vlog', views: '124K', time: '2 days ago', thumb: 'https://picsum.photos/200/300?random=1' },
    { id: 2, title: 'City Tour', views: '89K', time: '1 week ago', thumb: 'https://picsum.photos/200/300?random=2' },
    { id: 3, title: 'Desk Setup', views: '231K', time: '3 weeks ago', thumb: 'https://picsum.photos/200/300?random=3' },
    { id: 4, title: 'Hiking Vlog', views: '67K', time: '1 month ago', thumb: 'https://picsum.photos/200/300?random=4' },
  ];

  return (
    <div className="max-w-[600px] mx-auto bg-white min-h-screen pb-24">
      <div className="p-4 flex items-center gap-2 border-b sticky top-0 bg-white z-20">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-gray-100">←</button>
        <h1 className="font-bold text-lg">Profile</h1>
      </div>

      <div className="p-5 flex gap-5 items-center">
        <img src="https://i.pravatar.cc/150?img=12" className="w-24 h-24 rounded-full border-4 border-white shadow-lg" />
        <div>
          <h1 className="text-2xl font-extrabold">Sakib Islam</h1>
          <p className="text-gray-500">@sakib.islam • Rangpur, BD</p>
          <button className="mt-2 px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm font-bold">Edit Profile</button>
        </div>
      </div>

      {/* YOUR WANTED DESIGN: Like Friend Follower Subscriber */}
      <div className="grid grid-cols-4 text-center py-5 border-y bg-gray-50/50">
        {stats.map(s => (
          <div key={s.label} className="border-r last:border-0">
            <p className="font-black text-[22px]">{s.value}</p>
            <p className="text-[13px] text-gray-500 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="p-4 flex justify-between items-center">
        <h2 className="font-black text-xl">নিজের ভিডিও</h2>
        <button className="text-blue-600 text-sm font-bold">See all ›</button>
      </div>

      {/* YOUR WANTED DESIGN: Feed Short Watch Story */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold border whitespace-nowrap transition ${activeTab === t.id? 'bg-black text-white border-black' : 'bg-gray-100 border-gray-100 text-gray-700'}`}>
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 p-4">
        {videos.map(v => (
          <div key={v.id} className="rounded-2xl overflow-hidden bg-gray-100">
            <div className="relative">
              <img src={v.thumb} className="w-full aspect-[4/3] object-cover" />
              <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] px-2 py-0.5 rounded">8:24</span>
            </div>
            <div className="p-2.5">
              <p className="font-bold text-[13px] line-clamp-2">{v.title}</p>
              <p className="text-[11px] text-gray-500 mt-1">{v.views} views • {v.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- MAIN APP ---
export default function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('onefeed_user');
    if (user) setIsLoggedIn(true);
  }, []);

  if (showProfilePage) {
    return <ProfilePage onBack={() => setShowProfilePage(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-black">
      <TopBar
        onProfileClick={() => setShowProfilePage(true)}
        onSearchClick={() => setShowSearch(true)}
        onNotificationClick={() => setShowNotifications(true)}
        onChatClick={() => setShowChat(true)}
        onWalletClick={() => setShowWallet(true)}
        onLoginClick={() => setShowLogin(true)}
        onSettingsClick={() => setShowSettings(true)}
        isLoggedIn={isLoggedIn}
      />

      <div className="max-w-[1400px] mx-auto flex">
        <div className="hidden lg:block w-[280px] sticky top-0 h-screen p-3">
          <LeftSidebar activeTab={activeTab} setActiveTab={setActiveTab} onProfileClick={() => setShowProfilePage(true)} />
        </div>

        <div className="flex-1 max-w-[680px] mx-auto w-full">
          <StoriesBar />

          <div className="bg-white mx-2 lg:mx-0 mt-3 rounded-2xl p-2 flex gap-2 sticky top-[56px] z-10 shadow-sm">
            {[
              { id: 'feed', label: 'ফিড', icon: '🎞️' },
              { id: 'short', label: 'সর্ট', icon: '📱' },
              { id: 'watch', label: 'ওয়াচ', icon: '🎬' },
              { id: 'story', label: 'স্টরি', icon: '✨' },
            ].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm ${activeTab === t.id? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <div className="p-2 lg:p-0 lg:mt-4 space-y-4 pb-24">
            {activeTab === 'feed' && (
              <>
                <div className="bg-white rounded-2xl p-4 flex gap-3">
                  <img src="https://i.pravatar.cc/100?img=12" className="w-10 h-10 rounded-full" />
                  <button onClick={() => setShowCreatePost(true)} className="flex-1 bg-gray-100 rounded-full text-left px-4 text-gray-500">What's on your mind, Sakib?</button>
                </div>
                <FeedCard />
                <FeedCard />
              </>
            )}
            {activeTab === 'short' && <ShortsCard />}
            {activeTab === 'watch' && <WatchCard />}
            {activeTab === 'story' && <div className="bg-white rounded-2xl p-10 text-center">Story Feed Coming Soon ✨</div>}
            {activeTab === 'chat' && <ChatCard />}
          </div>
        </div>

        <div className="hidden xl:block w-[320px] sticky top-0 h-screen p-3">
          <RightSidebar />
        </div>
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} onProfileClick={() => setShowProfilePage(true)} onCreatePost={() => setShowCreatePost(true)} />

      {showCreatePost && <CreatePostModal onClose={() => setShowCreatePost(false)} />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={() => setIsLoggedIn(true)} />}
      {showNotifications && <NotificationModal onClose={() => setShowNotifications(false)} />}
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showWallet && <WalletModal onClose={() => setShowWallet(false)} />}
    </div>
  );
      }
