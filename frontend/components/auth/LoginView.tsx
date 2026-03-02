import React, { useState } from 'react';
import { CheckSquare, Smartphone, Shield, ArrowRight, Zap, ChevronLeft, Mail, Sparkles } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { PhoneAuthForm } from './PhoneAuthForm';
import { ProfileSetupForm } from './ProfileSetupForm';

const GoogleLogo = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

interface LoginViewProps {
  onLogin: (method: string, credentials?: any) => void;
  isLoggingIn: boolean;
  isSignupMode: boolean;
  setIsSignupMode: (val: boolean) => void;
}

type AuthStep = 'initial' | 'email-form' | 'phone-auth' | 'social-setup' | 'forgot-password';

const ForgotPasswordForm: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  
  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
      <div className="flex items-center space-x-3">
        <button type="button" onClick={onBack} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-white tracking-tight">Reset Password</h2>
      </div>
      
      {sent ? (
        <div className="text-center py-6 animate-in zoom-in">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles size={28} />
          </div>
          <h3 className="text-white font-bold mb-2">Email Sent!</h3>
          <p className="text-indigo-200/60 text-sm mb-6 px-4">Check your inbox for instructions to reset your password.</p>
          <button onClick={onBack} className="text-indigo-400 font-black text-xs uppercase tracking-widest">Back to Login</button>
        </div>
      ) : (
        <form onSubmit={handleReset} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-indigo-300/60 uppercase tracking-widest px-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="email" 
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-[22px] h-16 pl-14 pr-4 text-white placeholder-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:bg-white/10 transition-all"
              />
            </div>
          </div>
          <button type="submit" disabled={!email.includes('@')} className="w-full bg-white text-slate-900 h-16 rounded-[22px] font-black text-lg shadow-xl disabled:opacity-50">
            Send Reset Link
          </button>
        </form>
      )}
    </div>
  );
};

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, isLoggingIn, isSignupMode, setIsSignupMode }) => {
  const [authStep, setAuthStep] = useState<AuthStep>('initial');
  const [authMethod, setAuthMethod] = useState<string>('google');

  const handleSocialClick = (method: string) => {
    setAuthMethod(method);
    if (isSignupMode) {
      setAuthStep('social-setup');
    } else {
      onLogin(method);
    }
  };

  const handlePhoneStart = () => {
    setAuthMethod('phone');
    setAuthStep('phone-auth');
  };

  const handlePhoneComplete = (data?: { name: string; username: string }) => {
    onLogin('phone', data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0f172a] relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-rose-500/10 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>

      <div className="max-w-md w-full z-10 animate-in fade-in zoom-in duration-1000">
        <div className="text-center mb-10">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative inline-flex p-5 rounded-[28px] bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/30 mb-6">
              <CheckSquare size={38} className="text-white" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-3">HardNo</h1>
          <p className="text-indigo-200/60 text-base font-medium max-w-xs mx-auto">
            {isSignupMode ? 'The world’s most trusted social polling network.' : 'Sign in to discover what the world thinks.'}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] space-y-4 relative overflow-hidden">
          {authStep === 'initial' && (
            <div className="animate-in slide-in-from-bottom-4 duration-500 flex flex-col">
              <div className="flex bg-black/20 p-1.5 rounded-2xl mb-8 border border-white/5">
                <button 
                  onClick={() => setIsSignupMode(false)}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${!isSignupMode ? 'bg-white text-slate-900 shadow-xl' : 'text-white/50 hover:text-white'}`}
                >
                  Login
                </button>
                <button 
                  onClick={() => setIsSignupMode(true)}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${isSignupMode ? 'bg-white text-slate-900 shadow-xl' : 'text-white/50 hover:text-white'}`}
                >
                  Sign Up
                </button>
              </div>

              <div className="space-y-4">
                <button 
                  disabled={isLoggingIn}
                  onClick={() => handleSocialClick('google')}
                  className="w-full flex items-center px-6 bg-white hover:bg-slate-50 text-slate-900 h-16 rounded-[22px] font-bold transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg group"
                >
                  <div className="group-hover:scale-110 transition-transform"><GoogleLogo /></div>
                  <span className="flex-1 text-center pr-6">{isSignupMode ? 'Sign up with Google' : 'Continue with Google'}</span>
                </button>
                
                <button 
                  disabled={isLoggingIn}
                  onClick={handlePhoneStart}
                  className="w-full flex items-center px-6 bg-indigo-600 hover:bg-indigo-500 text-white h-16 rounded-[22px] font-bold transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-indigo-600/20 group"
                >
                  <Smartphone size={22} className="text-indigo-200 group-hover:scale-110 transition-transform" />
                  <span className="flex-1 text-center pr-6">Phone Number OTP</span>
                </button>

                <div className="flex items-center py-4">
                  <div className="flex-1 border-t border-white/10"></div>
                  <span className="px-4 text-[10px] uppercase tracking-[0.2em] font-black text-white/20">or use your email</span>
                  <div className="flex-1 border-t border-white/10"></div>
                </div>

                <button 
                  disabled={isLoggingIn}
                  onClick={() => setAuthStep('email-form')}
                  className="w-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white h-14 rounded-[20px] font-bold transition-all border border-white/10 group"
                >
                  <span className="text-sm">Email & Password</span>
                  <ArrowRight size={16} className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </div>
          )}

          {authStep === 'email-form' && (
            isSignupMode ? (
              <SignupForm 
                onSignup={onLogin} 
                onBack={() => setAuthStep('initial')} 
                onToggleLogin={() => setIsSignupMode(false)}
                isLoggingIn={isLoggingIn}
              />
            ) : (
              <LoginForm 
                onLogin={onLogin} 
                onBack={() => setAuthStep('initial')} 
                onToggleSignup={() => setIsSignupMode(true)}
                onForgotPassword={() => setAuthStep('forgot-password')}
                isLoggingIn={isLoggingIn}
              />
            )
          )}

          {authStep === 'forgot-password' && (
            <ForgotPasswordForm onBack={() => setAuthStep('email-form')} />
          )}

          {authStep === 'phone-auth' && (
            <PhoneAuthForm 
              onComplete={handlePhoneComplete}
              onBack={() => setAuthStep('initial')}
              isLoggingIn={isLoggingIn}
              isSignupMode={isSignupMode}
            />
          )}

          {authStep === 'social-setup' && (
            <ProfileSetupForm 
              onComplete={(data) => onLogin(authMethod, data)}
              onBack={() => setAuthStep('initial')}
              isLoggingIn={isLoggingIn}
            />
          )}
        </div>

        <div className="mt-10 flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2 text-indigo-300/40 text-[10px] font-black uppercase tracking-widest">
            <Shield size={12} />
            <span>Secure Enterprise Authentication</span>
          </div>
          <div className="flex items-center space-x-6 text-white/20">
            <Zap size={18} />
            <div className="h-4 w-px bg-white/10"></div>
            <p className="text-[10px] font-bold tracking-wider">HARDNO INC © {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
