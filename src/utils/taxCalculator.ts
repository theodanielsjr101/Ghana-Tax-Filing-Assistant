/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  TaxpayerType,
  IncomeState,
  ReliefsState,
  TaxBandBreakdown,
  TaxCalculationResult,
} from '../types';

export function calculateGhanaTax(
  selectedTypes: TaxpayerType[],
  income: IncomeState,
  reliefs: ReliefsState
): TaxCalculationResult {
  // 1. Calculate Total Gross / Assessable Income based on selection
  let totalIncome = 0;

  if (selectedTypes.includes('employed')) {
    totalIncome += Number(income.annualGrossSalary) || 0;
  }
  if (selectedTypes.includes('self_employed')) {
    // Standard Sole Trader / Freelancer taxable income is Revenue minus expenses
    const netSelfEmployed = Math.max(0, (Number(income.annualRevenue) || 0) - (Number(income.annualExpenses) || 0));
    totalIncome += netSelfEmployed;
  }
  if (selectedTypes.includes('rental')) {
    totalIncome += Number(income.annualGrossRent) || 0;
  }
  if (selectedTypes.includes('investment')) {
    totalIncome += (Number(income.annualDividends) || 0) + (Number(income.annualInterest) || 0);
  }

  // 2. Calculate Reliefs & Deductions
  let personalRelief = 4320; // Auto-apply GHS 4,320 under Ghana Income Tax Act, 2015
  let childEducationRelief = reliefs.hasChildEducation
    ? Math.min(3, Number(reliefs.childCount) || 0) * 600
    : 0;
  let marriageRelief = reliefs.hasMarriageRelief ? 200 : 0;
  let oldAgeRelief = reliefs.isOldAge ? 1500 : 0;
  
  // Disability relief is 25% of assessable income from business/employment
  let disabilityRelief = 0;
  if (reliefs.isDisabled) {
    let assessableForDisability = 0;
    if (selectedTypes.includes('employed')) {
      assessableForDisability += Number(income.annualGrossSalary) || 0;
    }
    if (selectedTypes.includes('self_employed')) {
      assessableForDisability += Math.max(0, (Number(income.annualRevenue) || 0) - (Number(income.annualExpenses) || 0));
    }
    // If no employment/business, apply on total income, max 25%
    if (assessableForDisability === 0) {
      assessableForDisability = totalIncome;
    }
    disabilityRelief = assessableForDisability * 0.25;
  }

  let mortgageRelief = Number(reliefs.mortgageInterest) || 0;

  let totalReliefs =
    personalRelief +
    childEducationRelief +
    marriageRelief +
    oldAgeRelief +
    disabilityRelief +
    mortgageRelief;

  // Reliefs cannot exceed total income
  if (totalReliefs > totalIncome) {
    totalReliefs = totalIncome;
  }

  // 3. Calculate Chargeable Income
  const chargeableIncome = Math.max(0, totalIncome - totalReliefs);

  // 4. Calculate Tax Liability using GRA 2024 annual tax bands:
  // Bands description:
  // - First GH¢5,880: 0%
  // - Next GH¢1,320: 5% (to GH¢7,200)
  // - Next GH¢1,560: 10% (to GH¢8,760)
  // - Next GH¢38,000: 17.5% (to GH¢46,760)
  // - Next GH¢193,240: 25% (to GH¢240,000)
  // - Above GH¢240,000: 35%
  
  const bands = [
    { width: 5880, rate: 0.0, label: 'First GH¢5,880' },
    { width: 1320, rate: 0.05, label: 'Next GH¢1,320' },
    { width: 1560, rate: 0.1, label: 'Next GH¢1,560' },
    { width: 38000, rate: 0.175, label: 'Next GH¢38,000' },
    { width: 193240, rate: 0.25, label: 'Next GH¢193,240' },
    { width: Infinity, rate: 0.35, label: 'Above GH¢240,000' },
  ];

  let remaining = chargeableIncome;
  let taxLiability = 0;
  const bandBreakdown: TaxBandBreakdown[] = [];

  for (const b of bands) {
    const chargeableInBand = Math.min(remaining, b.width);
    if (chargeableInBand > 0 || b.rate === 0) {
      // Record bands that have some income in them, or at least the first 0% band
      const taxInBand = chargeableInBand * b.rate;
      bandBreakdown.push({
        bandLabel: b.label,
        rate: b.rate * 100,
        chargeableAmountInBand: chargeableInBand,
        taxInBand: taxInBand,
      });
      taxLiability += taxInBand;
      remaining -= chargeableInBand;
    } else {
      // Just record empty bands for presentation
      bandBreakdown.push({
        bandLabel: b.label,
        rate: b.rate * 100,
        chargeableAmountInBand: 0,
        taxInBand: 0,
      });
    }
    if (remaining <= 0) {
      // Add outstanding bands with 0 values so the full structure is always returned for visual consistency
      const currentIdx = bands.indexOf(b);
      for (let j = currentIdx + 1; j < bands.length; j++) {
        bandBreakdown.push({
          bandLabel: bands[j].label,
          rate: bands[j].rate * 100,
          chargeableAmountInBand: 0,
          taxInBand: 0,
        });
      }
      break;
    }
  }

  // 5. Deduct tax already paid
  let taxAlreadyPaid = 0;
  if (selectedTypes.includes('employed')) {
    taxAlreadyPaid += Number(income.annualPAYEDeducted) || 0;
  }

  const balanceDue = taxLiability - taxAlreadyPaid;
  const isRefund = balanceDue < 0;

  return {
    totalIncome,
    totalReliefs,
    chargeableIncome,
    taxLiability,
    taxAlreadyPaid,
    balanceDue: Math.abs(balanceDue),
    isRefund,
    bandBreakdown,
  };
}

// Format currency helper
export function formatGHS(amount: number): string {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
