import React from 'react';
import { Transaction } from '../types';
import { PieChart, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';

interface StatsProps {
  transactions: Transaction[];
}

export function Stats({ transactions }: StatsProps) {
  const expenses = transactions.filter(t => t.type === 'expense');
  const incomes = transactions.filter(t => t.type === 'income');
  
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalEarned = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  
  const impulsiveExpenses = expenses.filter(e => e.expenseType === 'impulsive');
  const impulsiveTotal = impulsiveExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const plannedTotal = totalSpent - impulsiveTotal;
  const impulsivePercentage = totalSpent > 0 ? Math.round((impulsiveTotal / totalSpent) * 100) : 0;

  const formatCurrency = (val: number) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(val);

  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a).slice(0, 5);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 pb-24 overflow-y-auto transition-colors duration-300">
      <div className="bg-white dark:bg-slate-800 px-6 pt-12 pb-6 rounded-b-[2.5rem] shadow-sm border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">
            <PieChart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Статистика</h1>
        </div>
      </div>

      <div className="px-6 pt-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
            <TrendingUp className="w-5 h-5 text-emerald-500 mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Доходы</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalEarned)}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
            <TrendingDown className="w-5 h-5 text-rose-500 mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Расходы</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalSpent)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-rose-50 dark:bg-rose-900/20 p-5 rounded-3xl border border-rose-100 dark:border-rose-800/30">
            <AlertTriangle className="w-6 h-6 text-rose-500 mb-3" />
            <p className="text-sm text-rose-700 dark:text-rose-400 font-medium mb-1">Импульсивно</p>
            <p className="text-xl font-bold text-rose-900 dark:text-rose-300">{formatCurrency(impulsiveTotal)}</p>
            <p className="text-xs text-rose-600 dark:text-rose-500 mt-2">{impulsivePercentage}% от трат</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-3xl border border-emerald-100 dark:border-emerald-800/30">
            <TrendingDown className="w-6 h-6 text-emerald-500 mb-3" />
            <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium mb-1">Планово</p>
            <p className="text-xl font-bold text-emerald-900 dark:text-emerald-300">{formatCurrency(plannedTotal)}</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-2">{100 - impulsivePercentage}% от трат</p>
          </div>
        </div>

        <div className="bg-slate-900 dark:bg-slate-800 p-6 rounded-3xl shadow-lg text-white relative overflow-hidden border border-transparent dark:border-slate-700">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-rose-500 opacity-20 rounded-full blur-xl"></div>
          <h3 className="text-slate-300 font-medium mb-2 relative z-10">Ушло &quot;против цели&quot;</h3>
          <p className="text-3xl font-bold text-rose-400 relative z-10">{formatCurrency(impulsiveTotal)}</p>
          <p className="text-sm text-slate-400 mt-2 relative z-10">Эту сумму можно было бы отложить на достижение вашей главной финансовой цели.</p>
        </div>

        {sortedCategories.length > 0 && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Топ категорий расходов</h3>
            <div className="space-y-4">
              {sortedCategories.map(([cat, amount]) => (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{cat}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(amount)}</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full" style={{ width: `${(amount / totalSpent) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
