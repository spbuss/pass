
import React, { useState } from 'react';
import { MessageSquare, Send, MoreHorizontal, Flag, Heart, Trash2, Copy, BarChart2, UserX } from 'lucide-react';
import { Question } from '../../types';

interface QuestionCardProps {
  question: Question;
  currentUserId: string;
  onVote: (id: string, vote: 'yes' | 'no') => void;
  onLike: (id: string) => void;
  onDeleteQuestion?: (id: string) => void;
  onOpenConversation?: () => void;
  isFollowingAuthor?: boolean;
  onToggleFollow?: () => void;
  onProfileClick?: (userId: string) => void;
}

const formatTimeAgo = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

export const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  currentUserId,
  onVote, 
  onLike,
  onDeleteQuestion,
  onOpenConversation,
  isFollowingAuthor,
  onToggleFollow,
  onProfileClick
}) => {
  const [showOptionsSheet, setShowOptionsSheet] = useState(false);
  const [isPollReported, setIsPollReported] = useState(false);
  
  const totalVotes = question.yesVotes + question.noVotes;
  const yesPercent = totalVotes > 0 ? Math.round((question.yesVotes / totalVotes) * 100) : 0;
  const noPercent = totalVotes > 0 ? Math.round((question.noVotes / totalVotes) * 100) : 0;

  const handleShare = async () => {
    // Generate a valid URL safe for sharing
    let shareUrl = window.location.href;
    try {
      const urlObj = new URL(window.location.href);
      // Ensure protocol is http or https (navigator.share rejects others)
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        shareUrl = `https://hardno.app/poll/${question.id}`;
      } else {
        // Append poll ID to simulate a specific link
        urlObj.searchParams.set('id', question.id);
        shareUrl = urlObj.toString();
      }
    } catch (e) {
      // Fallback if window.location is invalid (e.g. in some iframe environments)
      shareUrl = `https://hardno.app/poll/${question.id}`;
    }

    const shareData = {
      title: 'HardNo Poll',
      text: `Check out this poll: "${question.content}"`,
      url: shareUrl
    };

    try {
      // Check for support before calling
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else if (navigator.share) {
        // Try anyway if canShare is missing (some browsers)
        await navigator.share(shareData);
      } else {
        throw new Error('Web Share API not supported');
      }
    } catch (err) {
      // Handle cancellation or error by falling back to clipboard
      // AbortError is typical when user closes the share sheet
      if ((err as Error).name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(shareData.url);
          alert('Link copied to clipboard!');
        } catch (clipboardErr) {
          console.error('Share and clipboard failed', clipboardErr);
        }
      }
    }
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onProfileClick) {
      onProfileClick(question.authorId);
    }
  };

  if (isPollReported) return (
    <div className="bg-white border border-slate-200 rounded-2xl mb-4 p-8 text-center shadow-sm">
      <Flag size={28} className="text-rose-500 mx-auto mb-4" />
      <h3 className="font-bold mb-2 text-slate-900">Poll Reported</h3>
      <button onClick={() => setIsPollReported(false)} className="text-indigo-600 font-bold text-xs uppercase tracking-widest">Undo</button>
    </div>
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl mb-4 overflow-hidden shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer">
          <div 
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center border border-slate-100 shadow-sm" 
            onClick={handleProfileClick}
          >
            <span className="text-[10px] font-black text-slate-500 tracking-tighter">{getInitials(question.authorName)}</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 
                className="font-bold text-sm text-slate-900 leading-tight hover:text-indigo-600 transition-colors"
                onClick={handleProfileClick}
              >
                {question.authorName}
              </h3>
              {question.authorId !== currentUserId && onToggleFollow && (
                <>
                  <span className="text-slate-300">•</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onToggleFollow(); }}
                    className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${isFollowingAuthor ? 'text-slate-400' : 'text-indigo-600 hover:text-indigo-700'}`}
                  >
                    {isFollowingAuthor ? 'Following' : 'Follow'}
                  </button>
                </>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{question.category}</p>
          </div>
        </div>
        <button onClick={() => setShowOptionsSheet(true)} className="text-slate-400 p-2 hover:bg-slate-50 rounded-full transition-colors"><MoreHorizontal size={20} /></button>
      </div>

      {/* Content */}
      <div className="px-4 pb-2 cursor-pointer" onClick={onOpenConversation}>
        <p className="text-[15px] font-medium text-slate-800 mb-4 leading-snug">{question.content}</p>
        <div className="grid grid-cols-2 gap-3 mb-1">
          <button onClick={(e) => { e.stopPropagation(); onVote(question.id, 'yes'); }} disabled={!!question.userVote} className={`flex flex-col items-center justify-center p-3.5 rounded-xl border-2 transition-all ${question.userVote === 'yes' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-100 hover:border-slate-200'}`}>
            <span className="text-[10px] font-black uppercase mb-1 tracking-widest">Yes</span>
            {question.userVote && <span className="text-xl font-black">{yesPercent}%</span>}
          </button>
          <button onClick={(e) => { e.stopPropagation(); onVote(question.id, 'no'); }} disabled={!!question.userVote} className={`flex flex-col items-center justify-center p-3.5 rounded-xl border-2 transition-all ${question.userVote === 'no' ? 'bg-rose-50 border-rose-500 text-rose-700' : 'bg-slate-50 border-slate-100 hover:border-slate-200'}`}>
            <span className="text-[10px] font-black uppercase mb-1 tracking-widest">No</span>
            {question.userVote && <span className="text-xl font-black">{noPercent}%</span>}
          </button>
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex flex-col border-t border-slate-50/50 mt-2">
        {/* Action Row */}
        <div className="px-4 py-3 flex items-center space-x-6">
          <div className="flex items-center space-x-1.5">
            <button onClick={() => onLike(question.id)} className={`transition-transform active:scale-125 ${question.userLiked ? 'text-rose-500' : 'text-slate-800'}`}>
              <Heart size={24} strokeWidth={2} fill={question.userLiked ? "currentColor" : "none"} />
            </button>
            <span className="text-xs font-bold text-slate-500">{question.likes}</span>
          </div>
          
          <div className="flex items-center space-x-1.5">
            <button onClick={onOpenConversation} className="text-slate-800 active:scale-110 transition-transform">
              <MessageSquare size={24} strokeWidth={2} />
            </button>
            <span className="text-xs font-bold text-slate-500">{question.comments.length}</span>
          </div>

          <button onClick={(e) => { e.stopPropagation(); handleShare(); }} className="text-slate-800 active:scale-110 transition-transform">
            <Send size={24} strokeWidth={2} />
          </button>
        </div>
        
        {/* Metadata Row: Time Left, Votes Right */}
        <div className="px-4 pb-3 flex items-center justify-between">
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
             {formatTimeAgo(question.createdAt)} ago
           </p>
           
           <div className="flex items-center bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100 shadow-sm">
             <BarChart2 size={10} className="text-slate-400 mr-1.5" />
             <span className="text-[10px] font-black text-slate-500 tracking-tight uppercase">
               {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
             </span>
          </div>
        </div>
      </div>

      {/* Options Overlay */}
      {showOptionsSheet && (
        <div className="fixed inset-0 z-[110] flex flex-col justify-end">
          <div className="absolute inset-0" onClick={() => setShowOptionsSheet(false)}></div>
          <div className="relative bg-white w-full max-w-sm mx-auto rounded-t-[32px] p-6 pb-12 animate-in slide-in-from-bottom duration-300 shadow-2xl">
            <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6"></div>
            <div className="space-y-1">
              <button onClick={() => { setIsPollReported(true); setShowOptionsSheet(false); }} className="w-full flex items-center p-4 font-bold text-rose-500 hover:bg-rose-50 rounded-2xl transition-colors"><Flag size={20} className="mr-4" strokeWidth={2.5} /> Report Poll</button>
              <button onClick={() => { setShowOptionsSheet(false); }} className="w-full flex items-center p-4 font-bold text-rose-500 hover:bg-rose-50 rounded-2xl transition-colors"><UserX size={20} className="mr-4" strokeWidth={2.5} /> Report User</button>
              <button onClick={() => { handleShare(); setShowOptionsSheet(false); }} className="w-full flex items-center p-4 font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors"><Copy size={20} className="mr-4" strokeWidth={2.5} /> Copy Poll Link</button>
              {question.authorId === currentUserId && (
                <button onClick={() => { onDeleteQuestion?.(question.id); setShowOptionsSheet(false); }} className="w-full flex items-center p-4 font-bold text-rose-600 hover:bg-rose-50 rounded-2xl transition-colors"><Trash2 size={20} className="mr-4" strokeWidth={2.5} /> Delete Poll</button>
              )}
              <div className="pt-4">
                <button onClick={() => setShowOptionsSheet(false)} className="w-full bg-slate-100 text-slate-600 py-4 rounded-[20px] font-black text-sm tracking-widest uppercase">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
