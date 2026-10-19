import React from 'react';
import { ShieldCheck, Star, FileText, Eye } from 'lucide-react';

export default function Navbar({ onLoadPreset, onOpenReport, onRunAudit, isAuditing }) {
  return (
    <header className="border-b border-[#1c263c] bg-[#090e1a]/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand & Gemini Badge */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-[#eab308]/15 border border-[#eab308]/40 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#eab308]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[13px] tracking-wide text-white uppercase">
                MULTIMODAL CONSTRUCTION INTELLIGENCE
              </span>
              <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#eab308]/10 text-[#fde047] border border-[#eab308]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#eab308] animate-pulse"></span>
                <span>Powered by Gemini</span>
              </span>
            </div>
            <p className="text-[11px] text-[#8b9bb4]">
              Site Safety Vision & OSHA Compliance Auditor • 29 CFR 1926 Reference
            </p>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={onLoadPreset}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#111a2e] hover:bg-[#182542] text-zinc-300 border border-[#20304f] text-xs font-medium transition cursor-pointer shadow-sm"
          >
            <Star className="w-3.5 h-3.5 text-[#eab308] fill-[#eab308]" />
            <span>Load Preset Sample</span>
          </button>

          <button
            onClick={onOpenReport}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#111a2e] hover:bg-[#182542] text-zinc-300 border border-[#20304f] text-xs font-medium transition cursor-pointer shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
            <span>Export Audit Report (PDF/JSON)</span>
          </button>

          <button
            onClick={onRunAudit}
            disabled={isAuditing}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-md bg-[#eab308] hover:bg-[#d97706] text-black text-xs font-semibold shadow transition cursor-pointer disabled:opacity-50"
          >
            <Eye className="w-3.5 h-3.5 text-black" />
            <span>{isAuditing ? 'Auditing...' : 'Run Safety Audit'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
