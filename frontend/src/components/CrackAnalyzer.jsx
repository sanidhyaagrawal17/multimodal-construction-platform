import React, { useState } from 'react';
import { UploadCloud, AlertTriangle, Shield, RefreshCw, Eye, Sparkles, Hammer } from 'lucide-react';
import { analyzeCrackFile, analyzeCrackJson } from '../api/client';

export default function CrackAnalyzer({ presetData, onUpdateReport }) {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [structuralElement, setStructuralElement] = useState('Beam');
  const [concreteGrade, setConcreteGrade] = useState('M25 / 3500 PSI');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(selected);
      setError(null);
    }
  };

  const handleLoadPreset = () => {
    if (presetData?.crack) {
      setStructuralElement(presetData.crack.structural_element);
      setConcreteGrade(presetData.crack.concrete_grade);
      setImagePreview(presetData.crack.image_base64);
      setFile(null);
      setError(null);
    }
  };

  const handleRunAnalysis = async () => {
    if (!file && !imagePreview) {
      setError('Please select a structural photo or load a preset scan.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let data;
      if (file) {
        data = await analyzeCrackFile(file, structuralElement, concreteGrade);
      } else {
        data = await analyzeCrackJson({
          structural_element: structuralElement,
          concrete_grade: concreteGrade,
          image_base64: imagePreview,
        });
      }
      setResult(data);
      if (onUpdateReport) {
        onUpdateReport('crack', data);
      }
    } catch (err) {
      setError(err.message || 'Crack evaluation failed');
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'Critical': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'High': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">Structural Crack Detection & Forensic Analysis</h2>
          <p className="text-xs text-zinc-400">Classifies shear, flexural, settlement, and thermal cracks per ACI 318 & ACI 224R</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleLoadPreset}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-medium text-zinc-300 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Load Preset Sample</span>
          </button>
          <button
            onClick={handleRunAnalysis}
            disabled={loading}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-md bg-white text-black hover:bg-zinc-200 transition text-xs font-medium cursor-pointer disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{loading ? 'Analyzing Crack...' : 'Analyze Structural Image'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Ingestion & Parameters */}
        <div className="lg:col-span-5 space-y-4">
          <div className="subtle-card p-4 space-y-4">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Structural Imagery Ingestion</h3>
            
            <div
              onClick={() => document.getElementById('crack-file-input').click()}
              className="border border-dashed border-white/[0.15] hover:border-white/[0.3] rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition bg-white/[0.01]"
            >
              <input
                id="crack-file-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
              <UploadCloud className="w-8 h-8 text-zinc-400 mb-2" />
              <span className="text-xs text-zinc-300 font-medium">Click to upload structural surface photo</span>
              <span className="text-[11px] text-zinc-500 mt-1">High-resolution concrete or masonry close-up</span>
            </div>

            {imagePreview && (
              <div className="relative rounded-md overflow-hidden border border-white/[0.08] bg-black/40">
                <img
                  src={imagePreview}
                  alt="Crack Inspection Preview"
                  className="w-full h-52 object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur text-[10px] text-zinc-300 border border-white/10">
                  {file ? file.name : 'Beam Shear Crack Sample Active'}
                </div>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Structural Element</label>
                <select
                  value={structuralElement}
                  onChange={(e) => setStructuralElement(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-white/[0.03] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/[0.3]"
                >
                  <option value="Beam" className="bg-zinc-900">Reinforced Concrete Beam</option>
                  <option value="Column" className="bg-zinc-900">Reinforced Concrete Column</option>
                  <option value="Slab" className="bg-zinc-900">Suspended Two-Way Slab</option>
                  <option value="Retaining Wall" className="bg-zinc-900">Basement Retaining Wall</option>
                  <option value="Foundation" className="bg-zinc-900">Foundation Footing / Raft</option>
                  <option value="Masonry Wall" className="bg-zinc-900">Unreinforced Masonry Wall</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Concrete Design Grade</label>
                <input
                  type="text"
                  value={concreteGrade}
                  onChange={(e) => setConcreteGrade(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-white/[0.03] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/[0.3]"
                  placeholder="e.g. M25 / 3500 PSI"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Forensic Diagnosis */}
        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <div className="space-y-4">
              {/* Classification Banner */}
              <div className="subtle-card p-5 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <div>
                    <span className="text-[11px] text-zinc-400 uppercase tracking-wider block">Diagnosed Crack Morphology</span>
                    <h3 className="text-base font-semibold text-white mt-0.5">{result.crack_classification}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded border ${getRiskBadge(result.structural_risk_rating)}`}>
                      {result.structural_risk_rating} Risk
                    </span>
                  </div>
                </div>

                {/* Key Metrics Row */}
                <div className="grid grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-[11px] text-zinc-400 block">Est. Max Width</span>
                    <span className="text-base font-mono font-bold text-white mt-0.5">{result.estimated_width_mm} mm</span>
                  </div>
                  <div className="p-3 rounded bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-[11px] text-zinc-400 block">Severity Tier</span>
                    <span className="text-sm font-semibold text-white mt-0.5">{result.severity}</span>
                  </div>
                  <div className="p-3 rounded bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-[11px] text-zinc-400 block">Element Audited</span>
                    <span className="text-sm font-medium text-zinc-300 mt-0.5 truncate">{result.structural_element}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] text-zinc-400 uppercase tracking-wider block mb-1">Failure Mechanism & Root Cause</span>
                  <p className="text-xs text-zinc-300 leading-relaxed">{result.cause_analysis}</p>
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px] text-zinc-500 border-t border-white/[0.04]">
                  <span>Design Code Compliance:</span>
                  <span className="font-mono text-zinc-400">{result.code_reference}</span>
                </div>
              </div>

              {/* Immediate Shoring & Safety Actions */}
              <div className="subtle-card p-4 space-y-2">
                <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Immediate Structural Safety Actions</span>
                </h4>
                <ul className="space-y-1.5">
                  {result.immediate_actions.map((act, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-zinc-300">
                      <span className="text-rose-400 font-bold shrink-0 mt-0.5">!</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Remediation Protocol */}
              <div className="subtle-card p-4 space-y-2">
                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Hammer className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Permanent Engineering Remediation Protocol</span>
                </h4>
                <ol className="space-y-2">
                  {result.remediation_protocol.map((step, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-xs text-zinc-300">
                      <span className="w-4 h-4 rounded-full bg-white/[0.06] text-zinc-400 text-[10px] font-mono flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            <div className="subtle-card p-12 flex flex-col items-center justify-center text-center space-y-3">
              <Shield className="w-10 h-10 text-zinc-500" />
              <h4 className="text-sm font-medium text-zinc-300">No Structural Scan Performed</h4>
              <p className="text-xs text-zinc-500 max-w-sm">
                Upload a concrete/masonry image or load the preset beam shear crack to evaluate structural integrity and repair protocols.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
