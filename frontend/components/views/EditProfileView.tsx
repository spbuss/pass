
import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { User } from '../../types';

interface EditProfileViewProps {
  userData: User & { interests?: string[] };
  onSave: (data: User & { interests?: string[] }) => void;
  onCancel: () => void;
}

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

export const EditProfileView: React.FC<EditProfileViewProps> = ({ userData, onSave, onCancel }) => {
  const [tempData, setTempData] = useState({ ...userData });

  return (
    <div className="min-h-screen bg-white pb-32">
      <header className="flex items-center justify-between px-4 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
        <button onClick={onCancel} className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-bold text-slate-900">Edit Profile</h1>
        <button onClick={() => onSave(tempData)} className="text-indigo-600 font-bold px-4 py-2 hover:bg-indigo-50 rounded-xl transition-all">
          Save
        </button>
      </header>
      <div className="p-6">
        <div className="flex flex-col items-center mb-10">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border-4 border-white shadow-xl">
              <span className="text-3xl font-black text-slate-400 tracking-tighter">{getInitials(tempData.name)}</span>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Name</label>
            <input 
              type="text" 
              value={tempData.name} 
              onChange={e => setTempData({...tempData, name: e.target.value})}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Username</label>
            <input 
              type="text" 
              value={tempData.username} 
              onChange={e => setTempData({...tempData, username: e.target.value})}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Bio</label>
              <span className={`text-[10px] font-bold ${tempData.bio?.length && tempData.bio.length > 120 ? 'text-rose-500' : 'text-slate-300'}`}>
                {tempData.bio?.length || 0}/120
              </span>
            </div>
            <textarea 
              rows={4}
              maxLength={120}
              value={tempData.bio || ''} 
              onChange={e => setTempData({...tempData, bio: e.target.value})}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none"
            />
          </div>
          <div>
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Link</label>
            <input 
              type="url" 
              placeholder="https://website.com"
              value={tempData.link || ''} 
              onChange={e => setTempData({...tempData, link: e.target.value})}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
