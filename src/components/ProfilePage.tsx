import { useState } from 'react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('feed');
  
  const stats = [
    { label: 'লাইক', value: '12.3K' },
    { label: 'ফ্রেন্ড', value: '842' },
    { label: 'ফলোয়ার', value: '45.6K' },
    { label: 'সাবস্ক্রাইবার', value: '9.1K' },
  ];

  const tabs = [
    { id: 'feed', label: 'ফিড', icon: '🎞️' },
    { id: 'short', label: 'সর্ট', icon: '🎞️' },
    { id: 'watch', label: 'ওয়াচ', icon: '🎬' },
    { id: 'story', label: 'স্টরি', icon: '🎞️' },
  ];

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="p-4 flex items-center gap-4">
        <img src="https://i.pravatar.cc/100" className="w-20 h-20 rounded-full" />
        <div>
          <h1 className="text-xl font-bold">Sakib Islam</h1>
          <p className="text-gray-500">@sakib.islam</p>
        </div>
      </div>

      {/* Stats - তোমার চাওয়া ডিজাইন */}
      <div className="flex justify-around py-4 border-y text-center">
        {stats.map(s => (
          <div key={s.label}>
            <div className="font-bold text-lg">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Own Video Title */}
      <div className="p-4">
        <h2 className="font-bold text-lg">নিজের ভিডিও</h2>
      </div>

      {/* Tabs - Feed Short Watch Story */}
      <div className="flex gap-2 px-4 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1 px-4 py-2 rounded-full whitespace-nowrap ${
              activeTab === tab.id ? 'bg-black text-white' : 'bg-gray-100'
            }`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-2 gap-2 p-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
            🎬 Video {i}
          </div>
        ))}
      </div>
    </div>
  );
                                        }
