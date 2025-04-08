'use client';

import React, { useState, useEffect } from 'react';
import {
  PlusCircle, Settings, BrainCircuit,
  Play, AlertTriangle, TrendingUp, Filter,
  Share2, Download, Clock, Activity, Target,
  Globe, X, Eye, GitMerge, Network, Sparkles,
  Calculator, Users, Dices, PieChart, HeartPulse,
  Workflow, Boxes, FileInput, Cloud, BarChartBig,
  Loader2, HelpCircle, Info, Search, Check,
  Database, CalendarDays, BarChart, RefreshCw,
  ChevronUp, ChevronDown, Sliders, GitBranch,
  LineChart, CheckCircle2, Lightbulb
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import { scenarioTemplates, advancedModelingTechniques } from '@/data/mock/data';

// Types for parameters
interface ScenarioParameters {
  [key: string]: string | number;
}

// Types for data inputs
type DataInput = string;

// Update state types
interface ScenarioTemplate {
  id: string;
  name: string;
  description: string;
  variables: string[];
  defaultTimeHorizon: string;
}

interface ScenarioStep {
  id: string;
  name: string;
  description: string;
  duration: number;
  impact: {
    stability: number;
    economic: number;
    security: number;
  };
}

interface ScenarioData {
  name: string;
  description: string;
  timeHorizon: string;
  region: string;
  variables: Record<string, string | number | boolean>;
  steps: ScenarioStep[];
  parameters: ScenarioParameters;
  dataInputs: DataInput[];
  template?: string;  // Adding optional template field
  
  // Advanced scenario options
  aiAssisted?: boolean;          // Enable AI assistance
  confidenceInterval?: number;   // Confidence interval for projections
  monteCarlo?: boolean;          // Enable Monte Carlo simulations
  sensitivityAnalysis?: boolean; // Enable sensitivity analysis
  multiVariateAnalysis?: boolean; // Enable multi-variate analysis
  correlationAnalysis?: boolean; // Analyze correlations between variables
  customAlgorithms?: string[];   // Custom algorithms to apply
  modelingTechniques?: string[]; // Advanced modeling techniques
}

type ScenarioStatus = 'draft' | 'running' | 'completed';

type ScenarioRun = {
  id: string;
  name: string;
  description: string;
  status: ScenarioStatus;
  progress?: number;
  results?: {
    impact: 'high' | 'medium' | 'low';
    confidence: number;
    timeHorizon: string;
    affectedSectors: string[];
    keyOutcomes: string[];
    riskFactors: string[];
  };
  lastRun?: string;
  template: string;
  modelingTechniques?: string[];
  dataQualityScore?: number;
  confidenceThreshold?: number;
};

export default function ScenarioPage() {
  const router = useRouter();
  const [activeScenario, setActiveScenario] = useState<ScenarioRun | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(scenarioTemplates[0]);
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'compare'>('list');
  const [compareScenarios, setCompareScenarios] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [scenarioData, setScenarioData] = useState<ScenarioData>({
    name: '',
    description: '',
    timeHorizon: '6 Months',
    region: '',
    variables: {},
    steps: [],
    parameters: {},
    dataInputs: [],
    aiAssisted: true,
    confidenceInterval: 85,
    monteCarlo: false,
    sensitivityAnalysis: false,
    modelingTechniques: []
  });

  const [modelingTechniques, setModelingTechniques] = useState<string[]>([]);
  const [dataQualityScore, setDataQualityScore] = useState<number>(85);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(75);
  const [runningMultipleScenarios, setRunningMultipleScenarios] = useState<boolean>(false);
  const [scenarioComparison, setScenarioComparison] = useState<{
    enabled: boolean;
    method: 'side-by-side' | 'overlay' | 'differential';
  }>({ enabled: false, method: 'side-by-side' });

  const [showAIInsights, setShowAIInsights] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [scenarioCategories, setScenarioCategories] = useState<string[]>([]);
  const [scenarioSearch, setScenarioSearch] = useState('');
  const [scenarioTags, setScenarioTags] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('All Regions');
  const [showHelpOverlay, setShowHelpOverlay] = useState(false);

  const [availableDataSources, setAvailableDataSources] = useState([
    { id: 'econ-indicators', name: 'Economic Indicators', type: 'API', lastUpdated: 'Apr 5, 2025', selected: true, quality: 98 },
    { id: 'political-events', name: 'Political Events Calendar', type: 'Database', lastUpdated: 'Apr 2, 2025', selected: true, quality: 95 },
    { id: 'trade-data', name: 'Regional Trade Statistics', type: 'CSV', lastUpdated: 'Mar 30, 2025', selected: false, quality: 92 },
    { id: 'news-feed', name: 'News Analysis Feed', type: 'AI Processed', lastUpdated: 'Apr 6, 2025', selected: true, quality: 88 },
    { id: 'social-sentiment', name: 'Social Media Sentiment', type: 'API', lastUpdated: 'Apr 6, 2025', selected: false, quality: 82 },
    { id: 'satellite-imagery', name: 'Satellite Imagery Data', type: 'External', lastUpdated: 'Mar 25, 2025', selected: false, quality: 90 },
    { id: 'user-custom', name: 'User Custom Data', type: 'Upload', lastUpdated: 'Apr 3, 2025', selected: false, quality: 85 }
  ]);

  const [analysisParameters, setAnalysisParameters] = useState({
    iterations: 1000,
    confidenceLevel: 90,
    timeHorizonMonths: 6,
    includeSecondOrderEffects: true,
    sensitivityLevels: 3,
    correlationThreshold: 0.7,
    variableWeighting: 'balanced'
  });

  const [showDataSourceSelector, setShowDataSourceSelector] = useState(false);
  const [expandedAnalysisTools, setExpandedAnalysisTools] = useState<string[]>([]);
  const [selectedVisualization, setSelectedVisualization] = useState('impact-heatmap');
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const [scenarioRuns, setScenarioRuns] = useState<ScenarioRun[]>([
    {
      id: 'scen1',
      name: 'Regional Economic Impact',
      description: 'Model impact of currency devaluation in Nigeria on West African economies',
      status: 'completed',
      template: 'economic-shock',
      lastRun: '2025-03-30',
      results: {
        impact: 'high',
        confidence: 85,
        timeHorizon: '6 Months',
        affectedSectors: ['Banking', 'Trade', 'Manufacturing'],
        keyOutcomes: [
          '15-20% reduction in cross-border trade',
          'Increased pressure on regional currencies',
          'Potential policy responses from neighboring states'
        ],
        riskFactors: [
          'Currency market volatility',
          'Trade policy changes',
          'Political stability'
        ]
      }
    },
    {
      id: 'scen2',
      name: 'Political Transition Analysis',
      description: 'Evaluate implications of upcoming elections in Kenya',
      status: 'running',
      template: 'political-event',
      progress: 65,
    },
    {
      id: 'scen3',
      name: 'Infrastructure Development',
      description: 'Impact assessment of major port expansion project',
      status: 'draft',
      template: 'custom'
    }
  ]);

  const handleScenarioChange = (field: keyof ScenarioData, value: ScenarioData[keyof ScenarioData]) => {
    setScenarioData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTemplateSelect = (template: ScenarioTemplate) => {
    setSelectedTemplate(template);
    setScenarioData(prev => ({
      ...prev,
      template: template.id,
      timeHorizon: template.defaultTimeHorizon
    }));
  };

  const handleModelingTechniqueToggle = (techniqueId: string) => {
    setModelingTechniques(prev => 
      prev.includes(techniqueId) 
        ? prev.filter(id => id !== techniqueId) 
        : [...prev, techniqueId]
    );
    
    setScenarioData(prev => ({
      ...prev,
      modelingTechniques: modelingTechniques.includes(techniqueId)
        ? modelingTechniques.filter(id => id !== techniqueId)
        : [...modelingTechniques, techniqueId]
    }));
  };

  const nextStep = () => {
    setWizardStep(prev => prev + 1);
  };

  const prevStep = () => {
    setWizardStep(prev => Math.max(1, prev - 1));
  };

  const createScenario = () => {
    console.log('Creating scenario with data:', {
      ...scenarioData,
      modelingTechniques,
      dataQualityScore,
      confidenceThreshold
    });
    
    const newScenario = {
      id: `scen${Date.now()}`,
      name: scenarioData.name,
      description: scenarioData.description,
      status: 'running' as ScenarioStatus,
      template: selectedTemplate.id,
      progress: 0,
      modelingTechniques: modelingTechniques,
      dataQualityScore: dataQualityScore,
      confidenceThreshold: confidenceThreshold
    };
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 1500);
    
    setWizardStep(1);
    setScenarioData({
      name: '',
      description: '',
      timeHorizon: '6 Months',
      region: '',
      variables: {},
      steps: [],
      parameters: {},
      dataInputs: [],
      aiAssisted: true,
      confidenceInterval: 85,
      monteCarlo: false,
      sensitivityAnalysis: false,
      modelingTechniques: []
    });
  };

  const toggleDataSource = (id: string) => {
    setAvailableDataSources(
      availableDataSources.map(source => 
        source.id === id 
          ? { ...source, selected: !source.selected } 
          : source
      )
    );
  };

  const updateAnalysisParameter = (param: string, value: any) => {
    setAnalysisParameters(prev => ({
      ...prev,
      [param]: value
    }));
  };

  const toggleExpandedTool = (toolId: string) => {
    setExpandedAnalysisTools(prev => 
      prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  const handleCreateNewScenario = () => {
    router.push('/dashboard/scenario/new');
  };

  const renderHelpOverlay = () => {
    if (!showHelpOverlay) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
          <div className="p-4">Help content goes here</div>
        </div>
      </div>
    );
  };

  const renderDataSourceSelector = () => {
    if (!showDataSourceSelector) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
          <div className="p-4">Data source selector content goes here</div>
        </div>
      </div>
    );
  };

  const renderAdvancedFilters = () => {
    if (!showAdvancedFilters) return null;
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="p-4">Advanced filters content goes here</div>
      </div>
    );
  };

  const renderAIInsights = () => {
    if (!showAIInsights) return null;
    
    return (
      <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-4 mt-4">
        <div className="p-4">AI insights content goes here</div>
      </div>
    );
  };

  const renderAnalysisTools = () => {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
        <div className="p-4">Analysis tools content goes here</div>
      </div>
    );
  };

  const ScenarioComparisonView = ({ scenariosToCompare, allScenarios, onClose }: { 
    scenariosToCompare: string[], 
    allScenarios: ScenarioRun[],
    onClose: () => void
  }) => {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="p-4">Comparison content goes here</div>
      </div>
    );
  };

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setPageLoading(true);
    };
    
    const handleRouteChangeComplete = () => {
      setPageLoading(false);
    };
    
    return () => {
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Loading scenario data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      {pageLoading && (
        <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      )}
      
      {renderHelpOverlay()}
      {renderDataSourceSelector()}

      <DashboardHeader
        title="Scenario Planning"
        description="Model and analyze potential future scenarios"
        showInfoTip
        infoTipContent="Create and run sophisticated scenario models to evaluate potential outcomes and risks. Combine AI insights with your expertise for better decision-making."
        bgColor="white"
        sticky
      >
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCreateNewScenario}
            className="flex items-center bg-blue-600 text-white rounded-md py-2 px-3 text-sm hover:bg-blue-700"
          >
            <PlusCircle className="h-4 w-4 mr-1.5" />
            New Scenario
          </button>
          <button 
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center bg-white border border-gray-300 rounded-md py-2 px-3 text-sm hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-1.5" />
            Filter
          </button>
          <button 
            onClick={() => setShowHelpOverlay(true)}
            className="flex items-center bg-white border border-gray-300 rounded-md py-2 px-3 text-sm hover:bg-gray-50"
          >
            <HelpCircle className="h-4 w-4 mr-1.5" />
            Help
          </button>
        </div>
      </DashboardHeader>

      <div className="flex-1 p-6 max-w-7xl mx-auto w-full bg-gray-50">
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search scenarios..."
              value={scenarioSearch}
              onChange={(e) => setScenarioSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          
          <button
            onClick={() => setShowAIInsights(!showAIInsights)}
            className={`flex items-center text-sm font-medium ${
              showAIInsights ? 'text-blue-700' : 'text-gray-700'
            }`}
          >
            <BrainCircuit className={`h-4 w-4 mr-1.5 ${
              showAIInsights ? 'text-blue-600' : 'text-gray-500'
            }`} />
            AI Insights
          </button>
        </div>
        
        {renderAdvancedFilters()}
        {renderAIInsights()}
        
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
          <div className="flex">
            <button 
              onClick={() => setCurrentView('list')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md ${
                currentView === 'list' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Scenarios List
            </button>
            <button 
              onClick={() => {
                if (compareScenarios.length < 2) {
                  const completedScenario = scenarioRuns.find(s => s.status === 'completed');
                  if (completedScenario && !compareScenarios.includes(completedScenario.id)) {
                    setCompareScenarios([completedScenario.id]);
                  }
                }
                setCurrentView('compare');
              }}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md ${
                currentView === 'compare' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Compare Scenarios
            </button>
          </div>
        </div>

        {currentView === 'list' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {scenarioRuns.map((scenario) => (
                <div
                  key={scenario.id}
                  className={`w-full p-4 rounded-lg border bg-white hover:border-blue-300 transition-colors ${
                    activeScenario?.id === scenario.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">{scenario.name}</h3>
                      <p className="text-sm text-gray-600">{scenario.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      scenario.status === 'completed' ? 'bg-green-100 text-green-800' :
                      scenario.status === 'running' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {scenario.status.charAt(0).toUpperCase() + scenario.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      {scenario.status === 'running' ? (
                        <>
                          <Activity className="h-4 w-4 mr-1.5 text-blue-500" />
                          {scenario.progress}% Complete
                        </>
                      ) : scenario.lastRun ? (
                        <>
                          <Clock className="h-4 w-4 mr-1.5" />
                          Last run: {scenario.lastRun}
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-4 w-4 mr-1.5" />
                          Not yet run
                        </>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {scenario.status === 'completed' && scenario.results?.impact && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          scenario.results?.impact === 'high' ? 'bg-red-100 text-red-800' :
                          scenario.results?.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {scenario.results?.impact ? scenario.results.impact.charAt(0).toUpperCase() + scenario.results.impact.slice(1) : ''} Impact
                        </span>
                      )}
                      {scenario.status === 'completed' && scenario.results?.confidence && (
                        <span className="text-xs text-gray-500">
                          {scenario.results.confidence}% Confidence
                        </span>
                      )}
                    </div>
                  </div>

                  {scenario.status === 'running' && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${scenario.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                    <button 
                      onClick={() => setActiveScenario(scenario)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1.5" /> 
                      View Details
                    </button>
                    
                    {scenario.status === 'completed' && (
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center text-sm text-gray-600">
                          <input 
                            type="checkbox" 
                            className="mr-1.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={compareScenarios.includes(scenario.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setCompareScenarios(prev => [...prev, scenario.id]);
                              } else {
                                setCompareScenarios(prev => prev.filter(id => id !== scenario.id));
                              }
                            }}
                          />
                          Compare
                        </label>
                        
                        <button 
                          onClick={() => {
                            console.log('Running again:', scenario.id);
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                        >
                          <Play className="h-4 w-4 mr-1.5" />
                          Run Again
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {renderAnalysisTools()}
            </div>

            {activeScenario && activeScenario.status === 'completed' && activeScenario.results && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium">Scenario Results</h3>
                  <div className="flex space-x-2">
                    <button className="p-1.5 hover:bg-gray-100 rounded-md">
                      <Share2 className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-md">
                      <Download className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-md">
                      <Settings className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Time Horizon</h4>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 mr-1.5" />
                      <span>{activeScenario.results.timeHorizon}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Affected Sectors</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeScenario.results.affectedSectors.map((sector, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                        >
                          {sector}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Key Outcomes</h4>
                    <ul className="space-y-2">
                      {activeScenario.results.keyOutcomes.map((outcome, index) => (
                        <li 
                          key={index}
                          className="flex items-start text-sm"
                        >
                          <TrendingUp className="h-4 w-4 text-blue-500 mr-1.5 mt-0.5" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Risk Factors</h4>
                    <ul className="space-y-2">
                      {activeScenario.results.riskFactors.map((risk, index) => (
                        <li 
                          key={index}
                          className="flex items-start text-sm"
                        >
                          <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1.5 mt-0.5" />
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <button className="w-full flex items-center justify-center bg-blue-600 text-white rounded-md py-2 px-4 text-sm hover:bg-blue-700">
                      <Play className="h-4 w-4 mr-1.5" />
                      Run New Simulation
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-medium mb-3">Select Scenarios to Compare</h3>
              <div className="space-y-3">
                {scenarioRuns.filter(s => s.status === 'completed').map(scenario => (
                  <label key={scenario.id} className="flex items-start p-2 rounded-md hover:bg-gray-50">
                    <input 
                      type="checkbox"
                      className="mt-1 mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={compareScenarios.includes(scenario.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCompareScenarios(prev => [...prev, scenario.id]);
                        } else {
                          setCompareScenarios(prev => prev.filter(id => id !== scenario.id));
                        }
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{scenario.name}</p>
                      <p className="text-sm text-gray-500">{scenario.description}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      scenario.results?.impact === 'high' ? 'bg-red-100 text-red-800' :
                      scenario.results?.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {scenario.results?.impact ? scenario.results.impact.charAt(0).toUpperCase() + scenario.results.impact.slice(1) : ''} Impact
                    </span>
                  </label>
                ))}
                
                {scenarioRuns.filter(s => s.status === 'completed').length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <p>No completed scenarios available for comparison</p>
                    <p className="text-sm mt-1">Complete at least two scenarios to compare them</p>
                  </div>
                )}
              </div>
              
              {compareScenarios.length >= 2 && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <button 
                    className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center justify-center"
                    onClick={() => console.log('Comparing scenarios:', compareScenarios)}
                  >
                    <BrainCircuit className="h-4 w-4 mr-2" />
                    Generate Comparison Report
                  </button>
                </div>
              )}
            </div>
            
            {compareScenarios.length >= 2 && (
              <ScenarioComparisonView 
                scenariosToCompare={compareScenarios} 
                allScenarios={scenarioRuns} 
                onClose={() => setCurrentView('list')} 
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
