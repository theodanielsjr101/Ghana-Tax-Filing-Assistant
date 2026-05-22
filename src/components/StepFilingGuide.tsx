/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TaxCalculationResult, PersonalDetails } from '../types';
import { ArrowLeft, ExternalLink, Copy, Check, Printer, FileCheck2, Milestone, ArrowUpRight } from 'lucide-react';
import { formatGHS } from '../utils/taxCalculator';

interface StepFilingGuideProps {
  personalDetails: PersonalDetails;
  calcResult: TaxCalculationResult;
  onBack: () => void;
  onReset: () => void;
}

export default function StepFilingGuide({
  personalDetails,
  calcResult,
  onBack,
  onReset,
}: StepFilingGuideProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (value: string, key: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(key);
      setTimeout(() => setCopiedField(null), 2000);
    }).catch(err => {
      console.warn('Could not copy text: ', err);
    });
  };

  const triggerPrint = () => {
    window.print();
  };

  const {
    totalIncome,
    totalReliefs,
    chargeableIncome,
    taxLiability,
    taxAlreadyPaid,
    balanceDue,
    isRefund,
  } = calcResult;

  // Key tokens to copy paste into GRA taxpayersportal.com
  const filingTokens = [
    { label: 'Full Name', val: personalDetails.fullName, key: 'fullname' },
    { label: `${personalDetails.idType === 'ghana_card' ? 'Ghana Card PIN' : 'TIN Sequence'}`, val: personalDetails.idNumber, key: 'idnumber' },
    { label: 'Assessment Year', val:String(personalDetails.taxYear), key: 'taxyear' },
    { label: 'Assessable Total Income', val: totalIncome.toFixed(2), displayVal: formatGHS(totalIncome), key: 'gross' },
    { label: 'Tax Reliefs claimed', val: totalReliefs.toFixed(2), displayVal: formatGHS(totalReliefs), key: 'reliefs' },
    { label: 'Chargeable Income', val: chargeableIncome.toFixed(2), displayVal: formatGHS(chargeableIncome), key: 'chargeable' },
    { label: 'Calculated Tax Liability', val: taxLiability.toFixed(2), displayVal: formatGHS(taxLiability), key: 'liability' },
    { label: 'PAYE Tax Already Paid', val: taxAlreadyPaid.toFixed(2), displayVal: formatGHS(taxAlreadyPaid), key: 'paid' },
    { label: isRefund ? 'Refund Due' : 'Balance Payable', val: balanceDue.toFixed(2), displayVal: formatGHS(balanceDue), key: 'balance' },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto" id="step-filing-guide-wrapper">
      {/* Visual Instruction Title */}
      <div className="text-center print:hidden" id="step7-header">
        <h2 className="text-2xl font-bold font-display text-slate-900 tracking-tight flex items-center justify-center gap-2" id="step7-title">
          <span className="w-1.5 h-6 bg-[#FCD116] rounded-full inline-block"></span>
          GRA Portal Filing Guide
        </h2>
        <p className="text-slate-500 mt-2 text-sm" id="step7-subtitle">
          Ready to submit your returns? Follow these straightforward steps to enter your computed details into the official GRA portal.
        </p>
      </div>

      {/* Step-by-Step Instructions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm print:hidden" id="filing-directions-box">
        <h3 className="font-bold text-slate-950 text-sm flex items-center gap-2 mb-2">
          <Milestone className="h-4.5 w-4.5 text-[#006B3F]" />
          Submit Returns in 5 Simple Steps:
        </h3>
        
        <ol className="relative border-l border-slate-100 ml-3.5 space-y-4 text-xs text-slate-600 pl-4" id="ordered-steps-list">
          <li className="relative" id="step-dir-1">
            <span className="absolute -left-[25px] flex items-center justify-center bg-[#006B3F]/10 text-[#006B3F] rounded-full h-5 w-5 font-bold text-[10px]">
              1
            </span>
            <div className="font-semibold text-slate-900 text-xs">Access the taxpayers portal</div>
            <p className="mt-1">
              Open <a href="https://taxpayersportal.com" target="_blank" rel="noopener noreferrer" className="text-[#006B3F] font-semibold inline-flex items-center gap-0.5 hover:underline">
                taxpayersportal.com <ExternalLink className="h-3 w-3" />
              </a> on a new tab.
            </p>
          </li>
          <li id="step-dir-2">
            <span className="absolute -left-[25px] flex items-center justify-center bg-[#006B3F]/10 text-[#006B3F] rounded-full h-5 w-5 font-bold text-[10px]">
              2
            </span>
            <div className="font-semibold text-slate-900 text-xs">Log in securely</div>
            <p className="mt-1">
              Enter your registered TIN or Ghana Card PIN (e.g. <span className="font-mono font-bold text-slate-800">{personalDetails.idNumber || 'GHA-XXXXXXXXX-X'}</span>) along with your secure password.
            </p>
          </li>
          <li id="step-dir-3">
            <span className="absolute -left-[25px] flex items-center justify-center bg-[#006B3F]/10 text-[#006B3F] rounded-full h-5 w-5 font-bold text-[10px]">
              3
            </span>
            <div className="font-semibold text-slate-900 text-xs">Initiate Returns filing</div>
            <p className="mt-1">
              On your dashboard, click on the <span className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-bold">File Returns</span> command. Select <span className="font-bold text-slate-800">Personal Income Tax (PIT)</span> for year <span className="font-bold text-slate-800">{personalDetails.taxYear}</span>.
            </p>
          </li>
          <li id="step-dir-4">
            <span className="absolute -left-[25px] flex items-center justify-center bg-[#006B3F]/10 text-[#006B3F] rounded-full h-5 w-5 font-bold text-[10px]">
              4
            </span>
            <div className="font-semibold text-slate-900 text-xs">Copy and paste figures exactly</div>
            <p className="mt-1">
              Use the convenience panel below to copy each tax value. Paste them directly into the correspond fields on the portal forms.
            </p>
          </li>
          <li>
            <span className="absolute -left-[25px] flex items-center justify-center bg-[#006B3F]/10 text-[#006B3F] rounded-full h-5 w-5 font-bold text-[10px]">
              5
            </span>
            <div className="font-semibold text-slate-900 text-xs">Verify returns & submit</div>
            <p className="mt-1">
              Complete any remaining declarations, sign off on the standard declaration checkbox, and click submit. Keep the submittance receipt safe.
            </p>
          </li>
        </ol>
      </div>

      {/* Copy figures convenience panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm print:hidden" id="copy-pastable-panel-card">
        <div className="flex items-center justify-between mb-4" id="copy-panel-top">
          <div>
            <h3 className="font-bold text-slate-950 text-sm flex items-center gap-2">
              <FileCheck2 className="h-4.5 w-4.5 text-[#006B3F]" />
              Portal Copy Convenience Desk
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Click any token card to instantly copy its value to your clipboard.
            </p>
          </div>

          <button
            type="button"
            onClick={triggerPrint}
            id="btn-print-summary"
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold cursor-pointer select-none bg-slate-50 transition-colors"
          >
            <Printer className="h-4 w-4" />
            Print Sheet
          </button>
        </div>

        <div className="space-y-2.5" id="copy-tokens-rows">
          {filingTokens.map((token) => {
            const isCopied = copiedField === token.key;
            return (
              <div
                key={token.key}
                id={`copy-row-${token.key}`}
                className="flex items-center justify-between gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-all select-none"
              >
                <div id={`token-meta-${token.key}`}>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    {token.label}
                  </span>
                  <span className="text-xs font-bold text-slate-900 font-mono mt-0.5 block">
                    {token.displayVal || token.val}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(token.val, token.key)}
                  id={`btn-copy-token-${token.key}`}
                  className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${
                    isCopied
                      ? 'bg-[#006B3F] border-[#006B3F] text-white shadow-xs'
                      : 'bg-white border-slate-250 text-slate-700 hover:border-slate-350 hover:bg-slate-50'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy Value
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prominent CTA to open GRA Portal */}
       <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-slate-100 print:hidden" id="step7-portal-linkage-row">
        <a
          href="https://taxpayersportal.com"
          target="_blank"
          rel="noopener noreferrer"
          id="btn-link-gra-portal"
          className="w-full sm:flex-1 py-3.5 px-6 rounded-xl font-bold bg-[#006B3F] hover:bg-[#005a35] text-white text-center shadow flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
        >
          Go to GRA Portal
          <ArrowUpRight className="h-4 w-4 stroke-[3]" />
        </a>

        <button
          type="button"
          onClick={onReset}
          id="btn-recalculate-taxpayer"
          className="w-full sm:w-auto py-3.5 px-5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold transition-all cursor-pointer"
        >
          Start Over / File Another Return
        </button>
      </div>

      <div className="flex justify-start print:hidden" id="step7-controls">
        <button
          type="button"
          onClick={onBack}
          id="step7-btn-back"
          className="px-6 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Checklist
        </button>
      </div>
      
      {/* ========================================================= */}
      {/* PRINT-ONLY VISUAL DASHBOARD SHEET */}
      {/* This renders only under media print. Hidden on UI screen */}
      {/* ========================================================= */}
      <div className="hidden print:block text-slate-900 bg-white" id="gra-printable-assessment-sheet">
        <div className="border-b-4 border-[#006B3F] pb-4 mb-6 flex justify-between items-end" id="print-header">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
              Ghana Revenue Authority
            </h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">
              Personal Income Tax Computation Assessment Memo
            </p>
          </div>
          <div className="text-right text-xs text-slate-400 font-mono">
            Date Generated: {new Date().toLocaleDateString('en-GB')}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs" id="print-meta-grid">
          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Taxpayer Name:</span>
            <span className="text-sm font-bold text-slate-800">{personalDetails.fullName || 'Kwame Mensah'}</span>
          </div>
          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
              {personalDetails.idType === 'ghana_card' ? 'Ghana Card PIN:' : 'TIN Sequence:'}
            </span>
            <span className="text-sm font-bold text-slate-800 font-mono">{personalDetails.idNumber || 'N/A'}</span>
          </div>
          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Assessment Year:</span>
            <span className="text-sm font-bold text-slate-800">{personalDetails.taxYear}</span>
          </div>
          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">TSC Office & Region:</span>
            <span className="text-sm font-bold text-slate-800">
              {personalDetails.taxOffice || 'N/A'} ({personalDetails.region || 'N/A'} Region)
            </span>
          </div>
        </div>

        <h3 className="text-sm font-black border-b border-slate-200 pb-1.5 mb-3 uppercase tracking-wider text-slate-800">
          Return Computation Metrics:
        </h3>

        <div className="space-y-2 mb-6" id="print-figures-sheet">
          <div className="flex justify-between border-b border-slate-100 py-1.5 text-xs">
            <span className="text-slate-500 font-medium">Aggregate Annual Gross Income:</span>
            <span className="font-bold font-mono text-slate-900">{formatGHS(totalIncome)}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 py-1.5 text-xs">
            <span className="text-slate-500 font-medium">Claimable Allowances / Reliefs:</span>
            <span className="font-bold font-mono text-[#006B3F]">(-) {formatGHS(totalReliefs)}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 py-1.5 text-xs bg-slate-50/70 p-1 rounded">
            <span className="text-slate-800 font-black">Net Chargeable Taxable Income:</span>
            <span className="font-black font-mono text-slate-900">{formatGHS(chargeableIncome)}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 py-1.5 text-xs">
            <span className="text-slate-500 font-medium">Calculated Annual Tax Liability:</span>
            <span className="font-bold font-mono text-slate-900">{formatGHS(taxLiability)}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 py-1.5 text-xs">
            <span className="text-slate-500 font-medium">Taxes Paid at Source (Employer PAYE Portion):</span>
            <span className="font-bold font-mono text-slate-900">(-) {formatGHS(taxAlreadyPaid)}</span>
          </div>
          <div className={`flex justify-between py-2 border-t border-b-2 text-sm font-black uppercase tracking-wider ${
            isRefund ? 'border-[#006B3F] text-[#006B3F] bg-[#006B3F]/5' : 'border-red-500 text-red-800 bg-red-50/50'
          } truncate px-2 rounded`}>
            <span>{isRefund ? 'Computed GRA Refund Owed:' : 'Net Tax Balance Payable:'}</span>
            <span className="font-mono">{formatGHS(balanceDue)}</span>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40 text-[10px]" id="print-notice">
          <p className="font-bold uppercase tracking-widest text-slate-500 mb-1">
            Standard Citizen Affirmation & Submission Instructions
          </p>
          <p className="text-slate-500 shrink-0 leading-relaxed">
            I certify that parent values stated herein are processed fully client-side on devices owned or administered by myself. This worksheet constitutes a personal guidance calculations draft based on Ghana Revenue Authority 2024 schedules. It is not an official return certification. Submit this file as part of your document archive or use values within standard online filing portals.
          </p>
        </div>

        <div className="mt-16 flex justify-between text-xs pt-12 border-t border-slate-200" id="print-signatures">
          <div className="text-center w-[180px]">
            <div className="border-b border-slate-400 h-8" />
            <span className="font-bold text-slate-500 uppercase text-[9px] mt-1 block">Taxpayer Signature</span>
          </div>
          <div className="text-center w-[180px]">
            <div className="border-b border-slate-400 h-8 font-mono text-center text-slate-350 text-[10px] pt-4 select-none">
              {new Date().toLocaleDateString('en-GB')}
            </div>
            <span className="font-bold text-slate-500 uppercase text-[9px] mt-1 block">Filing Date</span>
          </div>
        </div>
      </div>
    </div>
  );
}
