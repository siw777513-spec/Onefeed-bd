import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Heart,
  Film,
} from 'lucide-react';
import { SocialItem } from '../types';
import { getMediaUrlFromIDB } from '../utils/idbStorage';

interface VideoPlayerProps {
  item: SocialItem;
  onLikeToggle?: (id: string) => void;
  aspectRatio?: 'aspect-video' | 'aspect-[4/3]' | 'aspect-[9/16]' | 'aspect-square';
  className?: string;
  autoPlayInView?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  item,
  onLikeToggle,
  aspectRatio = 'aspect-video',
  className = '',
  autoPlayInView = true,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [resolvedSrc, setResolvedSrc] = useState<string | null>(
    item.videoUrl || (item.image && item.image.startsWith('data:video')? item.image : null)
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [doubleTapHeart, setDoubleTapHeart] = useState(false);
  const [lastTapTime, setLastTapTime] = useState(0);

  useEffect(() => {
    let isMounted = true;
    if (!resolvedSrc && item.mediaId) {
      getMediaUrlFromIDB(item.mediaId).then((url) => {
        if (isMounted && url) setResolvedSrc(url);
      });
    }
    return () => { isMounted = false; };
  }, [item.mediaId, resolvedSrc]);

  // Auto Play with SOUND
  useEffect(() => {
    if (!autoPlayInView ||!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!videoRef.current) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          videoRef.current.muted = false;
          videoRef.current.volume = 1;
          setIsMuted(false);
          videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
            // If browser blocks sound, try muted then show unmute button
            if(videoRef.current){
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().then(()=>setIsPlaying(true)).catch(()=>{});
            }
          });
        } else {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [autoPlayInView, resolvedSrc]);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.muted = isMuted;
      videoRef.current.volume = 1;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const newMuted =!isMuted;
    videoRef.current.muted = newMuted;
    videoRef.current.volume = 1;
    setIsMuted(newMuted);
    if(isPlaying){
      videoRef.current.play().catch(()=>{});
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      videoRef.current.volume = 1;
      videoRef.current.muted = isMuted;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (containerRef.current) {
      if (document.fullscreenElement) document.exitFullscreen();
      else containerRef.current.requestFullscreen();
    }
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    const now = Date.now();
    if (now - lastTapTime < 300) {
      if (!item.isLiked && onLikeToggle) onLikeToggle(item.id);
      setDoubleTapHeart(true);
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 }, colors: ['#FF007A', '#00F2FE', '#8A2BE2'] });
      setTimeout(() => setDoubleTapHeart(false), 800);
    } else {
      togglePlay(e);
    }
    setLastTapTime(now);
  };

  const formatTime = (timeInSec: number) => {
    if (isNaN(timeInSec) || timeInSec === 0) return '0:00';
    const mins = Math.floor(timeInSec / 60);
    const secs = Math.floor(timeInSec % 60);
    return `${mins}:${secs < 10? '0' : ''}${secs}`;
  };

  const videoSource =
    resolvedSrc ||
    item.videoUrl ||
    (item.image && (item.image.startsWith('http') || item.image.startsWith('blob:') || item.image.startsWith('data:video'))? item.image : 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-flying-cars-and-neon-lights-41551-large.mp4');

  return (
    <div ref={containerRef} onClick={handleDoubleTap} className={`relative w-full ${aspectRatio} rounded-xl overflow-hidden bg-black/90 group border border-white/10 select-none ${className}`}>
      <video
        ref={videoRef}
        src={videoSource}
        poster={item.posterImage || item.image}
        muted={isMuted}
        playsInline
        loop
        autoPlay
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        className="w-full h-full object-cover"
      />

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <button onClick={togglePlay} className="p-4 rounded-full bg-cyan-500/80 hover:bg-cyan-400 text-black shadow-xl">
            <Play className="w-8 h-8 fill-black translate-x-0.5" />
          </button>
        </div>
      )}

      {doubleTapHeart && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none z-30">
          <Heart className="w-20 h-20 text-[#FF007A] fill-[#FF007A] animate-ping" />
        </div>
      )}

      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-20">
        {item.fileSizeMb && (<span className="px-2 py-0.5 rounded-full bg-black/70 text-[9px] font-mono text-slate-300 border border-white/10">{item.fileSizeMb} MB</span>)}
        <span className="px-2 py-0.5 rounded-full bg-black/70 text-[9px] font-bold text-cyan-300 border border-cyan-400/30 flex items-center gap-1"><Film className="w-2.5 h-2.5" />{formatTime(duration)!== '0:00'? formatTime(duration) : item.duration || '0:30'}</span>
      </div>

      {/* AUTO SOUND BADGE */}
      <div className="absolute top-2.5 left-2.5 z-20">
        <button onClick={toggleMute} className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border backdrop-blur-md ${isMuted? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'}`}>
          {isMuted? <><VolumeX className="w-3 h-3" /> Tap for Sound</> : <><Volume2 className="w-3 h-3" /> Sound On</>}
        </button>
      </div>

      <div onClick={(e) => e.stopPropagation()} className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-1 z-20">
        <div className="flex items-center space-x-2 w-full">
          <span className="text-[9px] font-mono text-slate-300 min-w-[28px]">{formatTime(currentTime)}</span>
          <input type="range" min={0} max={duration || 100} value={currentTime} onChange={handleSeek} className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400" />
          <span className="text-[9px] font-mono text-slate-400 min-w-[28px]">{formatTime(duration)}</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2">
            <button onClick={togglePlay} className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white">{isPlaying? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}</button>
            <button onClick={toggleMute} className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white">{isMuted? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}</button>
          </div>
          <button onClick={toggleFullscreen} className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white"><Maximize2 className="w-3.5 h-3.5" /></button>
        </div>
      </div>
    </div>
  );
};
