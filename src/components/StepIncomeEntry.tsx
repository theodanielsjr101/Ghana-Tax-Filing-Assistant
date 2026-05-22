/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TaxpayerType, IncomeState } from '../types';
import { ArrowLeft, ArrowRight, HelpCircle, Briefcase, User, Building2, Landmark, Plus, Trash2 } from 'lucide-react';

interface StepIncomeEntryProps {
  selectedTypes: TaxpayerType[];
  onChangeSelectedTypes: (types: TaxpayerType[]) => void;
  income: IncomeState;
  onChangeIncome: (income: IncomeState) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepIncomeEntry({
  selectedTypes,
  onChangeSelectedTypes,
  income,
  onChangeIncome,
  onNext,
  onBack,
}: StepIncomeEntryProps) {
  // Update single income state field
  const handleFieldChange = (field: keyof IncomeState, value: string) => {
    // Basic sanitization, allow only numbers/decimals
    const sanitizedVal = value.replace(/[^0-9.]/g, '');
    onChangeIncome({
      ...income,
      [field]: sanitizedVal === '' ? 0 : Number(sanitizedVal),
    });
  };

  // Check if at least one income value is entered to make progress logical
  const hasSomeIncomeInput = () => {
    if (selectedTypes.includes('employed') && income.annualGrossSalary > 0) return true;
    if (selectedTypes.includes('self_employed') && income.annualRevenue > 0) return true;
    if (selectedTypes.includes('rental') && income.annualGrossRent > 0) return true;
    if (selectedTypes.includes('investment') && (income.annualDividends > 0 || income.annualInterest > 0)) return true;
    return false;
  };

  // Toggle category on the fly
  const toggleTypeOnFly = (type: TaxpayerType) => {
    if (selectedTypes.includes(type)) {
      onChangeSelectedTypes(selectedTypes.filter((t) => t !== type));
      // Reset values
      if (type === 'employed') {
        onChangeIncome({ ...income, annualGrossSalary: 0, annualPAYEDeducted: 0 });
      } else if (type === 'self_employed') {
        onChangeIncome({ ...income, annualRevenue: 0, annualExpenses: 0 });
      } else if (type === 'rental') {
        onChangeIncome({ ...income, annualGrossRent: 0 });
      } else if (type === 'investment') {
        onChangeIncome({ ...income, annualDividends: 0, annualInterest: 0 });
      }
    } else {
      onChangeSelectedTypes([...selectedTypes, type]);
    }
  };

  const isNextValid = selectedTypes.length > 0 && hasSomeIncomeInput();

  return (
    <div className="space-y-6 max-w-2xl mx-auto" id="step-income-entry-wrapper">
      <div className="text-center" id="step3-header">
        <h2 className="text-2xl font-bold font-display text-slate-900 tracking-tight flex items-center justify-center gap-2" id="step3-title">
          <span className="w-1.5 h-6 bg-[#FCD116] rounded-full inline-block"></span>
          Declare Your Income Sources
        </h2>
        <p className="text-slate-500 mt-2 text-sm" id="step3-subtitle">
          Input your annual values in Ghanaian Cedis (GH¢). Enter all numbers on a yearly basis.
        </p>
      </div>

      <div className="space-y-5" id="income-active-cards">
        {/* Employed Card Form */}
        {selectedTypes.includes('employed') && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden" id="income-card-employed">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#006B3F]" id="income-card-employed-accent" />
            <div className="flex items-start justify-between gap-4 mb-4" id="income-card-employed-header">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#006B3F]/10 text-[#006B3F] rounded-lg">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Salaried / Employed Income</h3>
                  <span className="text-xs text-slate-400">Regular job monthly PAYE earnings (Form P9)</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleTypeOnFly('employed')}
                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                title="Remove this income source"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="employed-fields">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                  Annual Gross Salary (GH¢)
                  <span className="group relative text-slate-400 hover:text-slate-600 cursor-help">
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[10px] p-2 rounded-md w-48 shadow font-normal text-center z-20">
                      Total yearly earnings before any tax or pension deductions. Refer to your P9 Form base salary.
                    </span>
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 text-sm font-bold">
                    GH¢
                  </span>
                  <input
                    type="text"
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#006B3F] focus:ring-1 focus:ring-[#006B3F] outline-none text-sm font-medium"
                    value={income.annualGrossSalary || ''}
                    onChange={(e) => handleFieldChange('annualGrossSalary', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                  PAYE Tax Already Deducted (GH¢)
                  <span className="group relative text-slate-400 hover:text-slate-600 cursor-help">
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[10px] p-2 rounded-md w-48 shadow font-normal text-center z-20">
                      Amount your employer already deducted and paid to GRA on your behalf over the year.
                    </span>
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 text-sm font-bold">
                    GH¢
                  </span>
                  <input
                    type="text"
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#006B3F] focus:ring-1 focus:ring-[#006B3F] outline-none text-sm font-medium"
                    value={income.annualPAYEDeducted || ''}
                    onChange={(e) => handleFieldChange('annualPAYEDeducted', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Self Employed Card Form */}
        {selectedTypes.includes('self_employed') && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden" id="income-card-selfemployed">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-505 bg-amber-500" id="income-card-self-accent" />
            <div className="flex items-start justify-between gap-4 mb-4" id="income-card-self-header">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Self-Employed / Freelancer Income</h3>
                  <span className="text-xs text-slate-400">Sole Trader revenue and business costs</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleTypeOnFly('self_employed')}
                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                title="Remove this income source"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="self-employed-fields">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                  Total Annual Income / Revenue (GH¢)
                  <span className="group relative text-slate-400 hover:text-slate-600 cursor-help">
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[10px] p-2 rounded-md w-48 shadow font-normal text-center z-20">
                      All money received from clients and services rendered over the 12-month period before operational costs.
                    </span>
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 text-sm font-bold">
                    GH¢
                  </span>
                  <input
                    type="text"
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#006B3F] focus:ring-1 focus:ring-[#006B3F] outline-none text-sm font-medium"
                    value={income.annualRevenue || ''}
                    onChange={(e) => handleFieldChange('annualRevenue', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                  Allowable Expenses (GH¢)
                  <span className="group relative text-slate-400 hover:text-slate-600 cursor-help">
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[10px] p-2 rounded-md w-48 shadow font-normal text-center z-20">
                      Standard allowable expenses incurred wholly and exclusively for running your enterprise (e.g. office rent, utilities, business logistics).
                    </span>
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 text-sm font-bold">
                    GH¢
                  </span>
                  <input
                    type="text"
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#006B3F] focus:ring-1 focus:ring-[#006B3F] outline-none text-sm font-medium"
                    value={income.annualExpenses || ''}
                    onChange={(e) => handleFieldChange('annualExpenses', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/* Real-time net margin warning */}
            {income.annualRevenue > 0 && income.annualExpenses >= income.annualRevenue && (
              <p className="text-red-500 text-xs mt-3 bg-red-50 p-2 rounded-lg" id="revenue-warning">
                Warning: Expenses cannot equal or exceed total revenues. This represents a net loss situation.
              </p>
            )}
          </div>
        )}

        {/* Rental Income Card Form */}
        {selectedTypes.includes('rental') && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden" id="income-card-rental">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#CE1126]" id="income-card-rental-accent" />
            <div className="flex items-start justify-between gap-4 mb-4" id="income-card-rental-header">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-red-50 text-red-700 rounded-lg">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Rental Income</h3>
                  <span className="text-xs text-slate-400">Rent received from residential or commercial buildings</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleTypeOnFly('rental')}
                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                title="Remove this income source"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
            </div>

            <div id="rental-fields">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                Gross Rent Received (GH¢/year)
                <span className="group relative text-slate-400 hover:text-slate-600 cursor-help">
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[10px] p-2 rounded-md w-48 shadow font-normal text-center z-20">
                    Gross amount received from all buildings and lands. Under 2024 GRA, rental income is generally taxed separately, but if declared under regular personal returns, it is bundled here.
                  </span>
                </span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 text-sm font-bold">
                  GH¢
                </span>
                <input
                  type="text"
                  placeholder="0.00"
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#006B3F] focus:ring-1 focus:ring-[#006B3F] outline-none text-sm font-medium"
                  value={income.annualGrossRent || ''}
                  onChange={(e) => handleFieldChange('annualGrossRent', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Investment Income Card Form */}
        {selectedTypes.includes('investment') && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden" id="income-card-investment">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" id="income-card-investment-accent" />
            <div className="flex items-start justify-between gap-4 mb-4" id="income-card-investment-header">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                  <Landmark className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Investment Income</h3>
                  <span className="text-xs text-slate-400">Dividends and domestic interest savings gained</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleTypeOnFly('investment')}
                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                title="Remove this income source"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="investment-fields">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                  Dividends Received (GH¢/year)
                  <span className="group relative text-slate-400 hover:text-slate-600 cursor-help">
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[10px] p-2 rounded-md w-48 shadow font-normal text-center z-20">
                      Total annual dividends received from companies. (Note: domestic dividend withholding is usually 8% final, but declaring helps give a holistic picture).
                    </span>
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 text-sm font-bold">
                    GH¢
                  </span>
                  <input
                    type="text"
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#006B3F] focus:ring-1 focus:ring-[#006B3F] outline-none text-sm font-medium"
                    value={income.annualDividends || ''}
                    onChange={(e) => handleFieldChange('annualDividends', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                  Interest Earned (GH¢/year)
                  <span className="group relative text-slate-400 hover:text-slate-600 cursor-help">
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[10px] p-2 rounded-md w-48 shadow font-normal text-center z-20">
                      Total interest from savings or fixed deposits. Declaring helps calculate overall personal liability.
                    </span>
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 text-sm font-bold">
                    GH¢
                  </span>
                  <input
                    type="text"
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#006B3F] focus:ring-1 focus:ring-[#006B3F] outline-none text-sm font-medium"
                    value={income.annualInterest || ''}
                    onChange={(e) => handleFieldChange('annualInterest', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Business Owner info tag when selected, wait, if they have 'business_owner' selected let's show an easy reminder card */}
        {selectedTypes.includes('business_owner') && !selectedTypes.includes('self_employed') && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs p-4 rounded-xl flex items-start gap-2" id="business-owner-tip">
            <HelpCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <span className="font-semibold block shrink-0" id="biz-owner-hint-title">Note for Company Directors / Owners:</span>
              Your business itself files Corporate Tax separately. For Personal returns, you are taxed on Directors fees, dividends, or salary. If you pay yourself a salary, please add <button type="button" onClick={() => toggleTypeOnFly('employed')} className="underline font-bold text-[#006B3F] cursor-pointer">Salaried / Employed Income</button> to declare that amount.
            </div>
          </div>
        )}
      </div>

      {/* Add More Income Types Drawer / Shortcuts on the fly */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5" id="add-more-income-fly-drawer">
        <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3 text-center md:text-left">
          Have other sources to report? Add them here:
        </h4>
        <div className="flex flex-wrap gap-2.5 justify-center md:justify-start" id="add-income-buttons-row">
          {([
            { id: 'employed', label: 'Employed (PAYE)', icon: Briefcase },
            { id: 'self_employed', label: 'Self-Employed / Freelancer', icon: User },
            { id: 'rental', label: 'Rental Income', icon: Building2 },
            { id: 'investment', label: 'Investment Income', icon: Landmark },
          ] as { id: TaxpayerType; label: string; icon: any }[]).map((btn) => {
            const isSelected = selectedTypes.includes(btn.id);
            const Icon = btn.icon;

            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => toggleTypeOnFly(btn.id)}
                id={`add-source-on-fly-${btn.id}`}
                className={`py-2 px-3.5 rounded-xl text-xs font-semibold select-none flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#006B3F] text-white shadow'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {!isSelected && <Plus className="h-3.5 w-3.5" />}
                <Icon className="h-3.5 w-3.5" />
                {btn.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-100" id="step3-controls">
        <button
          type="button"
          onClick={onBack}
          id="step3-btn-back"
          className="px-6 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!isNextValid}
          id="step3-btn-next"
          className={`px-8 py-2.5 rounded-lg font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer ${
            isNextValid
              ? 'bg-[#006B3F] hover:bg-[#005a35] text-white active:scale-[0.98]'
              : 'bg-[#006B3F]/50 text-white/90 cursor-not-allowed'
          }`}
        >
          Reliefs & Deductions
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
