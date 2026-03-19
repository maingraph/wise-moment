import React, { useState } from 'react';
import { Goal } from '../types';
import { Target, Calendar, DollarSign, PiggyBank } from 'lucide-react';

interface GoalSetupProps {
  onSave: (goal: Goal, initialSaved: number) => void;
  isFirstGoal: boolean;
}

export function GoalSetup({ onSave, isFirstGoal }: GoalSetupProps) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentSaved, setCurrentSaved] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !targetAmount || !deadline) return;

    const goal: Goal = {
      id: crypto.randomUUID(),
      name,
      targetAmount: Number(targetAmount),
      currentSaved: 0, // We use transactions to track balance now
      deadline,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    onSave(goal, isFirstGoal ? (Number(currentSaved) || 0) : 0);
  };

  return (
    <div className="p-6 h-full flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="mb-8 mt-4">
        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center mb-4">
          <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Какая у тебя цель?</h1>
        <p className="text-slate-500 dark:text-slate-400">Давай определим, ради чего мы будем оптимизировать траты.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Название цели</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Target className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Отпуск на Бали"
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Сумма цели (₽)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="number"
              required
              min="1"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="300000"
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors"
            />
          </div>
        </div>

        {isFirstGoal && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Уже накоплено (₽)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PiggyBank className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                type="number"
                min="0"
                value={currentSaved}
                onChange={(e) => setCurrentSaved(e.target.value)}
                placeholder="50000 (опционально)"
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Желаемая дата достижения</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors"
            />
          </div>
        </div>

        <div className="flex-1" />

        <button
          type="submit"
          disabled={!name || !targetAmount || !deadline}
          className="w-full bg-indigo-600 text-white rounded-2xl py-4 font-semibold text-lg hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-200 dark:shadow-none mb-4"
        >
          Сохранить цель
        </button>
      </form>
    </div>
  );
}
