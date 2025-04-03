'use client';

import { useState, useEffect } from 'react';
import { 
  Filter, ChevronDown, TrendingUp, AlertCircle, AlertTriangle,
  Building, BarChart, Map, User, Upload, Database, Globe, FileSpreadsheet,
  Waves, Link, Settings as SettingsIcon, Save, Clock
} from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import StabilityMap from '@/components/StabilityMap';
import EconomicTrends from '@/components/EconomicTrends';
import ThreatIntelligenceHeatmap from '@/components/ThreatIntelligenceHeatmap';
import RegionalSentimentAnalysis from '@/components/RegionalSentimentAnalysis';
import DashboardSettings, { DashboardWidget } from '@/components/DashboardSettings';
import { 
  regions, countriesByRegion, allCountries, mockReports,
  dataConnectorTypes, mockAlerts
} from '@/data/mock/data';
import DraggableWrapper from '@/components/DraggableWrapper';

// Default dashboard widgets configuration
const defaultWidgets: DashboardWidget[] = [
  {
    id: 'stability-map',
    name: 'Stability Index Map',
    enabled: true,
    description: 'Shows stability ratings across regions with risk assessment'
  },
  {
    id: 'economic-trends',
    name: 'Economic Trends',
    enabled: true,
    description: 'Displays economic indicators and financial trends over time'
  },
  {
    id: 'threat-intelligence',
    name: 'Threat Intelligence Heatmap',
    enabled: true,
    description: 'Visual representation of threats by type and severity'
  },
  {
    id: 'sentiment-analysis',
    name: 'Regional Sentiment Analysis',
    enabled: true,
    description: 'Tracks public sentiment from various data sources'
  },
  {
    id: 'risk-forecast',
    name: 'Risk Forecast',
    enabled: true,
    description: 'Upcoming risk alerts and forecasted issues'
  },
  {
    id: 'key-entities',
    name: 'Key Entities',
    enabled: true,
    description: 'Important people and organizations in the region'
  },
  {
    id: 'reports-table',
    name: 'Latest Reports',
    enabled: true,
    description: 'Recent intelligence reports and findings'
  }
];

export default function DashboardPage() {
  // State for geographic scope filters
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedCountry, setSelectedCountry] = useState('');
  
  // Modal states
  const [showImportModal, setShowImportModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // Dashboard configuration
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [timeframe, setTimeframe] = useState('30');
  const [isLoading, setIsLoading] = useState(true);
  
  // Advanced filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<string[]>([]);
  
  // Topics for filtering (would typically come from an API)
  const availableTopics = ['Economic', 'Political', 'Security', 'Infrastructure', 'Social', 'Environmental'];
  const riskLevels = ['High', 'Medium', 'Low'];

  // Get available countries based on selected region
  const availableCountries = selectedRegion && selectedRegion !== 'All Regions' 
    ? countriesByRegion[selectedRegion as keyof typeof countriesByRegion] || [] 
    : allCountries;

  // Load saved dashboard configuration from localStorage on initial load
  useEffect(() => {
    setIsLoading(true);
    
    // Try to load saved configuration from localStorage
    try {
      const savedWidgets = localStorage.getItem('dashboardWidgets');
      const savedTimeframe = localStorage.getItem('dashboardTimeframe');
      
      if (savedWidgets) {
        setWidgets(JSON.parse(savedWidgets));
      } else {
        setWidgets(defaultWidgets);
      }
      
      if (savedTimeframe) {
        setTimeframe(savedTimeframe);
        setSelectedTimeframe(savedTimeframe);
      }
    } catch (error) {
      console.error('Error loading dashboard configuration:', error);
      setWidgets(defaultWidgets);
    }
    
    // Simulate loading of dashboard data
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);
  
  // Save dashboard configuration when it changes
  const saveWidgetConfiguration = (updatedWidgets: DashboardWidget[]) => {
    setWidgets(updatedWidgets);
    localStorage.setItem('dashboardWidgets', JSON.stringify(updatedWidgets));
  };
  
  // Save timeframe when it changes
  const saveTimeframe = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
    setSelectedTimeframe(newTimeframe);
    localStorage.setItem('dashboardTimeframe', newTimeframe);
  };
  
  // Toggle for advanced filters
  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };
  
  // Toggle a topic selection
  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic) 
        : [...prev, topic]
    );
  };
  
  // Toggle a risk level selection
  const toggleRiskLevel = (level: string) => {
    setSelectedRiskLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level) 
        : [...prev, level]
    );
  };
  
  // Apply filters
  const applyFilters = () => {
    saveTimeframe(selectedTimeframe);
    setShowAdvancedFilters(false);
  };
  
  // Reset filters
  const resetFilters = () => {
    setSelectedTimeframe('30');
    setSelectedTopics([]);
    setSelectedRiskLevels([]);
    saveTimeframe('30');
    setShowAdvancedFilters(false);
  };

  // Data Import Modal (keeping this the same as before)
  const DataImportModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[600px] max-h-[80vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Import Data</h3>
          <button 
            onClick={() => setShowImportModal(false)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <span className="sr-only">Close</span>
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
            <h4 className="font-medium text-blue-800 mb-2">Connect Your Data Sources</h4>
            <p className="text-sm text-blue-600">
              Import your own data to combine with our intelligence for richer insights.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {dataConnectorTypes.map((connector) => (
              <button
                key={connector.id}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                {connector.id === 'csv' && <FileSpreadsheet className="h-8 w-8 text-blue-600 mb-2" />}
                {connector.id === 'api' && <Link className="h-8 w-8 text-purple-600 mb-2" />}
                {connector.id === 'database' && <Database className="h-8 w-8 text-green-600 mb-2" />}
                {connector.id === 'streaming' && <Waves className="h-8 w-8 text-orange-600 mb-2" />}
                {connector.id === 'scraping' && <Globe className="h-8 w-8 text-indigo-600 mb-2" />}
                <h5 className="font-medium">{connector.name}</h5>
                <p className="text-xs text-gray-500 mt-1">{connector.description}</p>
                <span className="text-xs mt-2 px-2 py-0.5 rounded-full bg-gray-100">
                  {connector.setupComplexity} Setup
                </span>
              </button>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium mb-2">Recently Connected Sources</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <span>Market Data API</span>
                <span className="text-green-600">Active</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <span>Regional News Feed</span>
                <span className="text-green-600">Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button 
            onClick={() => setShowImportModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
            Start Import
          </button>
        </div>
      </div>
    </div>
  );

  // Advanced Filters Panel
  const AdvancedFiltersPanel = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-800">Advanced Filters</h3>
        <button
          onClick={toggleAdvancedFilters}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Timeframe Selection */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Clock className="h-4 w-4 mr-1.5 text-gray-500" />
            Data Timeframe
          </h4>
          <div className="w-full">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="180">Last 6 months</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>
        
        {/* Topics Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Topics</h4>
          <div className="flex flex-wrap gap-2">
            {availableTopics.map(topic => (
              <button
                key={topic}
                onClick={() => toggleTopic(topic)}
                className={`text-xs px-2 py-1 rounded-full ${
                  selectedTopics.includes(topic)
                    ? 'bg-blue-100 text-blue-700 border-blue-300'
                    : 'bg-gray-100 text-gray-700 border-gray-200'
                } border`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
        
        {/* Risk Level Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Risk Level</h4>
          <div className="space-y-1">
            {riskLevels.map(level => (
              <label key={level} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedRiskLevels.includes(level)}
                  onChange={() => toggleRiskLevel(level)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className={`ml-2 text-sm ${
                  level === 'High' ? 'text-red-700' :
                  level === 'Medium' ? 'text-yellow-700' :
                  'text-green-700'
                }`}>
                  {level} Risk
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-6 space-x-3">
        <button
          onClick={resetFilters}
          className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50"
        >
          Reset
        </button>
        <button
          onClick={applyFilters}
          className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center"
        >
          <Save className="h-4 w-4 mr-1.5" />
          Apply Filters
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <DashboardHeader
        title="Intelligence Dashboard"
        description={`Displaying insights for: ${selectedCountry || selectedRegion}`}
        showInfoTip
        infoTipContent="This dashboard combines real-time data analysis with historical trends to provide comprehensive intelligence insights."
      >
        {/* Geographic Scope Filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <div className="relative">
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setSelectedCountry('');
              }}
              className="bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            >
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              disabled={selectedRegion === 'All Regions'}
              className="bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">All Countries in Region</option>
              {availableCountries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>

          <button 
            onClick={() => setShowImportModal(true)}
            className="flex items-center bg-blue-600 text-white rounded-md py-2 px-3 text-sm hover:bg-blue-700"
          >
            <Upload className="h-4 w-4 mr-1.5" /> Import Data
          </button>

          <button 
            onClick={toggleAdvancedFilters}
            className="flex items-center bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-1.5 text-gray-500" /> 
            {showAdvancedFilters ? 'Hide Filters' : 'More Filters'}
          </button>
          
          <button 
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-gray-700 hover:bg-gray-50"
          >
            <SettingsIcon className="h-4 w-4 mr-1.5 text-gray-500" /> Dashboard Settings
          </button>
        </div>
      </DashboardHeader>
      
      {/* Advanced Filters Panel (conditionally rendered) */}
      {showAdvancedFilters && <AdvancedFiltersPanel />}

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      ) : (
        <>
          {/* First Row - 2/3 + 1/3 split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stability Map (conditional rendering based on widgets configuration) */}
              {widgets.find(w => w.id === 'stability-map')?.enabled && (
                <StabilityMap 
                  selectedRegion={selectedRegion} 
                  selectedCountry={selectedCountry} 
                />
              )}
              
              {/* Economic Trends (conditional rendering) */}
              {widgets.find(w => w.id === 'economic-trends')?.enabled && (
                <EconomicTrends 
                  selectedRegion={selectedRegion} 
                  selectedCountry={selectedCountry} 
                />
              )}
              
              {/* Threat Intelligence Heatmap (conditional rendering) */}
              {widgets.find(w => w.id === 'threat-intelligence')?.enabled && (
                <ThreatIntelligenceHeatmap 
                  selectedRegion={selectedRegion} 
                  selectedCountry={selectedCountry} 
                  timeframe={timeframe}
                />
              )}
              
              {/* Regional Sentiment Analysis (conditional rendering) */}
              {widgets.find(w => w.id === 'sentiment-analysis')?.enabled && (
                <RegionalSentimentAnalysis 
                  selectedRegion={selectedRegion} 
                  selectedCountry={selectedCountry} 
                  timeframe={timeframe}
                />
              )}
            </div>

            {/* Right Column - 1/3 width */}
            <div className="lg:col-span-1 space-y-6">
              {/* Risk Forecast (conditional rendering) */}
              {widgets.find(w => w.id === 'risk-forecast')?.enabled && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="font-bold text-lg text-gray-800 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-purple-600"/>Risk Forecast
                    </h2>
                    <a href="/dashboard/scenario" className="text-blue-600 text-sm font-medium hover:underline">
                      Scenario Planning
                    </a>
                  </div>
                  <div className="space-y-3 text-sm">
                    {mockAlerts.map((alert) => (
                      <div 
                        key={alert.id}
                        className={`flex items-center justify-between p-2 ${
                          alert.severity === 'high' ? 'bg-red-50' :
                          alert.severity === 'medium' ? 'bg-yellow-50' :
                          'bg-green-50'
                        } rounded`}
                      >
                        <span>{alert.title}</span>
                        <span className={`font-medium ${
                          alert.severity === 'high' ? 'text-red-700' :
                          alert.severity === 'medium' ? 'text-yellow-700' :
                          'text-green-700'
                        }`}>
                          {alert.timeframe}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Entities (conditional rendering) */}
              {widgets.find(w => w.id === 'key-entities')?.enabled && (
                <DraggableWrapper>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4 drag-handle cursor-move">
                      <h2 className="font-bold text-lg text-gray-800">Key Entities</h2>
                      <a href="/dashboard/network" className="text-blue-600 text-sm font-medium hover:underline">
                        Explore Network
                      </a>
                    </div>
                    <ul className="space-y-3">
                      {[
                        { name: "Ahmed Hassan", role: "Egyptian FinMin", type: "person", influence: 8.5, risk: "Low" },
                        { name: "African Dev Bank", role: "Financial Inst.", type: "org", influence: 9.2, risk: "Low" }
                      ].map((entity, index) => (
                        <li 
                          key={index} 
                          className="flex items-center p-2 -m-2 hover:bg-gray-50 rounded-md cursor-pointer"
                        >
                          <div className={`h-9 w-9 rounded-lg mr-2.5 flex items-center justify-center text-white font-semibold text-xs ${
                            entity.type === 'person' ? 'bg-blue-500' : 'bg-purple-500'
                          }`}>
                            {entity.type === 'person' ? (
                              <User className="h-4 w-4"/>
                            ) : (
                              <Building className="h-4 w-4"/>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-800">{entity.name}</p>
                            <p className="text-xs text-gray-600">{entity.role}</p>
                            <p className="text-xs text-gray-500">Influence: {entity.influence} | Risk: {entity.risk}</p>
                          </div>
                        </li>
                      ))}
                      <a href="/dashboard/network" className="text-xs text-blue-600 hover:underline mt-1 block">
                        View More...
                      </a>
                    </ul>
                  </div>
                </DraggableWrapper>
              )}
              
              {/* You can add more sidebar widgets here */}
              
            </div>
          </div>

          {/* Latest Reports Table (conditional rendering) */}
          {widgets.find(w => w.id === 'reports-table')?.enabled && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 overflow-x-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-gray-800">Latest Intelligence Reports</h2>
                <a href="/dashboard/reports" className="text-blue-600 text-sm font-medium hover:underline">
                  Browse All Reports
                </a>
              </div>
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase tracking-wider">
                    <th className="py-3 font-medium">Report Title</th>
                    <th className="py-3 font-medium">Region</th>
                    <th className="py-3 font-medium">Category</th>
                    <th className="py-3 font-medium">Date</th>
                    <th className="py-3 font-medium">Confidence</th>
                    <th className="py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockReports.map((report) => {
                    const confColorClasses: Record<string, string> = {
                      green: 'bg-green-100 text-green-800',
                      yellow: 'bg-yellow-100 text-yellow-800',
                      red: 'bg-red-100 text-red-800'
                    };
                    
                    return (
                      <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 pr-3 font-medium text-gray-800">
                          {report.title}
                        </td>
                        <td className="py-3 pr-3 text-gray-600">{report.region}</td>
                        <td className="py-3 pr-3 text-gray-600">{report.category}</td>
                        <td className="py-3 pr-3 text-gray-600">{report.date}</td>
                        <td className="py-3 pr-3">
                          <span className={`px-2 py-0.5 ${confColorClasses[report.confColor]} rounded-full text-xs font-medium`}>
                            {report.confidence}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <a href={`/dashboard/report/${report.id}`} className="text-blue-600 hover:underline font-medium">
                            View
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Data Import Modal */}
      {showImportModal && <DataImportModal />}
      
      {/* Dashboard Settings Modal */}
      {showSettingsModal && (
        <DashboardSettings
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          widgets={widgets}
          onSave={saveWidgetConfiguration}
          timeframe={timeframe}
          onTimeframeChange={saveTimeframe}
        />
      )}
    </div>
  );
}
