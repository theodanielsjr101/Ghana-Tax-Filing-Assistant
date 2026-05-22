/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TaxpayerType } from '../types';
import { ArrowLeft, ArrowRight, CheckSquare, Square, FileCheck, Info, AlertCircle, Sparkles } from 'lucide-react';

interface StepChecklistProps {
  selectedTypes: TaxpayerType[];
  onNext: () => void;
  onBack: () => void;
}

interface ChecklistItem {
  id: string;
  source: string;
  title: string;
  desc: string;
}

export default function StepChecklist({
  selectedTypes,
  onNext,
  onBack,
}: StepChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});

  // Assemble dynamic checklist items based on selected types on load/update
  useEffect(() => {
    const list: ChecklistItem[] = [
      {
        id: 'ghana_card_tin',
        source: 'all',
        title: 'National ID card (Ghana Card) or active TIN',
        desc: 'Needed to log into taxpayersportal.com. Ensure your TIN is linked to your Ghana Card PIN.',
      },
      {
        id: 'income_general',
        source: 'all',
        title: 'Yearly aggregate accounting summaries or bank statements',
        desc: 'Provides baseline confirmation of bank incoming transactions corresponding to tax claims.',
      },
    ];

    if (selectedTypes.includes('employed')) {
      list.push({
        id: 'p9_form',
        source: 'employed',
        title: 'GRA P9 Tax Certificate / Form from your Employer',
        desc: 'Your employer is legally obligated to give you this form showing your total monthly gross salary and exact PAYE taxes already deducted and paid over 2024.',
      });
    }

    if (selectedTypes.includes('self_employed')) {
      list.push(
        {
          id: 'self_financials',
          source: 'self_employed',
          title: 'Direct profit/loss account statement or trading records',
          desc: 'A simple audited or self-prepared balance sheet and income statement of your annual business performance.',
        },
        {
          id: 'self_receipts',
          source: 'self_employed',
          title: 'Full folder of business expense receipts & client invoices',
          desc: 'Keep these on standby for 6 years as proof of "allowable expenses" in case of standard GRA audits.',
        }
      );
    }

    if (selectedTypes.includes('rental')) {
      list.push(
        {
          id: 'rental_agreement',
          source: 'rental',
          title: 'Active tenancy contracts & lease agreements',
          desc: 'Legal proof of agreed rental margins, contract lengths, and tenant profiles.',
        },
        {
          id: 'rental_receipts',
          source: 'rental',
          title: 'Carbon copy booklets of rent receipts issued',
          desc: 'Confirms actual rent amounts received during the year.',
        }
      );
    }

    if (selectedTypes.includes('investment')) {
      list.push(
        {
          id: 'investment_dividend',
          source: 'investment',
          title: 'Dividend payment vouchers & statements',
          desc: 'Issued by Ghanaian public or private enterprises confirming your received dividends and withholding tax certificates.',
        },
        {
          id: 'investment_interest',
          source: 'investment',
          title: 'Official bank interest statements or certificates',
          desc: 'Issued by your bank or treasury fund manager showing aggregate annual interest earned.',
        }
      );
    }

    setItems(list);
    
    // Default checked states can also load from local storage
    let savedChecked: Record<string, boolean> = {};
    try {
      const saved = localStorage.getItem('ghana_tax_checklist_ids');
      if (saved) {
        savedChecked = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error reading checklist states from localStorage:', e);
    }

    const initialChecked: Record<string, boolean> = {};
    list.forEach((item) => {
      initialChecked[item.id] = savedChecked[item.id] !== undefined ? savedChecked[item.id] : false;
    });
    setCheckedIds(initialChecked);
  }, [selectedTypes]);

  const handleToggle = (id: string) => {
    setCheckedIds((prev) => {
      const next = {
        ...prev,
        [id]: !prev[id],
      };
      try {
        localStorage.setItem('ghana_tax_checklist_ids', JSON.stringify(next));
      } catch (e) {
        console.error('Error writing checklist states to localStorage:', e);
      }
      return next;
    });
  };

  const totalItems = items.length;
  const checkedCount = Object.values(checkedIds).filter(Boolean).length;
  const isAllChecked = totalItems > 0 && checkedCount === totalItems;

  return (
    <div className="space-y-6 max-w-2xl mx-auto" id="step-checklist-wrapper">
      <div className="text-center" id="step6-header">
        <h2 className="text-2xl font-bold font-display text-slate-900 tracking-tight flex items-center justify-center gap-2" id="step6-title">
          <span className="w-1.5 h-6 bg-[#FCD116] rounded-full inline-block"></span>
          Personalized Document Checklist
        </h2>
        <p className="text-slate-500 mt-2 text-sm" id="step6-subtitle">
          Ensure you have these required documents on hand before filing on the taxpayers portal. Tick them off as you gather them!
        </p>
      </div>

      {/* Progress Status Bar for checklist */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4" id="checklist-progress-bar">
        <div id="checklist-meta-text">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
            Documents Preparation status
          </span>
          <span className="text-sm font-semibold text-slate-800" id="checklist-counts">
            {checkedCount} of {totalItems} items gathered
          </span>
        </div>
        <div className="flex-1 max-w-xs h-2 bg-slate-200 rounded-full overflow-hidden hidden sm:block" id="checklist-bar-bg">
          <div
            className="h-full bg-[#006B3F] transition-all duration-300 rounded-full"
            style={{ width: `${(checkedCount / totalItems) * 100}%` }}
            id="checklist-bar-filled"
          />
        </div>
        <div className="text-slate-700 font-mono font-black text-sm select-none" id="checklist-percent">
          {Math.round((checkedCount / totalItems) * 100) || 0}%
        </div>
      </div>

      <div className="space-y-3.5" id="checklist-cards-container">
        {items.map((item, idx) => {
          const isChecked = !!checkedIds[item.id];

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleToggle(item.id)}
              id={`checklist-item-${item.id}`}
              className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all w-full select-none focus:outline-none cursor-pointer ${
                isChecked
                  ? 'border-[#006B3F] bg-[#006B3F]/5'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="mt-1 shrink-0 text-[#006B3F]" id={`check-icon-wrapper-${item.id}`}>
                {isChecked ? (
                  <CheckSquare className="h-5.5 w-5.5 text-[#006B3F]" />
                ) : (
                  <Square className="h-5.5 w-5.5 text-slate-350" />
                )}
              </div>

              <div className="flex-1 min-w-0" id={`checklist-text-wrapper-${item.id}`}>
                <h4
                  className={`text-sm font-bold ${
                    isChecked ? 'text-slate-500 line-through' : 'text-slate-800'
                  }`}
                >
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                {item.source !== 'all' && (
                  <span className="inline-block mt-2 text-[9px] font-extrabold uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                    Category: {item.source}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Checklist Completion Motivator banner */}
      {isAllChecked && (
        <div className="bg-[#006B3F] text-white rounded-2xl p-5 shadow flex items-center gap-4 animate-fade-in" id="checklist-success-banner">
          <div className="p-2.5 bg-white/10 rounded-xl shrink-0">
            <Sparkles className="h-6 w-6 text-[#FCD116]" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Perfect! All documents gathered.</h4>
            <p className="text-xs text-white/80 mt-0.5 leading-relaxed">
              Excellent job. Your figures match your official document certificates. Let's proceed to the filing guide to copy numbers and submit returns.
            </p>
          </div>
        </div>
      )}

      {/* Control row */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-100" id="step6-controls">
        <button
          type="button"
          onClick={onBack}
          id="step6-btn-back"
          className="px-6 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          id="step6-btn-next"
          className="px-8 py-2.5 rounded-lg font-bold text-sm shadow-md bg-[#006B3F] hover:bg-[#005a35] text-white transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
        >
          View Return Filing Guide
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
