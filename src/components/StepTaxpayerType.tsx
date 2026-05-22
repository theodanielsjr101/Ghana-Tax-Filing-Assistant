/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TaxpayerType } from '../types';
import { Briefcase, Store, User, Building2, Landmark, Check } from 'lucide-react';

interface StepTaxpayerTypeProps {
  selectedTypes: TaxpayerType[];
  onChange: (types: TaxpayerType[]) => void;
  onNext: () => void;
}

interface OptionItem {
  id: TaxpayerType;
  title: string;
  sub: string;
  desc: string;
  icon: React.ComponentType<any>;
}

const OPTIONS: OptionItem[] = [
  {
    id: 'employed',
    title: 'Salaried / Employed',
    sub: 'PAYE Deducted by Employer',
    desc: 'You receive monthly payslips from a registered employer who deducts PAYE tax directly from your salary (Form P9).',
    icon: Briefcase,
  },
  {
    id: 'self_employed',
    title: 'Self-Employed / Freelancer',
    sub: 'Sole Trader / Independent Contractor',
    desc: 'You run a business under your own name or work as an independent consultant receiving payments directly from clients.',
    icon: User,
  },
  {
    id: 'business_owner',
    title: 'Business Owner / Director',
    sub: 'Incorporated Entity or Partnership',
    desc: 'You own shares or direct operations of a limited liability company or partnership in Ghana.',
    icon: Store,
  },
  {
    id: 'rental',
    title: 'Rental Income',
    sub: 'Property Leasing / Subletting',
    desc: 'You receive rent from tenants leasing residential apartments, retail shops, or commercial warehouses.',
    icon: Building2,
  },
  {
    id: 'investment',
    title: 'Investment Income',
    sub: 'Dividends & Interest Savings',
    desc: 'You earn gains from dividends paid by domestic companies or interest on bonds, savings accounts, or fixed deposits.',
    icon: Landmark,
  },
];

export default function StepTaxpayerType({
  selectedTypes,
  onChange,
  onNext,
}: StepTaxpayerTypeProps) {
  const handleToggle = (id: TaxpayerType) => {
    if (selectedTypes.includes(id)) {
      onChange(selectedTypes.filter((t) => t !== id));
    } else {
      onChange([...selectedTypes, id]);
    }
  };

  const isValid = selectedTypes.length > 0;

  return (
    <div className="space-y-6" id="step-taxpayer-type-wrapper">
      <div className="text-center" id="step1-header-block">
        <h2 className="text-2xl font-bold font-display text-slate-900 tracking-tight" id="step1-title">
          What describes your income situation?
        </h2>
        <p className="text-slate-500 mt-2 text-sm max-w-lg mx-auto" id="step1-subtitle">
          Select all that apply to you. We will use these selections to customize your calculator fields and filing preparations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto" id="taxpayer-options-grid">
        {OPTIONS.map((opt) => {
          const isSelected = selectedTypes.includes(opt.id);
          const Icon = opt.icon;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleToggle(opt.id)}
              id={`taxpayer-opt-${opt.id}`}
              className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#006B3F]/30 ${
                isSelected
                  ? 'border-[#006B3F] bg-[#006B3F]/5 ring-1 ring-[#006B3F]'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div
                className={`p-3 rounded-xl ${
                  isSelected ? 'bg-[#006B3F] text-white' : 'bg-slate-100 text-slate-500'
                }`}
                id={`taxpayer-icon-container-${opt.id}`}
              >
                <Icon className="h-6 w-6" />
              </div>

              <div className="flex-1 min-w-0" id={`taxpayer-text-container-${opt.id}`}>
                <div className="flex items-center justify-between gap-2" id={`taxpayer-top-${opt.id}`}>
                  <h3 className="font-semibold text-slate-900">{opt.title}</h3>
                  {isSelected && (
                    <span
                      className="bg-[#006B3F] text-white p-1 rounded-full text-[10px]"
                      id={`taxpayer-selected-check-${opt.id}`}
                    >
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold text-[#006B3F] tracking-wide uppercase mt-0.5 block">
                  {opt.sub}
                </span>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{opt.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end max-w-2xl mx-auto pt-4 border-t border-slate-100" id="step1-controls">
        <button
          type="button"
          disabled={!isValid}
          onClick={onNext}
          id="step1-btn-next"
          className={`px-8 py-2.5 rounded-lg font-bold text-sm shadow-md transition-all cursor-pointer ${
            isValid
              ? 'bg-[#006B3F] hover:bg-[#005a35] text-white active:scale-[0.98]'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          Begin Setup
        </button>
      </div>
    </div>
  );
}
