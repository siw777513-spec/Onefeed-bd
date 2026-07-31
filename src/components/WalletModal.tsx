import React, { useState } from 'react';
import {
  Coins,
  X,
  CreditCard,
  Zap,
  History,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Transaction } from '../types';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  coinBalance: number;
  transactions: Transaction[];
  onBuyCoins: (coinAmount: number, priceDollars: number, paymentMethod: string) => void;
}

const COIN_PACKAGES = [
  { coins: 100, price: 1.0, bonus: '0%', popular: false },
  { coins: 500, price: 5.0, bonus: '+10% Extra', popular: true },
  { coins: 1000, price: 10.0, bonus: '+25% Extra', popular: false },
  { coins: 5000, price: 45.0, bonus: '+35% Super Value', popular: false },
];

const PAYMENT_METHODS = [
  { id: 'bkash', name: 'bKash', icon: '📱', color: 'from-pink-600 to-rose-700' },
  { id: 'nagad', name: 'Nagad', icon: '📲', color: 'from-orange-600 to-amber-700' },
  { id: 'card', name: 'Credit/Debit Card', icon: '💳', color: 'from-blue-600 to-indigo-700' },
  { id: 'paypal', name: 'PayPal', icon: '🌐', color: 'from-cyan-600 to-blue-700' },
];

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  coinBalance,
  transactions,
  onBuyCoins,
}) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'history'>('buy');
  const [selectedPkg, setSelectedPkg] = useState(COIN_PACKAGES[1]);
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      onBuyCoins(selectedPkg.coins, selectedPkg.price, selectedPayment);
      setSuccessMsg(true);

      setTimeout(() => {
        setSuccessMsg(false);
      }, 2000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#181124] via-[#0F0B18] to-[#0A0711] rounded-2xl border border-amber-500/30 shadow-2xl p-4 text-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Coins className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">OneFeed Wallet & Coins</h3>
              <p className="text-[10px] text-slate-400">Buy coins to gift creators & unlock paid posts</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Display Banner */}
        <div className="my-3 p-3.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-purple-600/20 to-pink-500/20 border border-amber-500/30 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Coin Balance</span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="text-xl">🪙</span>
              <span className="text-2xl font-black text-amber-300 font-mono">{coinBalance.toLocaleString()}</span>
              <span className="text-xs text-slate-400">Coins</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-0.5">
              <ShieldCheck className="w-3 h-3" /> Secure Wallet
            </span>
            <span className="text-[9px] text-slate-400">Instant delivery</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-3 bg-black/40 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('buy')}
            className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'buy' ? 'bg-amber-500 text-black shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Re-fill Coins</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'history' ? 'bg-amber-500 text-black shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
          {activeTab === 'buy' ? (
            <form onSubmit={handlePurchase} className="space-y-3">
              {/* Packages */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Select Coin Package:</label>
                <div className="grid grid-cols-2 gap-2">
                  {COIN_PACKAGES.map((pkg, idx) => {
                    const isSelected = selectedPkg.coins === pkg.coins;
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setSelectedPkg(pkg)}
                        className={`relative p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50'
                            : 'bg-[#140D1E] border-white/10 hover:border-white/20'
                        }`}
                      >
                        {pkg.popular && (
                          <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[8px] font-black uppercase tracking-wider">
                            Most Popular
                          </span>
                        )}
                        <div className="flex items-center space-x-1.5">
                          <span className="text-base">🪙</span>
                          <span className="font-black text-sm text-white font-mono">{pkg.coins}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-bold text-amber-300">${pkg.price.toFixed(2)}</span>
                          <span className="text-[9px] text-emerald-400 font-bold">{pkg.bonus}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Choose Payment Gateway:</label>
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map((pm) => {
                    const isSel = selectedPayment === pm.id;
                    return (
                      <button
                        type="button"
                        key={pm.id}
                        onClick={() => setSelectedPayment(pm.id)}
                        className={`p-2.5 rounded-xl border flex items-center space-x-2 transition-all ${
                          isSel
                            ? 'bg-white/15 border-amber-400 text-white font-bold'
                            : 'bg-[#120B1A] border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="text-base">{pm.icon}</span>
                        <span className="text-xs font-semibold">{pm.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Purchase CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <span className="animate-pulse">Processing Payment...</span>
                ) : successMsg ? (
                  <span className="flex items-center gap-1.5 text-emerald-900">
                    <CheckCircle2 className="w-4 h-4" /> Added {selectedPkg.coins} Coins!
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-black" />
                    <span>Pay ${selectedPkg.price.toFixed(2)} & Get {selectedPkg.coins} Coins</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* History Tab */
            <div className="space-y-2">
              {transactions.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No transaction history yet.
                </div>
              ) : (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-2.5 rounded-xl bg-[#140C1E] border border-white/10 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-white">{tx.title}</p>
                      <p className="text-[9px] text-slate-400">{tx.timestamp}</p>
                    </div>

                    <div className="text-right font-mono">
                      {tx.amountCoins && (
                        <p className={`text-xs font-bold ${tx.amountCoins > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {tx.amountCoins > 0 ? `+${tx.amountCoins}` : tx.amountCoins} Coins
                        </p>
                      )}
                      {tx.amountDollars && (
                        <p className="text-[10px] text-amber-300 font-bold">${tx.amountDollars.toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
