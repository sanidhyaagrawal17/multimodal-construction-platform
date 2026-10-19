import React from 'react';
import { ShieldCheck, HardHat, FileText, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Navbar({ health, onOpenReport, hasReportData }) {
  const isLive = health?.ai_mode === 'gemini-live';

  return (
    <header className="border-b border-white/[0.08] bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-md bg-white text-black flex items-center justify-center font-bold tracking-tight">
            <HardHat className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm tracking-tight text-white">Multimodal Construction Intelligence</span>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-400 border border-white/[0.06]">v1.0</span>
            </div>
            <p className="text-[11px] text-zinc-400 tracking-tight hidden sm:block">Decision Support • OSHA 1926 & ACI 318 Standard</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* AI Engine Status Badge */}
          <div className="flex items-center space-x-2 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs">
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-zinc-300 font-medium">
              {isLive ? 'Gemini 1.5 Live' : 'Calibrated Engine'}
            </span>
          </div>

          {/* Export Report Button */}
          <button
            onClick={onOpenReport}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-white text-black hover:bg-zinc-200 transition text-xs font-medium cursor-pointer shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Audit Report</span>
          </button>
        </div>
      </div>
    </header>
  );
}
