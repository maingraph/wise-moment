export interface UserProfile {
  name: string;
  avatar?: string;
  theme: 'light' | 'dark';
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentSaved: number;
  deadline: string; // ISO date string
  createdAt: string;
  status?: 'active' | 'completed';
  achievedAt?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  expenseType?: 'planned' | 'impulsive';
  date: string; // ISO date string
}

export interface RecurringTransaction {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  frequency: 'monthly' | 'weekly' | 'yearly';
  nextDate: string;
}

export type AppState = 'onboarding' | 'goal-setup' | 'dashboard' | 'add-transaction' | 'stats' | 'calendar' | 'add-recurring' | 'profile';
