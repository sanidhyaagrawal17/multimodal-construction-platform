import React, { useState } from 'react';
import { CloudRain, Wind, Thermometer, Sun, ShieldAlert, Sparkles, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getWeatherAdvisory } from '../api/client';

export default function WeatherAdvisor({ presetData, onUpdateReport }) {
  const [tempC, setTempC] = useState(36.5);
  const [humidity, setHumidity] = useState(32);
  const [rainChance, setRainChance] = useState(10);
  const [windKmh, setWindKmh] = useState(28);
  const [uvIndex, setUvIndex] = useState(9);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const applyScenario = (t, h, r, w, uv) => {
    setTempC(t);
    setHumidity(h);
    setRainChance(r);
    setWindKmh(w);
    setUvIndex(uv);
    setError(null);
  };

  const handleRunAdvisory = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        temperature_c: Number(tempC),
        humidity_pct: Number(humidity),
        precipitation_chance_pct: Number(rainChance),
        wind_speed_kmh: Number(windKmh),
        uv_index: Number(uvIndex),
        scheduled_trades: [
          'Concrete Pouring & Curing',
          'Tower Crane & Aerial Hoists',
          'External Painting & Waterproofing',
          'Deep Excavation & Earthwork',
          'High-Elevation Roofing & Structural Steel'
        ],
      };
      const data = await getWeatherAdvisory(payload);
      setResult(data);
      if (onUpdateReport) {
        onUpdateReport('weather', data);
      }
    } catch (err) {
      setError(err.message || 'Weather advisory failed');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Unsafe': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Caution': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">Weather-Aware Construction Risk Advisory</h2>
          <p className="text-xs text-zinc-400">Meteorological trade safeguards for concreting, crane lifts, waterproofing, and excavation</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => applyScenario(36.5, 32, 10, 28, 9)}
            className="px-2.5 py-1.5 rounded-md bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-medium text-zinc-300 transition cursor-pointer"
          >
            Extreme Heat
          </button>
          <button
            onClick={() => applyScenario(18, 60, 20, 58, 3)}
            className="px-2.5 py-1.5 rounded-md bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-medium text-zinc-300 transition cursor-pointer"
          >
            Gale Wind Crane
          </button>
          <button
            onClick={() => applyScenario(20, 85, 75, 20, 2)}
            className="px-2.5 py-1.5 rounded-md bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-medium text-zinc-300 transition cursor-pointer"
          >
            Heavy Rain
          </button>
          <button
            onClick={handleRunAdvisory}
            disabled={loading}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-md bg-white text-black hover:bg-zinc-200 transition text-xs font-medium cursor-pointer disabled:opacity-50 ml-1"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CloudRain className="w-3.5 h-3.5" />}
            <span>{loading ? 'Evaluating Risk...' : 'Run Weather Risk Advisory'}</span>
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
        {/* Left: Meteorological Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="subtle-card p-4 space-y-4">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Meteorological Parameters</h3>

            {/* Temp */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400 flex items-center space-x-1">
                  <Thermometer className="w-3.5 h-3.5" />
                  <span>Ambient Temperature</span>
                </span>
                <span className="font-mono font-medium text-white">{tempC}°C ({Math.round(tempC * 9/5 + 32)}°F)</span>
              </div>
              <input
                type="range"
                min="-10"
                max="50"
                step="0.5"
                value={tempC}
                onChange={(e) => setTempC(parseFloat(e.target.value))}
                className="w-full accent-white"
              />
            </div>

            {/* Wind */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400 flex items-center space-x-1">
                  <Wind className="w-3.5 h-3.5" />
                  <span>Sustained Wind Speed</span>
                </span>
                <span className="font-mono font-medium text-white">{windKmh} km/h</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={windKmh}
                onChange={(e) => setWindKmh(parseInt(e.target.value))}
                className="w-full accent-white"
              />
            </div>

            {/* Rain */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400 flex items-center space-x-1">
                  <CloudRain className="w-3.5 h-3.5" />
                  <span>Precipitation Probability</span>
                </span>
                <span className="font-mono font-medium text-white">{rainChance}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={rainChance}
                onChange={(e) => setRainChance(parseInt(e.target.value))}
                className="w-full accent-white"
              />
            </div>

            {/* Humidity */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Relative Humidity</span>
                <span className="font-mono font-medium text-white">{humidity}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={humidity}
                onChange={(e) => setHumidity(parseInt(e.target.value))}
                className="w-full accent-white"
              />
            </div>

            {/* UV Index */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400 flex items-center space-x-1">
                  <Sun className="w-3.5 h-3.5" />
                  <span>Solar UV Index</span>
                </span>
                <span className="font-mono font-medium text-white">UV {uvIndex}</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={uvIndex}
                onChange={(e) => setUvIndex(parseFloat(e.target.value))}
                className="w-full accent-white"
              />
            </div>
          </div>
        </div>

        {/* Right: Trade Advisories & Safeguards */}
        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <div className="space-y-4">
              {/* Site Risk Status Banner */}
              <div className="subtle-card p-5 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                  <span className="text-[11px] text-zinc-400 uppercase tracking-wider">Overall Meteorological Condition</span>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded border ${getStatusBadge(result.risk_level)}`}>
                    {result.risk_level} Protocol Active
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white pt-1">{result.overall_site_condition}</h3>
              </div>

              {/* Worker Heat/Cold Safety Guidance */}
              <div className="subtle-card p-4 space-y-1.5">
                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Worker Environmental Health (NIOSH / OSHA Standard)</span>
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed">{result.worker_safety_advisory}</p>
              </div>

              {/* Trade Advisories Cards */}
              <div className="subtle-card p-4 space-y-3">
                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Trade-Specific Safeguards ({result.trade_advisories.length} Trades)</h4>
                <div className="space-y-3">
                  {result.trade_advisories.map((ta, idx) => (
                    <div key={idx} className="p-3 rounded bg-white/[0.02] border border-white/[0.04] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">{ta.trade}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getStatusBadge(ta.status)}`}>
                          {ta.status}
                        </span>
                      </div>

                      {/* Risks */}
                      <div className="text-[11px] text-zinc-400 space-y-0.5">
                        <span className="text-zinc-500 block uppercase text-[10px] font-semibold">Identified Physics Hazards:</span>
                        {ta.risk_factors.map((rf, rIdx) => (
                          <div key={rIdx} className="flex items-start space-x-1.5">
                            <span className="text-amber-400 shrink-0">•</span>
                            <span>{rf}</span>
                          </div>
                        ))}
                      </div>

                      {/* Measures */}
                      <div className="text-[11px] text-zinc-300 space-y-0.5 pt-1 border-t border-white/[0.04]">
                        <span className="text-emerald-400 block uppercase text-[10px] font-semibold">Mandatory Engineering Controls:</span>
                        {ta.mandatory_measures.map((mm, mIdx) => (
                          <div key={mIdx} className="flex items-start space-x-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{mm}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="subtle-card p-12 flex flex-col items-center justify-center text-center space-y-3">
              <CloudRain className="w-10 h-10 text-zinc-500" />
              <h4 className="text-sm font-medium text-zinc-300">No Weather Simulation Executed</h4>
              <p className="text-xs text-zinc-500 max-w-sm">
                Adjust environmental parameters or click one of the quick scenario buttons above (e.g. Extreme Heat or Gale Wind) to evaluate trade workability.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
