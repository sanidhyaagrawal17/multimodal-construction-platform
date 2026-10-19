import React from 'react';
import { X, Printer, Download, FileText, CheckCircle2 } from 'lucide-react';

export default function ReportModal({ isOpen, onClose, reportData }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    let md = `# Multimodal Construction Intelligence Platform - Executive Audit Report\n`;
    md += `Generated: ${new Date().toUTCString()}\n`;
    md += `Standards Enforced: OSHA 1926 • ACI 318 • IBC 2024\n\n`;

    if (reportData.safety) {
      const s = reportData.safety;
      md += `## 1. Site Safety Audit (${s.project_name} - ${s.site_zone})\n`;
      md += `- Safety Compliance Score: ${s.safety_score}/100 (${s.overall_risk_level} Risk)\n`;
      md += `- Summary: ${s.summary}\n\n`;
      md += `### Hazards Identified:\n`;
      s.hazards_identified.forEach(h => {
        md += `- [${h.severity}] ${h.hazard_id}: ${h.category} - ${h.description} (${h.osha_standard})\n`;
      });
      md += `\n### Corrective Actions:\n`;
      s.corrective_actions.forEach(a => md += `- ${a}\n`);
      md += `\n`;
    }

    if (reportData.crack) {
      const c = reportData.crack;
      md += `## 2. Structural Crack & Forensic Assessment\n`;
      md += `- Element: ${c.structural_element}\n`;
      md += `- Classification: ${c.crack_classification} (Estimated Width: ${c.estimated_width_mm} mm)\n`;
      md += `- Severity: ${c.severity} | Risk Rating: ${c.structural_risk_rating}\n`;
      md += `- Root Cause: ${c.cause_analysis}\n`;
      md += `- Code Reference: ${c.code_reference}\n\n`;
      md += `### Remediation Protocol:\n`;
      c.remediation_protocol.forEach((step, idx) => md += `${idx + 1}. ${step}\n`);
      md += `\n`;
    }

    if (reportData.planning) {
      const p = reportData.planning;
      md += `## 3. Construction Project Schedule & WBS (${p.project_name})\n`;
      md += `- Total Estimated Timeline: ${p.estimated_total_weeks} Weeks\n`;
      md += `- Budget: $${p.estimated_budget_usd.toLocaleString()}\n\n`;
      md += `### Phases:\n`;
      p.phases.forEach(ph => {
        md += `- ${ph.phase_id}: ${ph.phase_name} (Weeks ${ph.start_week}-${ph.end_week}, ${ph.labor_headcount} workers)\n`;
      });
      md += `\n`;
    }

    if (reportData.valuation) {
      const v = reportData.valuation;
      md += `## 4. Real Estate Valuation & Investment Yield\n`;
      md += `- Typology: ${v.property_type}\n`;
      md += `- Fair Market Median Value: $${v.estimated_market_value.median_value.toLocaleString()}\n`;
      md += `- Price Per Sqft: $${v.price_per_sqft}\n`;
      md += `- Projected Cap Rate: ${v.investment_metrics.estimated_cap_rate_pct}%\n`;
      md += `- Gross Rental Yield: ${v.investment_metrics.gross_rental_yield_pct}%\n\n`;
    }

    if (reportData.weather) {
      const w = reportData.weather;
      md += `## 5. Weather Risk Advisory\n`;
      md += `- Condition: ${w.overall_site_condition} (${w.risk_level} Protocol)\n`;
      md += `- Worker Safety: ${w.worker_safety_advisory}\n\n`;
    }

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Construction_Executive_Audit_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="subtle-card w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden bg-[#0e0e11] border border-white/10 shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-white" />
            <span className="font-semibold text-sm text-white">Executive Construction Audit Report</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-xs text-zinc-300 border border-white/[0.08] transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-white text-black hover:bg-zinc-200 text-xs font-medium transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .MD</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-white/[0.08] text-zinc-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body / Report Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-zinc-300 leading-relaxed font-sans">
          {/* Header Summary */}
          <div className="border-b border-white/[0.08] pb-4 flex justify-between items-start">
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">AI Construction Intelligence Platform</h1>
              <p className="text-zinc-500 text-[11px] mt-0.5">Automated Multi-Trade Verification & Forensic Audit</p>
            </div>
            <div className="text-right text-[11px] text-zinc-500">
              <div>Date: {new Date().toLocaleDateString()}</div>
              <div className="font-mono text-zinc-400">Status: Verified</div>
            </div>
          </div>

          {/* Module 1: Safety */}
          {reportData.safety ? (
            <div className="space-y-2 border-b border-white/[0.06] pb-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white text-xs uppercase tracking-wider">1. Site Safety & OSHA 1926 Inspection</h3>
                <span className="font-mono text-emerald-400">{reportData.safety.safety_score}/100 Score</span>
              </div>
              <p className="text-zinc-400">{reportData.safety.summary}</p>
              <div className="pt-1">
                <span className="text-[11px] font-semibold text-zinc-300 block mb-1">Key Corrective Actions:</span>
                <ul className="space-y-1 list-disc list-inside text-zinc-400">
                  {reportData.safety.corrective_actions.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-zinc-600 text-[11px] italic">No safety inspection data recorded in current session.</div>
          )}

          {/* Module 2: Crack */}
          {reportData.crack ? (
            <div className="space-y-2 border-b border-white/[0.06] pb-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white text-xs uppercase tracking-wider">2. Structural Crack & Forensic Diagnosis</h3>
                <span className="font-mono text-amber-400">{reportData.crack.crack_classification}</span>
              </div>
              <p className="text-zinc-400">{reportData.crack.cause_analysis}</p>
              <div className="text-[11px] text-zinc-500">
                <span>Code Standard: </span>
                <span className="text-zinc-400 font-mono">{reportData.crack.code_reference}</span>
              </div>
            </div>
          ) : (
            <div className="text-zinc-600 text-[11px] italic">No structural crack scan recorded in current session.</div>
          )}

          {/* Module 3: Planning */}
          {reportData.planning ? (
            <div className="space-y-2 border-b border-white/[0.06] pb-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white text-xs uppercase tracking-wider">3. CPM Project Execution Timeline</h3>
                <span className="font-mono text-white">{reportData.planning.estimated_total_weeks} Total Weeks</span>
              </div>
              <p className="text-zinc-400">
                Scheduled across {reportData.planning.phases.length} WBS stages with target capital expenditure of ${(reportData.planning.estimated_budget_usd / 1e6).toFixed(2)}M.
              </p>
            </div>
          ) : (
            <div className="text-zinc-600 text-[11px] italic">No project schedule synthesized in current session.</div>
          )}

          {/* Module 4: Valuation */}
          {reportData.valuation ? (
            <div className="space-y-2 border-b border-white/[0.06] pb-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white text-xs uppercase tracking-wider">4. Real Estate Feasibility & Valuation</h3>
                <span className="font-mono text-emerald-400">
                  ${(reportData.valuation.estimated_market_value.median_value / 1e3).toFixed(0)}k Median Value
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-zinc-400">
                <div>Price Per Sqft: ${reportData.valuation.price_per_sqft}</div>
                <div>Cap Rate: {reportData.valuation.investment_metrics.estimated_cap_rate_pct}%</div>
              </div>
            </div>
          ) : (
            <div className="text-zinc-600 text-[11px] italic">No real estate appraisal computed in current session.</div>
          )}

          {/* Module 5: Weather */}
          {reportData.weather && (
            <div className="space-y-2">
              <h3 className="font-semibold text-white text-xs uppercase tracking-wider">5. Meteorological Safeguard Directives</h3>
              <p className="text-zinc-400">{reportData.weather.overall_site_condition}</p>
              <p className="text-zinc-500 text-[11px]">{reportData.weather.worker_safety_advisory}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
