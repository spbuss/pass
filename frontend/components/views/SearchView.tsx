
import React, { useState } from 'react';
import { Search, X, User as UserIcon } from 'lucide-react';
import { User, Question } from '../../types';
import { QuestionCard } from '../polls/QuestionCard';

interface SearchViewProps {
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  filteredQuestions: Question[];
  filteredUsers: User[];
  userData: User;
  handleVote: any;
  handleLike: any;
  handleDeleteQuestion: any;
  followedUserIds: string[];
  handleToggleFollow: any;
  setActiveView: any;
  onOpenConversation: (q: Question) => void;
  handleAddComment?: any;
  handleLikeComment?: any;
  handleDeleteComment?: any;
  onProfileClick: (userId: string) => void;
}

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

export const SearchView: React.FC<SearchViewProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  filteredQuestions, 
  filteredUsers, 
  userData, 
  handleVote, 
  handleLike, 
  handleDeleteQuestion, 
  followedUserIds, 
  handleToggleFollow, 
  setActiveView,
  onOpenConversation,
  onProfileClick
}) => {
  const [activeTab, setActiveTab] = useState<'polls' | 'people'>('polls');

  return (
    <div className="pb-32 bg-slate-50 min-h-screen">
      <header className="bg-white border-b border-slate-100 pt-4 sticky top-0 z-20 shadow-sm transition-all">
        <div className="relative mb-4 px-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'polls' ? "Search polls..." : "Search people..."}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 font-medium placeholder-slate-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={18} /></button>
          )}
        </div>
        
        <div className="flex items-center mb-0.5 overflow-x-auto hide-scrollbar">
          <div className="flex space-x-6 px-4">
            <button 
              onClick={() => setActiveTab('polls')} 
              className={`py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'polls' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              Polls
            </button>
            <button 
              onClick={() => setActiveTab('people')} 
              className={`py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'people' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              People
            </button>
            <button 
              onClick={() => {
                setActiveTab('polls');
                setSearchQuery('Politics');
              }} 
              className={`py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${searchQuery === 'Politics' && activeTab === 'polls' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              Politics
            </button>
            <button 
              onClick={() => {
                setActiveTab('polls');
                setSearchQuery('Sports');
              }} 
              className={`py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${searchQuery === 'Sports' && activeTab === 'polls' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              Sports
            </button>
            <button 
              onClick={() => {
                setActiveTab('polls');
                setSearchQuery('Technology');
              }} 
              className={`py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${searchQuery === 'Technology' && activeTab === 'polls' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              Technology
            </button>
          </div>
        </div>
      </header>
      <main className="p-4">
        {activeTab === 'polls' ? (
          filteredQuestions.length > 0 ? (
            filteredQuestions.map(q => (
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
          ) : (
            <div className="text-center py-12 px-8">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-slate-300" />
              </div>
              <h3 className="text-slate-900 font-bold mb-1">No polls found</h3>
              <p className="text-slate-400 text-sm">Try searching for something else.</p>
            </div>
          )
        ) : (
          filteredUsers.length > 0 ? (
            <div className="space-y-3">
              {filteredUsers.map(user => (
                <div 
                  key={user.id} 
                  className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md cursor-pointer"
                  onClick={() => onProfileClick(user.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-50">
                      <span className="text-sm font-black text-slate-500 tracking-tighter">{getInitials(user.name)}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[15px] text-slate-900">{user.name}</h4>
                      <p className="text-xs text-slate-400 font-medium">@{user.username}</p>
                      <div className="flex items-center space-x-3 mt-1.5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{user.followers} followers</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleToggleFollow(user.id); }} 
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                      followedUserIds.includes(user.id) 
                        ? 'bg-slate-100 text-slate-500' 
                        : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700'
                    }`}
                  >
                    {followedUserIds.includes(user.id) ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-8">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon size={24} className="text-slate-300" />
              </div>
              <h3 className="text-slate-900 font-bold mb-1">No people found</h3>
              <p className="text-slate-400 text-sm">Try searching for a different name.</p>
            </div>
          )
        )}
      </main>
    </div>
  );
};
