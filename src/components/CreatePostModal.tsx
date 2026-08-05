import React, { useState } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import { ColumnId, UserProfile } from '../types';
import { COLUMNS } from '../data/mockData';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const CLOUD_NAME = "bvvoprge";
const UPLOAD_PRESET = "onefeed_preset";

interface Props { isOpen: boolean; onClose: () => void; onSubmitPost: any; defaultColumn?: ColumnId; currentUser?: UserProfile; }

export const CreatePostModal: React.FC<Props> = ({ isOpen, onClose, defaultColumn='feed', currentUser }) => {
  const [column, setColumn] = useState<ColumnId>(defaultColumn);
  const [text, setText] = useState('');
  const [file, setFile] = useState<File|null>(null);
  const [preview, setPreview] = useState<string|null>(null);
  const [mediaType, setMediaType] = useState<'image'|'video'>('image');
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;

  const handleFile = (f: File) => {
    if (f.size/1024/1024 > 100) { alert('Max 100MB'); return; }
    setMediaType(f.type.startsWith('video')?'video':'image');
    setFile(f); setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() &&!file) { alert('Caption or file lagbe'); return; }
    setLoading(true);
    let finalUrl = "";
    let finalVideoUrl = null;

    if (file) {
      const form = new FormData();
      form.append('file', file);
      form.append('upload_preset', UPLOAD_PRESET);
      try {
        const uploadUrl = mediaType === 'video'
         ? `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`
          : `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
        const res = await fetch(uploadUrl, { method: 'POST', body: form });
        const data = await res.json();
        if(!data.secure_url) throw new Error(data.error?.message || 'Upload failed');
        finalUrl = data.secure_url;
        if(data.resource_type === 'video' || mediaType === 'video') finalVideoUrl = data.secure_url;
      } catch(err:any){
        alert('Upload Error: ' + err.message);
        setLoading(false);
        return;
      }
    } else {
      finalUrl = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80";
    }

    try {
      await addDoc(collection(db, "posts"), {
        text: text.trim() || 'Video post',
        image: finalUrl,
        videoUrl: finalVideoUrl,
        mediaType: finalVideoUrl? 'video' : 'image',
        column,
        userId: auth.currentUser?.uid,
        userName: currentUser?.name || auth.currentUser?.displayName || 'User',
        userAvatar: currentUser?.avatar,
        likes: [],
        timestamp: serverTimestamp()
      });
    } catch(err:any){
      alert('Firebase Error: ' + err.message);
      setLoading(false);
      return;
    }

    setLoading(false); setText(''); setFile(null); setPreview(null); onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85">
      <div className="w-full max-w-lg bg-[#12121A] rounded-3xl border border-white/10">
        <div className="flex justify-between p-4 border-b border-white/10"><h3 className="text-white font-bold">Create {column.toUpperCase()}</h3><button onClick={onClose}><X className="text-white w-5 h-5"/></button></div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div className="grid grid-cols-4 gap-1 bg-black p-1 rounded-2xl">{COLUMNS.filter(c=>c.id!=='chat').map(col=><button key={col.id} type="button" onClick={()=>setColumn(col.id)} className={`py-2 rounded-xl text-xs font-bold ${column===col.id?'bg-cyan-500 text-black':'text-slate-400'}`}>{col.name}</button>)}</div>
          <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Caption..." rows={3} className="w-full bg-black border border-white/10 rounded-2xl p-3 text-xs text-white"/>
          {preview? <div className="relative rounded-2xl overflow-hidden bg-black">{mediaType==='video'?<video src={preview} controls/>:<img src={preview}/>}<button type="button" onClick={()=>{setPreview(null);setFile(null);}} className="absolute top-2 right-2 bg-rose-500 p-1 rounded-full"><Trash2 className="w-4 h-4 text-white"/></button></div> :
            <label className="block p-6 rounded-2xl border-2 border-dashed border-white/20 bg-black text-center cursor-pointer"><input type="file" accept="image/*,video/*" hidden onChange={e=>e.target.files&&handleFile(e.target.files[0])}/><Upload className="w-6 h-6 text-cyan-400 mx-auto"/><p className="text-xs text-white mt-2">Upload Photo/Video</p></label>}
          <button disabled={loading} className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-pink-500 text-white font-bold text-xs">{loading?'Uploading...':'Publish'}</button>
        </form>
      </div>
    </div>
  );
};
