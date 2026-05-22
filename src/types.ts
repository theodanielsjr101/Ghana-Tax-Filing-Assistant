/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TaxpayerType =
  | 'employed'
  | 'self_employed'
  | 'business_owner'
  | 'rental'
  | 'investment';

export interface PersonalDetails {
  fullName: string;
  idType: 'ghana_card' | 'tin';
  idNumber: string;
  taxYear: number;
  region: string;
  taxOffice: string;
}

export interface IncomeState {
  // Employed
  annualGrossSalary: number;
  annualPAYEDeducted: number;
  
  // Self-Employed / Freelancer
  annualRevenue: number;
  annualExpenses: number;
  
  // Rental
  annualGrossRent: number;
  
  // Investment
  annualDividends: number;
  annualInterest: number;
}

export interface ReliefsState {
  hasChildEducation: boolean;
  childCount: number; // Max 3, GHS 600 each
  hasMarriageRelief: boolean; // GHS 200
  isOldAge: boolean; // 60+, GHS 1,500
  isDisabled: boolean; // GHS 1,200 or 25% of taxable income (GRA rules: 25% of taxable income. We will apply GHS 3,000 or custom or direct 25% of taxable income)
  mortgageInterest: number; // Custom mortgage interest
}

export interface TaxBandBreakdown {
  bandLabel: string;
  rate: number; // percentage (e.g. 17.5)
  chargeableAmountInBand: number;
  taxInBand: number;
}

export interface TaxCalculationResult {
  totalIncome: number;
  totalReliefs: number;
  chargeableIncome: number;
  taxLiability: number;
  taxAlreadyPaid: number;
  balanceDue: number;
  isRefund: boolean;
  bandBreakdown: TaxBandBreakdown[];
}
