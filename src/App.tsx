import { useState, useEffect } from 'react';
import ProfilePage from './components/ProfilePage';

// Simple TopBar - তোমার আগের TopBar এর Error এড়াতে
function SimpleTopBar({ onProfileClick }: any) {
  return (
    <div className="bg-white p-3 flex justify-between items-center border-b sticky top-0 z-20">
      <h1 className="font-black text-xl text-blue-600">OneFeedBD</h1>
      <img onClick={onProfileClick} src="https://i.pravatar.cc/100?img=12" className="w-9 h-9 rounded-full cursor-pointer" />
    </div>
  );
}

function SimpleBottomNav({ activeTab, setActiveTab, onProfileClick }: any) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2">
      <button onClick={() => setActiveTab('feed')} className={activeTab==='feed'?'text-blue-600 font-bold':'text-gray-500'}>🏠 ফিড</button>
      <button onClick={() => setActiveTab('short')} className={activeTab==='short'?'text-blue-600 font-bold':'text-gray-500'}>📱 সর্ট</button>
      <button onClick={() => setActiveTab('watch')} className={activeTab==='watch'?'text-blue-600 font-bold':'text-gray-500'}>🎬 ওয়াচ</button>
      <button onClick={onProfileClick} className="text-gray-500">👤 প্রোফাইল</button>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [showProfilePage, setShowProfilePage] = useState(false);

  if (showProfilePage) {
    return <ProfilePage onBack={() => setShowProfilePage(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] pb-20">
      <SimpleTopBar onProfileClick={() => setShowProfilePage(true)} />

      <div className="max-w-[600px] mx-auto">
        <div className="bg-white m-2 rounded-2xl p-2 flex gap-2">
          {[
            { id: 'feed', label: 'ফিড', icon: '🎞️' },
            { id: 'short', label: 'সর্ট', icon: '🎞️' },
            { id: 'watch', label: 'ওয়াচ', icon: '🎬' },
            { id: 'story', label: 'স্টরি', icon: '🎞️' },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm ${activeTab === t.id? 'bg-black text-white' : 'bg-gray-100'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div className="p-2 space-y-3">
          <div className="bg-white rounded-2xl p-4">Welcome to OneFeedBD! Video Feed Here</div>
          <div className="bg-white rounded-2xl p-4">Post 2</div>
        </div>
      </div>

      <SimpleBottomNav activeTab={activeTab} setActiveTab={setActiveTab} onProfileClick={() => setShowProfilePage(true)} />
    </div>
  );
}
