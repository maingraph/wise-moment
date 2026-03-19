'use client';

import React, { useState, useEffect } from 'react';
import { AppState, Goal, Transaction, RecurringTransaction, UserProfile } from '@/types';
import { storage } from '@/lib/storage';
import { AppLayout } from '@/components/AppLayout';
import { Onboarding } from '@/components/Onboarding';
import { GoalSetup } from '@/components/GoalSetup';
import { Dashboard } from '@/components/Dashboard';
import { AddTransaction } from '@/components/AddTransaction';
import { CalendarView } from '@/components/CalendarView';
import { AddRecurring } from '@/components/AddRecurring';
import { Stats } from '@/components/Stats';
import { Profile } from '@/components/Profile';
import { Home as HomeIcon, Calendar, Plus, PieChart, User } from 'lucide-react';

function BottomNav({ current, onChange, onAdd }: { current: string, onChange: (s: AppState) => void, onAdd: () => void }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center z-50">
      <button onClick={() => onChange('dashboard')} className={`flex flex-col items-center transition-colors ${current === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>
        <HomeIcon className="w-6 h-6" />
        <span className="text-[10px] font-medium mt-1">Главная</span>
      </button>
      <button onClick={() => onChange('calendar')} className={`flex flex-col items-center transition-colors ${current === 'calendar' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>
        <Calendar className="w-6 h-6" />
        <span className="text-[10px] font-medium mt-1">Календарь</span>
      </button>
      
      <div className="relative -top-6">
        <button onClick={onAdd} className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 hover:scale-105 transition-transform">
          <Plus className="w-8 h-8" />
        </button>
      </div>

      <button onClick={() => onChange('stats')} className={`flex flex-col items-center transition-colors ${current === 'stats' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>
        <PieChart className="w-6 h-6" />
        <span className="text-[10px] font-medium mt-1">Статистика</span>
      </button>
      <button onClick={() => onChange('profile')} className={`flex flex-col items-center transition-colors ${current === 'profile' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>
        <User className="w-6 h-6" />
        <span className="text-[10px] font-medium mt-1">Профиль</span>
      </button>
    </div>
  );
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [appState, setAppState] = useState<AppState>('onboarding');
  const [goal, setGoal] = useState<Goal | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recurring, setRecurring] = useState<RecurringTransaction[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    avatar: '',
    theme: 'light'
  });
  const [completedGoals, setCompletedGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const hasOnboarded = storage.isOnboardingComplete();
    const savedGoal = storage.getGoal();
    const savedTransactions = storage.getTransactions();
    const savedRecurring = storage.getRecurring();
    const savedCompletedGoals = storage.getCompletedGoals();
    const savedProfile = storage.getProfile();

    let initialAppState: AppState = 'onboarding';
    if (hasOnboarded) {
      initialAppState = savedGoal ? 'dashboard' : 'goal-setup';
    }
    
    // Use a timeout to avoid synchronous state updates in effect
    setTimeout(() => {
      setAppState(initialAppState);
      setGoal(savedGoal);
      setTransactions(savedTransactions);
      setRecurring(savedRecurring);
      setCompletedGoals(savedCompletedGoals);
      setProfile(savedProfile);
      setIsLoaded(true);
    }, 0);
  }, []);

  if (!isLoaded) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full min-h-screen">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      </AppLayout>
    );
  }

  const handleOnboardingComplete = () => {
    storage.setOnboardingComplete();
    setAppState('goal-setup');
  };

  const handleGoalSave = (newGoal: Goal, initialSaved: number) => {
    storage.saveGoal(newGoal);
    setGoal(newGoal);
    
    if (initialSaved > 0) {
      const initialTx: Transaction = {
        id: crypto.randomUUID(),
        amount: initialSaved,
        type: 'income',
        category: 'Начальные накопления',
        date: new Date().toISOString()
      };
      storage.addTransaction(initialTx);
      setTransactions(prev => [...prev, initialTx]);
    }
    
    setAppState('dashboard');
  };

  const handleCompleteGoal = () => {
    if (!goal) return;
    
    const completedGoal: Goal = {
      ...goal,
      status: 'completed',
      achievedAt: new Date().toISOString()
    };
    
    storage.addCompletedGoal(completedGoal);
    setCompletedGoals(prev => [...prev, completedGoal]);
    
    // Add an expense transaction to "freeze" the funds
    const freezeTx: Transaction = {
      id: crypto.randomUUID(),
      amount: goal.targetAmount,
      type: 'expense',
      category: 'Отложено на цель',
      expenseType: 'planned',
      date: new Date().toISOString()
    };
    storage.addTransaction(freezeTx);
    setTransactions(prev => [...prev, freezeTx]);
    
    // Clear current goal
    storage.saveGoal(null);
    setGoal(null);
    setAppState('goal-setup');
  };

  const handleAddTransaction = (tx: Transaction) => {
    storage.addTransaction(tx);
    setTransactions(prev => [...prev, tx]);
    setAppState('dashboard');
  };

  const handleAddRecurring = (rtx: RecurringTransaction) => {
    storage.addRecurring(rtx);
    setRecurring(prev => [...prev, rtx]);
    setAppState('calendar');
  };

  const handleUpdateProfile = (newProfile: typeof profile) => {
    storage.saveProfile(newProfile);
    setProfile(newProfile);
  };

  const currentBalance = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) - transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  const showBottomNav = ['dashboard', 'calendar', 'stats', 'profile'].includes(appState);

  return (
    <AppLayout theme={profile.theme}>
      {appState === 'onboarding' && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}
      
      {appState === 'goal-setup' && (
        <GoalSetup onSave={handleGoalSave} isFirstGoal={completedGoals.length === 0} />
      )}
      
      {appState === 'dashboard' && goal && (
        <Dashboard 
          goal={goal} 
          transactions={transactions} 
          currentBalance={currentBalance}
          onCompleteGoal={handleCompleteGoal}
        />
      )}
      
      {appState === 'add-transaction' && goal && (
        <AddTransaction 
          goal={goal} 
          currentBalance={currentBalance}
          onSave={handleAddTransaction} 
          onCancel={() => setAppState('dashboard')} 
        />
      )}

      {appState === 'calendar' && (
        <CalendarView 
          recurring={recurring}
          onAddRecurring={() => setAppState('add-recurring')}
        />
      )}

      {appState === 'add-recurring' && (
        <AddRecurring
          onSave={handleAddRecurring}
          onCancel={() => setAppState('calendar')}
        />
      )}

      {appState === 'stats' && (
        <Stats 
          transactions={transactions} 
        />
      )}

      {appState === 'profile' && (
        <Profile 
          profile={profile}
          onUpdateProfile={handleUpdateProfile}
          completedGoals={completedGoals}
        />
      )}

      {showBottomNav && (
        <BottomNav 
          current={appState} 
          onChange={setAppState} 
          onAdd={() => setAppState('add-transaction')} 
        />
      )}
    </AppLayout>
  );
}
