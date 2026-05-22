/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TaxCalculationResult, PersonalDetails } from '../types';
import { ArrowLeft, ArrowRight, TrendingUp, DollarSign, BookOpen, AlertCircle, FileText } from 'lucide-react';
import { formatGHS } from '../utils/taxCalculator';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface StepTaxCalculationProps {
  personalDetails: PersonalDetails;
  calcResult: TaxCalculationResult;
  onNext: () => void;
  onBack: () => void;
}

export default function StepTaxCalculation({
  personalDetails,
  calcResult,
  onNext,
  onBack,
}: StepTaxCalculationProps) {
  const {
    totalIncome,
    totalReliefs,
    chargeableIncome,
    taxLiability,
    taxAlreadyPaid,
    balanceDue,
    isRefund,
    bandBreakdown,
  } = calcResult;

  // Prepare chart data for Recharts
  const chartData = [
    {
      name: 'Total Gross Income',
      Amount: totalIncome,
      color: '#006B3F', // Forest green
    },
    {
      name: 'Allowable Reliefs',
      Amount: totalReliefs,
      color: '#FCD116', // Accent gold
    },
    {
      name: 'Chargeable Taxable',
      Amount: chargeableIncome,
      color: '#E5A900', // Deep Gold/Amber
    },
    {
      name: 'Final Tax Liability',
      Amount: taxLiability,
      color: '#CE1126', // Crimson red
    },
    {
      name: 'Already Paid (PAYE)',
      Amount: taxAlreadyPaid,
      color: '#475569', // Slate
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto" id="step-tax-calculation-wrapper">
      <div className="text-center" id="step5-header">
        <h2 className="text-2xl font-bold font-display text-slate-900 tracking-tight flex items-center justify-center gap-2" id="step5-title">
          <span className="w-1.5 h-6 bg-[#FCD116] rounded-full inline-block"></span>
          Tax Computation Breakdown
        </h2>
        <p className="text-slate-500 mt-2 text-sm" id="step5-subtitle">
          Based on the 2024 Ghana Revenue Authority (GRA) annual tax schedule. Review your figures below.
        </p>
      </div>

      {/* Main Color-Coded Balance Card */}
      <div
        className={`rounded-2xl border p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${
          isRefund
            ? 'bg-[#006B3F]/5 border-[#006B3F]/20 text-[#006B3F]'
            : balanceDue === 0
            ? 'bg-slate-50 border-slate-200 text-slate-950'
            : 'bg-amber-50 border-amber-200 text-amber-950'
        }`}
        id="computation-balance-display-card"
      >
        <div className="text-center md:text-left" id="balance-title-col">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block mb-1">
            Tax Assessment Output
          </span>
          <h3 className="text-lg font-bold" id="balance-assessment-heading">
            {isRefund ? '🎉 Tax Refund Owed to You' : '💼 Tax Summary'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mt-1 leading-relaxed">
            {isRefund
              ? 'Excellent! Your declared PAYE contributions already paid exceed your computed actual yearly tax liability. You are eligible to claim a refund from the GRA.'
              : balanceDue === 0
              ? 'Great! Your taxes are perfectly clear and balanced. You do not owe any further balance, nor do you have outstanding liabilities for this filing period.'
              : 'Attention: This is the computed outstanding tax balance you are legally required to pay to the GRA on or before the direct return filing deadline.'}
          </p>
        </div>

        <div className="text-center md:text-right bg-white/95 border border-slate-100 py-4 px-6 rounded-xl shrink-0 shadow-xs" id="balance-numerical-display">
          <span className="text-xs text-slate-500 font-bold block mb-1">
            {isRefund ? 'Amount Reclaimable' : 'Calculated Balance Due'}
          </span>
          <span
            className={`text-3xl font-black font-mono block ${
              isRefund ? 'text-[#006B3F]' : balanceDue === 0 ? 'text-slate-700' : 'text-[#CE1126]'
            }`}
            id="balance-money-amount"
          >
            {formatGHS(balanceDue)}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold block mt-1 tracking-widest uppercase">
            {isRefund ? 'GRA REFUND' : balanceDue === 0 ? 'NO LIABILITY' : 'TAX DUE'}
          </span>
        </div>
      </div>

      {/* Four core metrics highlight display row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="metric-highlights-grid">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs" id="met-gross">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">1. Total Income</span>
          <span className="text-sm font-semibold text-slate-500 block mt-0.5">Annual Aggregate</span>
          <span className="text-lg font-black font-mono text-slate-900 block mt-2" id="met-gross-val">
            {formatGHS(totalIncome)}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs" id="met-reliefs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">2. Total Reliefs</span>
          <span className="text-sm font-semibold text-slate-500 block mt-0.5">Allowable Deductions</span>
          <span className="text-lg font-black font-mono text-[#006B3F] block mt-2" id="met-reliefs-val">
            {formatGHS(totalReliefs)}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs" id="met-chargeable">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">3. Chargeable Income</span>
          <span className="text-sm font-semibold text-slate-500 block mt-0.5">Amount subject to tax</span>
          <span className="text-lg font-black font-mono text-amber-600 block mt-2" id="met-chargeable-val">
            {formatGHS(chargeableIncome)}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs" id="met-liability">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">4. Computed Tax</span>
          <span className="text-sm font-semibold text-slate-500 block mt-0.5">Yearly Liability</span>
          <span className="text-lg font-black font-mono text-red-600 block mt-2" id="met-liability-val">
            {formatGHS(taxLiability)}
          </span>
        </div>
      </div>

      {/* Breakdown Details Table and Chart Tabs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="breakdown-details-visualization-grid">
        {/* Itemized Bracket Liability Table */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between" id="bracket-table-box">
          <div id="bracket-table-headings">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-[#006B3F]" />
              GRA Tax Band Computations
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Detailed partition of your {formatGHS(chargeableIncome)} Chargeable Income in each threshold band:
            </p>
          </div>

          <div className="overflow-x-auto" id="bracket-table-wrapper">
            <table className="w-full text-xs text-left" id="bracket-breakdown-table">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="py-2.5 px-1 font-semibold text-[10px]">Tax Bracket</th>
                  <th className="py-2.5 px-1 font-semibold text-[10px] text-center">Rate</th>
                  <th className="py-2.5 px-1 font-semibold text-[10px] text-right">In Bracket</th>
                  <th className="py-2.5 px-1 font-semibold text-[10px] text-right">Tax Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bandBreakdown.map((band, idx) => (
                  <tr
                    key={idx}
                    id={`band-tr-${idx}`}
                    className={`hover:bg-slate-50/50 ${
                      band.chargeableAmountInBand > 0 ? 'bg-[#006B3F]/5 font-medium' : 'text-slate-400'
                    }`}
                  >
                    <td className="py-2.5 px-1 font-semibold text-slate-800">{band.bandLabel}</td>
                    <td className="py-2.5 px-1 text-center font-bold text-slate-700">{band.rate}%</td>
                    <td className="py-2.5 px-1 text-right font-mono text-slate-600">
                      {formatGHS(band.chargeableAmountInBand)}
                    </td>
                    <td className="py-2.5 px-1 text-right font-mono text-slate-900 font-bold">
                      {formatGHS(band.taxInBand)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {taxAlreadyPaid > 0 && (
            <div className="mt-4 border-t border-slate-150 pt-3 flex flex-col gap-1.5 text-xs" id="summary-paye-box">
              <div className="flex justify-between text-slate-500">
                <span>Calculated Total Tax Liability:</span>
                <span className="font-mono font-bold text-slate-800">{formatGHS(taxLiability)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>(-) Already Paid PAYE (P9 Form Deduction):</span>
                <span className="font-mono font-bold text-[#006B3F]">{formatGHS(taxAlreadyPaid)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-slate-900">
                <span>{isRefund ? 'Refund Owed:' : 'Net Balance Due:'}</span>
                <span className={`font-mono ${isRefund ? 'text-[#006B3F]' : 'text-red-750'}`}>
                  {formatGHS(balanceDue)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Visual Bar Chart Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col" id="chart-visualization-box">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-1" id="chart-title">
            <TrendingUp className="h-4 w-4 text-amber-500" />
            Income vs. Tax Composition Chart
          </h4>
          <p className="text-xs text-slate-400 mb-4" id="chart-desc">
            Visual progression of your income, deductible reliefs, chargeable base, and final tax responsibility.
          </p>

          <div className="flex-1 w-full h-[220px] select-none min-h-[220px]" id="recharts-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                barSize={32}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#64748b', fontSize: 9 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(val) => `GH¢${val}`}
                  tick={{ fill: '#64748b', fontSize: 9 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value: any) => [formatGHS(Number(value)), 'Amount']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                  itemStyle={{ color: '#fbbf24' }}
                />
                <Bar dataKey="Amount" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center mt-3 text-[10px] font-semibold text-slate-500" id="chart-legends">
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#006B3F]" /> Gross Income</div>
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#FCD116]" /> Reliefs</div>
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#E5A900]" /> Chargeable</div>
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#CE1126]" /> Liability</div>
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#475569]" /> Already Paid</div>
          </div>
        </div>
      </div>

      {/* Return buttons control line */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-100" id="step5-controls">
        <button
          type="button"
          onClick={onBack}
          id="step5-btn-back"
          className="px-6 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          id="step5-btn-next"
          className="px-8 py-2.5 rounded-lg font-bold text-sm shadow-md bg-[#006B3F] hover:bg-[#005a35] text-white transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
        >
          Assemble Document Checklist
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
