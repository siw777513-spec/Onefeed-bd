import React, { useState } from 'react';
import { Smartphone, Maximize2, Battery, Wifi, Signal } from 'lucide-react';

interface PhoneContainerProps {
  children: React.ReactNode;
}

export const PhoneContainer: React.FC<PhoneContainerProps> = ({ children }) => {
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  return (
    <div className="w-screen h-screen bg-[#050508] text-slate-100 flex flex-col items-center justify-center overflow-hidden font-sans select-none">
      {/* Top Desktop Controls Bar */}
      <div className="w-full bg-[#0A0A0F] border-b border-white/10 px-4 py-2 flex items-center justify-between z-40 shrink-0 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold text-white tracking-wide">OneFeed App Preview</span>
          <span className="text-[10px] text-slate-500 hidden sm:inline">
            • 5 Vertical Side-by-Side Columns • Dark #0A0A0F
          </span>
        </div>

        <button
          onClick={() => setIsPhoneFrame(!isPhoneFrame)}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px] transition-all"
        >
          {isPhoneFrame ? (
            <>
              <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full Screen</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Phone Frame</span>
            </>
          )}
        </button>
      </div>

      {/* Frame Container */}
      <div
        className={`flex-1 w-full flex items-center justify-center p-0 ${
          isPhoneFrame ? 'sm:p-4' : ''
        } overflow-hidden`}
      >
        <div
          className={`relative w-full h-full flex flex-col bg-[#0A0A0F] overflow-hidden transition-all duration-300 ${
            isPhoneFrame
              ? 'max-w-[430px] max-h-[880px] rounded-[36px] sm:border-[8px] border-[#1F1F2C] shadow-2xl shadow-cyan-950/40 ring-1 ring-white/10'
              : 'max-w-none max-h-none rounded-none border-none'
          }`}
        >
          {/* Mobile Status Bar (If in phone frame) */}
          {isPhoneFrame && (
            <div className="w-full bg-[#0A0A0F] px-5 pt-2 pb-1 flex items-center justify-between text-[11px] font-semibold text-slate-300 select-none shrink-0 z-30">
              <span>9:41</span>
              {/* Dynamic Notch */}
              <div className="w-24 h-4 bg-black rounded-full border border-white/10 flex items-center justify-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-slate-800" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
              </div>
              <div className="flex items-center space-x-1.5 text-slate-400">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>
          )}

          {/* App Content */}
          <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
