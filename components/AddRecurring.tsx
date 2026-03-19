import React, { useState } from 'react';
import { RecurringTransaction } from '../types';
import { ArrowLeft, Calendar } from 'lucide-react';

interface AddRecurringProps {
  onSave: (rtx: RecurringTransaction) => void;
  onCancel: () => void;
}

const EXPENSE_CATEGORIES = ['Подписки', 'Квартплата', 'Кредит', 'Связь', 'Другое'];
const INCOME_CATEGORIES = ['Зарплата', 'Аренда', 'Инвестиции', 'Другое'];

export function AddRecurring({ onSave, onCancel }: AddRecurringProps) {
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [frequency, setFrequency] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');
  const [nextDate, setNextDate] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !nextDate) return;

    onSave({
      id: crypto.randomUUID(),
      name,
      amount: Number(amount),
      type,
      category,
      frequency,
      nextDate
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 p-6 overflow-y-auto">
      <div className="flex items-center mb-6 mt-2">
        <button onClick={onCancel} className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm">
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white ml-4">Новый регулярный платеж</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-6 pb-24">
        <div className="flex p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl">
          <button type="button" onClick={() => { setType('expense'); setCategory(EXPENSE_CATEGORIES[0]); }} className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${type === 'expense' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>Расход</button>
          <button type="button" onClick={() => { setType('income'); setCategory(INCOME_CATEGORIES[0]); }} className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${type === 'income' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>Доход</button>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 text-center">Сумма (₽)</label>
          <input type="number" required min="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className="block w-full text-center text-5xl font-bold text-slate-900 dark:text-white focus:outline-none bg-transparent placeholder-slate-200 dark:placeholder-slate-600" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Название</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder={type === 'expense' ? "Например: Netflix" : "Например: Зарплата"} className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Категория</label>
          <div className="grid grid-cols-2 gap-2">
            {(type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(cat => (
              <button key={cat} type="button" onClick={() => setCategory(cat)} className={`py-2 px-2 rounded-xl text-sm font-medium transition-all ${category === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}>{cat}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Частота</label>
            <select value={frequency} onChange={(e) => setFrequency(e.target.value as any)} className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
              <option value="weekly">Раз в неделю</option>
              <option value="monthly">Раз в месяц</option>
              <option value="yearly">Раз в год</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Следующая дата</label>
            <input type="date" required min={new Date().toISOString().split('T')[0]} value={nextDate} onChange={(e) => setNextDate(e.target.value)} className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
          </div>
        </div>

        <button type="submit" className="w-full bg-indigo-600 text-white rounded-2xl py-4 font-semibold text-lg hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-md shadow-indigo-200 dark:shadow-none mt-4">
          Сохранить
        </button>
      </form>
    </div>
  );
}
