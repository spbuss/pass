
import React from 'react';
import { Plus, X, Sparkles, Filter, Send } from 'lucide-react';
import { User } from '../../types';

interface AddViewProps {
  userData: User;
  newQuestionText: string;
  setNewQuestionText: (t: string) => void;
  newQuestionCategory: string;
  setNewQuestionCategory: (c: string) => void;
  handlePostQuestion: () => void;
  setActiveView: (v: any) => void;
}

const CATEGORIES = ['General', 'Sports', 'Politics', 'Dating', 'Technology', 'Ethics', 'Food', 'Cinema', 'Lifestyle', 'Relationships', 'Travel', 'Health', 'Science', 'Music'];
const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

export const AddView: React.FC<AddViewProps> = ({ 
  userData, 
  newQuestionText, 
  setNewQuestionText, 
  newQuestionCategory, 
  setNewQuestionCategory, 
  handlePostQuestion, 
  setActiveView 
}) => (
  <div className="pb-32 min-h-screen bg-slate-50 overflow-y-auto pt-6 px-4">
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center space-x-3">
           <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
             <Plus size={24} className="text-white" strokeWidth={3} />
           </div>
           <h1 className="text-2xl font-black text-slate-900 tracking-tight">New Question</h1>
        </div>
        <button 
          onClick={() => setActiveView('home')} 
          className="p-2.5 bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full shadow-sm transition-all border border-slate-100"
        >
          <X size={20} />
        </button>
      </div>
      <div className="bg-white rounded-[32px] p-6 md:p-10 shadow-xl shadow-indigo-100/40 border border-slate-100 mb-6">
        <div className="flex items-start space-x-4 mb-10">
          <div className="relative flex-shrink-0">
             <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center border-2 border-slate-50 shadow-md">
               <span className="text-xl font-black text-slate-400 tracking-tighter">{getInitials(userData.name)}</span>
             </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-lg border-2 border-white">
              <Sparkles size={12} />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-slate-900 text-lg mb-1">{userData.name}</h4>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">Asking the community</p>
            <textarea
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="Ask something like: 'Should we ban plastic straws?'"
              rows={4}
              className="w-full border-none focus:ring-0 text-2xl font-semibold resize-none placeholder-slate-200 p-0 leading-tight min-h-[140px] focus:outline-none"
            ></textarea>
          </div>
        </div>
        <div className="space-y-8">
          <div className="border-t border-slate-50 pt-8">
            <div className="flex items-center justify-between mb-5 px-1">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center space-x-2">
                <Filter size={14} className="text-indigo-500" />
                <span>Choose Category</span>
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setNewQuestionCategory(cat)}
                  className={`px-4 py-3.5 rounded-[18px] text-[13px] font-bold transition-all border text-center flex items-center justify-center group ${
                    newQuestionCategory === cat 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200 scale-[1.02]' 
                      : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-indigo-200 hover:bg-white hover:text-indigo-600'
                  }`}
                >
                  <span>{cat === 'Dating' ? '🔥 Dating' : cat}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="pt-6">
            <button 
              onClick={handlePostQuestion}
              disabled={!newQuestionText.trim()}
              className="w-full bg-indigo-600 text-white py-6 rounded-[24px] font-black text-xl shadow-2xl shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center space-x-3 group"
            >
              <span>Post Question</span>
              <Send size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
