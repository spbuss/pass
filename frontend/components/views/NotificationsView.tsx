
import React from 'react';
import { ChevronLeft, Heart, UserPlus, CheckSquare, Check } from 'lucide-react';

interface NotificationsViewProps {
  onBack: () => void;
  followedUserIds: string[];
  handleToggleFollow: (userId: string) => void;
}

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

export const NotificationsView: React.FC<NotificationsViewProps> = ({ onBack, followedUserIds, handleToggleFollow }) => {
  const notifications = [
    { id: 1, user: 'Sarah Jenkins', userId: 'u2', action: 'liked your poll', meta: 'Is cereal a soup?', avatar: 'https://picsum.photos/seed/sarah/200', type: 'like', time: '2m' },
    { id: 3, user: 'Tom Black', userId: 'u5', action: 'started following you', meta: '', avatar: 'https://picsum.photos/seed/tom/200', type: 'follow', time: '1h' },
    { id: 4, user: 'Maya Chen', userId: 'u6', action: 'voted on your poll', meta: 'Should AI art be copyrighted?', avatar: 'https://picsum.photos/seed/maya/200', type: 'vote', time: '3h' },
    { id: 5, user: 'Sarah Jenkins', userId: 'u2', action: 'started following you', meta: '', avatar: 'https://picsum.photos/seed/sarah/200', type: 'follow', time: '5h' },
  ];

  return (
    <div className="pb-32 bg-white min-h-screen">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-4 py-4 border-b border-slate-100 flex items-center space-x-4">
        <button onClick={onBack} className="p-1 hover:bg-slate-50 rounded-full text-slate-500 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Activity</h1>
      </header>
      <div className="divide-y divide-slate-50">
        {notifications.map(n => (
          <div key={n.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-100 shadow-sm">
                   <span className="text-sm font-black text-slate-500 tracking-tighter">{getInitials(n.user)}</span>
                </div>
                <div className={`absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-white text-white ${
                  n.type === 'like' ? 'bg-rose-500' : 
                  n.type === 'follow' ? 'bg-emerald-500' : 'bg-blue-500'
                }`}>
                  {n.type === 'like' && <Heart size={8} fill="currentColor" />}
                  {n.type === 'follow' && <UserPlus size={8} />}
                  {n.type === 'vote' && <CheckSquare size={8} />}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-800 leading-tight">
                  <span className="font-bold text-slate-900">{n.user}</span> {n.action}
                  {n.meta && <span className="text-slate-500 italic block mt-0.5 truncate max-w-[200px]">"{n.meta}"</span>}
                </p>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{n.time} ago</span>
              </div>
            </div>
            {n.type === 'follow' && (
              <button 
                onClick={() => handleToggleFollow(n.userId)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg shadow-sm transition-all flex items-center space-x-1 ${
                  followedUserIds.includes(n.userId)
                    ? 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {followedUserIds.includes(n.userId) ? (
                  <span>Following</span>
                ) : (
                  <span>Follow</span>
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
