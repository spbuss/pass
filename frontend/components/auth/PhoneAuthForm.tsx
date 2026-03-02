
import React, { useState, useRef } from 'react';
import { Smartphone, ChevronLeft, ArrowRight, Sparkles, User, AtSign, ChevronDown } from 'lucide-react';

interface PhoneAuthFormProps {
  onComplete: (data?: { name: string; username: string }) => void;
  onBack: () => void;
  isLoggingIn: boolean;
  isSignupMode: boolean;
}

export const PhoneAuthForm: React.FC<PhoneAuthFormProps> = ({ onComplete, onBack, isLoggingIn, isSignupMode }) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [showCountryCodes, setShowCountryCodes] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const countryCodes = [
    { code: '+91', country: 'IN' },
    { code: '+1', country: 'US/CA' },
    { code: '+44', country: 'UK' },
    { code: '+61', country: 'AU' },
    { code: '+81', country: 'JP' },
  ];
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignupMode) {
      if (!fullName.trim()) {
        setError('Please enter your full name');
        return;
      }
      if (!username.trim() || username.length < 3) {
        setError('Username must be at least 3 characters');
        return;
      }
    }
    if (phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    setError('');
    setIsSending(true);
    
    // Simulate sending OTP
    setTimeout(() => {
      setIsSending(false);
      setStep('otp');
    }, 1200);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (otp.some(digit => !digit)) {
      setError('Please enter the full 6-digit code');
      return;
    }
    if (isSignupMode) {
      onComplete({ name: fullName, username });
    } else {
      onComplete();
    }
  };

  return (
    <div className="animate-in slide-in-from-right duration-300 space-y-5 h-full flex flex-col">
      <div className="flex items-center space-x-3 mb-4">
        <button 
          type="button"
          onClick={step === 'otp' ? () => setStep('phone') : onBack}
          className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-white tracking-tight">
          {step === 'otp' ? 'Verify Identity' : (isSignupMode ? 'Join HardNo' : 'Phone Verification')}
        </h2>
      </div>

      {error && (
        <div className="p-3 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-200 text-xs font-medium animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      {step === 'phone' ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          {isSignupMode && (
            <>
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
            </>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-indigo-300 uppercase tracking-widest px-1">Mobile Number</label>
            <div className="relative flex items-center">
              <div className="relative">
                <button 
                  type="button"
                  onClick={() => setShowCountryCodes(!showCountryCodes)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-14 px-4 text-indigo-400 font-bold flex items-center space-x-1 border-r border-white/10 hover:bg-white/5 rounded-l-2xl transition-colors z-10"
                >
                  <Smartphone size={18} />
                  <span className="text-sm">{countryCode}</span>
                  <ChevronDown size={14} className="ml-1 opacity-70" />
                </button>
                
                {showCountryCodes && (
                  <div className="absolute top-full left-0 mt-2 w-32 bg-slate-800 border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden">
                    {countryCodes.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          setCountryCode(c.code);
                          setShowCountryCodes(false);
                        }}
                        className="w-full px-4 py-3 text-left text-sm font-bold text-white hover:bg-white/10 transition-colors flex justify-between items-center"
                      >
                        <span>{c.code}</span>
                        <span className="text-xs text-slate-400">{c.country}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input 
                type="tel" 
                autoFocus={!isSignupMode}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="00000 00000"
                className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 pl-28 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-lg tracking-widest"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSending || phoneNumber.length < 10 || (isSignupMode && (!fullName.trim() || !username.trim()))}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white h-14 rounded-2xl font-black text-lg transition-all active:scale-[0.98] shadow-xl shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center space-x-2 group mt-2"
          >
            {isSending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>{isSignupMode ? 'Send Verification' : 'Send OTP'}</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-right duration-300">
          <div className="text-center space-y-2">
            <p className="text-indigo-200 text-sm">Enter the code sent to</p>
            <p className="text-white font-bold tracking-widest">{countryCode} {phoneNumber.replace(/(\d{5})(\d{5})/, "$1 $2")}</p>
          </div>

          <div className="flex justify-between gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { otpRefs.current[idx] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                autoFocus={idx === 0}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-full h-14 bg-white/5 border border-white/10 rounded-xl text-center text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
              />
            ))}
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleVerify}
              disabled={isLoggingIn || otp.some(d => !d)}
              className="w-full bg-white text-slate-900 h-14 rounded-2xl font-black text-lg transition-all active:scale-[0.98] shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoggingIn ? (
                <div className="w-5 h-5 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
              ) : (
                <>
                  <Sparkles size={18} className="text-indigo-600" />
                  <span>{isSignupMode ? 'Verify & Create Profile' : 'Verify & Continue'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
