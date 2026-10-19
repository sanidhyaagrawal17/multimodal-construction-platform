import React, { useState } from 'react';
import { 
  UploadCloud, 
  Check, 
  Clock, 
  AlertTriangle, 
  Image as ImageIcon, 
  ChevronDown, 
  CheckCircle2, 
  AlertOctagon,
  RefreshCw
} from 'lucide-react';
import { analyzeSafetyFile, analyzeSafetyJson } from '../api/client';

export default function SafetyInspector({ onUpdateReport }) {
  // State switcher: 'results' | 'empty' | 'loading' | 'error'
  const [uiState, setUiState] = useState('results');
  const [projectName, setProjectName] = useState('Skyline Heights Tower B (Commercial Core)');
  const [siteZone, setSiteZone] = useState('Scaffolding Zone B - Level 4');
  const [imageFileName, setImageFileName] = useState('Skyline-TowerB-Scaffold4.jpg');
  const [fileSizeStr, setFileSizeStr] = useState('8.4MB');
  const [imageSrc, setImageSrc] = useState('/scaffold_sample.jpg');
  const [uploadedFile, setUploadedFile] = useState(null);

  // OSHA target checkboxes
  const [targets, setTargets] = useState({
    fallArrest: true,
    guardrails: true,
    ppe: true,
    plankDeflection: false,
  });

  const toggleTarget = (key) => {
    setTargets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDemoData = () => {
    setUiState('results');
    setProjectName('Skyline Heights Tower B (Commercial Core)');
    setSiteZone('Scaffolding Zone B - Level 4');
    setImageFileName('Skyline-TowerB-Scaffold4.jpg');
    setFileSizeStr('8.4MB');
    setImageSrc('/scaffold_sample.jpg');
    setUploadedFile(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setImageFileName(file.name);
      setFileSizeStr(`${(file.size / (1024 * 1024)).toFixed(1)}MB`);
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunAudit = async () => {
    setUiState('loading');
    try {
      let data;
      if (uploadedFile) {
        data = await analyzeSafetyFile(uploadedFile, projectName, siteZone);
      } else {
        // Run with base image or fallback
        data = await analyzeSafetyJson({
          project_name: projectName,
          site_zone: siteZone,
          image_base64: imageSrc,
        });
      }
      setUiState('results');
      if (onUpdateReport) {
        onUpdateReport('safety', data);
      }
    } catch (err) {
      setUiState('error');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-zinc-200">
      {/* ================= LEFT COLUMN (3.5 / 12) ================= */}
      <div className="lg:col-span-4 space-y-4">
        {/* Card 1: Site Imagery Ingestion */}
        <div className="tactical-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#eab308]"></span>
              <span className="font-semibold text-xs tracking-wide text-white uppercase">Site Imagery Ingestion</span>
            </div>
            <button
              onClick={handleDemoData}
              className="px-2.5 py-1 rounded bg-[#131d31] hover:bg-[#1a2742] text-[#8b9bb4] hover:text-white text-[11px] font-medium border border-[#223354] transition cursor-pointer"
            >
              Demo Data
            </button>
          </div>

          {/* Upload Area */}
          <div
            onClick={() => document.getElementById('file-upload-input').click()}
            className="border border-dashed border-[#243555] hover:border-[#3b5380] rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer transition bg-[#0b101d]/60"
          >
            <input
              id="file-upload-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <div className="w-9 h-9 rounded-full bg-[#131d31] flex items-center justify-center text-zinc-400 mb-2">
              <UploadCloud className="w-4 h-4 text-zinc-300" />
            </div>
            <div className="text-xs text-center font-medium">
              <span className="text-[#eab308]">Click to upload</span>
              <span className="text-zinc-400"> or drag site image</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">JPEG, PNG, WebP up to 25MB</p>

            {/* Active File Pill */}
            {imageFileName && (
              <div className="mt-3 px-3 py-1.5 rounded-md bg-[#0f1a2e] border border-[#1e2f4f] text-[11px] text-zinc-300 flex items-center space-x-2 w-full justify-between">
                <div className="flex items-center space-x-1.5 truncate">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{imageFileName}</span>
                </div>
                <span className="text-zinc-500 font-mono text-[10px] shrink-0">({fileSizeStr})</span>
              </div>
            )}
          </div>

          {/* Project & Zone Inputs */}
          <div className="space-y-3 pt-1">
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Project / Structure Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#0b101d] border border-[#1e2a42] text-xs text-white focus:outline-none focus:border-[#3b5380] transition"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Site Work Zone</label>
              <input
                type="text"
                value={siteZone}
                onChange={(e) => setSiteZone(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#0b101d] border border-[#1e2a42] text-xs text-white focus:outline-none focus:border-[#3b5380] transition"
              />
            </div>
          </div>

          {/* OSHA Verification Targets Checklist */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase block">
              OSHA VERIFICATION TARGETS
            </span>

            <div className="space-y-1.5">
              {/* Target 1 */}
              <div
                onClick={() => toggleTarget('fallArrest')}
                className="p-2.5 rounded bg-[#0b101d] border border-[#1e2a42] flex items-start space-x-2.5 cursor-pointer hover:border-[#2b3a58] transition"
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                  targets.fallArrest ? 'bg-[#eab308] text-black' : 'border border-zinc-600'
                }`}>
                  {targets.fallArrest && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <div>
                  <span className="text-xs font-medium text-white block">Worker Fall Arrest & Tie-Off</span>
                  <span className="text-[11px] font-mono text-zinc-500">OSHA 1926.501(b)(1) 6ft threshold</span>
                </div>
              </div>

              {/* Target 2 */}
              <div
                onClick={() => toggleTarget('guardrails')}
                className="p-2.5 rounded bg-[#0b101d] border border-[#1e2a42] flex items-start space-x-2.5 cursor-pointer hover:border-[#2b3a58] transition"
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                  targets.guardrails ? 'bg-[#eab308] text-black' : 'border border-zinc-600'
                }`}>
                  {targets.guardrails && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <div>
                  <span className="text-xs font-medium text-white block">Guardrails, Mid-rails & Toe-boards</span>
                  <span className="text-[11px] font-mono text-zinc-500">OSHA 1926.451(g)(1) perimeter integrity</span>
                </div>
              </div>

              {/* Target 3 */}
              <div
                onClick={() => toggleTarget('ppe')}
                className="p-2.5 rounded bg-[#0b101d] border border-[#1e2a42] flex items-start space-x-2.5 cursor-pointer hover:border-[#2b3a58] transition"
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                  targets.ppe ? 'bg-[#eab308] text-black' : 'border border-zinc-600'
                }`}>
                  {targets.ppe && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <div>
                  <span className="text-xs font-medium text-white block">Hardhat & High-Visibility PPE</span>
                  <span className="text-[11px] font-mono text-zinc-500">OSHA 1926.100 & ANSI/ISEA 107</span>
                </div>
              </div>

              {/* Target 4 */}
              <div
                onClick={() => toggleTarget('plankDeflection')}
                className="p-2.5 rounded bg-[#0b101d] border border-[#1e2a42] flex items-start space-x-2.5 cursor-pointer hover:border-[#2b3a58] transition"
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                  targets.plankDeflection ? 'bg-[#eab308] text-black' : 'border border-zinc-600'
                }`}>
                  {targets.plankDeflection && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <div>
                  <span className="text-xs font-medium text-white block">Scaffold Plank Deflection & Locking Pins</span>
                  <span className="text-[11px] font-mono text-zinc-500">OSHA 1926.451(a) structural load limit</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Recent Audits */}
        <div className="tactical-card p-4 space-y-3">
          <div className="flex items-center justify-between text-xs pb-1 border-b border-[#1c263c]">
            <div className="flex items-center space-x-2 text-zinc-300">
              <Clock className="w-3.5 h-3.5 text-[#eab308]" />
              <span className="font-semibold tracking-wide uppercase text-[11px]">RECENT AUDITS</span>
            </div>
            <span className="text-zinc-500 text-[11px]">Last 3 audits</span>
          </div>

          <div className="space-y-2">
            {/* Audit 1 */}
            <div className="p-2.5 rounded bg-[#0b101d] border border-[#1e2a42] flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-white block">Skyline Heights Tower B</span>
                <span className="text-[10px] text-zinc-500">Today, 14:32</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
                84 FAIL
              </span>
            </div>

            {/* Audit 2 */}
            <div className="p-2.5 rounded bg-[#0b101d] border border-[#1e2a42] flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-white block">Hudson Yards Core C</span>
                <span className="text-[10px] text-zinc-500">Yesterday</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                22 PASS
              </span>
            </div>

            {/* Audit 3 */}
            <div className="p-2.5 rounded bg-[#0b101d] border border-[#1e2a42] flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-white block">Pacific Bay Pier 14</span>
                <span className="text-[10px] text-zinc-500">2 days ago</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                68 MODERATE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT COLUMN (8.5 / 12) ================= */}
      <div className="lg:col-span-8 space-y-4">
        {/* Main Vision Display Card */}
        <div className="tactical-card overflow-hidden">
          {/* Header Bar */}
          <div className="px-4 py-2.5 bg-[#0a0f1d] border-b border-[#1c263c] flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-zinc-300">
              <ImageIcon className="w-3.5 h-3.5 text-[#eab308]" />
              <span className="font-mono text-[11px] text-zinc-200">{imageFileName}</span>
            </div>
            <div className="font-mono text-[11px] text-zinc-400">
              <span>3840 × 2160</span>
              <span className="mx-2">•</span>
              <span>Analyzed: 14:32:08 UTC</span>
            </div>
          </div>

          {/* Image & Bounding Boxes Canvas */}
          <div className="relative bg-black flex items-center justify-center min-h-[360px] overflow-hidden select-none">
            <img
              src={imageSrc}
              alt="Site Inspection Scan"
              className="w-full h-auto max-h-[460px] object-cover"
            />

            {/* Bounding Box 1: Red Critical Box (Worker at Edge) */}
            {uiState === 'results' && (
              <>
                <div
                  className="hud-box border-2 border-rose-500 bg-rose-500/10"
                  style={{ top: '15%', left: '26%', width: '13%', height: '72%' }}
                >
                  <span className="absolute -top-6 left-0 px-1.5 py-0.5 bg-rose-600 text-white font-mono text-[9px] font-bold tracking-tight whitespace-nowrap shadow">
                    OSHA 1926.501(b)(1) • Critical • 98%
                  </span>
                </div>

                {/* Bounding Box 2: Green Hardhat OK Box */}
                <div
                  className="hud-box border-2 border-emerald-400 bg-emerald-400/10"
                  style={{ top: '18%', left: '32%', width: '7%', height: '11%' }}
                >
                  <span className="absolute -top-5 right-0 px-1.5 py-0.5 bg-emerald-500 text-black font-mono text-[9px] font-bold tracking-tight whitespace-nowrap shadow">
                    PPE • OK • 96%
                  </span>
                </div>

                {/* Bounding Box 3: Yellow Moderate Box (Missing Midrail) */}
                <div
                  className="hud-box border-2 border-[#eab308] bg-[#eab308]/10"
                  style={{ top: '28%', left: '42%', width: '22%', height: '24%' }}
                >
                  <span className="absolute -top-6 left-0 px-1.5 py-0.5 bg-[#eab308] text-black font-mono text-[9px] font-bold tracking-tight whitespace-nowrap shadow">
                    OSHA 1926.451(g)(1) • Moderate • 91%
                  </span>
                </div>
              </>
            )}

            {/* Loading Overlay */}
            {uiState === 'loading' && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="w-8 h-8 text-[#eab308] animate-spin" />
                <span className="text-xs font-mono text-zinc-300">Executing OSHA 1926 Multimodal Vision Inference...</span>
              </div>
            )}

            {/* Error Overlay */}
            {uiState === 'error' && (
              <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center space-y-2 p-6 text-center">
                <AlertOctagon className="w-8 h-8 text-rose-500" />
                <span className="text-sm font-semibold text-white">Inspection Scan Interrupted</span>
                <span className="text-xs text-zinc-400 max-w-sm">Failed to connect to multimodal inference endpoint. Please verify payload formatting or network access.</span>
              </div>
            )}
          </div>

          {/* Bottom Detection Stats Strip */}
          <div className="px-4 py-2.5 bg-[#0a0f1d] border-t border-[#1c263c] flex flex-wrap items-center gap-6 text-xs font-medium">
            <div className="flex items-center space-x-2">
              <span className="text-zinc-400">Workers Detected:</span>
              <span className="px-2 py-0.5 rounded bg-[#131d31] border border-[#20304f] font-mono text-[11px] text-white">
                2 Active
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-zinc-400">PPE Compliance:</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 font-mono text-[11px] text-[#fde047]">
                50% Warning
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-zinc-400">Hazards Found:</span>
              <span className="px-2 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 font-mono text-[11px] text-rose-400">
                2 Detected
              </span>
            </div>
          </div>
        </div>

        {/* Mid Section: Risk Score & Infraction Analysis Log */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Card A: TOTAL HAZARD RISK SCORE */}
          <div className="md:col-span-5 tactical-card p-4 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs tracking-wider text-zinc-300 uppercase">
                  TOTAL HAZARD RISK SCORE
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                  FAIL
                </span>
              </div>

              {/* Big Score */}
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-4xl font-extrabold font-mono text-rose-500 tracking-tight">84</span>
                <span className="text-xs font-mono text-zinc-400">/ 100 Risk Index</span>
              </div>

              <p className="text-xs text-rose-300/80 leading-relaxed mt-2">
                High Severity Fall Risk detected. Immediate supervisor intervention required prior to continued work.
              </p>
            </div>

            {/* Progress Bars & State Switcher */}
            <div className="space-y-3 pt-2 border-t border-[#1c263c]">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Fall Risk</span>
                  <span className="text-rose-400 font-bold">84%</span>
                </div>
                <div className="w-full h-1.5 bg-[#141d30] rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>

              {/* State Switcher Pills */}
              <div className="flex items-center justify-between pt-1">
                <div className="inline-flex rounded-md p-0.5 bg-[#0a0f1d] border border-[#1c263c] text-[10px] font-medium">
                  {['results', 'empty', 'loading', 'error'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setUiState(st)}
                      className={`px-2 py-0.5 rounded capitalize transition cursor-pointer ${
                        uiState === st ? 'bg-[#1b263b] text-white font-semibold' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Scaffold Structure Defect</span>
                  <span className="text-[#eab308] font-bold">42%</span>
                </div>
                <div className="w-full h-1.5 bg-[#141d30] rounded-full overflow-hidden">
                  <div className="h-full bg-[#eab308] rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Card B: OSHA INFRACTION ANALYSIS LOG */}
          <div className="md:col-span-7 tactical-card p-4 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#1c263c]">
              <div className="flex items-center space-x-1.5 text-zinc-300">
                <AlertTriangle className="w-3.5 h-3.5 text-[#eab308]" />
                <span className="font-semibold text-xs tracking-wider uppercase">OSHA INFRACTION ANALYSIS LOG</span>
              </div>
              <span className="text-zinc-500 font-mono text-[11px]">2 Items Flagged</span>
            </div>

            <div className="space-y-2.5">
              {/* Infraction 1 */}
              <div className="p-3 rounded-md bg-[#131722] border border-rose-900/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                      CRITICAL
                    </span>
                    <span className="font-mono text-xs font-bold text-white">OSHA 1926.501(b)(1)</span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500">Zone B • Level 4</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Worker positioned within 18 inches of leading edge at 32.4 ft without active fall arrest tie-off.
                </p>
              </div>

              {/* Infraction 2 */}
              <div className="p-3 rounded-md bg-[#161a24] border border-amber-900/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-[#fde047] border border-amber-500/40">
                      MODERATE
                    </span>
                    <span className="font-mono text-xs font-bold text-white">OSHA 1926.451(g)(1)</span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500">Bay 4C Standard</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Perimeter midrail missing between vertical standards. Missing outward-facing 3.5" toeboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Card: Recommended Actions & Corrective Protocol */}
        <div className="tactical-card p-4 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-[#1c263c]">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span className="font-semibold text-xs tracking-wide text-white">
                Recommended Actions & Corrective Protocol <span className="text-zinc-500 font-normal">(3 Structured Steps)</span>
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-zinc-400 cursor-pointer" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {/* Step 1 */}
            <div className="p-3.5 rounded bg-[#0b101d] border border-[#1e2a42] space-y-1.5">
              <span className="text-[11px] font-mono font-bold text-rose-400 block tracking-wider uppercase">
                01. IMMEDIATE ACTION
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Halt ironwork on Cantilever B-4. Direct worker to connect dual self-retracting lanyard to rated horizontal lifeline immediately.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded bg-[#0b101d] border border-[#1e2a42] space-y-1.5">
              <span className="text-[11px] font-mono font-bold text-[#eab308] block tracking-wider uppercase">
                02. ENGINEERING FIX
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Direct the scaffold contractor to reinstall 42-inch top-rail, 21-inch mid-rail, and 3.5-inch toe-board on Bay 4C prior to resuming concrete work.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded bg-[#0b101d] border border-[#1e2a42] space-y-1.5">
              <span className="text-[11px] font-mono font-bold text-emerald-400 block tracking-wider uppercase">
                03. DOCUMENTATION
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Log a formal non-conformance report and require a toolbox talk sign-off before the next shift.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
