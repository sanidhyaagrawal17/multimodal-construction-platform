import React, { useState } from 'react';
import { ClipboardList, AlertCircle, CheckCircle2, Clock, Sparkles, RefreshCw, Users, ShieldAlert } from 'lucide-react';
import { processDailyLog } from '../api/client';

export default function DailySiteAssistant({ presetData, onUpdateReport }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [supervisor, setSupervisor] = useState('Marcus Vance');
  const [headcount, setHeadcount] = useState(34);
  const [weatherObserved, setWeatherObserved] = useState('Clear, 28°C');
  const [fieldNotes, setFieldNotes] = useState(
    'Poured 120 cubic yards of concrete on Floor 3 slab. Ready-mix transit mixer delayed 1.5 hours due to highway accident. 4 masons absent today. Steel delivery arrived at 2 PM. Minor scaffold tie wire loose on north bay, fixed on spot. Rebar crew completed column cages for Floor 4.'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleLoadPreset = () => {
    if (presetData?.daily_log) {
      const d = presetData.daily_log;
      setDate(d.date);
      setSupervisor(d.supervisor_name);
      setHeadcount(d.workforce_headcount);
      setWeatherObserved(d.weather_observed);
      setFieldNotes(d.raw_field_notes);
      setError(null);
    }
  };

  const handleProcessLog = async () => {
    if (!fieldNotes.trim()) {
      setError('Please provide raw field notes.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        date,
        supervisor_name: supervisor,
        workforce_headcount: Number(headcount),
        weather_observed: weatherObserved,
        raw_field_notes: fieldNotes,
      };
      const data = await processDailyLog(payload);
      setResult(data);
      if (onUpdateReport) {
        onUpdateReport('daily_log', data);
      }
    } catch (err) {
      setError(err.message || 'Daily log processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">Daily Site Log Assistant & Punch List Generator</h2>
          <p className="text-xs text-zinc-400">Transforms unstructured field notes into executive summaries, bottleneck tracking, and punch lists</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleLoadPreset}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-medium text-zinc-300 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Load Field Notes Preset</span>
          </button>
          <button
            onClick={handleProcessLog}
            disabled={loading}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-md bg-white text-black hover:bg-zinc-200 transition text-xs font-medium cursor-pointer disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ClipboardList className="w-3.5 h-3.5" />}
            <span>{loading ? 'Processing Notes...' : 'Process Daily Log'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
          {error}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Field Notes */}
        <div className="lg:col-span-5 space-y-4">
          <div className="subtle-card p-4 space-y-3">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Field Supervisor Log</h3>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-white/[0.03] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/[0.3]"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Supervisor</label>
                <input
                  type="text"
                  value={supervisor}
                  onChange={(e) => setSupervisor(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-white/[0.03] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/[0.3]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Workforce Count</label>
                <input
                  type="number"
                  min="1"
                  value={headcount}
                  onChange={(e) => setHeadcount(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-white/[0.03] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/[0.3]"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Weather Observed</label>
                <input
                  type="text"
                  value={weatherObserved}
                  onChange={(e) => setWeatherObserved(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-white/[0.03] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/[0.3]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-zinc-400 block mb-1">Raw Field Notes / Daily Diary</label>
              <textarea
                rows="7"
                value={fieldNotes}
                onChange={(e) => setFieldNotes(e.target.value)}
                className="w-full px-3 py-2 rounded bg-white/[0.03] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/[0.3] leading-relaxed resize-none"
                placeholder="Enter field observations, deliveries, trade progress, and delays..."
              />
            </div>
          </div>
        </div>

        {/* Right: Processed Executive Briefing */}
        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <div className="space-y-4">
              {/* Executive Summary Card */}
              <div className="subtle-card p-5 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                  <span className="text-[11px] text-zinc-400 uppercase tracking-wider">Executive Daily Briefing</span>
                  <div className="flex items-center space-x-2 text-[11px] text-zinc-400">
                    <Users className="w-3.5 h-3.5" />
                    <span>{headcount} Personnel</span>
                    <span>•</span>
                    <span>{date}</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed pt-1">{result.executive_summary}</p>
              </div>

              {/* Progress Highlights */}
              <div className="subtle-card p-4 space-y-2">
                <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Progress Highlights</span>
                </h4>
                <ul className="space-y-1.5">
                  {result.progress_highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-zinc-300">
                      <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottlenecks and Delays */}
              <div className="subtle-card p-4 space-y-2.5">
                <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Delays & Logistics Bottlenecks</span>
                </h4>
                <div className="space-y-2">
                  {result.delays_and_bottlenecks.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded bg-white/[0.02] border border-white/[0.04] space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">{item.issue}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {item.delay_hours}h Delay
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400">{item.impact}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Infractions */}
              {result.safety_infractions && result.safety_infractions.length > 0 && (
                <div className="subtle-card p-4 space-y-2">
                  <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Safety Infractions Noted</span>
                  </h4>
                  <ul className="space-y-1">
                    {result.safety_infractions.map((inf, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-zinc-300">
                        <span className="text-rose-400 font-bold shrink-0 mt-0.5">•</span>
                        <span>{inf}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Next-Day Punch List */}
              <div className="subtle-card p-4 space-y-2">
                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Automated Next-Day Action Punch List</h4>
                <ol className="space-y-2">
                  {result.next_day_punch_list.map((task, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-xs text-zinc-300">
                      <span className="w-4 h-4 rounded-full bg-white/[0.06] text-zinc-400 text-[10px] font-mono flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            <div className="subtle-card p-12 flex flex-col items-center justify-center text-center space-y-3">
              <ClipboardList className="w-10 h-10 text-zinc-500" />
              <h4 className="text-sm font-medium text-zinc-300">No Daily Log Analyzed</h4>
              <p className="text-xs text-zinc-500 max-w-sm">
                Paste raw site supervisor field notes or click "Load Field Notes Preset" to generate structured progress briefings and next-day punch lists.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
