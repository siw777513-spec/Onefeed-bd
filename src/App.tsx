import React, { useState } from 'react';
import { TopBar } from './components/TopBar';
import { WalletModal } from './components/WalletModal';
import { PostDetailModal } from './components/PostDetailModal';
import { CreatePostModal } from './components/CreatePostModal';

// Demo Data
const demoUser = { name: 'Sakib', handle: '@sakib', avatar: 'https://i.pravatar.cc/150?u=sakib' };

export default function App() {
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPostDetailOpen, setIsPostDetailOpen] = useState(false);
  const [coinBalance, setCoinBalance] = useState(1250);
  const [transactions, setTransactions] = useState<any[]>([
    { id: '1', type: 'gift', title: 'Gift from @rahim', from: '@rahim', amountCoins: 70, timestamp: '2 min ago' },
    { id: '2', type: 'tip', title: 'Tip from @karim', from: '@karim', amountCoins: 90, timestamp: '1 hour ago' },
    { id: '3', type: 'subscribe', title: 'New Subscriber @nila', from: '@nila', amountCoins: 240, timestamp: 'Today' },
  ]);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const handleBuyCoins = (coins: number) => {
    setCoinBalance(prev => prev + coins);
    setTransactions(prev => [{ id: Date.now().toString(), type: 'buy', title: `Bought ${coins} Coins`, amountCoins: coins, timestamp: 'Just now' },...prev]);
    alert(`${coins} Coins Added!`);
  };

  const handleGift = (amount: number) => {
    if (coinBalance < amount) { alert('Not enough coins'); setIsWalletOpen(true); return; }
    setCoinBalance(prev => prev - amount);
    const income = Math.floor(amount * 0.7);
    // Creator income - demo
    setTransactions(prev => [{ id: Date.now().toString(), type: 'gift', title: `Gift received`, from: 'Viewer', amountCoins: income, timestamp: 'Just now' },...prev]);
    alert(`You sent ${amount} Coins! Creator got ${income} Coins`);
  };

  return (
    <div className="min-h-screen bg-[#08080A] text-white">
      {/* TOP BAR WITH WALLET BUTTON */}
      <TopBar
        currentUser={demoUser}
        onOpenCreate={() => setIsCreateOpen(true)}
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenProfile={() => {}}
        onOpenNotifications={() => {}}
        onOpenSearch={() => {}}
      />

      {/* FEED - Demo Post */}
      <div className="max-w-md mx-auto p-4">
        <div className="bg-[#12121A] rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <img src={demoUser.avatar} className="w-8 h-8 rounded-full" />
            <span className="font-bold text-sm">@sakib</span>
          </div>
          <img src="https://picsum.photos/400/600" className="w-full rounded-xl aspect-[9/12] object-cover" />
          <div className="flex gap-2 mt-3">
            <button onClick={() => handleGift(100)} className="flex-1 bg-gradient-to-r from-amber-500 to-pink-500 text-black py-2 rounded-full font-bold text-xs">🎁 Send 100 Coins Gift</button>
            <button onClick={() => setIsWalletOpen(true)} className="px-4 bg-white/10 rounded-full text-xs">💰 Wallet</button>
          </div>
          <p className="text-[11px] text-white/50 mt-2">Click Gift -> Income will add to your Wallet!</p>
        </div>
      </div>

      {/* WALLET MODAL - YOUR INCOME */}
      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        coinBalance={coinBalance}
        transactions={transactions}
        onBuyCoins={handleBuyCoins}
      />

      {isCreateOpen && <CreatePostModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onCreatePost={() => {}} />}
    </div>
  );
}
