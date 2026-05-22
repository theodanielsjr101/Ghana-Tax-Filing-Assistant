/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Check } from 'lucide-react';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  goToStep: (step: number) => void;
  maxStepReached: number;
}

const STEP_LABELS = [
  'Taxpayer Type',
  'Personal Details',
  'Income Sources',
  'Reliefs & Deductions',
  'Calculations',
  'Document Checklist',
  'Filing Guide',
];

export default function StepProgress({
  currentStep,
  totalSteps,
  goToStep,
  maxStepReached,
}: StepProgressProps) {
  // Percentage of total progress
  const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full mb-8" id="step-progress-container">
      {/* Visual Ghana Flag Top Accents Bar */}
      <div className="h-1.5 w-full flex rounded-full overflow-hidden mb-6" id="ghana-accent-bar">
        <div className="bg-[#CE1126] h-full flex-1" id="ghana-red-stripe" />
        <div className="bg-[#FCD116] h-full flex-1" id="ghana-gold-stripe" />
        <div className="bg-[#006B3F] h-full flex-1" id="ghana-green-stripe" />
      </div>

      {/* Progress Line and Circles */}
      <div className="relative flex justify-between items-center" id="step-indicators-line">
        <div
          className="absolute h-1 bg-slate-100 left-3 right-3 top-1/2 -translate-y-1/2 rounded-full"
          id="progress-track-bg"
        >
          <div
            className="h-full bg-[#006B3F] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
            id="progress-track-filled"
          />
        </div>

        {Array.from({ length: totalSteps }).map((_, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;
          const isSelectable = stepNum <= maxStepReached;

          return (
            <button
              key={stepNum}
              type="button"
              disabled={!isSelectable}
              onClick={() => goToStep(stepNum)}
              id={`step-btn-${stepNum}`}
              className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border transition-all focus:outline-none cursor-pointer ${
                isCompleted
                  ? 'bg-[#006B3F] border-[#006B3F] text-white shadow-sm'
                  : isActive
                  ? 'border-4 border-[#006B3F] bg-white text-[#006B3F] font-bold scale-110 shadow'
                  : isSelectable
                  ? 'bg-white border-slate-300 text-slate-700 hover:border-[#006B3F]'
                  : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isCompleted ? (
                <Check className="h-4 w-4 stroke-[3]" />
              ) : (
                <span className="text-xs">{stepNum}</span>
              )}
              
              {/* Tooltip or small label for desktop */}
              <span
                id={`step-label-sub-${stepNum}`}
                className={`absolute top-10 whitespace-nowrap text-[10px] font-bold uppercase tracking-tight transition-all ${
                  isActive
                    ? 'text-[#006B3F] font-bold'
                    : isCompleted
                    ? 'text-slate-400'
                    : 'text-slate-400'
                } hidden md:block`}
              >
                {STEP_LABELS[idx]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile-only Step Status Label */}
      <div className="mt-4 text-center md:hidden" id="mobile-step-indicator-label">
        <span className="text-xs text-slate-400 font-bold font-mono tracking-wider uppercase">
          Step {currentStep} of {totalSteps}
        </span>
        <h3 className="text-lg font-bold text-slate-800" id="step-label-mobile">
          {STEP_LABELS[currentStep - 1]}
        </h3>
      </div>
    </div>
  );
}
