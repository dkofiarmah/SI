import React, { useState } from 'react';
import {
  Share2, Download, Clock, ArrowLeft,
  TrendingUp, AlertTriangle, BarChart, Target,
  Check, Zap, Expand, Maximize2, CalendarDays,
  Layers, GitFork, Map, Building, User, Flag, Info,
  Dice1, Network, GitMerge, BrainCircuit, Users
} from 'lucide-react';
import type { ScenarioRun } from '@/types';

type ScenarioDetailViewProps = {
  scenario: ScenarioRun;
  onBack: () => void;
  onRunAgain: (id: string) => void;
  onDownload: (id: string) => void;
  onShare: (id: string) => void;
};

export default function ScenarioDetailView({
  scenario,
  onBack,
  onRunAgain,
  onDownload,
  onShare
}: ScenarioDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'factors' | 'data' | 'assumptions'>('overview');
  const [showFullScreen, setShowFullScreen] = useState(false);

  if (!scenario.results) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-3 p-1.5 hover:bg-gray-100 rounded-md"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h3 className="font-medium text-lg">{scenario.name}</h3>
              <p className="text-sm text-gray-500">{scenario.description}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="p-1.5 hover:bg-gray-100 rounded-md">
              <Share2 className="h-4 w-4 text-gray-600" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded-md">
              <Maximize2 className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-12 text-center">
          <Clock className="h-12 w-12 text-gray-300 mb-4" />
          <h4 className="text-lg font-medium text-gray-700 mb-2">
            This scenario hasn't been run yet
          </h4>
          <p className="text-gray-500 mb-6 max-w-md">
            Run this scenario to see detailed results, insights, and recommended actions based on the outcome.
          </p>
          <button 
            onClick={() => onRunAgain(scenario.id)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center text-sm hover:bg-blue-700"
          >
            <Zap className="h-4 w-4 mr-1.5" />
            Run This Scenario
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${showFullScreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-3 p-1.5 hover:bg-gray-100 rounded-md"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h3 className="font-medium text-lg">{scenario.name}</h3>
              <p className="text-sm text-gray-500">{scenario.description}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => onShare(scenario.id)}
              className="p-1.5 hover:bg-gray-100 rounded-md"
            >
              <Share2 className="h-4 w-4 text-gray-600" />
            </button>
            <button 
              onClick={() => onDownload(scenario.id)}
              className="p-1.5 hover:bg-gray-100 rounded-md"
            >
              <Download className="h-4 w-4 text-gray-600" />
            </button>
            <button 
              onClick={() => setShowFullScreen(!showFullScreen)}
              className="p-1.5 hover:bg-gray-100 rounded-md"
            >
              <Maximize2 className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex border-b border-gray-200 mt-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('factors')}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              activeTab === 'factors'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Impact Factors
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              activeTab === 'data'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Data Sources
          </button>
          <button
            onClick={() => setActiveTab('assumptions')}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              activeTab === 'assumptions'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Assumptions
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Impact Level</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    scenario.results.impact === 'high' ? 'bg-red-100 text-red-800' :
                    scenario.results.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {scenario.results.impact.charAt(0).toUpperCase() + scenario.results.impact.slice(1)}
                  </span>
                </div>
                <div className="mt-1 flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        scenario.results.impact === 'high' ? 'bg-red-500' :
                        scenario.results.impact === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ 
                        width: scenario.results.impact === 'high' ? '85%' : 
                               scenario.results.impact === 'medium' ? '50%' : '25%' 
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Confidence Level</h4>
                <div className="flex items-end justify-between">
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-blue-600 mr-1" />
                    <span className="text-lg font-bold">{scenario.results.confidence}%</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    Based on 1 modeling technique
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Time Horizon</h4>
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 text-gray-500 mr-1.5" />
                  <span>{scenario.results.timeHorizon}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {scenario.lastRun ? `Last updated: ${scenario.lastRun}` : 'First run'}
                </p>
              </div>
            </div>
            
            {/* Key Outcomes Section */}
            <div>
              <h4 className="text-base font-medium text-gray-800 mb-3">Key Outcomes</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex mb-3">
                    <BarChart className="h-5 w-5 text-blue-600 mr-2" />
                    <h5 className="font-medium">Primary Effects</h5>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {scenario.results.keyOutcomes.slice(0, 3).map((outcome, index) => (
                      <li 
                        key={index}
                        className="flex items-start pl-2 border-l-2 border-blue-400"
                      >
                        <span className="text-gray-700">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex mb-3">
                    <GitFork className="h-5 w-5 text-purple-600 mr-2" />
                    <h5 className="font-medium">Secondary Effects</h5>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {[
                      'Increased regulatory scrutiny in financial sector',
                      'Shift in consumer spending patterns',
                      'Potential market consolidation in affected sectors'
                    ].map((outcome, index) => (
                      <li 
                        key={index}
                        className="flex items-start pl-2 border-l-2 border-purple-400"
                      >
                        <span className="text-gray-700">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Affected Sectors & Risk Factors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <h4 className="text-base font-medium text-gray-800 mb-3">Affected Sectors</h4>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {scenario.results.affectedSectors.map((sector, index) => (
                      <div 
                        key={index}
                        className="flex items-center bg-gray-50 rounded-md p-2"
                      >
                        <Building className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm">{sector}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-base font-medium text-gray-800 mb-3">Risk Factors</h4>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <ul className="space-y-2 text-sm">
                    {scenario.results.riskFactors.map((risk, index) => (
                      <li 
                        key={index}
                        className="flex items-start"
                      >
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1.5 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Strategic Recommendations */}
            <div>
              <h4 className="text-base font-medium text-gray-800 mb-3">Strategic Recommendations</h4>
              <div className="bg-blue-50 rounded-lg border border-blue-100 p-4">
                <ul className="space-y-3 text-sm">
                  {[
                    'Diversify supply chain to reduce dependency on affected regions',
                    'Implement currency hedging strategy to mitigate exchange rate risks',
                    'Develop contingency plans for potential trade disruptions',
                    'Monitor key economic indicators in Nigeria for early warning signs'
                  ].map((recommendation, index) => (
                    <li 
                      key={index}
                      className="flex items-start"
                    >
                      <Target className="h-4 w-4 text-blue-600 mr-1.5 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="flex justify-end border-t border-gray-200 pt-4 mt-4">
              <button
                onClick={() => onRunAgain(scenario.id)}
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center"
              >
                <Zap className="h-4 w-4 mr-1.5" />
                Run Updated Simulation
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'factors' && (
          <div className="space-y-6">
            {/* Impact factors content */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="text-base font-medium mb-4">Impact Factor Analysis</h4>
              <div className="h-64 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg mb-4">
                <div className="text-center">
                  <BarChart className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">Impact factor chart visualization</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                This analysis shows how different factors contribute to the overall scenario impact. The key drivers in this scenario are currency volatility and trade policy changes.
              </p>
            </div>
            
            {/* Sensitivity Analysis */}
            <div>
              <h4 className="text-base font-medium text-gray-800 mb-3">Sensitivity Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h5 className="text-sm font-medium mb-3">Most Sensitive Variables</h5>
                  <ul className="space-y-3">
                    {[
                      { name: 'Currency Devaluation Rate', sensitivity: 'High' },
                      { name: 'Duration of Economic Shock', sensitivity: 'Medium' },
                      { name: 'Trade Flow Disruption', sensitivity: 'Medium' }
                    ].map((variable, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <span className="text-sm">{variable.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          variable.sensitivity === 'High' ? 'bg-red-100 text-red-700' :
                          variable.sensitivity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {variable.sensitivity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h5 className="text-sm font-medium mb-3">Robust Against</h5>
                  <ul className="space-y-3">
                    {[
                      { name: 'Regional Political Changes', robustness: 'High' },
                      { name: 'Global Commodity Prices', robustness: 'Medium' },
                      { name: 'Consumer Sentiment Shifts', robustness: 'High' }
                    ].map((variable, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <span className="text-sm">{variable.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          variable.robustness === 'High' ? 'bg-green-100 text-green-700' :
                          variable.robustness === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {variable.robustness}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'data' && (
          <div className="space-y-6">
            {/* Data Sources content */}
            <div>
              <h4 className="text-base font-medium text-gray-800 mb-3">Data Sources</h4>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality Score</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { name: 'Economic Indicators Dataset', type: 'CSV Import', updated: 'Apr 1, 2025', quality: 95 },
                      { name: 'Central Bank Reports', type: 'API Feed', updated: 'Mar 30, 2025', quality: 98 },
                      { name: 'Trade Flow Database', type: 'Database', updated: 'Apr 2, 2025', quality: 92 },
                      { name: 'Regional News Analysis', type: 'AI Processed', updated: 'Apr 2, 2025', quality: 87 }
                    ].map((source, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">{source.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{source.type}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{source.updated}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            source.quality >= 90 ? 'bg-green-100 text-green-800' :
                            source.quality >= 80 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {source.quality}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 flex justify-end">
                <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                  <Layers className="h-3.5 w-3.5 mr-1" />
                  Manage Data Sources
                </button>
              </div>
            </div>
            
            {/* Data Quality Assessment */}
            <div>
              <h4 className="text-base font-medium text-gray-800 mb-3">Data Quality Assessment</h4>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="text-sm font-medium mb-2">Completeness</h5>
                    <div className="flex items-center">
                      <div className="flex-1 mr-2">
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-green-500 rounded-full" style={{ width: '94%' }}></div>
                        </div>
                      </div>
                      <span className="text-sm font-medium">94%</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="text-sm font-medium mb-2">Timeliness</h5>
                    <div className="flex items-center">
                      <div className="flex-1 mr-2">
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-green-500 rounded-full" style={{ width: '97%' }}></div>
                        </div>
                      </div>
                      <span className="text-sm font-medium">97%</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="text-sm font-medium mb-2">Accuracy</h5>
                    <div className="flex items-center">
                      <div className="flex-1 mr-2">
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'assumptions' && (
          <div className="space-y-6">
            {/* Model Assumptions content */}
            <div>
              <h4 className="text-base font-medium text-gray-800 mb-3">Core Assumptions</h4>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <ul className="space-y-3">
                  {[
                    'Currency devaluation will remain within the 20-35% range over the scenario period',
                    'No significant changes to regional trade agreements during the timeframe',
                    'Political stability in neighboring countries remains consistent',
                    'Global commodity prices follow projected trends without major disruptions'
                  ].map((assumption, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-800 font-medium flex items-center justify-center text-xs flex-shrink-0 mr-2 mt-0.5">
                        {index + 1}
                      </span>
                      <span>{assumption}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Modeling Approach */}
            <div>
              <h4 className="text-base font-medium text-gray-800 mb-3">Modeling Approach</h4>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(['monte-carlo']).map((technique, index) => {
                    const techniqueInfo = {
                      'monte-carlo': {
                        name: 'Monte Carlo Simulation',
                        description: 'Used 5,000 simulation runs to determine probability distributions of outcomes.',
                        icon: Dice1
                      },
                      'bayesian': {
                        name: 'Bayesian Network Analysis',
                        description: 'Probabilistic modeling of causal relationships between key economic variables.',
                        icon: Network
                      },
                      'system-dynamics': {
                        name: 'System Dynamics Modeling',
                        description: 'Analysis of feedback loops and time-dependent behavior in economic systems.',
                        icon: GitMerge
                      },
                      'agent-based': {
                        name: 'Agent-Based Modeling',
                        description: 'Simulation of individual actor behaviors to identify emergent patterns.',
                        icon: Users
                      },
                      'ml-forecasting': {
                        name: 'Machine Learning Forecasting',
                        description: 'Predictive analytics using historical data patterns and current indicators.',
                        icon: BrainCircuit
                      }
                    }[technique] || {
                      name: 'Standard Scenario Analysis',
                      description: 'Projected outcomes based on defined variables and historical patterns.',
                      icon: TrendingUp
                    };
                    
                    const IconComponent = techniqueInfo.icon;
                    
                    return (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center mb-2">
                          <IconComponent className="h-4 w-4 text-blue-600 mr-2" />
                          <h5 className="text-sm font-medium">{techniqueInfo.name}</h5>
                        </div>
                        <p className="text-xs text-gray-600">{techniqueInfo.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Confidence & Uncertainty */}
            <div>
              <h4 className="text-base font-medium text-gray-800 mb-3">Confidence & Uncertainty</h4>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-start space-x-2 mb-4">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <p className="text-sm text-gray-600">
                    This scenario has a confidence level of {scenario.results.confidence}%, meaning there's a {scenario.results.confidence}% probability that the actual outcomes will fall within the projected ranges.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium mb-2">High Confidence Areas</h5>
                    <ul className="space-y-1">
                      {[
                        'Short-term currency market reactions',
                        'Banking sector stress indicators',
                        'Trade volume changes with primary partners'
                      ].map((area, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <Check className="h-3.5 w-3.5 text-green-600 mr-1.5" />
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium mb-2">Areas of Uncertainty</h5>
                    <ul className="space-y-1">
                      {[
                        'Long-term inflation trajectory',
                        'Policy responses from neighboring states',
                        'Impact on informal sector economy'
                      ].map((area, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <AlertTriangle className="h-3.5 w-3.5 text-yellow-600 mr-1.5" />
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
