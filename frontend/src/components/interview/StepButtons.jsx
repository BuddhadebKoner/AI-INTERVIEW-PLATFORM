import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const StepButtons = ({
  currentStep,
  onPrevious,
  onNext,
  onSubmit,
  canProceed,
  isLastStep,
}) => {
  return (
    <div className='flex items-center justify-between pt-8'>
      <div>
        {currentStep > 1 && (
          <button
            type='button'
            onClick={onPrevious}
            className='flex items-center gap-2 px-6 py-3 text-slate-600 transition-colors hover:text-slate-800'
          >
            <ArrowLeft className='h-5 w-5' />
            Previous
          </button>
        )}
      </div>

      <div>
        {isLastStep ? (
          <button
            type='button'
            onClick={onSubmit}
            disabled={!canProceed}
            className={`flex items-center gap-3 rounded-xl px-12 py-4 text-lg font-semibold transition-all duration-300 ${
              canProceed
                ? 'transform bg-gradient-to-r from-green-600 to-blue-600 text-white hover:scale-105 hover:shadow-2xl'
                : 'cursor-not-allowed bg-slate-300 text-slate-500'
            }`}
          >
            Start AI Interview
            <ArrowRight className='h-6 w-6' />
          </button>
        ) : (
          <button
            type='button'
            onClick={onNext}
            disabled={!canProceed}
            className={`flex items-center gap-2 rounded-xl px-8 py-3 font-semibold transition-all duration-300 ${
              canProceed
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 hover:shadow-lg'
                : 'cursor-not-allowed bg-slate-300 text-slate-500'
            }`}
          >
            Next Step
            <ArrowRight className='h-5 w-5' />
          </button>
        )}
      </div>
    </div>
  );
};

export default StepButtons;
