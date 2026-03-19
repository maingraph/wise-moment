import React, { useRef } from 'react';
import { UserProfile, Goal } from '../types';
import { User, Moon, Sun, Target, CheckCircle2, Camera } from 'lucide-react';

interface ProfileProps {
  profile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
  completedGoals: Goal[];
}

export function Profile({ profile, onUpdateProfile, completedGoals }: ProfileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfile({ ...profile, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const totalFrozen = completedGoals.reduce((sum, g) => sum + g.targetAmount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 pb-24 overflow-y-auto transition-colors duration-300">
      <div className="bg-white dark:bg-slate-800 px-6 pt-12 pb-6 rounded-b-[2.5rem] shadow-sm border-b border-slate-100 dark:border-slate-700">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Профиль</h1>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-700 shadow-sm">
              {profile.avatar ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-md hover:bg-indigo-700 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Имя</label>
            <input 
              type="text" 
              value={profile.name}
              onChange={(e) => onUpdateProfile({ ...profile, name: e.target.value })}
              className="w-full bg-transparent text-xl font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none py-1"
              placeholder="Ваше имя"
            />
          </div>
        </div>
      </div>

      <div className="px-6 pt-8 space-y-8">
        {/* Theme Toggle */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
              {profile.theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white">Тема оформления</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{profile.theme === 'dark' ? 'Темная' : 'Светлая'}</p>
            </div>
          </div>
          <button 
            onClick={() => onUpdateProfile({ ...profile, theme: profile.theme === 'dark' ? 'light' : 'dark' })}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${profile.theme === 'dark' ? 'bg-indigo-500' : 'bg-slate-300'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${profile.theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Frozen Funds / Completed Goals */}
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Отложенные средства</h2>
          
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-3xl shadow-lg text-white mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-20 rounded-full blur-xl"></div>
            <h3 className="text-emerald-100 font-medium mb-1 relative z-10">Всего заморожено на цели</h3>
            <p className="text-3xl font-bold relative z-10">{formatCurrency(totalFrozen)}</p>
          </div>

          {completedGoals.length === 0 ? (
            <div className="text-center py-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
              <Target className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 dark:text-slate-400 text-sm">У вас пока нет выполненных целей</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedGoals.map(goal => (
                <div key={goal.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white">{goal.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Выполнено: {new Date(goal.achievedAt || goal.deadline).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(goal.targetAmount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
