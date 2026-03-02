
import React, { useState, useRef } from 'react';
import { ChevronLeft, Heart, MessageSquare, Send, X, Trash2 } from 'lucide-react';
import { User, Question, Comment } from '../../types';
import { QuestionCard } from '../polls/QuestionCard';

interface SinglePollViewProps {
  question: Question;
  userData: User;
  handleVote: any;
  handleLike: any;
  handleAddComment: any;
  handleLikeComment: any;
  handleDeleteQuestion: any;
  handleDeleteComment: any;
  followedUserIds: string[];
  handleToggleFollow: any;
  onBack: () => void;
  onProfileClick: (userId: string) => void;
}

const formatTimeAgo = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

export const SinglePollView: React.FC<SinglePollViewProps> = ({ 
  question, 
  userData, 
  handleVote, 
  handleLike, 
  handleAddComment,
  handleLikeComment,
  handleDeleteQuestion, 
  handleDeleteComment,
  followedUserIds, 
  handleToggleFollow, 
  onBack,
  onProfileClick
}) => {
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: string, name: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      handleAddComment(question.id, commentText, replyTo?.id);
      setCommentText('');
      setReplyTo(null);
    }
  };

  const renderComment = (comment: Comment, parentName?: string) => {
    const hasReplies = comment.replies && comment.replies.length > 0;
    
    return (
      <div key={comment.id} className="relative border-b border-slate-50 last:border-b-0">
        <div className="flex px-4 py-4 bg-white">
          <div 
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-100 flex-shrink-0 mr-3 cursor-pointer" 
            onClick={() => onProfileClick(comment.userId)}
          >
            <span className="text-xs font-black text-slate-500 tracking-tighter">{getInitials(comment.userName)}</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1 mb-0.5">
              <span 
                className="font-bold text-[14px] text-slate-900 truncate cursor-pointer hover:text-indigo-600"
                onClick={() => onProfileClick(comment.userId)}
              >
                {comment.userName}
              </span>
              <span className="text-slate-400 text-[13px] font-medium">@{comment.userName.toLowerCase().replace(/\s/g, '')}</span>
              <span className="text-slate-400 text-[13px] font-medium">·</span>
              <span className="text-slate-400 text-[13px] font-medium">{formatTimeAgo(comment.createdAt)}</span>
            </div>
            
            <p className="text-[14px] text-slate-800 leading-normal mb-2 whitespace-pre-wrap">
              {parentName && (
                <span className="text-indigo-600 font-bold mr-1.5">@{parentName.toLowerCase().replace(/\s/g, '')}</span>
              )}
              {comment.text}
            </p>
            
            <div className="flex items-center space-x-8 text-slate-400">
              <button 
                onClick={() => {
                  setReplyTo({ id: comment.id, name: comment.userName });
                  inputRef.current?.focus();
                }}
                className="flex items-center space-x-1.5 hover:text-indigo-500 transition-colors"
              >
                <MessageSquare size={16} strokeWidth={2} />
                <span className="text-[12px] font-bold">{comment.replies?.length || 0}</span>
              </button>
              
              <button 
                onClick={() => handleLikeComment(question.id, comment.id)}
                className={`flex items-center space-x-1.5 hover:text-rose-500 transition-colors ${comment.userLiked ? 'text-rose-500' : ''}`}
              >
                <Heart size={16} strokeWidth={2} fill={comment.userLiked ? "currentColor" : "none"} />
                <span className="text-[12px] font-bold">{comment.likes}</span>
              </button>

              {comment.userId === userData.id && (
                <button 
                  onClick={() => handleDeleteComment(question.id, comment.id)}
                  className="flex items-center space-x-1.5 hover:text-rose-600 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Render nested replies flatly in a straight line */}
        {hasReplies && (
          <div className="bg-slate-50/20">
            {comment.replies!.map((reply) => 
              renderComment(reply, comment.userName)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md z-40 px-4 py-4 border-b border-slate-100 flex items-center space-x-6">
        <button onClick={onBack} className="p-1 hover:bg-slate-50 rounded-full text-slate-900 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-black text-slate-900 tracking-tight">Conversation</h1>
      </header>

      {/* Main Conversation Thread */}
      <main className="flex-1 pb-48"> 
        {/* The Original Poll */}
        <div className="border-b border-slate-50 bg-slate-50/30 p-4">
          <QuestionCard 
            question={question} 
            currentUserId={userData.id}
            onVote={handleVote} 
            onLike={handleLike}
            onDeleteQuestion={handleDeleteQuestion}
            onProfileClick={onProfileClick}
          />
        </div>

        {/* Reply Section Label */}
        <div className="px-4 py-3 border-b border-slate-50 bg-white">
          <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.15em]">Replies</h3>
        </div>

        {/* Flattened Comments */}
        <div className="divide-y divide-slate-50">
          {question.comments.length === 0 ? (
            <div className="py-20 text-center px-10">
              <MessageSquare size={48} className="text-slate-100 mx-auto mb-4" />
              <p className="text-slate-400 font-bold text-sm">No replies yet. Be the first!</p>
            </div>
          ) : (
            question.comments.map((comment) => 
              renderComment(comment)
            )
          )}
        </div>
        
        {/* Extra spacer for scrollability over the input bar */}
        <div className="h-32" />
      </main>

      {/* Sticky Reply Input */}
      <div className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-white border-t border-slate-100 px-4 pt-3 pb-8 z-30 shadow-[0_-8px_30px_rgb(0,0,0,0.06)]">
        {replyTo && (
          <div className="flex items-center justify-between mb-3 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-xl animate-in slide-in-from-bottom-2">
            <span className="text-[11px] font-bold text-indigo-600 tracking-wide uppercase">Replying to @{replyTo.name.toLowerCase().replace(/\s/g, '')}</span>
            <button onClick={() => setReplyTo(null)} className="text-indigo-400 hover:text-indigo-600 p-0.5">
              <X size={14} strokeWidth={3} />
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center border border-slate-100 shadow-sm">
            <span className="text-[10px] font-black text-slate-500 tracking-tighter">{getInitials(userData.name)}</span>
          </div>
          <div className="flex-1 relative">
            <input 
              ref={inputRef}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={replyTo ? `Reply to @${replyTo.name.toLowerCase().replace(/\s/g, '')}...` : "Add a reply..."}
              className="w-full bg-slate-50 border border-slate-100 rounded-full py-3 px-5 text-[14px] focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-200 transition-all font-medium placeholder-slate-400"
            />
            <button 
              type="submit"
              disabled={!commentText.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-full disabled:opacity-30 disabled:bg-slate-300 transition-all hover:bg-indigo-700 active:scale-95 shadow-sm"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
