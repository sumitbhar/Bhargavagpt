
import React, { useState, useEffect } from 'react';
import type { CognitiveState } from '../types';

interface CognitiveFlowProps {
  state: CognitiveState;
  t: (key: string) => any;
}

const CheckIcon = () => (
    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
);

const LoadingIcon = () => (
    <div className="w-3 h-3 border-2 border-t-transparent border-orange-400 rounded-full animate-spin"></div>
);

const CognitiveFlow: React.FC<CognitiveFlowProps> = ({ state, t }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const steps: string[] = t(`cognitiveFlow_${state}`);

  useEffect(() => {
    setCompletedSteps([]); // Reset on state change
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    
    steps.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setCompletedSteps(prev => [...prev, index]);
      }, (index + 1) * 700); // Stagger the completion animation
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [state, steps]);

  return (
    <div className="flex items-start gap-3 my-4 animate-fade-in-up">
      <div className="w-8 h-8 rounded-full bg-gray-700/80 flex items-center justify-center shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-400 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="max-w-md px-4 py-3 rounded-lg bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 text-gray-200 self-start">
        <div className="space-y-2">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(index);
            const isCurrent = completedSteps.length === index;

            return (
              <div
                key={index}
                className={`flex items-center gap-2 text-sm transition-opacity duration-500 ${isCompleted || isCurrent ? 'opacity-100' : 'opacity-50'}`}
              >
                {isCompleted ? <CheckIcon /> : <LoadingIcon />}
                <span className={`${isCurrent ? 'font-semibold text-orange-300' : 'text-gray-300'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CognitiveFlow;