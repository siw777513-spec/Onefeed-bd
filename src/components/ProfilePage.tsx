export default function ProfilePage({ onBack }: { onBack?: () => void }) {
  return (
    <div className="max-w-[600px] mx-auto bg-white min-h-screen pb-24">
      {onBack && <div className="p-3 border-b"><button onClick={onBack} className="px-4 py-2 bg-gray-100 rounded-full">← Back</button></div>}
      <div className="p-5 flex gap-5 items-center">
        <img src="https://i.pravatar.cc/150?img=12" className="w-24 h-24 rounded-full" />
        <div><h1 className="text-2xl font-black">Sakib Islam</h1><p className="text-gray-500">@sakib.islam</p></div>
      </div>
      <div className="grid grid-cols-4 text-center py-5 border-y bg-gray-50">
        <div><p className="font-black text-xl">3.2K</p><p className="text-xs">লাইক</p></div>
        <div><p className="font-black text-xl">1.5K</p><p className="text-xs">ফ্রেন্ড</p></div>
        <div><p className="font-black text-xl">45K</p><p className="text-xs">ফলোয়ার</p></div>
        <div><p className="font-black text-xl">9.1K</p><p className="text-xs">সাবস্ক্রাইবার</p></div>
      </div>
      <div className="p-4 font-black text-lg">নিজের ভিডিও</div>
      <div className="flex gap-2 px-4">
        <button className="flex-1 py-3 rounded-xl bg-black text-white">🎞️ ফিড</button>
        <button className="flex-1 py-3 rounded-xl bg-gray-100">🎞️ সর্ট</button>
        <button className="flex-1 py-3 rounded-xl bg-gray-100">🎬 ওয়াচ</button>
        <button className="flex-1 py-3 rounded-xl bg-gray-100">🎞️ স্টরি</button>
      </div>
      <div className="grid grid-cols-2 gap-3 p-4">
        {[1,2,3,4].map(n=><div key={n} className="aspect-[9/16] bg-gray-200 rounded-2xl flex items-center justify-center">Video {n}</div>)}
      </div>
    </div>
  )
}
