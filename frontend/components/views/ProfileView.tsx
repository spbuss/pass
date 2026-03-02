
import React, { useState } from 'react';
import { Menu, Link as LinkIcon, ChevronLeft, UserPlus, Check, Grid, List, Settings, MoreHorizontal, BadgeCheck } from 'lucide-react';
import { User, Question } from '../../types';
import { QuestionCard } from '../polls/QuestionCard';

interface ProfileViewProps {
  userData: User & { interests?: string[] };
  questions: Question[];
  handleVote: any;
  handleLike: any;
  handleDeleteQuestion: any;
  followedUserIds: string[];
  handleToggleFollow: any;
  setActiveView: any;
  setShowSettingsSheet?: any;
  onOpenConversation: (q: Question) => void;
  isOwnProfile?: boolean;
  onBack?: () => void;
  onProfileClick?: (userId: string) => void;
}

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

export const ProfileView: React.FC<ProfileViewProps> = ({ 
  userData, 
  questions, 
  handleVote, 
  handleLike, 
  handleDeleteQuestion, 
  followedUserIds, 
  handleToggleFollow, 
  setActiveView, 
  setShowSettingsSheet,
  onOpenConversation,
  isOwnProfile = true,
  onBack,
  onProfileClick
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'grid'>('list');
  
  const userQuestions = questions.filter(q => q.authorId === userData.id);
  const votesCast = questions.filter(q => q.userVote).length; 
  const followingCount = userData.following || followedUserIds.length + 431; 
  const followersCount = userData.followers || 0;
  const isFollowing = followedUserIds.includes(userData.id);

  const StatBox = ({ label, value }: { label: string, value: string | number }) => (
    <div className="flex flex-col items-center justify-center cursor-pointer active:opacity-50 transition-opacity">
      <span className="font-bold text-lg text-slate-900 leading-tight">{value}</span>
      <span className="text-[13px] text-slate-500 font-medium">{label}</span>
    </div>
  );

  return (
    <div className="pb-20 bg-white min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-100 h-14 px-4 flex items-center justify-between">
        {onBack ? (
          <div className="flex items-center space-x-4">
             <button onClick={onBack} className="text-slate-900 -ml-2 p-2">
               <ChevronLeft size={26} strokeWidth={2} />
             </button>
             <h1 className="font-bold text-lg text-slate-900 truncate max-w-[200px] flex items-center">
               {userData.username}
               {isOwnProfile && <BadgeCheck size={14} className="ml-1.5 text-indigo-500" />}
             </h1>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-xl text-slate-900 tracking-tight flex items-center">
              {userData.username}
              {isOwnProfile && <BadgeCheck size={16} className="ml-1.5 text-indigo-500" />}
            </h1>
          </div>
        )}

        <div className="flex items-center space-x-1">
          {isOwnProfile ? (
            <>
              <button 
                onClick={() => setShowSettingsSheet && setShowSettingsSheet(true)} 
                className="p-2 text-slate-900 hover:bg-slate-50 rounded-full transition-colors"
              >
                <Menu size={26} strokeWidth={1.5} />
              </button>
            </>
          ) : (
            <button className="p-2 text-slate-900">
              <MoreHorizontal size={24} />
            </button>
          )}
        </div>
      </header>

      <div className="px-4 pt-4 pb-2">
        {/* Top Row: Avatar & Stats */}
        <div className="flex items-center justify-between mb-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center border-4 border-white">
              <span className="text-2xl font-bold text-slate-500 tracking-tight">{getInitials(userData.name)}</span>
            </div>
          </div>

          <div className="flex flex-1 justify-around ml-4 sm:ml-8">
            <StatBox label="Polls" value={userQuestions.length} />
            <StatBox label="Followers" value={followersCount} />
            <StatBox label="Following" value={followingCount} />
          </div>
        </div>

        {/* User Info */}
        <div className="mb-6 space-y-1">
          <h2 className="font-bold text-sm text-slate-900">{userData.name}</h2>
          {userData.bio && (
            <p className="text-sm text-slate-800 whitespace-pre-wrap leading-tight max-w-md">
              {userData.bio}
            </p>
          )}
          {userData.link && (
            <a 
              href={userData.link.startsWith('http') ? userData.link : `https://${userData.link}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center text-indigo-800 text-sm font-semibold hover:underline w-fit mt-1"
            >
              <LinkIcon size={14} className="mr-1.5 -rotate-45" />
              {userData.link.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-6">
          {isOwnProfile ? (
            <>
              <button 
                onClick={() => setActiveView('edit-profile')}
                className="flex-1 bg-slate-100 text-slate-900 font-bold text-sm py-2 rounded-lg hover:bg-slate-200 transition-colors active:scale-95"
              >
                Edit profile
              </button>
            </>
          ) : (
            <>
               <button 
                onClick={() => handleToggleFollow(userData.id)}
                className={`flex-1 font-bold text-sm py-2 rounded-lg transition-all active:scale-95 flex items-center justify-center space-x-1.5 ${
                  isFollowing 
                    ? 'bg-slate-100 text-slate-900' 
                    : 'bg-indigo-600 text-white'
                }`}
              >
                {isFollowing ? (
                  <span>Following</span>
                ) : (
                  <span>Follow</span>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-14 bg-white z-20 border-t border-slate-200">
        <div className="flex">
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex-1 flex items-center justify-center h-12 border-b-2 transition-colors ${activeTab === 'list' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400'}`}
          >
            <List size={24} />
          </button>
          <button 
            onClick={() => setActiveTab('grid')}
            className={`flex-1 flex items-center justify-center h-12 border-b-2 transition-colors ${activeTab === 'grid' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400'}`}
          >
            <Grid size={24} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[300px]">
        {activeTab === 'list' ? (
          <div className="space-y-4 p-4 bg-slate-50 min-h-full">
            {userQuestions.length > 0 ? (
              userQuestions.map(q => (
                <QuestionCard 
                  key={q.id} 
                  question={q} 
                  currentUserId={userData.id} 
                  onVote={handleVote} 
                  onLike={handleLike}
                  onDeleteQuestion={isOwnProfile ? handleDeleteQuestion : undefined}
                  onOpenConversation={() => onOpenConversation(q)}
                  isFollowingAuthor={followedUserIds.includes(q.authorId)}
                  onToggleFollow={() => handleToggleFollow(q.authorId)}
                  onProfileClick={onProfileClick}
                />
              ))
            ) : (
              <EmptyState isOwnProfile={isOwnProfile} onCreate={() => setActiveView('add')} />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-0.5 pb-20">
            {userQuestions.length > 0 ? (
              userQuestions.map(q => (
                <div 
                  key={q.id} 
                  onClick={() => onOpenConversation(q)}
                  className="aspect-square bg-slate-100 relative group cursor-pointer border border-white"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 line-clamp-1">{q.category}</span>
                    <p className="text-xs font-semibold text-slate-800 line-clamp-3 leading-tight mb-2">
                      {q.content}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))
            ) : (
              <div className="col-span-3">
                <EmptyState isOwnProfile={isOwnProfile} onCreate={() => setActiveView('add')} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ isOwnProfile, onCreate }: { isOwnProfile?: boolean; onCreate: () => void }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-full border-2 border-slate-900 flex items-center justify-center mb-4">
      <Grid size={32} className="text-slate-900" strokeWidth={1.5} />
    </div>
    <h3 className="text-xl font-black text-slate-900 mb-1">No polls yet</h3>
    <p className="text-sm text-slate-500 max-w-xs mx-auto">
      {isOwnProfile 
        ? "When you share polls, they will appear on your profile." 
        : "This user hasn't posted any polls yet."}
    </p>
    {isOwnProfile && (
      <button onClick={onCreate} className="mt-6 text-indigo-600 font-bold text-sm">Create your first poll</button>
    )}
  </div>
);
