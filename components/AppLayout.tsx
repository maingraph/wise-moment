import React from 'react';
import { motion } from 'motion/react';

interface AppLayoutProps {
  children: React.ReactNode;
  theme?: 'light' | 'dark';
}

export function AppLayout({ children, theme = 'light' }: AppLayoutProps) {
  return (
    <div className={`min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900 ${theme === 'dark' ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      <div className="max-w-md mx-auto min-h-screen bg-white dark:bg-slate-900 shadow-xl relative flex flex-col transition-colors duration-300">
        <motion.main 
          className="flex-1 overflow-y-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
