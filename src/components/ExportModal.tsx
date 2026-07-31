import React, { useState } from 'react';
import { X, Download, FileCode, Archive, Sparkles, Check, Globe, Code2 } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [downloadingHtml, setDownloadingHtml] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleDownloadHtml = () => {
    setDownloadingHtml(true);
    const link = document.createElement('a');
    link.href = '/onefeed-standalone.html';
    link.download = 'onefeed-standalone.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadingHtml(false), 1000);
  };

  const handleDownloadZip = () => {
    setDownloadingZip(true);
    const link = document.createElement('a');
    link.href = '/onefeed-source-code.zip';
    link.download = 'onefeed-source-code.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadingZip(false), 1000);
  };

  const handleCopyHtmlLink = () => {
    const fullUrl = `${window.location.origin}/onefeed-standalone.html`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#0F0F16] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-cyan-950/40 via-purple-950/40 to-pink-950/40">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base tracking-tight flex items-center gap-1.5">
                Export OneFeed App <Sparkles className="w-4 h-4 text-cyan-400" />
              </h3>
              <p className="text-xs text-slate-400">Standalone Single HTML & Full Source Code ZIP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4">
          {/* Option 1: Standalone Single File HTML */}
          <div className="p-3.5 rounded-xl bg-[#08121A] border border-cyan-500/40 space-y-2.5 hover:border-cyan-400 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wide">Standalone index.html</h4>
                  <p className="text-[11px] text-cyan-200/80">
                    Single HTML file with all CSS, JS & assets bundled inline (~700 KB). Host anywhere!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <button
                onClick={handleDownloadHtml}
                className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-cyan-500/20 active:scale-98 transition-all"
              >
                {downloadingHtml ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                <span>{downloadingHtml ? 'Downloading...' : 'Download index.html'}</span>
              </button>

              <button
                onClick={handleCopyHtmlLink}
                className="py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs flex items-center space-x-1 transition-all"
                title="Copy Direct Link"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Globe className="w-3.5 h-3.5 text-cyan-300" />}
                <span className="text-[11px]">{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Option 2: Full Source Code ZIP */}
          <div className="p-3.5 rounded-xl bg-[#140A18] border border-purple-500/40 space-y-2.5 hover:border-purple-400 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
                  <Archive className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wide">Source Code ZIP Archive</h4>
                  <p className="text-[11px] text-purple-200/80">
                    Full React + TypeScript + Vite project files (.zip). Ready for GitHub or local dev!
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadZip}
              className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-90 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-purple-500/20 active:scale-98 transition-all"
            >
              {downloadingZip ? <Check className="w-4 h-4 text-black" /> : <Download className="w-4 h-4 text-white" />}
              <span>{downloadingZip ? 'Downloading...' : 'Download onefeed-source-code.zip'}</span>
            </button>
          </div>

          {/* Instructions Box */}
          <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-[11px] text-slate-400 space-y-1">
            <p className="font-bold text-slate-200 flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" /> Standalone Usage Note:
            </p>
            <p>
              The standalone <code className="text-cyan-300 font-mono">index.html</code> runs directly in any modern web browser without requiring Node.js or a build server. Simply double click to open or upload to Netlify, Vercel, GitHub Pages, or any static host!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
