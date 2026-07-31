import React, { useState, useRef } from 'react';
import {
  X,
  Image as ImageIcon,
  Film,
  Sparkles,
  Send,
  Upload,
  Camera,
  CheckCircle2,
  AlertCircle,
  FileVideo,
  Play,
  Trash2,
} from 'lucide-react';
import { ColumnId, SocialItem, UserProfile } from '../types';
import { COLUMNS } from '../data/mockData';
import { saveMediaToIDB } from '../utils/idbStorage';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPost: (newItem: SocialItem) => void;
  defaultColumn?: ColumnId;
  currentUser?: UserProfile;
}

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSubmitPost,
  defaultColumn = 'feed',
  currentUser,
}) => {
  const [column, setColumn] = useState<ColumnId>(defaultColumn);
  const [mediaFilter, setMediaFilter] = useState<'both' | 'photo' | 'video'>('both');
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[0]);

  // Uploaded media state
  const [uploadedBlobUrl, setUploadedBlobUrl] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [fileSizeMb, setFileSizeMb] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<string>('00:30');
  const [hashtags, setHashtags] = useState('#OneFeed #Trending');

  // Drag and Drop & Upload UI
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);

  if (!isOpen) return null;

  const handleFileProcess = async (file: File) => {
    setErrorMessage(null);
    const sizeInMb = file.size / (1024 * 1024);

    // 100MB Max limit check
    if (sizeInMb > 100) {
      setErrorMessage(`File size (${sizeInMb.toFixed(1)}MB) exceeds maximum 100MB limit.`);
      return;
    }

    const isVideo = file.type.startsWith('video') || file.name.match(/\.(mp4|webm|mov|mkv)$/i) !== null;
    setMediaType(isVideo ? 'video' : 'image');
    setFileSizeMb(Number(sizeInMb.toFixed(2)));
    setUploadedFile(file);

    const objectUrl = URL.createObjectURL(file);
    setUploadedBlobUrl(objectUrl);

    if (isVideo) {
      // Get duration from video metadata
      const tempVideo = document.createElement('video');
      tempVideo.src = objectUrl;
      tempVideo.onloadedmetadata = () => {
        const secs = Math.floor(tempVideo.duration);
        const mins = Math.floor(secs / 60);
        const remSecs = secs % 60;
        const durStr = `${mins < 10 ? '0' : ''}${mins}:${remSecs < 10 ? '0' : ''}${remSecs}`;
        setVideoDuration(durStr);
      };
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleRemoveMedia = () => {
    if (uploadedBlobUrl) {
      URL.revokeObjectURL(uploadedBlobUrl);
    }
    setUploadedBlobUrl(null);
    setUploadedFile(null);
    setFileSizeMb(0);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsProcessing(true);
    setUploadProgress(10);

    let savedMediaId: string | undefined;
    let finalMediaUrl = selectedImage;

    if (uploadedFile) {
      if (fileSizeMb > 50) {
        setStatusMessage('Compressing & optimizing video for high-speed streaming...');
      } else {
        setStatusMessage('Saving media to IndexedDB storage...');
      }

      // Simulate progress bar steps
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev >= 85 ? prev : prev + 15));
      }, 150);

      try {
        const idbResult = await saveMediaToIDB(uploadedFile, videoDuration);
        savedMediaId = idbResult.id;
        finalMediaUrl = idbResult.url;
      } catch (err) {
        console.error('IDB storage error:', err);
        finalMediaUrl = uploadedBlobUrl || selectedImage;
      }

      clearInterval(progressInterval);
      setUploadProgress(100);
    } else {
      setUploadProgress(100);
    }

    setTimeout(() => {
      setIsProcessing(false);

      const parsedTags = hashtags
        .split(' ')
        .filter((t) => t.trim().length > 0)
        .map((t) => (t.startsWith('#') ? t : `#${t}`));

      const newItem: SocialItem = {
        id: `${column}-${Date.now()}`,
        column: column,
        author: {
          name: currentUser?.name || 'Alex Vance (Owner)',
          handle: currentUser?.handle || '@alex_vance',
          avatar:
            currentUser?.avatar ||
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          verified: true,
          online: true,
        },
        image: finalMediaUrl,
        mediaType: mediaType,
        videoUrl: mediaType === 'video' ? finalMediaUrl : undefined,
        mediaId: savedMediaId,
        fileSizeMb: fileSizeMb > 0 ? fileSizeMb : undefined,
        text: text.trim(),
        likeCount: 1,
        isLiked: true,
        commentCount: 0,
        shareCount: 0,
        timestamp: 'Just now',
        tags: parsedTags.length > 0 ? parsedTags : ['#OneFeed'],
        soundTrack: column === 'shorts' ? '🎵 Original Audio - OneFeed' : undefined,
        duration: mediaType === 'video' ? videoDuration : column === 'watch' ? '04:12' : undefined,
        views: column === 'watch' ? '1 view' : undefined,
        comments: [],
      };

      onSubmitPost(newItem);
      setText('');
      setUploadedBlobUrl(null);
      setUploadedFile(null);
      setUploadProgress(0);
      setStatusMessage('');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#12121A] rounded-3xl border border-white/10 shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0A0A0F]/90">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="font-extrabold text-base text-white">Create New Post</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto custom-scrollbar">
          {/* Target Column Selector */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">
              Target Column
            </label>
            <div className="grid grid-cols-4 gap-1.5 bg-[#0A0A0F] p-1.5 rounded-2xl border border-white/10">
              {COLUMNS.filter((c) => c.id !== 'chat').map((col) => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setColumn(col.id)}
                  className={`flex flex-col items-center py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                    column === col.id
                      ? 'bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 text-white border border-cyan-400/60 shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span style={{ color: col.color }}>{col.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Media Type Filter Toggle (Photo | Video | Both) */}
          <div className="flex items-center justify-between bg-[#0A0A0F] px-3 py-2 rounded-2xl border border-white/10 text-xs">
            <span className="text-slate-400 font-bold">Media Filter:</span>
            <div className="flex space-x-1">
              {(['both', 'photo', 'video'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setMediaFilter(mode)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-extrabold uppercase transition-all ${
                    mediaFilter === mode
                      ? 'bg-cyan-500 text-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Caption Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Caption / Post Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Write a story or description for ${column.toUpperCase()}...`}
              rows={3}
              required
              className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
            />
          </div>

          {/* Hashtags Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Hashtags & Tags
            </label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#OneFeed #Viral #Tech"
              className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-cyan-300 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Drag & Drop Upload Zone */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Media Asset (Max 100MB)
            </label>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-2 p-3 rounded-2xl bg-rose-500/20 border border-rose-400 text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Custom File Preview or Drop Area */}
            {uploadedBlobUrl ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-400/80 bg-black/90 shadow-xl group">
                {mediaType === 'video' ? (
                  <div className="relative aspect-video bg-black flex items-center justify-center">
                    <video
                      ref={videoPreviewRef}
                      src={uploadedBlobUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="relative aspect-[16/9] bg-black flex items-center justify-center">
                    <img
                      src={uploadedBlobUrl}
                      alt="Uploaded Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Media Metadata Info Tag */}
                <div className="p-3 bg-[#0A0A0F] border-t border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 min-w-0">
                    {mediaType === 'video' ? (
                      <FileVideo className="w-4 h-4 text-cyan-400 shrink-0" />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-purple-400 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate max-w-[200px]">
                        {uploadedFile?.name || 'Selected Media'}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {fileSizeMb} MB {mediaType === 'video' ? `• ${videoDuration}` : ''}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveMedia}
                    className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/30 transition-all flex items-center gap-1 font-bold text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Drag & Drop Upload Zone */
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`p-6 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
                    : 'border-white/20 bg-[#0A0A0F] hover:border-cyan-400/50 hover:bg-white/5'
                }`}
              >
                <input
                  type="file"
                  accept={
                    mediaFilter === 'photo'
                      ? 'image/*'
                      : mediaFilter === 'video'
                      ? 'video/*'
                      : 'image/*,video/*'
                  }
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="media-file-input"
                />
                <label htmlFor="media-file-input" className="cursor-pointer block">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 flex items-center justify-center mx-auto mb-2">
                    <Upload className="w-6 h-6 animate-bounce" />
                  </div>
                  <p className="text-xs font-bold text-white">
                    Drag & Drop video (MP4, WebM, MOV) or photo here
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">
                    Supports up to 100MB per file • Auto IndexedDB storage
                  </p>
                  <span className="inline-block mt-3 px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-300 text-xs font-bold border border-cyan-400/30">
                    Browse Files from Device
                  </span>
                </label>
              </div>
            )}

            {/* Visual Presets fallback if no upload */}
            {!uploadedBlobUrl && (
              <div className="mt-3">
                <p className="text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Or select preset image:
                </p>
                <div className="grid grid-cols-5 gap-1.5">
                  {PRESET_IMAGES.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                        selectedImage === img
                          ? 'border-cyan-400 scale-95 shadow-md shadow-cyan-400/30'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt="Preset"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {selectedImage === img && (
                        <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 fill-cyan-400/40" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Processing / Upload Progress Bar */}
          {isProcessing && (
            <div className="space-y-1.5 p-3 rounded-2xl bg-cyan-500/10 border border-cyan-400/30">
              <div className="flex justify-between text-[11px] text-cyan-300 font-bold">
                <span>{statusMessage || 'Processing media post...'}</span>
                <span className="font-mono">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/80 overflow-hidden border border-cyan-400/30">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-rose-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#00F2FE] via-[#8A2BE2] to-[#FF007A] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-[#FF007A]/25 hover:opacity-95 active:scale-98 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>Publish to {column.toUpperCase()}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
