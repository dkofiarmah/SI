'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shuffle, Globe, Download, Info, Target, BrainCircuit,
  User, Building, ZoomIn, ZoomOut, UserPlus, Upload,
  Activity, Search, Share2, Filter
} from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import { networkEntities, networkConnections } from '@/data/mock/data';
import { mockEntityData } from '@/data/mock/data';

// Define the specific types needed
interface EntityNode {
  id: string;
  type: 'person' | 'organization' | 'location';
  name: string;
  riskScore: number;
}

interface ConnectionEdge {
  source: string;
  target: string;
  strength: 'Strong' | 'Medium' | 'Weak';
}

export default function NetworkPage() {
  const router = useRouter();
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  
  // Add missing state variables
  const [entityTypeFilters, setEntityTypeFilters] = useState({
    person: true,
    organization: true,
    location: true
  });
  
  // Helper function to safely update entity type filters
  const toggleEntityTypeFilter = (type: 'person' | 'organization' | 'location') => {
    setEntityTypeFilters(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const [timeRange, setTimeRange] = useState('3 months');
  const [selectedEntity, setSelectedEntity] = useState(mockEntityData);

  // Network analysis features
  const [analysisType, setAnalysisType] = useState<'influence' | 'risk' | 'connection'>('influence');

  // Replace the modal opening function with navigation
  const handleImportClick = () => {
    router.push('/dashboard/data-import');
  };

  // Analysis Panel Component
  const AnalysisPanel = () => (
    <div className="absolute right-4 top-20 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Network Analysis</h3>
        <button 
          onClick={() => setShowAnalysisPanel(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Analysis Type
          </label>
          <select 
            value={analysisType}
            onChange={(e) => setAnalysisType(e.target.value as 'influence' | 'risk' | 'connection')}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="influence">Influence Analysis</option>
            <option value="risk">Risk Assessment</option>
            <option value="connection">Connection Patterns</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Analysis Parameters
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 rounded border-gray-300" />
              <span className="text-sm">Include indirect connections</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 rounded border-gray-300" />
              <span className="text-sm">Show historical patterns</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 rounded border-gray-300" />
              <span className="text-sm">Highlight key influencers</span>
            </label>
          </div>
        </div>

        <button className="w-full py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
          Run Analysis
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <DashboardHeader
        title="Network Analysis"
        description="Explore and analyze entity relationships"
        showInfoTip
        infoTipContent="Visualize and analyze connections between people, organizations, and locations. Import your own data to enhance the network."
        bgColor="white"
        sticky
      >
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleImportClick}
            className="flex items-center bg-blue-600 text-white rounded-md py-2 px-3 text-sm hover:bg-blue-700"
          >
            <Upload className="h-4 w-4 mr-1.5" />
            Import Data
          </button>
          <button 
            onClick={() => setShowAnalysisPanel(true)}
            className="flex items-center bg-white border border-gray-300 rounded-md py-2 px-3 text-sm hover:bg-gray-50"
          >
            <Activity className="h-4 w-4 mr-1.5" />
            Analyze
          </button>
        </div>
      </DashboardHeader>

      <div className="flex-1 flex">
        {/* Filters Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search entities..." 
                className="w-full bg-gray-100 rounded-md pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            </div>
          </div>

          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Entity Types
            </h3>
            <div className="space-y-2">
              {Object.entries(entityTypeFilters).map(([type, checked]) => (
                <label key={type} className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleEntityTypeFilter(type as 'person' | 'organization' | 'location')}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm flex items-center">
                    {type === 'person' && <User className="h-3 w-3 mr-1 text-blue-600" />}
                    {type === 'organization' && <Building className="h-3 w-3 mr-1 text-purple-600" />}
                    {type === 'location' && <Globe className="h-3 w-3 mr-1 text-green-600" />}
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Time Range
            </h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm border border-gray-200"
            >
              <option value="1 month">Last Month</option>
              <option value="3 months">Last 3 Months</option>
              <option value="6 months">Last 6 Months</option>
              <option value="1 year">Last Year</option>
              <option value="3 years">Last 3 Years</option>
            </select>
          </div>

          <div className="p-4 mt-auto border-t border-gray-200">
            <button className="w-full bg-blue-600 text-white rounded-md p-2 mb-2 text-sm hover:bg-blue-700 transition duration-150">
              Apply Filters
            </button>
            <button className="w-full text-blue-600 border border-blue-600 rounded-md p-2 text-sm hover:bg-blue-50 transition duration-150">
              Reset
            </button>
          </div>
        </aside>

        {/* Main Network View */}
        <main className="flex-1 flex flex-col">
          <div className="bg-white border-b border-gray-200 p-2 flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-md text-gray-600">
                <ZoomIn className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-md text-gray-600">
                <ZoomOut className="h-5 w-5" />
              </button>
              <span className="text-sm text-gray-500 px-2">100%</span>
              <div className="h-4 border-r border-gray-300 mx-2"></div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium mr-1 text-gray-700">
                  {networkEntities.length}
                </span> 
                entities
                <span className="mx-1">•</span>
                <span className="font-medium mr-1 text-gray-700">
                  {networkConnections.length}
                </span> 
                connections
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button className="p-2 hover:bg-gray-100 rounded-md flex items-center text-gray-600">
                <Download className="h-4 w-4 mr-1" />Export
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-md flex items-center text-gray-600">
                <Share2 className="h-4 w-4 mr-1" />Share
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-md text-gray-600">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden">
            {/* Network Visualization Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center p-10">
              <svg width="100%" height="100%" viewBox="0 0 400 300" className="opacity-50">
                {/* Central Node */}
                <circle cx="200" cy="150" r="20" fill="#4A90E2" />
                <text x="200" y="155" textAnchor="middle" fill="white" fontSize="10">AH</text>
                
                {/* Connection 1 */}
                <line x1="200" y1="150" x2="100" y2="100" stroke="#4A4A4A" strokeWidth="2" />
                <circle cx="100" cy="100" r="15" fill="#9B59B6" />
                <text x="100" y="105" textAnchor="middle" fill="white" fontSize="8">NO</text>
                
                {/* Connection 2 */}
                <line x1="200" y1="150" x2="300" y2="100" stroke="#4A4A4A" strokeWidth="3" strokeDasharray="4 2"/>
                <circle cx="300" cy="100" r="18" fill="#F5A623" />
                <text x="300" y="105" textAnchor="middle" fill="white" fontSize="9">ADB</text>
                
                {/* Connection 3 */}
                <line x1="200" y1="150" x2="150" y2="220" stroke="#9B9B9B" strokeWidth="1" />
                <circle cx="150" cy="220" r="12" fill="#50E3C2" />
                <text x="150" y="225" textAnchor="middle" fill="white" fontSize="7">UAE</text>
                
                {/* Connection 4 */}
                <line x1="200" y1="150" x2="250" y2="220" stroke="#4A4A4A" strokeWidth="2" />
                <circle cx="250" cy="220" r="15" fill="#4A90E2" />
                <text x="250" y="225" textAnchor="middle" fill="white" fontSize="8">X</text>
                
                <text x="200" y="280" textAnchor="middle" fill="#9B9B9B" fontSize="12">
                  Interactive network visualization placeholder
                </text>
                <text x="200" y="295" textAnchor="middle" fill="#9B9B9B" fontSize="10">
                  Showing connections for {selectedEntity?.name || 'selected entity'} over past {timeRange}
                </text>
              </svg>
            </div>

            {/* User Guide Overlay */}
            {showGuide && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-blue-200 max-w-lg text-sm">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <Info className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-medium text-blue-900">Network Analysis Guide</h3>
                  </div>
                  <button 
                    onClick={() => setShowGuide(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <Target className="h-4 w-4 mr-2 text-blue-500" />
                    Click on entities to explore their connections
                  </li>
                  <li className="flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-blue-500" />
                    Use analysis tools to identify patterns and risks
                  </li>
                  <li className="flex items-center">
                    <Upload className="h-4 w-4 mr-2 text-blue-500" />
                    Import your own data to enhance the network
                  </li>
                  <li className="flex items-center">
                    <BrainCircuit className="h-4 w-4 mr-2 text-blue-500" />
                    AI-powered insights highlight key relationships
                  </li>
                </ul>
              </div>
            )}

            {/* Analysis Panel */}
            {showAnalysisPanel && <AnalysisPanel />}

            {/* Network Legend */}
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md border border-gray-200">
              <h3 className="font-medium text-sm mb-2">Legend</h3>
              <div className="space-y-1 text-xs">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-blue-500 mr-2 border border-blue-600"></div>
                  <span>Individual</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-purple-500 mr-2 border border-purple-600"></div>
                  <span>Organization</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2 border border-green-600"></div>
                  <span>Location</span>
                </div>
                <div className="h-px bg-gray-200 my-1"></div>
                <div className="flex items-center">
                  <div className="h-1 w-6 bg-gray-400 mr-2 rounded"></div>
                  <span>Weak Connection</span>
                </div>
                <div className="flex items-center">
                  <div className="h-1 w-6 bg-gray-600 mr-2 rounded"></div>
                  <span>Medium Connection</span>
                </div>
                <div className="flex items-center">
                  <div className="h-1 w-6 bg-gray-800 mr-2 rounded"></div>
                  <span>Strong Connection</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Entity Details Sidebar */}
        {selectedEntity && (
          <aside className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-bold text-lg">{selectedEntity.name}</h2>
                  <p className="text-sm text-gray-600">{selectedEntity.role}</p>
                </div>
                <div className="flex flex-col items-end flex-shrink-0 ml-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedEntity.riskScore === "Low"
                      ? "bg-green-100 text-green-800"
                      : selectedEntity.riskScore === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {selectedEntity.riskScore} Risk
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    {selectedEntity.connections} connections
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-700">{selectedEntity.bio}</p>
              <div className="flex mt-3 space-x-2">
                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm flex items-center hover:bg-blue-200 transition duration-150">
                  <UserPlus className="h-3 w-3 mr-1" />Add to Watchlist
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm flex items-center hover:bg-gray-200 transition duration-150">
                  View Full Profile
                </button>
              </div>
            </div>

            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium mb-2 text-sm">Recent Activities</h3>
              <ul className="space-y-3">
                {selectedEntity.recentActivities.map((activity, index) => (
                  <li key={index} className="text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">
                        {activity.type}
                      </span>
                      <span className="text-xs text-gray-500">{activity.date}</span>
                    </div>
                    <p className="text-gray-600 mt-0.5">{activity.description}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium mb-2 text-sm">Key Connections</h3>
              <ul className="space-y-3">
                {selectedEntity.keyConnections.map((connection, index) => (
                  <li 
                    key={index}
                    className="p-2 bg-gray-50 rounded-md border border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm text-gray-800">
                          {connection.name}
                        </p>
                        <p className="text-xs text-gray-600">{connection.role}</p>
                      </div>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                        connection.strength === "Strong"
                          ? "text-blue-700 bg-blue-100"
                          : connection.strength === "Medium"
                          ? "text-purple-700 bg-purple-100"
                          : "text-gray-600 bg-gray-100"
                      }`}>
                        {connection.strength}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4">
              <h3 className="font-medium mb-2 text-sm flex items-center">
                <BrainCircuit className="h-4 w-4 mr-1.5 text-indigo-500"/>
                AI-Powered Insights
              </h3>
              <div className="space-y-3 text-sm">
                <div className="p-2 bg-indigo-50 border border-indigo-100 rounded">
                  <p className="font-medium text-indigo-800">Predicted Action:</p>
                  <p className="text-indigo-700">
                    High likelihood (70%) of announcing new trade deal within 3 months
                    based on recent travel and communication patterns.
                  </p>
                </div>
                <div className="p-2 bg-orange-50 border border-orange-100 rounded">
                  <p className="font-medium text-orange-800">Vulnerability Assessment:</p>
                  <p className="text-orange-700">
                    Moderate exposure to fluctuations in global energy prices due to
                    reliance on [Sector Y].
                  </p>
                </div>
                <div className="p-2 bg-gray-50 border border-gray-100 rounded">
                  <p className="font-medium text-gray-800">Influence Network:</p>
                  <p className="text-gray-700">
                    Identified 5 second-degree connections with significant political
                    influence in [Region Z].
                  </p>
                  <button className="text-xs text-blue-600 hover:underline mt-1">
                    Explore Influence
                  </button>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
