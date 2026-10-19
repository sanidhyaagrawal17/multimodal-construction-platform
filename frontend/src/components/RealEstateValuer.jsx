import React, { useState } from 'react';
import { Building2, DollarSign, TrendingUp, Sparkles, RefreshCw, PieChart, Check } from 'lucide-react';
import { calculateValuation } from '../api/client';

const ALL_AMENITIES = [
  'Underground Parking',
  'Swimming Pool',
  '24/7 Power Backup',
  'Gymnasium',
  'LEED Certified',
  'Rooftop Lounge',
  'EV Charging Stations',
  'Private Concierge',
  'Smart Home Automation'
];

export default function RealEstateValuer({ presetData, onUpdateReport }) {
  const [propertyType, setPropertyType] = useState('Residential High-Rise');
  const [areaSqft, setAreaSqft] = useState(2400);
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(3);
  const [quality, setQuality] = useState('Premium');
  const [ageYears, setAgeYears] = useState(0);
  const [locationTier, setLocationTier] = useState('Prime Urban Core');
  const [landAreaSqft, setLandAreaSqft] = useState(3000);
  const [selectedAmenities, setSelectedAmenities] = useState([
    'Underground Parking',
    'Swimming Pool',
    '24/7 Power Backup',
    'Gymnasium',
    'LEED Certified'
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const toggleAmenity = (item) => {
    if (selectedAmenities.includes(item)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== item));
    } else {
      setSelectedAmenities([...selectedAmenities, item]);
    }
  };

  const handleLoadPreset = () => {
    if (presetData?.valuation) {
      const v = presetData.valuation;
      setPropertyType(v.property_type);
      setAreaSqft(v.built_up_area_sqft);
      setBedrooms(v.bedrooms);
      setBathrooms(v.bathrooms);
      setQuality(v.construction_quality);
      setAgeYears(v.age_years);
      setLocationTier(v.location_tier);
      setSelectedAmenities(v.amenities);
      setLandAreaSqft(v.land_area_sqft);
      setError(null);
    }
  };

  const handleRunValuation = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        property_type: propertyType,
        built_up_area_sqft: Number(areaSqft),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        construction_quality: quality,
        age_years: Number(ageYears),
        location_tier: locationTier,
        amenities: selectedAmenities,
        land_area_sqft: Number(landAreaSqft),
      };
      const data = await calculateValuation(payload);
      setResult(data);
      if (onUpdateReport) {
        onUpdateReport('valuation', data);
      }
    } catch (err) {
      setError(err.message || 'Valuation failed');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">Real Estate Valuation & Investment Appraisal Engine</h2>
          <p className="text-xs text-zinc-400">Hedonic pricing, replacement cost analysis, and Cap Rate yield modeling</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleLoadPreset}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-medium text-zinc-300 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Load Penthouse Preset</span>
          </button>
          <button
            onClick={handleRunValuation}
            disabled={loading}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-md bg-white text-black hover:bg-zinc-200 transition text-xs font-medium cursor-pointer disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <DollarSign className="w-3.5 h-3.5" />}
            <span>{loading ? 'Evaluating Asset...' : 'Calculate Valuation'}</span>
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
        {/* Left: Input Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="subtle-card p-4 space-y-3">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Property Specification</h3>

            <div>
              <label className="text-[11px] font-medium text-zinc-400 block mb-1">Typology</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-white/[0.03] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/[0.3]"
              >
                <option value="Residential High-Rise" className="bg-zinc-900">Residential High-Rise</option>
                <option value="Residential Single-Family" className="bg-zinc-900">Residential Single-Family</option>
                <option value="Commercial Office" className="bg-zinc-900">Commercial Office</option>
                <option value="Retail Storefront" className="bg-zinc-900">Retail Storefront</option>
                <option value="Industrial Warehouse" className="bg-zinc-900">Industrial Warehouse</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Built-Up Area (sqft)</label>
                <input
                  type="number"
                  step="50"
                  value={areaSqft}
                  onChange={(e) => setAreaSqft(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-white/[0.03] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/[0.3]"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Land Area (sqft)</label>
                <input
                  type="number"
                  step="50"
                  value={landAreaSqft}
                  onChange={(e) => setLandAreaSqft(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-white/[0.03] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/[0.3]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Finish Quality</label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-white/[0.03] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/[0.3]"
                >
                  <option value="Standard" className="bg-zinc-900">Standard Grade</option>
                  <option value="Premium" className="bg-zinc-900">Premium Grade</option>
                  <option value="Ultra-Luxury" className="bg-zinc-900">Ultra-Luxury Grade</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Asset Age (Years)</label>
                <input
                  type="number"
                  min="0"
                  value={ageYears}
                  onChange={(e) => setAgeYears(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-white/[0.03] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/[0.3]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-zinc-400 block mb-1">Location Tier</label>
              <select
                value={locationTier}
                onChange={(e) => setLocationTier(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-white/[0.03] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/[0.3]"
              >
                <option value="Prime Urban Core" className="bg-zinc-900">Prime Urban Core (Metropolitan Center)</option>
                <option value="Suburban Growth Corridor" className="bg-zinc-900">Suburban Growth Corridor</option>
                <option value="Outer Metropolitan" className="bg-zinc-900">Outer Metropolitan</option>
                <option value="Industrial Zone" className="bg-zinc-900">Industrial / Logistics Zone</option>
              </select>
            </div>

            {/* Amenities Pills Selection */}
            <div>
              <label className="text-[11px] font-medium text-zinc-400 block mb-1.5">Incorporated Amenities</label>
              <div className="flex flex-wrap gap-1.5">
                {ALL_AMENITIES.map((amenity) => {
                  const isSelected = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`text-[11px] px-2 py-1 rounded transition flex items-center space-x-1 border cursor-pointer ${
                        isSelected
                          ? 'bg-white text-black font-medium border-white'
                          : 'bg-white/[0.02] text-zinc-400 border-white/[0.06] hover:border-white/[0.15]'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      <span>{amenity}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Valuation Report */}
        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <div className="space-y-4">
              {/* Valuation Banner */}
              <div className="subtle-card p-5 space-y-3">
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider block">Estimated Fair Market Valuation</span>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-white/[0.08]">
                  <div>
                    <h3 className="text-2xl font-bold font-mono text-white tracking-tight">
                      {formatCurrency(result.estimated_market_value.median_value)}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Range: {formatCurrency(result.estimated_market_value.min_value)} — {formatCurrency(result.estimated_market_value.max_value)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-mono font-semibold text-emerald-400">
                      ${result.price_per_sqft.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-zinc-400 block">per sqft built-up</span>
                  </div>
                </div>

                {/* Investment Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-[10px] text-zinc-400 block">Monthly Rent</span>
                    <span className="text-sm font-mono font-semibold text-white mt-0.5">
                      {formatCurrency(result.investment_metrics.projected_monthly_rental)}
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-[10px] text-zinc-400 block">Gross Yield</span>
                    <span className="text-sm font-mono font-semibold text-emerald-400 mt-0.5">
                      {result.investment_metrics.gross_rental_yield_pct.toFixed(2)}%
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-[10px] text-zinc-400 block">Cap Rate (NOI)</span>
                    <span className="text-sm font-mono font-semibold text-emerald-400 mt-0.5">
                      {result.investment_metrics.estimated_cap_rate_pct.toFixed(2)}%
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-[10px] text-zinc-400 block">5-Yr Growth</span>
                    <span className="text-sm font-mono font-semibold text-white mt-0.5">
                      +{result.investment_metrics.forecasted_5yr_appreciation_pct.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Replacement Cost Breakdown */}
              <div className="subtle-card p-4 space-y-3">
                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Replacement Cost & Capitalization Breakdown</span>
                  <PieChart className="w-3.5 h-3.5 text-zinc-400" />
                </h4>
                
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs text-zinc-300 mb-1">
                      <span>Direct Construction Replacement Cost</span>
                      <span className="font-mono">{formatCurrency(result.cost_breakdown.construction_cost)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-400 rounded-full"
                        style={{
                          width: `${(result.cost_breakdown.construction_cost / result.estimated_market_value.median_value) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-zinc-300 mb-1">
                      <span>Land Share Equity Value</span>
                      <span className="font-mono">{formatCurrency(result.cost_breakdown.land_share_value)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full"
                        style={{
                          width: `${(result.cost_breakdown.land_share_value / result.estimated_market_value.median_value) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-zinc-300 mb-1">
                      <span>Developer Margin & Professional Overhead</span>
                      <span className="font-mono">{formatCurrency(result.cost_breakdown.developer_margin_overhead)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{
                          width: `${(result.cost_breakdown.developer_margin_overhead / result.estimated_market_value.median_value) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparative Market Insights */}
              <div className="subtle-card p-4 space-y-2">
                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Comparative Market Drivers</h4>
                <ul className="space-y-1.5">
                  {result.comparative_market_insights.map((insight, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-zinc-300">
                      <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="subtle-card p-12 flex flex-col items-center justify-center text-center space-y-3">
              <Building2 className="w-10 h-10 text-zinc-500" />
              <h4 className="text-sm font-medium text-zinc-300">No Valuation Computed</h4>
              <p className="text-xs text-zinc-500 max-w-sm">
                Enter your property dimensions and finish grade or click "Load Penthouse Preset" to calculate DCF value, Cap Rate, and construction cost breakdown.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
