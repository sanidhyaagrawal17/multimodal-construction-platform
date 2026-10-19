import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Calendar, 
  Building2, 
  ClipboardList, 
  CloudRain, 
  MessageSquareCode 
} from 'lucide-react';

import Navbar from './components/Navbar';
import SafetyInspector from './components/SafetyInspector';
import CrackAnalyzer from './components/CrackAnalyzer';
import ProjectPlanner from './components/ProjectPlanner';
import RealEstateValuer from './components/RealEstateValuer';
import DailySiteAssistant from './components/DailySiteAssistant';
import WeatherAdvisor from './components/WeatherAdvisor';
import KnowledgeBot from './components/KnowledgeBot';
import ReportModal from './components/ReportModal';
import { fetchHealth, fetchPresets } from './api/client';

const TABS = [
  { id: 'safety', label: 'Site Safety', icon: ShieldCheck, desc: 'OSHA 1926 Inspection' },
  { id: 'crack', label: 'Crack Analysis', icon: Activity, desc: 'ACI 318 Diagnostics' },
  { id: 'planning', label: 'Project Planner', icon: Calendar, desc: 'CPM & WBS Scheduling' },
  { id: 'valuation', label: 'Real Estate Valuer', icon: Building2, desc: 'Cost & Yield Modeling' },
  { id: 'daily_log', label: 'Daily Assistant', icon: ClipboardList, desc: 'Field Logs & Punchlist' },
  { id: 'weather', label: 'Weather Advisor', icon: CloudRain, desc: 'Meteorological Risk' },
  { id: 'chat', label: 'Knowledge Bot', icon: MessageSquareCode, desc: 'Civil Engineering AI' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('safety');
  const [health, setHealth] = useState(null);
  const [presets, setPresets] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportData, setReportData] = useState({
    safety: null,
    crack: null,
    planning: null,
    valuation: null,
    daily_log: null,
    weather: null,
  });

  useEffect(() => {
    // Initial fetch for health & preset scenarios
    fetchHealth()
      .then(setHealth)
      .catch((err) => console.warn('Could not fetch health:', err));

    fetchPresets()
      .then(setPresets)
      .catch((err) => console.warn('Could not fetch presets:', err));
  }, []);

  const handleUpdateReport = (moduleName, data) => {
    setReportData((prev) => ({
      ...prev,
      [moduleName]: data,
    }));
  };

  const hasAnyReportData = Object.values(reportData).some((v) => v !== null);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col font-sans">
      {/* Top Header */}
      <Navbar
        health={health}
        onOpenReport={() => setIsReportOpen(true)}
        hasReportData={hasAnyReportData}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-2 border-b border-white/[0.08] no-scrollbar">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-md text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-black shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="pt-2">
          {activeTab === 'safety' && (
            <SafetyInspector
              presetData={presets}
              onUpdateReport={handleUpdateReport}
            />
          )}

          {activeTab === 'crack' && (
            <CrackAnalyzer
              presetData={presets}
              onUpdateReport={handleUpdateReport}
            />
          )}

          {activeTab === 'planning' && (
            <ProjectPlanner
              presetData={presets}
              onUpdateReport={handleUpdateReport}
            />
          )}

          {activeTab === 'valuation' && (
            <RealEstateValuer
              presetData={presets}
              onUpdateReport={handleUpdateReport}
            />
          )}

          {activeTab === 'daily_log' && (
            <DailySiteAssistant
              presetData={presets}
              onUpdateReport={handleUpdateReport}
            />
          )}

          {activeTab === 'weather' && (
            <WeatherAdvisor
              presetData={presets}
              onUpdateReport={handleUpdateReport}
            />
          )}

          {activeTab === 'chat' && (
            <KnowledgeBot />
          )}
        </div>
      </main>

      {/* Executive Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        reportData={reportData}
      />

      {/* Subtle Footer */}
      <footer className="border-t border-white/[0.06] py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-2">
          <span>Multimodal Construction Intelligence Decision Support System</span>
          <span>FastAPI • React • Google Gemini 1.5 • OSHA 1926 & ACI 318 Compliant</span>
        </div>
      </footer>
    </div>
  );
}
