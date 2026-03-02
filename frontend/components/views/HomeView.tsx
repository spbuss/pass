
import React, { useState, useMemo } from 'react';
import { CheckSquare, Bell, Zap, ArrowDownUp } from 'lucide-react';
import { User, Question } from '../../types';
import { QuestionCard } from '../polls/QuestionCard';
import { PullToRefresh } from '../ui/PullToRefresh';

interface HomeViewProps {
  questions: Question[];
  userData: User;
  handleVote: any;
  handleLike: any;
  handleDeleteQuestion: any;
  followedUserIds: string[];
  handleToggleFollow: any;
  setActiveView: any;
  onRefresh: () => Promise<void>;
  onOpenConversation: (q: Question) => void;
  handleAddComment?: any;
  handleLikeComment?: any;
  handleDeleteComment?: any;
  onProfileClick: (userId: string) => void;
  unreadNotifications?: boolean;
  onOpenNotifications?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  questions, 
  userData, 
  handleVote, 
  handleLike, 
  handleDeleteQuestion, 
  followedUserIds, 
  handleToggleFollow, 
  setActiveView, 
  onRefresh,
  onOpenConversation,
  onProfileClick,
  unreadNotifications = true,
  onOpenNotifications
}) => {
  const [sortBy, setSortBy] = useState<'latest' | 'votes'>('latest');

  const sortedQuestions = useMemo(() => {
    return [...questions].sort((a, b) => {
      if (sortBy === 'votes') {
        const votesA = a.yesVotes + a.noVotes;
        const votesB = b.yesVotes + b.noVotes;
        if (votesB !== votesA) {
          return votesB - votesA;
        }
      }
      return b.createdAt - a.createdAt;
    });
  }, [questions, sortBy]);

  return (
    <div className="pb-32">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-4 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
              <CheckSquare size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">HardNo</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => {
                if (onOpenNotifications) {
                  onOpenNotifications();
                } else {
                  setActiveView('notifications');
                }
              }} 
              className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors relative"
            >
              <Bell size={24} />
              {unreadNotifications && (
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              )}
            </button>
          </div>
        </div>
      </header>

      <PullToRefresh onRefresh={onRefresh}>
        <main className="max-w-xl mx-auto px-4 pt-4">
          {sortedQuestions.length === 0 ? (
            <div className="text-center py-20">
              <Zap size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">No questions yet. Why not create one?</p>
            </div>
          ) : (
            sortedQuestions.map(q => (
              <QuestionCard 
                key={q.id} 
                question={q} 
                currentUserId={userData.id}
                onVote={handleVote} 
                onLike={handleLike}
                onDeleteQuestion={handleDeleteQuestion}
                onOpenConversation={() => onOpenConversation(q)}
                isFollowingAuthor={followedUserIds.includes(q.authorId)}
                onToggleFollow={() => handleToggleFollow(q.authorId)}
                onProfileClick={onProfileClick}
              />
            ))
          )}
        </main>
      </PullToRefresh>
    </div>
  );
};
