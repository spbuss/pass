import React, { useState, useEffect, useMemo } from 'react';
import { Home, Search, PlusSquare, Layout, User as UserIcon, LogOut, Settings, Shield, Bell, ChevronRight, Info } from 'lucide-react';
import { User, Question, View, Comment } from './types';

// Views
import { LoginView } from './components/auth/LoginView';
import { HomeView } from './components/views/HomeView';
import { SearchView } from './components/views/SearchView';
import { AddView } from './components/views/AddView';
import { FeedView } from './components/views/FeedView';
import { ProfileView } from './components/views/ProfileView';
import { SinglePollView } from './components/views/SinglePollView';
import { NotificationsView } from './components/views/NotificationsView';
import { EditProfileView } from './components/views/EditProfileView';

import { login, register, getMe, getUsers } from './api/authService';
import { getFeed, createPoll, votePoll, likePoll, deletePoll, addComment, getComments } from './api/pollService';
import { getAuthToken, clearAuthToken } from './api/base';

const App: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [activeView, setActiveView] = useState<View>('home');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [followedUserIds, setFollowedUserIds] = useState<string[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [showSettingsSheet, setShowSettingsSheet] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(true);

  // Profile Viewing State
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);
  const [previousView, setPreviousView] = useState<View>('home');

  // New Question State
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionCategory, setNewQuestionCategory] = useState('General');

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const user = await getMe();
          setUserData(user);
        } catch (e) {
          clearAuthToken();
        }
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchFeed();
      fetchUsers();
    }
  }, [userData]);

  const fetchFeed = async () => {
    try {
      const data = await getFeed();
      setQuestions(data);
    } catch (e) {
      console.error('Failed to fetch feed', e);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (e) {
      console.error('Failed to fetch users', e);
    }
  };

  const handleLogin = async (method: string, credentials?: any) => {
    setIsLoggingIn(true);
    try {
      if (isSignupMode && method === 'email') {
        const user = await register(credentials);
        setUserData(user);
      } else if (method === 'email') {
        const user = await login(credentials.email, credentials.password);
        setUserData(user);
      } else {
        // Mock social/phone login for now
        setUserData({
          id: 'u1',
          name: credentials?.name || 'Alex Rivera',
          username: credentials?.username || 'arivera',
          avatar: 'https://ui-avatars.com/api/?name=Alex+Rivera',
          bio: 'Just here for the hot takes and spicy debates. 🔥',
          followers: 128,
          following: 431
        });
      }
    } catch (error: any) {
      alert(error.message || 'Authentication failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    setUserData(null);
    setActiveView('home');
    setShowSettingsSheet(false);
  };

  const handleVote = async (id: string, vote: 'yes' | 'no') => {
    setQuestions(prev => prev.map(q => {
      if (q.id === id && !q.userVote) {
        return {
          ...q,
          userVote: vote,
          yesVotes: vote === 'yes' ? q.yesVotes + 1 : q.yesVotes,
          noVotes: vote === 'no' ? q.noVotes + 1 : q.noVotes
        };
      }
      return q;
    }));

    if (selectedQuestion?.id === id) {
      setSelectedQuestion(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          userVote: vote,
          yesVotes: vote === 'yes' ? prev.yesVotes + 1 : prev.yesVotes,
          noVotes: vote === 'no' ? prev.noVotes + 1 : prev.noVotes
        };
      });
    }

    try {
      await votePoll(id, vote);
    } catch (e) {
      fetchFeed();
    }
  };

  const handleLike = async (id: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === id) {
        return {
          ...q,
          userLiked: !q.userLiked,
          likes: q.userLiked ? q.likes - 1 : q.likes + 1
        };
      }
      return q;
    }));

    if (selectedQuestion?.id === id) {
      setSelectedQuestion(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          userLiked: !prev.userLiked,
          likes: prev.userLiked ? prev.likes - 1 : prev.likes + 1
        };
      });
    }

    try {
      await likePoll(id);
    } catch (e) {
      fetchFeed();
    }
  };

  const handleAddComment = async (questionId: string, text: string, replyToId?: string) => {
    if (!userData) return;

    try {
      await addComment(questionId, text, replyToId);
      const comments = await getComments(questionId);
      setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, comments } : q));
      if (selectedQuestion?.id === questionId) {
        setSelectedQuestion(prev => prev ? { ...prev, comments } : prev);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLikeComment = (questionId: string, commentId: string) => {
    // Mock for now
  };

  const handleDeleteComment = (questionId: string, commentId: string) => {
    // Mock for now
  };

  const handlePostQuestion = async () => {
    if (!newQuestionText.trim() || !userData) return;
    
    try {
      await createPoll(newQuestionText, newQuestionCategory);
      await fetchFeed();
      setNewQuestionText('');
      setActiveView('home');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    if (selectedQuestion?.id === id) {
      setSelectedQuestion(null);
      setActiveView('home');
    }
    try {
      await deletePoll(id);
    } catch (e) {
      fetchFeed();
    }
  };

  const handleToggleFollow = (userId: string) => {
    setFollowedUserIds(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleOpenProfile = (userId: string) => {
    if (userId === userData?.id) {
      setActiveView('profile');
    } else {
      setPreviousView(activeView);
      setViewingProfileId(userId);
      setActiveView('user-profile');
    }
  };

  const handleOpenConversation = async (q: Question) => {
    setSelectedQuestion(q);
    setActiveView('single-poll');
    try {
      const comments = await getComments(q.id);
      setQuestions(prev => prev.map(question => 
        question.id === q.id ? { ...question, comments } : question
      ));
      setSelectedQuestion(prev => prev?.id === q.id ? { ...prev, comments } : prev);
    } catch (e) {
      console.error(e);
    }
  };

  const onRefresh = async () => {
    await fetchFeed();
  };

  const filteredQuestions = useMemo(() => {
    if (!searchQuery) return questions;
    return questions.filter(q => 
      q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [questions, searchQuery]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    return users.filter(u => 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  if (!userData) {
    return (
      <LoginView 
        onLogin={handleLogin} 
        isLoggingIn={isLoggingIn}
        isSignupMode={isSignupMode}
        setIsSignupMode={setIsSignupMode}
      />
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return (
          <HomeView 
            questions={questions}
            userData={userData}
            handleVote={handleVote}
            handleLike={handleLike}
            handleDeleteQuestion={handleDeleteQuestion}
            followedUserIds={followedUserIds}
            handleToggleFollow={handleToggleFollow}
            setActiveView={setActiveView}
            onRefresh={onRefresh}
            onOpenConversation={handleOpenConversation}
            onProfileClick={handleOpenProfile}
            unreadNotifications={unreadNotifications}
            onOpenNotifications={() => {
              setUnreadNotifications(false);
              setActiveView('notifications');
            }}
          />
        );
      case 'search':
        return (
          <SearchView 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredQuestions={filteredQuestions}
            filteredUsers={filteredUsers}
            userData={userData}
            handleVote={handleVote}
            handleLike={handleLike}
            handleDeleteQuestion={handleDeleteQuestion}
            followedUserIds={followedUserIds}
            handleToggleFollow={handleToggleFollow}
            setActiveView={setActiveView}
            onOpenConversation={handleOpenConversation}
            onProfileClick={handleOpenProfile}
          />
        );
      case 'add':
        return (
          <AddView 
            userData={userData}
            newQuestionText={newQuestionText}
            setNewQuestionText={setNewQuestionText}
            newQuestionCategory={newQuestionCategory}
            setNewQuestionCategory={setNewQuestionCategory}
            handlePostQuestion={handlePostQuestion}
            setActiveView={setActiveView}
          />
        );
      case 'feed':
        return (
          <FeedView 
            questions={questions}
            handleLike={handleLike}
            setActiveView={setActiveView}
            setSelectedQuestion={setSelectedQuestion}
            onRefresh={onRefresh}
          />
        );
      case 'profile':
        return (
          <ProfileView 
            userData={{...userData, interests: ['Technology', 'Design', 'Ethics']}}
            questions={questions}
            handleVote={handleVote}
            handleLike={handleLike}
            handleDeleteQuestion={handleDeleteQuestion}
            followedUserIds={followedUserIds}
            handleToggleFollow={handleToggleFollow}
            setActiveView={setActiveView}
            setShowSettingsSheet={setShowSettingsSheet}
            onOpenConversation={handleOpenConversation}
            isOwnProfile={true}
          />
        );
      case 'user-profile':
        const targetUser = users.find(u => u.id === viewingProfileId) || (viewingProfileId === userData.id ? userData : null);
        
        const finalTargetUser = targetUser || (viewingProfileId ? {
          id: viewingProfileId,
          name: questions.find(q => q.authorId === viewingProfileId)?.authorName || 'Unknown User',
          username: 'user_' + viewingProfileId,
          avatar: questions.find(q => q.authorId === viewingProfileId)?.authorAvatar || 'https://via.placeholder.com/150',
          followers: 0,
          following: 0,
          bio: 'No bio available.',
          interests: []
        } as User : null);

        return finalTargetUser ? (
          <ProfileView 
            userData={finalTargetUser}
            questions={questions}
            handleVote={handleVote}
            handleLike={handleLike}
            handleDeleteQuestion={handleDeleteQuestion}
            followedUserIds={followedUserIds}
            handleToggleFollow={handleToggleFollow}
            setActiveView={setActiveView}
            onOpenConversation={handleOpenConversation}
            isOwnProfile={finalTargetUser.id === userData.id}
            onBack={() => setActiveView(previousView)}
            onProfileClick={handleOpenProfile}
          />
        ) : null;
      case 'single-poll':
        return selectedQuestion ? (
          <SinglePollView 
            question={questions.find(q => q.id === selectedQuestion.id) || selectedQuestion}
            userData={userData}
            handleVote={handleVote}
            handleLike={handleLike}
            handleAddComment={handleAddComment}
            handleLikeComment={handleLikeComment}
            handleDeleteQuestion={handleDeleteQuestion}
            handleDeleteComment={handleDeleteComment}
            followedUserIds={followedUserIds}
            handleToggleFollow={handleToggleFollow}
            onBack={() => setActiveView('home')}
            onProfileClick={handleOpenProfile}
          />
        ) : null;
      case 'notifications':
        return (
          <NotificationsView 
            onBack={() => setActiveView('home')} 
            followedUserIds={followedUserIds}
            handleToggleFollow={handleToggleFollow}
          />
        );
      case 'edit-profile':
        return (
          <EditProfileView 
            userData={{...userData, interests: ['Tech', 'Debate']}}
            onSave={(data) => {
              setUserData(data);
              setActiveView('profile');
            }}
            onCancel={() => setActiveView('profile')}
          />
        );
      default:
        return null;
    }
  };

  const showNav = !['add', 'edit-profile', 'single-poll', 'notifications', 'user-profile'].includes(activeView);

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-slate-50 relative">
      {renderView()}

      {/* Settings Bottom Sheet */}
      {showSettingsSheet && (
        <div className="fixed inset-0 z-[120] flex flex-col justify-end bg-black/60 animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={() => setShowSettingsSheet(false)}></div>
          <div className="relative bg-white w-full max-w-2xl mx-auto rounded-t-[32px] p-6 pb-12 animate-in slide-in-from-bottom duration-400 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8"></div>
            
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-2 hover:bg-slate-50 rounded-2xl transition-all group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <UserIcon size={22} strokeWidth={2} />
                  </div>
                  <span className="font-bold text-slate-900 text-[15px]">Account</span>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
              </button>

              <button 
                onClick={() => {
                  setUnreadNotifications(false);
                  setActiveView('notifications');
                  setShowSettingsSheet(false);
                }}
                className="w-full flex items-center justify-between p-2 hover:bg-slate-50 rounded-2xl transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 relative">
                    <Bell size={22} strokeWidth={2} />
                    {unreadNotifications && (
                      <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <span className="font-bold text-slate-900 text-[15px]">Notifications</span>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
              </button>

              <button className="w-full flex items-center justify-between p-2 hover:bg-slate-50 rounded-2xl transition-all group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                    <Shield size={22} strokeWidth={2} />
                  </div>
                  <span className="font-bold text-slate-900 text-[15px]">Privacy & Security</span>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
              </button>

              <button className="w-full flex items-center justify-between p-2 hover:bg-slate-50 rounded-2xl transition-all group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                    <Settings size={22} strokeWidth={2} />
                  </div>
                  <span className="font-bold text-slate-900 text-[15px]">App Settings</span>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
              </button>

              <button className="w-full flex items-center justify-between p-2 hover:bg-slate-50 rounded-2xl transition-all group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
                    <Info size={22} strokeWidth={2} />
                  </div>
                  <span className="font-bold text-slate-900 text-[15px]">About HardNo</span>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
              </button>

              <button onClick={handleLogout} className="w-full flex items-center justify-between p-2 hover:bg-slate-50 rounded-2xl transition-all group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                    <LogOut size={22} strokeWidth={2} />
                  </div>
                  <span className="font-bold text-slate-900 text-[15px]">Log Out</span>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
              </button>
            </div>
            
            <button 
              onClick={() => setShowSettingsSheet(false)}
              className="mt-8 w-full bg-slate-100 text-slate-700 py-4 rounded-[20px] font-bold text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-6 py-4 flex justify-between items-center max-w-2xl mx-auto shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
          <button 
            onClick={() => setActiveView('home')}
            className={`flex flex-col items-center transition-all ${activeView === 'home' ? 'text-indigo-600' : 'text-slate-300 hover:text-slate-400'}`}
          >
            <Home size={24} strokeWidth={activeView === 'home' ? 2.5 : 2} />
          </button>
          <button 
            onClick={() => setActiveView('search')}
            className={`flex flex-col items-center transition-all ${activeView === 'search' ? 'text-indigo-600' : 'text-slate-300 hover:text-slate-400'}`}
          >
            <Search size={24} strokeWidth={activeView === 'search' ? 2.5 : 2} />
          </button>
          <button 
            onClick={() => setActiveView('add')}
            className="flex flex-col items-center -mt-8"
          >
            <div className="bg-indigo-600 text-white p-4 rounded-3xl shadow-2xl shadow-indigo-200 transform hover:scale-110 active:scale-90 transition-all border-4 border-white">
              <PlusSquare size={26} strokeWidth={2.5} />
            </div>
          </button>
          <button 
            onClick={() => setActiveView('feed')}
            className={`flex flex-col items-center transition-all ${activeView === 'feed' ? 'text-indigo-600' : 'text-slate-300 hover:text-slate-400'}`}
          >
            <Layout size={24} strokeWidth={activeView === 'feed' ? 2.5 : 2} />
          </button>
          <button 
            onClick={() => setActiveView('profile')}
            className={`flex flex-col items-center transition-all ${activeView === 'profile' ? 'text-indigo-600' : 'text-slate-300 hover:text-slate-400'}`}
          >
            <UserIcon size={24} strokeWidth={activeView === 'profile' ? 2.5 : 2} />
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;
