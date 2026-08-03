import React, { useState } from 'react';
import { X, Sparkles, Send, Upload, CheckCircle2, AlertCircle, FileVideo, Trash2, Image as ImageIcon } from 'lucide-react';
import { ColumnId, SocialItem, UserProfile } from '../types';
import { COLUMNS } from '../data/mockData';
import { db, storage, auth } from '../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface CreatePostModalProps {
  isOpen: boolean; onClose: () => void; onSubmitPost: (newItem: SocialItem) => void;
  defaultColumn?: ColumnId; currentUser?: UserProfile;
}
const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmitPost, defaultColumn='feed', currentUser }) => {
  const [column, setColumn] = useState<ColumnId>(defaultColumn);
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[0]);
  const [uploadedBlobUrl, setUploadedBlobUrl] = useState<string|null>(null);
  const [uploadedFile, setUploadedFile] = useState<File|null>(null);
  const [mediaType, setMediaType] = useState<'image'|'video'>('image');
  const [fileSizeMb, setFileSizeMb] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string|null>(null);
  const [hashtags, setHashtags] = useState('#OneFeed #Trending');

  if (!isOpen) return null;

  const handleFileProcess = (file: File) => {
    if (file.size / 1024 / 1024 > 100) { setErrorMessage('Max 100MB!'); return; }
    setMediaType(file.type.startsWith('video')? 'video' : 'image');
    setFileSizeMb(Number((file.size/1024/1024).toFixed(2)));
    setUploadedFile(file);
    setUploadedBlobUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!text.trim()) return;
    setIsProcessing(true); setUploadProgress(5);
    let finalMediaUrl = selectedImage;

    try {
      if (uploadedFile) {
        const storageRef = ref(storage, `posts/${auth.currentUser?.uid}_${Date.now()}_${uploadedFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, uploadedFile);
        finalMediaUrl = await new Promise<string>((resolve, reject) => {
          uploadTask.on('state_changed',
            (snap) => setUploadProgress(Math.round((snap.bytesTransferred/snap.totalBytes)*100)),
            (err) => reject(err),
            async () => resolve(await getDownloadURL(uploadTask.snapshot.ref))
          );
        });
      }

      // Save to Firestore directly
      await addDoc(collection(db, "posts"), {
        text: text.trim(),
        image: finalMediaUrl,
        videoUrl: mediaType==='video'?finalMediaUrl:null,
        mediaType: mediaType,
        column: column,
        tags: hashtags.split(' ').filter(t=>t),
        userId: auth.currentUser?.uid,
        userName: currentUser?.name || auth.currentUser?.displayName || 'User',
        userAvatar: currentUser?.avatar || auth.currentUser?.photoURL,
        likes: [], timestamp: serverTimestamp()
      });

      setIsProcessing(false); setText(''); setUploadedFile(null); setUploadedBlobUrl(null); onClose();
    } catch(err:any){ setErrorMessage(err.message); setIsProcessing(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#12121A] rounded-3xl border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/10"><div className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-cyan-400"/><h3 className="font-bold text-white">Create Post</h3></div><button onClick={onClose}><X className="w-5 h-5 text-white"/></button></div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-4 gap-1 bg-black p-1 rounded-2xl">{COLUMNS.filter(c=>c.id!=='chat').map(col=><button key={col.id} type="button" onClick={()=>setColumn(col.id)} className={`py-2 rounded-xl text-xs font-bold ${column===col.id?'bg-cyan-500 text-black':'text-slate-400'}`}>{col.name}</button>)}</div>
          <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Write caption..." rows={3} required className="w-full bg-black border border-white/10 rounded-2xl p-3 text-xs text-white"/>
          <input value={hashtags} onChange={e=>setHashtags(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-cyan-300"/>
          {errorMessage && <div className="p-2 bg-rose-500/20 text-rose-300 text-xs rounded-xl">{errorMessage}</div>}
          {uploadedBlobUrl? <div className="relative rounded-2xl overflow-hidden bg-black">{mediaType==='video'?<video src={uploadedBlobUrl} controls className="w-full"/>:<img src={uploadedBlobUrl} className="w-full"/>}<button type="button" onClick={()=>{setUploadedBlobUrl(null);setUploadedFile(null);}} className="absolute top-2 right-2 bg-rose-500 p-1 rounded-full"><Trash2 className="w-4 h-4 text-white"/></button></div> :
            <label className="block p-6 rounded-2xl border-2 border-dashed border-white/20 bg-black text-center cursor-pointer"><input type="file" accept="image/*,video/*" hidden onChange={e=>e.target.files&&handleFileProcess(e.target.files[0])}/><Upload className="w-6 h-6 text-cyan-400 mx-auto"/><p className="text-xs text-white mt-2">Click to upload Photo/Video (Max 100MB)</p></label>}
          {isProcessing && <div className="w-full h-2 bg-black rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-cyan-400 to-pink-500" style={{width:`${uploadProgress}%`}}/></div>}
          <button disabled={isProcessing} className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-pink-500 text-white font-bold text-xs">{isProcessing?`Uploading ${uploadProgress}%`:'Publish'}</button>
        </form>
      </div>
    </div>
  );
};
