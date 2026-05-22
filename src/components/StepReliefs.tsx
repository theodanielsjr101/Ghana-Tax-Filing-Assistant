/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { ReliefsState, TaxpayerType, IncomeState } from '../types';
import { ArrowLeft, ArrowRight, CheckCircle, Gift, Home, Smile, UserCheck, Accessibility, Sparkles } from 'lucide-react';
import { formatGHS } from '../utils/taxCalculator';

interface StepReliefsProps {
  selectedTypes: TaxpayerType[];
  income: IncomeState;
  reliefs: ReliefsState;
  onChange: (reliefs: ReliefsState) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepReliefs({
  selectedTypes,
  income,
  reliefs,
  onChange,
  onNext,
  onBack,
}: StepReliefsProps) {
  // Compute total relief in real-time
  const personalReliefVal = 4320;
  const childReliefVal = reliefs.hasChildEducation ? Math.min(3, reliefs.childCount) * 600 : 0;
  const marriageReliefVal = reliefs.hasMarriageRelief ? 200 : 0;
  const oldAgeReliefVal = reliefs.isOldAge ? 1500 : 0;
  
  // Disability relief is 25% of assessable income
  let assessableForDisability = 0;
  if (selectedTypes.includes('employed')) {
    assessableForDisability += Number(income.annualGrossSalary) || 0;
  }
  if (selectedTypes.includes('self_employed')) {
    assessableForDisability += Math.max(0, (Number(income.annualRevenue) || 0) - (Number(income.annualExpenses) || 0));
  }
  if (assessableForDisability === 0) {
    assessableForDisability =
      (Number(income.annualGrossSalary) || 0) +
      Math.max(0, (Number(income.annualRevenue) || 0) - (Number(income.annualExpenses) || 0)) +
      (Number(income.annualGrossRent) || 0) +
      (Number(income.annualDividends) || 0) +
      (Number(income.annualInterest) || 0);
  }
  const disabilityReliefVal = reliefs.isDisabled ? assessableForDisability * 0.25 : 0;
  const mortgageReliefVal = Number(reliefs.mortgageInterest) || 0;

  const totalReliefSum =
    personalReliefVal +
    childReliefVal +
    marriageReliefVal +
    oldAgeReliefVal +
    disabilityReliefVal +
    mortgageReliefVal;

  return (
    <div className="space-y-6 max-w-2xl mx-auto" id="step-reliefs-wrapper">
      <div className="text-center" id="step4-header">
        <h2 className="text-2xl font-bold font-display text-slate-900 tracking-tight flex items-center justify-center gap-2" id="step4-title">
          <span className="w-1.5 h-6 bg-[#FCD116] rounded-full inline-block"></span>
          Ghanaian Tax Reliefs & Deductions
        </h2>
        <p className="text-slate-500 mt-2 text-sm" id="step4-subtitle">
          Under the Ghana Income Tax Act, 2015 (Act 896), you are entitled to claim reliefs side-by-side to reduce your chargeable tax. See what applies to you.
        </p>
      </div>

      {/* Real-time Relief Summary Header Widget */}
      <div className="bg-gradient-to-r from-[#006B3F] to-[#005a35] text-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4" id="relief-live-summary">
        <div id="relief-summary-meta">
          <span className="text-[#FCD116] text-xs font-bold uppercase tracking-widest block mb-1">
            Active Real-time Deductions
          </span>
          <h3 className="text-xl font-bold font-display" id="relief-summary-title">
            Your Total Deductible Reliefs
          </h3>
          <p className="text-xs text-white/70 mt-1">
            This entire sum directly reduces your taxable income figure (Chargeable Income).
          </p>
        </div>
        <div className="text-center sm:text-right bg-white/10 px-5 py-3 rounded-xl backdrop-blur-xs w-full sm:w-auto" id="relief-summary-money-panel">
          <span className="text-xs text-white/85 block">Total Relief Claim</span>
          <span className="text-2xl font-black font-mono text-[#FCD116]" id="live-relief-total">
            {formatGHS(totalReliefSum)}
          </span>
        </div>
      </div>

      <div className="space-y-4" id="reliefs-checklist">
        {/* 1. Personal Relief (Auto Applied) */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-start gap-4 relative overflow-hidden" id="card-relief-personal">
          <div className="absolute top-3 right-3 bg-[#006B3F]/10 text-[#006B3F] text-[10px] uppercase font-bold py-1 px-2.5 rounded-full flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Applied
          </div>
          <div className="p-3 bg-[#006B3F]/10 text-[#006B3F] rounded-xl shrink-0">
            <UserCheck className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0" id="relief-personal-text">
            <h4 className="font-bold text-slate-900 text-sm">Personal Relief (Citizen Allowance)</h4>
            <span className="text-xs font-semibold text-[#006B3F] tracking-wide block mt-0.5">
              GH¢4,320.00 / year (Standard Deductible)
            </span>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Every registered taxpayer in Ghana automatically receives this baseline tax exemption as a standard legal threshold.
            </p>
          </div>
        </div>

        {/* 2. Child Education Relief */}
        <div className={`border rounded-2xl p-5 flex items-start gap-4 transition-all ${
          reliefs.hasChildEducation ? 'border-[#006B3F] bg-[#006B3F]/5' : 'border-slate-200 bg-white hover:border-slate-300'
        }`} id="card-relief-children">
          <div className="pt-1 select-none shrink-0" id="checkbox-child-col">
            <input
              type="checkbox"
              id="chk-relief-child"
              className="h-5 w-5 rounded border-slate-300 text-[#006B3F] focus:ring-[#006B3F] cursor-pointer"
              checked={reliefs.hasChildEducation}
              onChange={(e) => onChange({ ...reliefs, hasChildEducation: e.target.checked })}
            />
          </div>
          <div className={`p-3 rounded-xl shrink-0 ${
            reliefs.hasChildEducation ? 'bg-[#006B3F] text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            <Smile className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0" id="relief-children-text">
            <label htmlFor="chk-relief-child" className="font-bold text-slate-900 text-sm cursor-pointer block select-none">
              Child Education Relief
            </label>
            <span className="text-xs font-semibold text-[#006B3F] tracking-wide block mt-0.5">
              GH¢600.00 per child (Max 3 children — up to GH¢1,800.00 / year)
            </span>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Claimable if you are paying school fees for biological or legally adopted children enrolled in school in Ghana.
            </p>

            {reliefs.hasChildEducation && (
              <div className="mt-4 bg-white/70 border border-slate-200 p-3 rounded-xl flex items-center justify-between gap-4" id="child-counter-subform">
                <span className="text-xs font-semibold text-slate-700">Number of children qualifying:</span>
                <div className="flex items-center gap-1.5" id="child-count-selector">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => onChange({ ...reliefs, childCount: num })}
                      id={`btn-childcount-${num}`}
                      className={`h-8 w-8 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                        reliefs.childCount === num
                          ? 'bg-[#006B3F] border-[#006B3F] text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Marriage / Dependent Responsibility Relief */}
        <div className={`border rounded-2xl p-5 flex items-start gap-4 transition-all ${
          reliefs.hasMarriageRelief ? 'border-[#006B3F] bg-[#006B3F]/5' : 'border-slate-200 bg-white hover:border-slate-300'
        }`} id="card-relief-marriage">
          <div className="pt-1 select-none shrink-0">
            <input
              type="checkbox"
              id="chk-relief-marriage"
              className="h-5 w-5 rounded border-slate-300 text-[#006B3F] focus:ring-[#006B3F] cursor-pointer"
              checked={reliefs.hasMarriageRelief}
              onChange={(e) => onChange({ ...reliefs, hasMarriageRelief: e.target.checked })}
            />
          </div>
          <div className={`p-3 rounded-xl shrink-0 ${
            reliefs.hasMarriageRelief ? 'bg-[#006B3F] text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            <Gift className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0" id="relief-marriage-text">
            <label htmlFor="chk-relief-marriage" className="font-bold text-slate-900 text-sm cursor-pointer block select-none">
              Marriage or Spouse Dependent Relief
            </label>
            <span className="text-xs font-semibold text-[#006B3F] tracking-wide block mt-0.5">
              GH¢200.00 / year
            </span>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Claimable if you are married or supporting an unemployed/underemployed spouse or dependent relative.
            </p>
          </div>
        </div>

        {/* 4. Old Age / Senior Relief */}
        <div className={`border rounded-2xl p-5 flex items-start gap-4 transition-all ${
          reliefs.isOldAge ? 'border-[#006B3F] bg-[#006B3F]/5' : 'border-slate-200 bg-white hover:border-slate-300'
        }`} id="card-relief-oldage">
          <div className="pt-1 select-none shrink-0">
            <input
              type="checkbox"
              id="chk-relief-oldage"
              className="h-5 w-5 rounded border-slate-300 text-[#006B3F] focus:ring-[#006B3F] cursor-pointer"
              checked={reliefs.isOldAge}
              onChange={(e) => onChange({ ...reliefs, isOldAge: e.target.checked })}
            />
          </div>
          <div className={`p-3 rounded-xl shrink-0 ${
            reliefs.isOldAge ? 'bg-[#006B3F] text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0" id="relief-oldage-text">
            <label htmlFor="chk-relief-oldage" className="font-bold text-slate-900 text-sm cursor-pointer block select-none">
              Old Age / Senior Tax Relief
            </label>
            <span className="text-xs font-semibold text-[#006B3F] tracking-wide block mt-0.5">
              GH¢1,500.00 / year
            </span>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Available to all taxpayers who are sixty (60) years of age or older during the assessment year.
            </p>
          </div>
        </div>

        {/* 5. Disability Relief */}
        <div className={`border rounded-2xl p-5 flex items-start gap-4 transition-all ${
          reliefs.isDisabled ? 'border-[#006B3F] bg-[#006B3F]/5' : 'border-slate-200 bg-white hover:border-slate-300'
        }`} id="card-relief-disability">
          <div className="pt-1 select-none shrink-0">
            <input
              type="checkbox"
              id="chk-relief-disability"
              className="h-5 w-5 rounded border-slate-300 text-[#006B3F] focus:ring-[#006B3F] cursor-pointer"
              checked={reliefs.isDisabled}
              onChange={(e) => onChange({ ...reliefs, isDisabled: e.target.checked })}
            />
          </div>
          <div className={`p-3 rounded-xl shrink-0 ${
            reliefs.isDisabled ? 'bg-[#006B3F] text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            <Accessibility className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0" id="relief-disability-text">
            <label htmlFor="chk-relief-disability" className="font-bold text-slate-900 text-sm cursor-pointer block select-none">
              Disability Relief
            </label>
            <span className="text-xs font-semibold text-[#006B3F] tracking-wide block mt-0.5">
              25% of your Employment / Business Income
            </span>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Ghana law grants physical or sensory disability status holders a generous relief of 25% of any gross salaries or trading revenue earned.
            </p>
            {reliefs.isDisabled && (
              <div className="mt-2 text-[11px] text-[#006B3F] font-bold bg-[#006B3F]/10 p-2 rounded-lg" id="disability-live-calc-label">
                Disability Relief Active Amount: {formatGHS(disabilityReliefVal)}
              </div>
            )}
          </div>
        </div>

        {/* 6. Mortgage Interest Relief */}
        <div className={`border rounded-2xl p-5 flex items-start gap-4 transition-all ${
          reliefs.mortgageInterest > 0 ? 'border-[#006B3F] bg-[#006B3F]/5' : 'border-slate-200 bg-white hover:border-slate-300'
        }`} id="card-relief-mortgage">
          <div className="pt-1 shrink-0 select-none">
            <input
              type="checkbox"
              id="chk-relief-mortgage"
              className="h-5 w-5 rounded border-slate-300 text-[#006B3F] focus:ring-[#006B3F] cursor-pointer"
              checked={reliefs.mortgageInterest > 0}
              onChange={(e) => {
                if (!e.target.checked) {
                  onChange({ ...reliefs, mortgageInterest: 0 });
                } else {
                  onChange({ ...reliefs, mortgageInterest: 1 }); // Start with placeholder
                }
              }}
            />
          </div>
          <div className={`p-3 rounded-xl shrink-0 ${
            reliefs.mortgageInterest > 0 ? 'bg-[#006B3F] text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            <Home className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0" id="relief-mortgage-text">
            <label htmlFor="chk-relief-mortgage" className="font-bold text-slate-900 text-sm cursor-pointer block select-none">
              Mortgage Interest Relief
            </label>
            <span className="text-xs font-semibold text-[#006B3F] tracking-wide block mt-0.5">
              Deduct actual mortgage interest paid on your primary residential home
            </span>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              If you have an active bank loan for purchasing or building your primary home in Ghana, you can deduct the annual interest portion.
            </p>
 
            {reliefs.mortgageInterest > 0 && (
              <div className="mt-4 bg-white/70 border border-slate-200 p-4 rounded-xl space-y-2" id="mortgage-interest-subform">
                <label className="block text-xs font-semibold text-slate-700">
                  Annual Home Loan Interest Paid (GH¢/year)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 text-xs font-bold">
                    GH¢
                  </span>
                  <input
                    type="text"
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#006B3F] focus:ring-1 focus:ring-[#006B3F] outline-none text-sm font-semibold"
                    value={reliefs.mortgageInterest || ''}
                    onChange={(e) => {
                      const sanitized = e.target.value.replace(/[^0-9.]/g, '');
                      onChange({
                        ...reliefs,
                        mortgageInterest: sanitized === '' ? 0 : Number(sanitized),
                      });
                    }}
                    id="input-mortgage-interest"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Control row */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-100" id="step4-controls">
        <button
          type="button"
          onClick={onBack}
          id="step4-btn-back"
          className="px-6 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          id="step4-btn-next"
          className="px-8 py-2.5 rounded-lg font-bold text-sm shadow-md bg-[#006B3F] hover:bg-[#005a35] text-white transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
        >
          Calculate Tax Liability
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
