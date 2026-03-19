import { Goal, Transaction, RecurringTransaction, UserProfile } from '../types';

const GOAL_KEY = 'wisemoment_goal';
const COMPLETED_GOALS_KEY = 'wisemoment_completed_goals';
const TRANSACTIONS_KEY = 'wisemoment_transactions';
const RECURRING_KEY = 'wisemoment_recurring';
const ONBOARDING_KEY = 'wisemoment_onboarding_complete';
const PROFILE_KEY = 'wisemoment_profile';

export const storage = {
  getProfile: (): UserProfile => {
    if (typeof window === 'undefined') return { name: 'Пользователь', theme: 'light' };
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : { name: 'Пользователь', theme: 'light' };
  },
  saveProfile: (profile: UserProfile): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  },
  getGoal: (): Goal | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(GOAL_KEY);
    return data ? JSON.parse(data) : null;
  },
  saveGoal: (goal: Goal | null): void => {
    if (typeof window === 'undefined') return;
    if (goal) {
      localStorage.setItem(GOAL_KEY, JSON.stringify(goal));
    } else {
      localStorage.removeItem(GOAL_KEY);
    }
  },
  getCompletedGoals: (): Goal[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(COMPLETED_GOALS_KEY);
    return data ? JSON.parse(data) : [];
  },
  addCompletedGoal: (goal: Goal): void => {
    if (typeof window === 'undefined') return;
    const goals = storage.getCompletedGoals();
    goals.push(goal);
    localStorage.setItem(COMPLETED_GOALS_KEY, JSON.stringify(goals));
  },
  getTransactions: (): Transaction[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  },
  addTransaction: (tx: Transaction): void => {
    if (typeof window === 'undefined') return;
    const txs = storage.getTransactions();
    txs.push(tx);
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(txs));
  },
  getRecurring: (): RecurringTransaction[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(RECURRING_KEY);
    return data ? JSON.parse(data) : [];
  },
  addRecurring: (rtx: RecurringTransaction): void => {
    if (typeof window === 'undefined') return;
    const rtxs = storage.getRecurring();
    rtxs.push(rtx);
    localStorage.setItem(RECURRING_KEY, JSON.stringify(rtxs));
  },
  deleteRecurring: (id: string): void => {
    if (typeof window === 'undefined') return;
    const rtxs = storage.getRecurring().filter(r => r.id !== id);
    localStorage.setItem(RECURRING_KEY, JSON.stringify(rtxs));
  },
  isOnboardingComplete: (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(ONBOARDING_KEY) === 'true';
  },
  setOnboardingComplete: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ONBOARDING_KEY, 'true');
  },
  clearAll: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(GOAL_KEY);
    localStorage.removeItem(COMPLETED_GOALS_KEY);
    localStorage.removeItem(TRANSACTIONS_KEY);
    localStorage.removeItem(RECURRING_KEY);
    localStorage.removeItem(ONBOARDING_KEY);
    localStorage.removeItem(PROFILE_KEY);
  }
};
