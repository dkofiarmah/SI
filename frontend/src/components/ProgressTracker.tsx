import React from 'react';
import { Check } from 'lucide-react';

interface ProgressTrackerProps {
  steps: string[];
  currentStep: number;
  onChange?: (step: number) => void;
  allowSkip?: boolean;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  steps,
  currentStep,
  onChange,
  allowSkip = false
}) => {
  return (
    <div className="w-full">
      <div className="relative">
        <div className="flex mb-2 justify-between">
          {steps.map((step, index) => (
            <div
              key={index}
              onClick={() => {
                if (onChange && (allowSkip || index + 1 <= currentStep)) {
                  onChange(index + 1);
                }
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                index + 1 < currentStep
                  ? 'bg-blue-600 text-white cursor-pointer'
                  : index + 1 === currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-500 ' + (allowSkip || index + 1 <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed')
              }`}
            >
              {index + 1 < currentStep ? <Check className="h-5 w-5" /> : index + 1}
            </div>
          ))}
        </div>
        <div className="relative">
          <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full -mt-3"></div>
          <div
            className="absolute top-0 left-0 h-1 bg-blue-600 -mt-3"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        {steps.map((step, index) => (
          <span 
            key={index} 
            className={`text-center w-20 ${
              index + 1 <= currentStep ? 'font-medium text-blue-600' : ''
            }`}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
};
