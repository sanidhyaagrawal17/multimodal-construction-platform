import React from 'react';
import { ShieldCheck, Star, FileText, Eye } from 'lucide-react';

export default function Navbar({ onLoadPreset, onOpenReport, onRunAudit, isAuditing }) {
  return (
    <header className="border-b border-[#1c263c] bg-[#090e1a]/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand & Gemini Badge */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-[#eab308]/15 border border-[#eab308]/40 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#eab308]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xs sm:text-[13px] tracking-wide text-white uppercase truncate max-w-[180px] sm:max-w-none">
                MULTIMODAL CONSTRUCTION INTELLIGENCE
              </span>
              <span className="hidden sm:inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#eab308]/10 text-[#fde047] border border-[#eab308]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#eab308] animate-pulse"></span>
                <span>Powered by Gemini</span>
              </span>
            </div>
            <p className="text-[11px] text-zinc-300 hidden md:block">
              Site Safety Vision & OSHA Compliance Auditor • 29 CFR 1926 Reference
            </p>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          <button
            onClick={onLoadPreset}
            aria-label="Preset sample"
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-md bg-[#111a2e] hover:bg-[#182542] text-zinc-300 border border-[#20304f] text-xs font-medium transition cursor-pointer shadow-sm"
          >
            <Star className="w-3.5 h-3.5 text-[#eab308] fill-[#eab308]" />
            <span className="hidden sm:inline">Preset</span>
          </button>

          <button
            onClick={onOpenReport}
            aria-label="Export Report"
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#111a2e] hover:bg-[#182542] text-zinc-300 border border-[#20304f] text-xs font-medium transition cursor-pointer shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-zinc-300" />
            <span>Export Report</span>
          </button>

          <button
            onClick={onRunAudit}
            disabled={isAuditing}
            aria-label="Run Audit"
            className="flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-md bg-[#eab308] hover:bg-[#d97706] text-black text-xs font-semibold shadow transition cursor-pointer disabled:opacity-50"
          >
            <Eye className="w-3.5 h-3.5 text-black" />
            <span>{isAuditing ? 'Auditing...' : 'Run Audit'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
