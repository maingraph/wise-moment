import React from 'react';
import { Goal, Transaction } from '../types';
import { Target, Calendar, TrendingDown, TrendingUp, Coffee, ShoppingBag, Car, Home, Zap, Wallet, CheckCircle2 } from 'lucide-react';

interface DashboardProps {
  goal: Goal;
  transactions: Transaction[];
  currentBalance: number;
  onCompleteGoal: () => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'Еда': <Coffee className="w-4 h-4" />,
  'Шопинг': <ShoppingBag className="w-4 h-4" />,
  'Транспорт': <Car className="w-4 h-4" />,
  'Дом': <Home className="w-4 h-4" />,
  'Развлечения': <Zap className="w-4 h-4" />,
  'Зарплата': <Wallet className="w-4 h-4" />,
  'Другое': <TrendingDown className="w-4 h-4" />
};

export function Dashboard({ goal, transactions, currentBalance, onCompleteGoal }: DashboardProps) {
  const progressPercentage = Math.min(100, Math.max(0, (currentBalance / goal.targetAmount) * 100));
  const isGoalReached = currentBalance >= goal.targetAmount;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' }).format(new Date(dateString));
  };

  const sortedTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 pb-24 overflow-y-auto transition-colors duration-300">
      {/* Header / Goal Card */}
      <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 px-6 pt-12 pb-10 rounded-b-[2.5rem] shadow-xl shadow-indigo-500/20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-indigo-200 text-sm font-medium mb-1 tracking-wide uppercase">Мой баланс</p>
              <h2 className="text-4xl font-extrabold tracking-tight">{formatCurrency(currentBalance)}</h2>
            </div>
          </div>

          {/* Glassmorphism Goal Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-indigo-200" />
                <span className="font-medium">{goal.name}</span>
              </div>
              <span className="text-sm font-bold bg-white/20 px-2 py-1 rounded-lg">{progressPercentage.toFixed(1)}%</span>
            </div>
            
            <div className="h-2.5 bg-black/20 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center text-xs text-indigo-100">
              <span>Цель: {formatCurrency(goal.targetAmount)}</span>
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                <span>{formatDate(goal.deadline)}</span>
              </div>
            </div>
          </div>

          {isGoalReached && (
            <div className="mt-6">
              <button 
                onClick={onCompleteGoal}
                className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-6 h-6" />
                <span>Отложить {formatCurrency(goal.targetAmount)} и завершить цель</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-6 pt-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Последние операции</h3>
        </div>

        {sortedTransactions.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <Wallet className="w-6 h-6 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Пока нет операций</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Добавьте доход или расход</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedTransactions.map(tx => (
              <div key={tx.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    tx.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 
                    tx.expenseType === 'impulsive' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  }`}>
                    {tx.type === 'income' ? <TrendingUp className="w-6 h-6" /> : (categoryIcons[tx.category] || <ShoppingBag className="w-6 h-6" />)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white">{tx.category}</p>
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-1 space-x-2">
                      <span>{formatDate(tx.date)}</span>
                      {tx.type === 'expense' && (
                        <>
                          <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
                          <span className={tx.expenseType === 'impulsive' ? 'text-rose-500 dark:text-rose-400 font-medium' : 'text-indigo-500 dark:text-indigo-400 font-medium'}>
                            {tx.expenseType === 'impulsive' ? 'Импульсивная' : 'Плановая'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className={`font-bold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-white'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
