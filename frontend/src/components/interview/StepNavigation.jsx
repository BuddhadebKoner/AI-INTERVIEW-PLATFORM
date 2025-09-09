import React from 'react';
import {
  User,
  Briefcase,
  GraduationCap,
  FileText,
  CreditCard,
  CheckCircle,
} from 'lucide-react';

const StepNavigation = ({ currentStep, completedSteps }) => {
  const steps = [
    { id: 1, name: 'Personal Info', icon: User },
    { id: 2, name: 'Professional & Education', icon: Briefcase },
    { id: 3, name: 'Documents', icon: FileText },
  ];

  return (
    <div className='mb-8 lg:mb-12'>
      <div className='flex items-center justify-center'>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isAccessible = step.id <= currentStep || isCompleted;

          return (
            <div key={step.id} className='flex items-center'>
              <div className='flex flex-col items-center'>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                        ? 'bg-blue-600 text-white'
                        : isAccessible
                          ? 'bg-slate-200 text-slate-600'
                          : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className='h-6 w-6' />
                  ) : (
                    <Icon className='h-6 w-6' />
                  )}
                </div>
                <div className='mt-2 text-center'>
                  <div
                    className={`text-sm font-medium ${
                      isCurrent
                        ? 'text-blue-600'
                        : isCompleted
                          ? 'text-green-600'
                          : 'text-slate-500'
                    }`}
                  >
                    Step {step.id}
                  </div>
                  <div
                    className={`text-xs ${
                      isCurrent
                        ? 'text-blue-600'
                        : isCompleted
                          ? 'text-green-600'
                          : 'text-slate-400'
                    }`}
                  >
                    {step.name}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-4 h-0.5 w-16 transition-all duration-300 ${
                    completedSteps.includes(step.id)
                      ? 'bg-green-500'
                      : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepNavigation;
