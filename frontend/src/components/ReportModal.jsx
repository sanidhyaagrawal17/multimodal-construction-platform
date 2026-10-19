import React from 'react';
import { X, Printer, Download, FileText } from 'lucide-react';

export default function ReportModal({ isOpen, onClose, reportData }) {
  if (!isOpen) return null;

  const handlePrint = () => window.print();

  const handleDownloadMarkdown = () => {
    let md = `# Multimodal Construction Intelligence Platform - Executive Audit Report\n`;
    md += `Generated: ${new Date().toUTCString()}\n`;
    md += `Standards Enforced: OSHA 1926 • ACI 318 • IBC 2024\n\n`;

    if (reportData.safety) {
      const s = reportData.safety;
      md += `## 1. Site Safety Audit (${s.project_name} - ${s.site_zone})\n`;
      md += `- Safety Compliance Score: ${s.safety_score}/100 (${s.overall_risk_level} Risk)\n`;
      md += `- Summary: ${s.summary}\n\n`;
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
      <div className="tactical-card w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden bg-[#0a0f1d] border border-[#243555] shadow-2xl">
        <div className="p-4 border-b border-[#1c263c] flex items-center justify-between bg-[#080d1a]">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-[#eab308]" />
            <span className="font-semibold text-sm text-white">Executive Construction Audit Dossier</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#131d31] hover:bg-[#1a2742] text-xs text-zinc-300 border border-[#223354] transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#eab308] hover:bg-[#ca8a04] text-black text-xs font-semibold transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .MD</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-[#141d30] text-zinc-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 text-xs text-zinc-300 leading-relaxed font-sans">
          <div className="border-b border-[#1c263c] pb-3 flex justify-between items-start">
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">Skyline Heights Tower B (Commercial Core)</h1>
              <p className="text-zinc-500 text-[11px]">Site Safety Vision & OSHA 1926 Compliance Audit</p>
            </div>
            <div className="text-right text-[11px] font-mono text-zinc-400">
              <div>Risk Score: <span className="text-rose-400 font-bold">84 FAIL</span></div>
              <div className="text-zinc-500">Standard: 29 CFR 1926</div>
            </div>
          </div>

          <div className="space-y-2 border-b border-[#1c263c] pb-3">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">1. Site Safety Infractions</span>
            <div className="p-2.5 rounded bg-[#0b101d] border border-rose-900/30 text-rose-300">
              <span className="font-mono font-bold block mb-0.5">CRITICAL: OSHA 1926.501(b)(1)</span>
              Worker positioned within 18 inches of leading edge at 32.4 ft without active fall arrest tie-off.
            </div>
            <div className="p-2.5 rounded bg-[#0b101d] border border-amber-900/30 text-[#fde047]">
              <span className="font-mono font-bold block mb-0.5">MODERATE: OSHA 1926.451(g)(1)</span>
              Perimeter midrail missing between vertical standards. Missing outward-facing 3.5" toeboard.
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">2. Mandatory Corrective Protocol</span>
            <ol className="space-y-1.5 list-decimal list-inside text-zinc-300">
              <li>Halt ironwork on Cantilever B-4. Direct worker to connect dual self-retracting lanyard to rated horizontal lifeline immediately.</li>
              <li>Direct the scaffold contractor to reinstall 42-inch top-rail, 21-inch mid-rail, and 3.5-inch toe-board on Bay 4C prior to resuming concrete work.</li>
              <li>Log a formal non-conformance report and require a toolbox talk sign-off before the next shift.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
