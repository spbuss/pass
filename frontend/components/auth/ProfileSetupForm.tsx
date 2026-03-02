
import React, { useState } from 'react';
import { User, AtSign, ChevronLeft, ArrowRight, Sparkles } from 'lucide-react';

interface ProfileSetupFormProps {
  onComplete: (data: { name: string; username: string }) => void;
  onBack: () => void;
  isLoggingIn: boolean;
}

export const ProfileSetupForm: React.FC<ProfileSetupFormProps> = ({ onComplete, onBack, isLoggingIn }) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!username.trim() || username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    onComplete({ name: fullName, username });
  };

  return (
    <div className="animate-in slide-in-from-right duration-300 space-y-5 h-full flex flex-col">
      <div className="flex items-center space-x-3 mb-4">
        <button type="button" onClick={onBack} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-white tracking-tight">Complete Profile</h2>
      </div>

      {error && (
        <div className="p-3 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-200 text-xs font-medium animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-indigo-300 uppercase tracking-widest px-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input 
              type="text" 
              autoFocus
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Alex Rivera"
              className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-indigo-300 uppercase tracking-widest px-1">Username</label>
          <div className="relative">
            <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
              placeholder="arivera"
              className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={isLoggingIn || !fullName.trim() || !username.trim()}
          className="w-full bg-white text-slate-900 h-14 rounded-2xl font-black text-lg transition-all active:scale-[0.98] shadow-xl flex items-center justify-center space-x-2 group mt-4"
        >
          {isLoggingIn ? (
            <div className="w-5 h-5 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
          ) : (
            <>
              <Sparkles size={18} className="text-indigo-600" />
              <span>Finish Setup</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform ml-2" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
