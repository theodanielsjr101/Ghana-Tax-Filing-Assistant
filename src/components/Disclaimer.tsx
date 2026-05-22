/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-500 max-w-xl mx-auto" id="gra-disclaimer-wrapper">
      <div className="flex items-center justify-center gap-2 mb-1" id="gra-disclaimer-header">
        <AlertTriangle className="h-4.5 w-4.5 text-amber-500 shrink-0" id="gra-warn-icon" />
        <span className="font-semibold text-slate-700" id="gra-disclaimer-title">Official GRA Disclaimer</span>
      </div>
      <p id="gra-disclaimer-text">
        This tool is for guidance and educational purposes only. Calculations are estimations based on the 2024 Inland Revenue guidelines. Always verify final figures with a licensed tax practitioner or the Ghana Revenue Authority (GRA) directly before submitting returns.
      </p>
    </div>
  );
}
