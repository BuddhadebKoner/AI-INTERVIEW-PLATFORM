import React from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const StepButtons = ({ currentStep, onPrevious, onNext, onSubmit, canProceed, isLastStep }) => {
   return (
      <div className="flex justify-between items-center pt-8">
         <div>
            {currentStep > 1 && (
               <button
                  type="button"
                  onClick={onPrevious}
                  className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:text-slate-800 transition-colors"
               >
                  <ArrowLeft className="w-5 h-5" />
                  Previous
               </button>
            )}
         </div>

         <div>
            {isLastStep ? (
               <button
                  type="button"
                  onClick={onSubmit}
                  disabled={!canProceed}
                  className={`px-12 py-4 rounded-xl font-semibold flex items-center gap-3 text-lg transition-all duration-300 ${canProceed
                     ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-2xl hover:scale-105 transform'
                     : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                     }`}
               >
                  Start AI Interview
                  <ArrowRight className="w-6 h-6" />
               </button>
            ) : (
               <button
                  type="button"
                  onClick={onNext}
                  disabled={!canProceed}
                  className={`px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 ${canProceed
                     ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                     : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                     }`}
               >
                  Next Step
                  <ArrowRight className="w-5 h-5" />
               </button>
            )}
         </div>
      </div>
   )
}

export default StepButtons
