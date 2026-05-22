/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PersonalDetails } from '../types';
import { User, CreditCard, ShieldAlert, Calendar, MapPin, Building, ArrowLeft } from 'lucide-react';

interface StepPersonalDetailsProps {
  details: PersonalDetails;
  onChange: (details: PersonalDetails) => void;
  onNext: () => void;
  onBack: () => void;
}

const REGIONS = [
  'Greater Accra',
  'Ashanti',
  'Western',
  'Central',
  'Eastern',
  'Volta',
  'Northern',
  'Upper West',
  'Upper East',
  'Bono',
  'Savannah',
  'Oti',
  'Western North',
  'Ahafo',
  'Bono East',
  'North East',
];

const TAX_OFFICES = [
  'Adabraka Area TSC (Accra)',
  'Osu TSC (Accra)',
  'Spintex Area TSC (Accra)',
  'Legon Area TSC (Accra)',
  'Tema TSC',
  'Kumasi Central TSC (Kumasi)',
  'Asokwa TSC (Kumasi)',
  'Takoradi TSC (Takoradi)',
  'Tamale TSC (Tamale)',
  'Cape Coast TSC',
  'Koforidua TSC',
  'Sunyani TSC',
  'Bolgatanga TSC',
  'Wa TSC',
  'Ho TSC',
];

export default function StepPersonalDetails({
  details,
  onChange,
  onNext,
  onBack,
}: StepPersonalDetailsProps) {
  const [dirty, setDirty] = useState(false);

  // Validate Ghana Card format GHA-7XXXXXXXX-X or custom TIN format
  const getPINValidationResult = () => {
    if (!details.idNumber) return { valid: false, message: 'ID/PIN is required' };
    
    if (details.idType === 'ghana_card') {
      // Ghana Card typically starts with GHA- followed by 9 digits and a check digit GHA-123456789-0
      const trimmed = details.idNumber.trim().toUpperCase();
      const pattern = /^GHA-\d{9}-\d$/;
      if (pattern.test(trimmed)) {
        return { valid: true, message: 'Valid Ghana Card format' };
      }
      return {
        valid: false,
        message: 'Format should match GHA-123456789-0',
      };
    } else {
      // TIN usually starts with T or simply a 10 digit number or T00...
      const trimmed = details.idNumber.trim().toUpperCase();
      const pattern = /^[A-Z\d]{8,12}$/;
      if (pattern.test(trimmed)) {
        return { valid: true, message: 'Valid TIN format' };
      }
      return {
        valid: false,
        message: 'TIN should be 8-12 alphanumeric characters',
      };
    }
  };

  const idVal = getPINValidationResult();
  const isNameVal = details.fullName.trim().length > 1;
  const isFormValid = isNameVal && idVal.valid && details.region && details.taxOffice;

  const handleNext = () => {
    setDirty(true);
    if (isFormValid) {
      onNext();
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto" id="step-personal-details-wrapper">
      <div className="text-center" id="step2-header">
        <h2 className="text-2xl font-bold font-display text-slate-900 tracking-tight flex items-center justify-center gap-2" id="step2-title">
          <span className="w-1.5 h-6 bg-[#FCD116] rounded-full inline-block"></span>
          Personal Taxpayer Details
        </h2>
        <p className="text-slate-500 mt-2 text-sm" id="step2-subtitle">
          Provide your identification details and tax jurisdiction to customize your assessment.
        </p>
      </div>

      {/* Security Banner */}
      <div
        className="bg-[#006B3F]/5 border border-[#006B3F]/20 p-4 rounded-xl flex items-start gap-3"
        id="security-privacy-notice"
      >
        <ShieldAlert className="h-5 w-5 text-[#006B3F] shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700" id="privacy-explanation">
          <span className="font-bold block text-[#006B3F]" id="privacy-title">
            100% Client-Side Privacy Guaranteed
          </span>
          Your figures, name, Ghana Card PIN, and tax data are processed entirely inside your browser memory. No data is stored, cached, or transmitted to the GRA or any external servers.
        </div>
      </div>

      {/* Input Fields Form container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm" id="details-form-box">
        {/* Full Name */}
        <div id="field-fullname-block">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Taxpayer Full Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <User className="h-5 w-5" />
            </span>
            <input
              type="text"
              placeholder="Kwame Mensah"
              className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none text-sm font-medium transition-all ${
                dirty && !isNameVal
                  ? 'border-red-400 bg-red-50/20 focus:border-red-500'
                  : 'border-slate-300 focus:border-[#006B3F] focus:ring-1 focus:ring-[#006B3F]'
              }`}
              value={details.fullName}
              onChange={(e) => onChange({ ...details, fullName: e.target.value })}
              id="input-fullname"
            />
          </div>
          {dirty && !isNameVal && (
            <span className="text-xs text-red-500 mt-1 block font-medium" id="err-fullname">
              Please enter your full name as appearing on national identity records.
            </span>
          )}
        </div>

        {/* Identity Type Selection */}
        <div id="field-identity-type-block">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Tax Reference Identifier
          </label>
          <div className="grid grid-cols-2 gap-3" id="id-type-selection-row">
            <button
              type="button"
              onClick={() => onChange({ ...details, idType: 'ghana_card', idNumber: '' })}
              id="btn-idtype-ghana-card"
              className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all relative flex items-center justify-center gap-2 cursor-pointer ${
                details.idType === 'ghana_card'
                  ? 'border-[#006B3F] bg-[#006B3F]/5 text-[#006B3F] ring-1 ring-[#006B3F]'
                  : 'border-slate-300 text-slate-600 hover:border-slate-400'
              }`}
            >
              <CreditCard className="h-4 w-4" />
              Ghana Card PIN
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...details, idType: 'tin', idNumber: '' })}
              id="btn-idtype-tin"
              className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all relative flex items-center justify-center gap-2 cursor-pointer ${
                details.idType === 'tin'
                  ? 'border-[#006B3F] bg-[#006B3F]/5 text-[#006B3F] ring-1 ring-[#006B3F]'
                  : 'border-slate-300 text-slate-600 hover:border-slate-400'
              }`}
            >
              <Building className="h-4 w-4" />
              TIN Sequence
            </button>
          </div>
        </div>

        {/* Identity PIN Number */}
        <div id="field-idnumber-block">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            {details.idType === 'ghana_card' ? 'Ghana Card PIN' : 'Taxpayer Identification Number (TIN)'}
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <CreditCard className="h-5 w-5" />
            </span>
            <input
              type="text"
              placeholder={details.idType === 'ghana_card' ? 'GHA-712345678-9' : 'T009876543'}
              className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none text-sm font-medium transition-all uppercase placeholder:normal-case ${
                dirty && !idVal.valid
                  ? 'border-red-400 bg-red-50/10'
                  : 'border-slate-300 focus:border-[#006B3F] focus:ring-1 focus:ring-[#006B3F]'
              }`}
              value={details.idNumber}
              onChange={(e) => onChange({ ...details, idNumber: e.target.value })}
              id="input-idnumber"
            />
          </div>
          <div className="flex justify-between items-center mt-1.5" id="idnumber-hint-row">
            <span
              className={`text-xs ${idVal.valid ? 'text-[#006B3F] font-semibold' : 'text-slate-400'}`}
              id="hint-idnumber"
            >
              {idVal.message}
            </span>
            <span className="text-[10px] text-slate-400 italic">Never stored on servers</span>
          </div>
        </div>

        {/* Tax Year & Region */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="tax-year-and-region-row">
          <div id="field-taxyear-block">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Tax Year Being Calculated
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Calendar className="h-5 w-5" />
              </span>
              <select
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 bg-white outline-none text-sm font-medium focus:border-[#006B3F]"
                value={details.taxYear}
                onChange={(e) => onChange({ ...details, taxYear: Number(e.target.value) })}
                id="select-taxyear"
              >
                <option value={2024}>2024 (Assessment Year)</option>
                <option value={2023}>2023 (Previous Rules)</option>
              </select>
            </div>
          </div>

          <div id="field-region-block">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Region of Residence
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <MapPin className="h-5 w-5" />
              </span>
              <select
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 bg-white outline-none text-sm font-medium focus:border-[#006B3F]"
                value={details.region}
                onChange={(e) => onChange({ ...details, region: e.target.value })}
                id="select-region"
              >
                <option value="">-- Choose Region --</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r} Region
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tax Office */}
        <div id="field-taxoffice-block">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Local GRA Taxpayer Service Center (TSC)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Building className="h-5 w-5" />
            </span>
            <select
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 bg-white outline-none text-sm font-medium focus:border-[#006B3F]"
              value={details.taxOffice}
              onChange={(e) => onChange({ ...details, taxOffice: e.target.value })}
              id="select-taxoffice"
            >
              <option value="">-- Choose Nearest TSC --</option>
              {TAX_OFFICES.map((office) => (
                <option key={office} value={office}>
                  {office}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Button Controls */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-100" id="step2-controls">
        <button
          type="button"
          onClick={onBack}
          id="step2-btn-back"
          className="px-6 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          id="step2-btn-next"
          className={`px-8 py-2.5 rounded-lg font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer ${
            isFormValid
              ? 'bg-[#006B3F] hover:bg-[#005a35] text-white'
              : 'bg-[#006B3F]/50 text-white/90 cursor-not-allowed'
          }`}
        >
          Continue to Income Entry
        </button>
      </div>
    </div>
  );
}
