import React, { useState } from 'react';
import { Calendar, Layers, ShieldAlert, Sparkles, RefreshCw, CheckCircle2, TrendingUp } from 'lucide-react';
import { generateProjectPlan } from '../api/client';

export default function ProjectPlanner({ presetData, onUpdateReport }) {
  const [projectName, setProjectName] = useState('Apex Commercial Complex');
  const [projectType, setProjectType] = useState('Commercial');
  const [areaSqft, setAreaSqft] = useState(45000);
  const [budgetUsd, setBudgetUsd] = useState(3200000);
  const [durationMonths, setDurationMonths] = useState(14);
  const [location, setLocation] = useState('Dallas, TX');
  const [soilCondition, setSoilCondition] = useState('Standard Clay / Sandy Silt');
  const [floors, setFloors] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleLoadPreset = () => {
    if (presetData?.planning) {
      const p = presetData.planning;
      setProjectName(p.project_name);
      setProjectType(p.project_type);
      setAreaSqft(p.total_built_up_area_sqft);
      setBudgetUsd(p.target_budget_usd);
      setDurationMonths(p.target_duration_months);
      setLocation(p.location);
      setSoilCondition(p.soil_condition);
      setFloors(p.floors);
      setError(null);
    }
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        project_name: projectName,
        project_type: projectType,
        total_built_up_area_sqft: Number(areaSqft),
        target_budget_usd: Number(budgetUsd),
        target_duration_months: Number(durationMonths),
        location,
        soil_condition: soilCondition,
        floors: Number(floors),
      };
      const data = await generateProjectPlan(payload);
      setResult(data);
      if (onUpdateReport) {
        onUpdateReport('planning', data);
      }
    } catch (err) {
      setError(err.message || 'Plan generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">Construction Project Planning & Scheduling Engine</h2>
          <p className="text-xs text-zinc-400">Critical Path Method (CPM) Work Breakdown Structure (WBS) & risk mitigation matrix</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleLoadPreset}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-medium text-zinc-300 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Load Commercial Preset</span>
          </button>
          <button
            onClick={handleGeneratePlan}
            disabled={loading}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-md bg-white text-black hover:bg-zinc-200 transition text-xs font-medium cursor-pointer disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Layers className="w-3.5 h-3.5" />}
            <span>{loading ? 'Synthesizing Schedule...' : 'Generate Project Plan'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
          {error}
        </div>
      )}

      {/* Main Grid: Parameters on Left, WBS & Schedule on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form */}
        <div className="lg:col-span-4 space-y-4">
          <div className="subtle-card p-4 space-y-3">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Project Parameters</h3>
            
            <div>
              <label className="text-[11px] font-medium text-zinc-400 block mb-1">Project Title</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-white/[0.03] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/[0.3]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Typology</label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-white/[0.03] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/[0.3]"
                >
                  <option value="Residential" className="bg-zinc-900">Residential</option>
                  <option value="Commercial" className="bg-zinc-900">Commercial</option>
                  <option value="Industrial" className="bg-zinc-900">Industrial</option>
                  <option value="Infrastructure" className="bg-zinc-900">Infrastructure</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Floors</label>
                <input
                  type="number"
                  min="1"
                  value={floors}
                  onChange={(e) => setFloors(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-white/[0.03] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/[0.3]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Gross Area (sqft)</label>
                <input
                  type="number"
                  step="1000"
                  value={areaSqft}
                  onChange={(e) => setAreaSqft(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-white/[0.03] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/[0.3]"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Duration (Months)</label>
                <input
                  type="number"
                  min="2"
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-white/[0.03] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/[0.3]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-zinc-400 block mb-1">Target Budget ($ USD)</label>
              <input
                type="number"
                step="50000"
                value={budgetUsd}
                onChange={(e) => setBudgetUsd(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-white/[0.03] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/[0.3]"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-zinc-400 block mb-1">Geographic Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-white/[0.03] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/[0.3]"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-zinc-400 block mb-1">Subsurface / Soil Condition</label>
              <input
                type="text"
                value={soilCondition}
                onChange={(e) => setSoilCondition(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-white/[0.03] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/[0.3]"
              />
            </div>
          </div>
        </div>

        {/* Right: Plan Deliverables */}
        <div className="lg:col-span-8 space-y-4">
          {result ? (
            <div className="space-y-4">
              {/* Executive Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="subtle-card p-3">
                  <span className="text-[11px] text-zinc-400 block">Total Duration</span>
                  <span className="text-base font-bold text-white mt-0.5">{result.estimated_total_weeks} Weeks</span>
                  <span className="text-[10px] text-zinc-500 block">~{Math.round(result.estimated_total_weeks / 4.3)} Months</span>
                </div>
                <div className="subtle-card p-3">
                  <span className="text-[11px] text-zinc-400 block">Total Budget</span>
                  <span className="text-base font-bold text-white mt-0.5">${(result.estimated_budget_usd / 1e6).toFixed(2)}M</span>
                  <span className="text-[10px] text-zinc-500 block">${(result.estimated_budget_usd / areaSqft).toFixed(0)}/sqft</span>
                </div>
                <div className="subtle-card p-3">
                  <span className="text-[11px] text-zinc-400 block">WBS Phases</span>
                  <span className="text-base font-bold text-white mt-0.5">{result.phases.length} Stages</span>
                  <span className="text-[10px] text-zinc-500 block">Integrated CPM</span>
                </div>
                <div className="subtle-card p-3">
                  <span className="text-[11px] text-zinc-400 block">Peak Workforce</span>
                  <span className="text-base font-bold text-white mt-0.5">
                    {Math.max(...result.phases.map(p => p.labor_headcount))} Workers
                  </span>
                  <span className="text-[10px] text-zinc-500 block">Superstructure phase</span>
                </div>
              </div>

              {/* 5-Phase Gantt / WBS Schedule */}
              <div className="subtle-card p-4 space-y-4">
                <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Work Breakdown Structure & Gantt Schedule</span>
                  <span className="text-[11px] text-zinc-500 font-normal">Week 1 to Week {result.estimated_total_weeks}</span>
                </h3>

                <div className="space-y-3">
                  {result.phases.map((phase) => {
                    const leftPct = (phase.start_week / result.estimated_total_weeks) * 100;
                    const widthPct = (phase.duration_weeks / result.estimated_total_weeks) * 100;

                    return (
                      <div key={phase.phase_id} className="p-3 rounded bg-white/[0.02] border border-white/[0.04] space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-[11px] text-zinc-400">{phase.phase_id}</span>
                            <span className="font-semibold text-white">{phase.phase_name}</span>
                            {phase.critical_path && (
                              <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                Critical Path
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-3 text-[11px] text-zinc-400">
                            <span>Weeks {phase.start_week}-{phase.end_week} ({phase.duration_weeks} wks)</span>
                            <span>•</span>
                            <span>{phase.labor_headcount} Crew</span>
                            <span>•</span>
                            <span>{phase.budget_allocation_pct}% Budget</span>
                          </div>
                        </div>

                        {/* Visual Gantt Bar */}
                        <div className="w-full h-2 bg-white/[0.04] rounded-full overflow-hidden relative">
                          <div
                            className={`h-full rounded-full ${
                              phase.critical_path ? 'bg-rose-400' : 'bg-emerald-400'
                            }`}
                            style={{
                              marginLeft: `${leftPct}%`,
                              width: `${Math.max(4, widthPct)}%`
                            }}
                          />
                        </div>

                        {/* Milestones list */}
                        <div className="pt-1">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">Key Deliverables</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-zinc-300">
                            {phase.milestones.map((m, mIdx) => (
                              <div key={mIdx} className="flex items-center space-x-1.5">
                                <CheckCircle2 className="w-3 h-3 text-zinc-500 shrink-0" />
                                <span className="truncate">{m}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Risk Contingency Matrix */}
              <div className="subtle-card p-4 space-y-3">
                <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Risk Contingency Matrix ({result.risk_contingency_matrix.length} Factors)</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/[0.08] text-zinc-400 text-[11px]">
                        <th className="pb-2 font-medium">Risk Event</th>
                        <th className="pb-2 font-medium">Probability</th>
                        <th className="pb-2 font-medium">Impact</th>
                        <th className="pb-2 font-medium">Engineered Mitigation Strategy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {result.risk_contingency_matrix.map((r, rIdx) => (
                        <tr key={rIdx} className="text-zinc-300">
                          <td className="py-2 pr-3 font-medium text-white">{r.risk}</td>
                          <td className="py-2 pr-2">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                              r.probability === 'High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                              r.probability === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                              'bg-zinc-800 text-zinc-400 border-zinc-700'
                            }`}>{r.probability}</span>
                          </td>
                          <td className="py-2 pr-2">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                              r.impact === 'Critical' || r.impact === 'High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                              'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>{r.impact}</span>
                          </td>
                          <td className="py-2 text-[11px] text-zinc-400 leading-snug">{r.mitigation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Strategic Recommendations */}
              <div className="subtle-card p-4 space-y-2">
                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Strategic Superintendent Directives</h4>
                <ul className="space-y-1.5">
                  {result.key_recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-zinc-300">
                      <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="subtle-card p-12 flex flex-col items-center justify-center text-center space-y-3">
              <Calendar className="w-10 h-10 text-zinc-500" />
              <h4 className="text-sm font-medium text-zinc-300">No Construction Schedule Synthesized</h4>
              <p className="text-xs text-zinc-500 max-w-sm">
                Configure your project parameters or click "Load Commercial Preset" to generate a complete WBS, Gantt timeline, and risk matrix.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
