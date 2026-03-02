import React, { useState, useMemo, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ChevronLeft, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginFormProps {
  onLogin: (method: string, credentials?: any) => void;
  onBack: () => void;
  onToggleSignup: () => void;
  onForgotPassword: () => void;
  isLoggingIn: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onBack, onToggleSignup, onForgotPassword, isLoggingIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Clear error message after a few seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: 'bg-white/10' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score, label: 'Weak', color: 'bg-rose-500', textColor: 'text-rose-400' };
    if (score <= 3) return { score, label: 'Medium', color: 'bg-amber-500', textColor: 'text-amber-400' };
    return { score, label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-400' };
  }, [password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    onLogin('email', { email, password });
  };

  return (
    <div className="animate-in slide-in-from-right-4 duration-500 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <button 
          type="button"
          onClick={onBack}
          className="p-2.5 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-colors border border-white/5"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-white tracking-tight">Login</h2>
        <div className="w-10"></div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-300 text-xs font-semibold animate-in fade-in slide-in-from-top-2 flex items-center space-x-3">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-indigo-300/60 uppercase tracking-[0.2em] px-1">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              type="email" 
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-[22px] h-16 pl-14 pr-4 text-white placeholder-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:bg-white/10 transition-all font-medium"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-[10px] font-black text-indigo-300/60 uppercase tracking-[0.2em]">Password</label>
            <button 
              type="button" 
              onClick={onForgotPassword}
              className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors hover:underline underline-offset-4"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative group">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-[22px] h-16 pl-14 pr-14 text-white placeholder-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:bg-white/10 transition-all font-medium"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          <div className="px-1 pt-1 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex space-x-1">
                {[1, 2, 3].map((segment) => (
                  <div 
                    key={segment}
                    className={`h-1 w-8 rounded-full transition-all duration-300 ${
                      passwordStrength.score >= segment 
                        ? passwordStrength.color 
                        : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest transition-colors duration-300 ${passwordStrength.textColor || 'text-white/20'}`}>
                {passwordStrength.label}
              </span>
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={isLoggingIn}
          className="w-full bg-white hover:bg-indigo-50 text-slate-900 h-16 rounded-[22px] font-black text-lg transition-all active:scale-[0.98] shadow-2xl shadow-indigo-500/10 disabled:opacity-50 mt-4 flex items-center justify-center space-x-3 group"
        >
          {isLoggingIn ? (
            <div className="w-6 h-6 border-3 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-white/30 pt-4">
        Don't have an account?{' '}
        <button 
          type="button"
          onClick={onToggleSignup}
          className="font-black text-indigo-400 hover:text-indigo-300 underline underline-offset-2 decoration-indigo-400/20"
        >
          Sign up for free
        </button>
      </p>
    </div>
  );
};
