
import React from 'react';
import { TrendingUp, Zap, Heart, MessageSquare } from 'lucide-react';
import { Question } from '../../types';
import { PullToRefresh } from '../ui/PullToRefresh';

interface FeedViewProps {
  questions: Question[];
  handleLike: (id: string) => void;
  setActiveView: (v: any) => void;
  setSelectedQuestion: (q: Question | null) => void;
  onRefresh: () => Promise<void>;
}

const GridQuestionCard: React.FC<{ 
  question: Question, 
  onLike: (id: string) => void,
  onClick: () => void 
}> = ({ question, onLike, onClick }) => {
  const totalVotes = question.yesVotes + question.noVotes;
  const categoryLabel = question.category.toUpperCase();

  return (
    <div 
      onClick={onClick}
      className="bg-white border border-slate-100 rounded-none h-64 p-4 flex flex-col justify-between cursor-pointer hover:shadow-sm transition-shadow relative"
    >
      <div className="flex items-start justify-between">
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider ${
          question.category === 'Dating' ? 'bg-rose-500 text-white' : 'bg-slate-50 text-slate-400'
        }`}>
          {categoryLabel}
        </span>
        <button 
          onClick={(e) => { e.stopPropagation(); onLike(question.id); }}
          className={`${question.userLiked ? 'text-rose-500' : 'text-slate-300'} transition-colors`}
        >
          <Heart size={18} fill={question.userLiked ? "currentColor" : "none"} />
        </button>
      </div>

      <p className="text-[14px] font-bold text-slate-900 leading-tight flex-1 flex items-center pr-2">
        {question.content}
      </p>

      <div className="flex items-center justify-between mt-4">
        <div className="text-indigo-600 text-[11px] font-black tracking-widest uppercase">
          {totalVotes.toLocaleString()} VOTES
        </div>
        
        {question.comments.length > 0 && (
          <div className="flex items-center space-x-1 text-slate-300">
            <MessageSquare size={12} />
            <span className="text-[10px] font-bold">{question.comments.length}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const FeedView: React.FC<FeedViewProps> = ({ 
  questions, 
  handleLike, 
  setActiveView, 
  setSelectedQuestion, 
  onRefresh 
}) => {
  return (
    <div className="pb-32 bg-slate-50 min-h-screen">
      <header className="px-4 py-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-lg font-black text-slate-900 uppercase tracking-widest">Discover</h1>
        <TrendingUp size={20} className="text-indigo-500" />
      </header>
      <PullToRefresh onRefresh={onRefresh}>
        <div className="grid grid-cols-2 gap-px border-b border-slate-100">
          {questions.length > 0 ? (
            questions.map(q => (
              <GridQuestionCard 
                key={q.id} 
                question={q} 
                onLike={handleLike}
                onClick={() => {
                  setSelectedQuestion(q);
                  setActiveView('single-poll');
                }}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-20 px-8">
              <Zap size={48} className="mx-auto text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Feed Empty</h3>
              <p className="text-slate-400 text-sm">Follow people to see their polls here.</p>
            </div>
          )}
        </div>
      </PullToRefresh>
    </div>
  );
};
