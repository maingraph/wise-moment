import React from 'react';
import { RecurringTransaction } from '../types';
import { Calendar as CalendarIcon, Plus, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

interface CalendarViewProps {
  recurring: RecurringTransaction[];
  onAddRecurring: () => void;
}

export function CalendarView({ recurring, onAddRecurring }: CalendarViewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(new Date(dateString));
  };

  const frequencyLabel = {
    'monthly': 'Ежемесячно',
    'weekly': 'Еженедельно',
    'yearly': 'Ежегодно'
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 pb-24 overflow-y-auto transition-colors duration-300">
      <div className="bg-white dark:bg-slate-800 px-6 pt-12 pb-6 rounded-b-[2.5rem] shadow-sm border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">
            <CalendarIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Календарь</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Управление постоянными доходами и расходами</p>
      </div>

      <div className="px-6 pt-6 flex-1">
        <button
          onClick={onAddRecurring}
          className="w-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-400 rounded-2xl py-4 font-semibold flex items-center justify-center space-x-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors mb-6"
        >
          <Plus className="w-5 h-5" />
          <span>Добавить регулярный платеж</span>
        </button>

        {recurring.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-slate-500 dark:text-slate-400">Нет регулярных операций</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recurring.sort((a,b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime()).map(rtx => (
              <div key={rtx.id} className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      rtx.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                    }`}>
                      {rtx.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white">{rtx.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{rtx.category} • {frequencyLabel[rtx.frequency]}</p>
                    </div>
                  </div>
                  <div className={`font-bold ${rtx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-white'}`}>
                    {rtx.type === 'income' ? '+' : '-'}{formatCurrency(rtx.amount)}
                  </div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Следующий платеж:</span>
                  <div className="flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    {formatDate(rtx.nextDate)}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
