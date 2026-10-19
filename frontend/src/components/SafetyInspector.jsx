import React, { useState } from 'react';
import { UploadCloud, ShieldAlert, CheckCircle2, AlertOctagon, RefreshCw, Eye, Sparkles } from 'lucide-react';
import { analyzeSafetyFile, analyzeSafetyJson } from '../api/client';

export default function SafetyInspector({ presetData, onUpdateReport }) {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [projectName, setProjectName] = useState('Skyline Heights Tower B');
  const [siteZone, setSiteZone] = useState('Scaffolding Zone B - Level 4');
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
    if (presetData?.safety) {
      setProjectName(presetData.safety.project_name);
      setSiteZone(presetData.safety.site_zone);
      setImagePreview(presetData.safety.image_base64);
      setFile(null);
      setError(null);
    }
  };

  const handleRunAudit = async () => {
    if (!file && !imagePreview) {
      setError('Please select an image file or load a preset scenario.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let data;
      if (file) {
        data = await analyzeSafetyFile(file, projectName, siteZone);
      } else {
        data = await analyzeSafetyJson({
          project_name: projectName,
          site_zone: siteZone,
          image_base64: imagePreview,
        });
      }
      setResult(data);
      if (onUpdateReport) {
        onUpdateReport('safety', data);
      }
    } catch (err) {
      setError(err.message || 'Inspection failed');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-400/30 bg-emerald-500/10';
    if (score >= 70) return 'text-amber-400 border-amber-400/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-400/30 bg-rose-500/10';
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
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
          <h2 className="text-lg font-semibold text-white tracking-tight">Site Safety & OSHA Compliance Inspector</h2>
          <p className="text-xs text-zinc-400">Multimodal vision audit for worker PPE, fall risks, and OSHA 1926 infractions</p>
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
            onClick={handleRunAudit}
            disabled={loading}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-md bg-white text-black hover:bg-zinc-200 transition text-xs font-medium cursor-pointer disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{loading ? 'Auditing Site...' : 'Run Safety Audit'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
          <AlertOctagon className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Upload & Inputs on Left, Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Ingestion & Project Metadata */}
        <div className="lg:col-span-5 space-y-4">
          <div className="subtle-card p-4 space-y-4">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Site Imagery Ingestion</h3>
            
            {/* Dropzone */}
            <div
              onClick={() => document.getElementById('safety-file-input').click()}
              className="border border-dashed border-white/[0.15] hover:border-white/[0.3] rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition bg-white/[0.01]"
            >
              <input
                id="safety-file-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
              <UploadCloud className="w-8 h-8 text-zinc-400 mb-2" />
              <span className="text-xs text-zinc-300 font-medium">Click to upload or drag site photo</span>
              <span className="text-[11px] text-zinc-500 mt-1">JPEG, PNG, WebP (up to 25MB)</span>
            </div>

            {/* Preview Canvas */}
            {imagePreview && (
              <div className="relative rounded-md overflow-hidden border border-white/[0.08] bg-black/40">
                <img
                  src={imagePreview}
                  alt="Site Inspection Preview"
                  className="w-full h-52 object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur text-[10px] text-zinc-300 border border-white/10">
                  {file ? file.name : 'Preset Scenario Active'}
                </div>
              </div>
            )}

            {/* Parameters */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-white/[0.03] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/[0.3]"
                  placeholder="e.g. Skyline Heights Tower B"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Site Work Zone</label>
                <input
                  type="text"
                  value={siteZone}
                  onChange={(e) => setSiteZone(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-white/[0.03] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/[0.3]"
                  placeholder="e.g. Level 4 Cantilever Deck"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Audit Findings & Metrics */}
        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <div className="space-y-4">
              {/* Score & Risk Overview Card */}
              <div className="subtle-card p-5">
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-full border flex items-center justify-center font-bold text-lg ${getScoreColor(result.safety_score)}`}>
                      {result.safety_score}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-zinc-400 font-medium">Compliance Score</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getSeverityBadge(result.overall_risk_level)}`}>
                          {result.overall_risk_level} Risk
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-white mt-0.5">{result.project_name} — {result.site_zone}</h4>
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-xs text-zinc-300 leading-relaxed">
                  {result.summary}
                </div>
              </div>

              {/* PPE Compliance Matrix */}
              <div className="subtle-card p-4 space-y-3">
                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                  <span>PPE Compliance Audit</span>
                  <span className="text-[11px] text-zinc-500 font-normal">OSHA 1926 Subpart E</span>
                </h4>
                <div className="space-y-2.5">
                  {result.ppe_compliance.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded bg-white/[0.02] border border-white/[0.04] space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-white">{item.item}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] text-zinc-400">{item.compliance_rate_pct}%</span>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${
                            item.status === 'Compliant' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            item.status === 'Violation' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            item.compliance_rate_pct >= 85 ? 'bg-emerald-400' :
                            item.compliance_rate_pct >= 60 ? 'bg-amber-400' : 'bg-rose-400'
                          }`}
                          style={{ width: `${item.compliance_rate_pct}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-zinc-400">{item.notes}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hazards Identified */}
              <div className="subtle-card p-4 space-y-3">
                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Identified Violations & Hazards ({result.hazards_identified.length})
                </h4>
                <div className="space-y-2">
                  {result.hazards_identified.map((haz, idx) => (
                    <div key={idx} className="p-3 rounded bg-white/[0.02] border border-white/[0.04] space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-[11px] text-zinc-400">{haz.hazard_id}</span>
                          <span className="font-semibold text-white">{haz.category}</span>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getSeverityBadge(haz.severity)}`}>
                          {haz.severity}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300">{haz.description}</p>
                      <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                        <span>Zone: {haz.location}</span>
                        <span className="font-mono text-zinc-400">{haz.osha_standard}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Corrective Actions */}
              <div className="subtle-card p-4 space-y-2">
                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Immediate Corrective Actions</h4>
                <ul className="space-y-1.5">
                  {result.corrective_actions.map((act, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-zinc-300">
                      <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="subtle-card p-12 flex flex-col items-center justify-center text-center space-y-3">
              <ShieldAlert className="w-10 h-10 text-zinc-500" />
              <h4 className="text-sm font-medium text-zinc-300">No Inspection Performed Yet</h4>
              <p className="text-xs text-zinc-500 max-w-sm">
                Upload a site image or click "Load Preset Sample" above to run an AI multimodal safety analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
