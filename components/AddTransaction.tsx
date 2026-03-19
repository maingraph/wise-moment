import React, { useState, useMemo } from 'react';
import { Goal, Transaction } from '../types';
import { ArrowLeft, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface AddTransactionProps {
  goal: Goal;
  onSave: (tx: Transaction) => void;
  onCancel: () => void;
  currentBalance: number;
}

const EXPENSE_CATEGORIES = ['Еда', 'Шопинг', 'Транспорт', 'Дом', 'Развлечения', 'Другое'];
const INCOME_CATEGORIES = ['Зарплата', 'Подарок', 'Кэшбек', 'Другое'];

export function AddTransaction({ goal, onSave, onCancel, currentBalance }: AddTransactionProps) {
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [isImpulsive, setIsImpulsive] = useState(false);
  const [showDecision, setShowDecision] = useState(false);

  const numAmount = Number(amount) || 0;

  const impact = useMemo(() => {
    if (numAmount <= 0 || type === 'income') return null;
    const today = new Date();
    const deadlineDate = new Date(goal.deadline);
    const daysToDeadline = Math.max(1, Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    const monthsToDeadline = Math.max(1, daysToDeadline / 30);
    const remainingToSave = Math.max(0, goal.targetAmount - currentBalance);
    const requiredMonthlySavings = remainingToSave / monthsToDeadline || 1;
    const delayInMonths = numAmount / requiredMonthlySavings;
    const delayInDays = Math.round(delayInMonths * 30);

    return { delayDays: delayInDays, isSignificant: delayInDays > 3 };
  }, [numAmount, goal, type, currentBalance]);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount > 0) {
      if (type === 'expense') {
        setShowDecision(true);
      } else {
        handleConfirm();
      }
    }
  };

  const handleConfirm = () => {
    onSave({
      id: crypto.randomUUID(),
      amount: numAmount,
      category,
      type,
      expenseType: type === 'expense' ? (isImpulsive ? 'impulsive' : 'planned') : undefined,
      date: new Date().toISOString()
    });
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(val);

  if (showDecision && impact) {
    return (
      <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 p-6 overflow-y-auto transition-colors duration-300">
        <button onClick={() => setShowDecision(false)} className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-6 border border-slate-100 dark:border-slate-700">
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto w-full">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-lg ${impact.isSignificant ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 shadow-rose-100 dark:shadow-none' : 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 shadow-amber-100 dark:shadow-none'}`}>
            {impact.isSignificant ? <AlertCircle className="w-10 h-10" /> : <Clock className="w-10 h-10" />}
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Момент истины</h2>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 w-full mb-8">
            <p className="text-slate-600 dark:text-slate-300 text-lg mb-4">Если ты потратишь <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(numAmount)}</span> сейчас...</p>
            <div className={`p-4 rounded-2xl ${impact.isSignificant ? 'bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-800/50' : 'bg-amber-50 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-800/50'}`}>
              <p className={`font-bold text-xl ${impact.isSignificant ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>Достижение цели сдвинется на {impact.delayDays} {impact.delayDays === 1 ? 'день' : impact.delayDays > 1 && impact.delayDays < 5 ? 'дня' : 'дней'}</p>
            </div>
          </div>
        </div>
        <div className="space-y-3 pb-4">
          <button onClick={onCancel} className="w-full bg-emerald-500 text-white rounded-2xl py-4 font-semibold text-lg hover:bg-emerald-600 transition-all shadow-md shadow-emerald-200 dark:shadow-none flex items-center justify-center space-x-2">
            <CheckCircle2 className="w-5 h-5" /><span>Отказаться от покупки</span>
          </button>
          <button onClick={handleConfirm} className="w-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 font-semibold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
            Всё равно купить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 p-6 overflow-y-auto transition-colors duration-300">
      <div className="flex items-center mb-6 mt-2">
        <button onClick={onCancel} className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700">
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white ml-4">Новая операция</h1>
      </div>
      <form onSubmit={handleContinue} className="flex-1 flex flex-col space-y-6 pb-24">
        <div className="flex p-1 bg-slate-200/50 dark:bg-slate-800 rounded-2xl">
          <button type="button" onClick={() => { setType('expense'); setCategory(EXPENSE_CATEGORIES[0]); }} className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${type === 'expense' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>Расход</button>
          <button type="button" onClick={() => { setType('income'); setCategory(INCOME_CATEGORIES[0]); }} className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${type === 'income' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>Пополнение</button>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 text-center">Сумма (₽)</label>
          <input type="number" required min="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className="block w-full text-center text-5xl font-bold text-slate-900 dark:text-white focus:outline-none bg-transparent placeholder-slate-200 dark:placeholder-slate-700" autoFocus />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Категория</label>
          <div className="grid grid-cols-3 gap-3">
            {(type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(cat => (
              <button key={cat} type="button" onClick={() => setCategory(cat)} className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${category === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}>{cat}</button>
            ))}
          </div>
        </div>
        {type === 'expense' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Тип траты</label>
            <div className="flex p-1 bg-slate-200/50 dark:bg-slate-800 rounded-2xl">
              <button type="button" onClick={() => setIsImpulsive(false)} className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${!isImpulsive ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>Плановая</button>
              <button type="button" onClick={() => setIsImpulsive(true)} className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${isImpulsive ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>Импульсивная</button>
            </div>
          </div>
        )}
        <div className="flex-1" />
        <button type="submit" disabled={numAmount <= 0} className="w-full bg-indigo-600 text-white rounded-2xl py-4 font-semibold text-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 dark:shadow-none mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
          {type === 'expense' ? 'Продолжить' : 'Сохранить'}
        </button>
      </form>
    </div>
  );
}
