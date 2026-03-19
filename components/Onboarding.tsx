import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Target, Brain, TrendingUp } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    id: 1,
    icon: <TrendingUp className="w-12 h-12 text-indigo-500 dark:text-indigo-400 mb-6" />,
    title: "Раньше я просто считал траты",
    description: "И всё равно жил от зарплаты до зарплаты, не понимая, куда уходят деньги."
  },
  {
    id: 2,
    icon: <Brain className="w-12 h-12 text-indigo-500 dark:text-indigo-400 mb-6" />,
    title: "Теперь я принимаю решения",
    description: "Исходя из своих истинных целей, а не сиюминутных эмоций."
  },
  {
    id: 3,
    icon: <Target className="w-12 h-12 text-indigo-500 dark:text-indigo-400 mb-6" />,
    title: "WiseMoment",
    description: "Показывает, как каждая конкретная трата влияет на твою главную цель прямо в момент покупки."
  }
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="flex flex-col h-full p-6 justify-between bg-slate-50 dark:bg-slate-900">
      <div className="flex-1 flex flex-col items-center justify-center text-center mt-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            {slides[currentSlide].icon}
            <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">{slides[currentSlide].title}</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pb-8 pt-4">
        <div className="flex justify-center space-x-2 mb-8">
          {slides.map((_, index) => (
            <div 
              key={index} 
              className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-8 bg-indigo-600 dark:bg-indigo-500' : 'w-2 bg-indigo-200 dark:bg-slate-700'}`}
            />
          ))}
        </div>
        
        <button
          onClick={handleNext}
          className="w-full bg-indigo-600 text-white rounded-2xl py-4 font-semibold text-lg flex items-center justify-center space-x-2 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-md shadow-indigo-200 dark:shadow-none"
        >
          <span>{currentSlide === slides.length - 1 ? 'Начать' : 'Далее'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
