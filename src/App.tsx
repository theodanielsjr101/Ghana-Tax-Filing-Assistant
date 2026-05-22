/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TaxpayerType, PersonalDetails, IncomeState, ReliefsState } from './types';
import { calculateGhanaTax } from './utils/taxCalculator';
import StepProgress from './components/StepProgress';
import StepTaxpayerType from './components/StepTaxpayerType';
import StepPersonalDetails from './components/StepPersonalDetails';
import StepIncomeEntry from './components/StepIncomeEntry';
import StepReliefs from './components/StepReliefs';
import StepTaxCalculation from './components/StepTaxCalculation';
import StepChecklist from './components/StepChecklist';
import StepFilingGuide from './components/StepFilingGuide';
import Disclaimer from './components/Disclaimer';
import { Shield, BookOpen, Calculator, Landmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_DETAILS: PersonalDetails = {
  fullName: '',
  idType: 'ghana_card',
  idNumber: '',
  taxYear: 2024,
  region: '',
  taxOffice: '',
};

const INITIAL_INCOME: IncomeState = {
  annualGrossSalary: 0,
  annualPAYEDeducted: 0,
  annualRevenue: 0,
  annualExpenses: 0,
  annualGrossRent: 0,
  annualDividends: 0,
  annualInterest: 0,
};

const INITIAL_RELIEFS: ReliefsState = {
  hasChildEducation: false,
  childCount: 1,
  hasMarriageRelief: false,
  isOldAge: false,
  isDisabled: false,
  mortgageInterest: 0,
};

export default function App() {
  // Helper functions for safe local storage loading
  const getLocalStorageNumber = (key: string, defaultValue: number): number => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = parseInt(saved, 10);
        return isNaN(parsed) ? defaultValue : parsed;
      }
      return defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  };

  const getLocalStorageItem = <T,>(key: string, defaultValue: T): T => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  };

  const [currentStep, setCurrentStep] = useState<number>(() => 
    getLocalStorageNumber('ghana_tax_current_step', 1)
  );
  const [maxStepReached, setMaxStepReached] = useState<number>(() => 
    getLocalStorageNumber('ghana_tax_max_step_reached', 1)
  );

  // Core application states loaded from local storage
  const [selectedTypes, setSelectedTypes] = useState<TaxpayerType[]>(() => 
    getLocalStorageItem<TaxpayerType[]>('ghana_tax_selected_types', [])
  );
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>(() => 
    getLocalStorageItem<PersonalDetails>('ghana_tax_personal_details', INITIAL_DETAILS)
  );
  const [income, setIncome] = useState<IncomeState>(() => 
    getLocalStorageItem<IncomeState>('ghana_tax_income', INITIAL_INCOME)
  );
  const [reliefs, setReliefs] = useState<ReliefsState>(() => 
    getLocalStorageItem<ReliefsState>('ghana_tax_reliefs', INITIAL_RELIEFS)
  );

  // Persist states automatically as they change
  useEffect(() => {
    localStorage.setItem('ghana_tax_current_step', currentStep.toString());
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem('ghana_tax_max_step_reached', maxStepReached.toString());
  }, [maxStepReached]);

  useEffect(() => {
    localStorage.setItem('ghana_tax_selected_types', JSON.stringify(selectedTypes));
  }, [selectedTypes]);

  useEffect(() => {
    localStorage.setItem('ghana_tax_personal_details', JSON.stringify(personalDetails));
  }, [personalDetails]);

  useEffect(() => {
    localStorage.setItem('ghana_tax_income', JSON.stringify(income));
  }, [income]);

  useEffect(() => {
    localStorage.setItem('ghana_tax_reliefs', JSON.stringify(reliefs));
  }, [reliefs]);

  // Compute results dynamically on the fly based on state
  const calcResult = calculateGhanaTax(selectedTypes, income, reliefs);

  const handleNextStep = () => {
    const next = currentStep + 1;
    setCurrentStep(next);
    if (next > maxStepReached) {
      setMaxStepReached(next);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleGoToStep = (step: number) => {
    if (step <= maxStepReached) {
      setCurrentStep(step);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setMaxStepReached(1);
    setSelectedTypes([]);
    setPersonalDetails(INITIAL_DETAILS);
    setIncome(INITIAL_INCOME);
    setReliefs(INITIAL_RELIEFS);

    try {
      localStorage.removeItem('ghana_tax_current_step');
      localStorage.removeItem('ghana_tax_max_step_reached');
      localStorage.removeItem('ghana_tax_selected_types');
      localStorage.removeItem('ghana_tax_personal_details');
      localStorage.removeItem('ghana_tax_income');
      localStorage.removeItem('ghana_tax_reliefs');
      localStorage.removeItem('ghana_tax_checklist_ids');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  const hasEnteredName = personalDetails.fullName.trim() !== '';
  const taxpayerName = personalDetails.fullName.trim();
  const taxpayerInitials = hasEnteredName
    ? personalDetails.fullName.trim().split(/\s+/).map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '';
  const showHeaderTaxpayer = currentStep > 1 && hasEnteredName;

  return (
    <div className="min-h-screen bg-slate-50 pb-16 flex flex-col font-sans" id="applet-core-layout">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden" id="applet-primary-header">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-12 rounded overflow-hidden shadow-sm border border-slate-100 shrink-0">
            <div className="bg-[#CE1126] w-1/3"></div>
            <div className="bg-[#FCD116] w-1/3 flex items-center justify-center"><span className="text-[10px] font-bold text-slate-800">★</span></div>
            <div className="bg-[#006B3F] w-1/3"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight" id="brand-app-title">Ghana Tax Filing Assistant</h1>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5" id="brand-app-byline">
              Official 2024 Filing Period
              <span className="text-slate-300 select-none">•</span>
              <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#006B3F] bg-[#006B3F]/10 px-1.5 py-0.5 rounded-md">
                <span className="h-1.5 w-1.5 rounded-full bg-[#006B3F] animate-pulse"></span>
                Progress Saved
              </span>
            </p>
          </div>
        </div>
        {showHeaderTaxpayer && (
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Taxpayer</p>
              <p className="text-sm font-bold text-[#006B3F]" id="taxpayer-header-name">{taxpayerName}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[#FCD116] flex items-center justify-center border-2 border-white shadow-sm shrink-0">
              <span className="font-bold text-slate-800 text-sm">{taxpayerInitials}</span>
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-8 flex flex-col justify-between" id="app-content-core">
        
        {/* Wizard Panel card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 flex-1 flex flex-col justify-between shadow-sm border border-slate-200/60 select-none print:bg-white print:border-none print:shadow-none print:p-0 print:m-0 print:border-t-0" id="primary-wizard-layout-sheet">
          
          {/* Progress Indicators */}
          <div className="print:hidden" id="app-wizard-indicators">
            <StepProgress
              currentStep={currentStep}
              totalSteps={7}
              goToStep={handleGoToStep}
              maxStepReached={maxStepReached}
            />
          </div>

          {/* Dynamic Steps Wrapper */}
          <div className="flex-1 mt-4" id="app-steps-wrapper">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                id={`wizard-step-anim-container-${currentStep}`}
              >
                {currentStep === 1 && (
                  <StepTaxpayerType
                    selectedTypes={selectedTypes}
                    onChange={setSelectedTypes}
                    onNext={handleNextStep}
                  />
                )}

                {currentStep === 2 && (
                  <StepPersonalDetails
                    details={personalDetails}
                    onChange={setPersonalDetails}
                    onNext={handleNextStep}
                    onBack={handlePrevStep}
                  />
                )}

                {currentStep === 3 && (
                  <StepIncomeEntry
                    selectedTypes={selectedTypes}
                    onChangeSelectedTypes={setSelectedTypes}
                    income={income}
                    onChangeIncome={setIncome}
                    onNext={handleNextStep}
                    onBack={handlePrevStep}
                  />
                )}

                {currentStep === 4 && (
                  <StepReliefs
                    selectedTypes={selectedTypes}
                    income={income}
                    reliefs={reliefs}
                    onChange={setReliefs}
                    onNext={handleNextStep}
                    onBack={handlePrevStep}
                  />
                )}

                {currentStep === 5 && (
                  <StepTaxCalculation
                    personalDetails={personalDetails}
                    calcResult={calcResult}
                    onNext={handleNextStep}
                    onBack={handlePrevStep}
                  />
                )}

                {currentStep === 6 && (
                  <StepChecklist
                    selectedTypes={selectedTypes}
                    onNext={handleNextStep}
                    onBack={handlePrevStep}
                  />
                )}

                {currentStep === 7 && (
                  <StepFilingGuide
                    personalDetails={personalDetails}
                    calcResult={calcResult}
                    onBack={handlePrevStep}
                    onReset={handleReset}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Persistent Guidances bottom margin */}
          <div className="print:hidden" id="persistent-footer-disclaimer">
            <Disclaimer />
          </div>
        </div>
      </main>

      <footer className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 mt-4 border-t border-slate-200/60 text-slate-500 text-xs print:hidden" id="app-footer">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          {/* Left section */}
          <div className="space-y-1" id="footer-left">
            <p className="text-slate-400 font-medium text-[10px] uppercase tracking-wider">Developed by</p>
            <p className="text-slate-700 font-black tracking-widest uppercase text-[11px]">THEO DANIELS</p>
          </div>

          {/* Center section */}
          <div id="footer-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-slate-500 hover:text-[#006B3F] font-bold transition-colors cursor-pointer hover:underline"
              type="button"
              id="footer-back-to-top"
            >
              Back to top
            </button>
          </div>

          {/* Right section */}
          <div className="space-y-0.5 text-center sm:text-right" id="footer-right">
            <p className="font-semibold text-slate-600">© 2026 — All rights reserved</p>
            <p className="text-slate-400 text-[11px] font-medium">University of Ghana</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
