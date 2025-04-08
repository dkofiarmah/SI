'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check, ArrowLeft, ChevronRight, ChevronDown, ChevronUp,
  Info, AlertTriangle, Save, Play, Database, CalendarDays,
  BarChart, RefreshCw, Sliders, GitBranch, LineChart, Network,
  Target, Grid, BrainCircuit, PlusCircle, X, Lightbulb, 
  CheckCircle2, Clock, Filter
} from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import { ProgressTracker } from '@/components/ProgressTracker';
import { scenarioTemplates } from '@/data/mock/data';

// Import types from the main scenario page
import type { ScenarioData, ScenarioTemplate } from '@/types/scenario';

export default function NewScenarioPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(scenarioTemplates[0]);
  const [expandedAnalysisTools, setExpandedAnalysisTools] = useState<string[]>([]);
  const [selectedVisualization, setSelectedVisualization] = useState('impact-heatmap');
  
  // State for user-friendly form
  const [scenarioData, setScenarioData] = useState<ScenarioData>({
    name: '',
    description: '',
    timeHorizon: '6 Months',
    region: '',
    variables: {},
    steps: [],
    parameters: {},
    dataInputs: [],
    dataSources: [], // Add the missing dataSources property
    aiAssisted: true,
    confidenceInterval: 85,
    monteCarlo: false,
    sensitivityAnalysis: false,
    modelingTechniques: []
  });
  
  const [modelingTechniques, setModelingTechniques] = useState<string[]>([]);
  
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
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  
  // Helper functions
  const handleTemplateSelect = (template: ScenarioTemplate) => {
    setSelectedTemplate(template);
    setScenarioData(prev => ({
      ...prev,
      template: template.id,
      timeHorizon: template.defaultTimeHorizon
    }));
    setUnsavedChanges(true);
  };
  
  const handleScenarioChange = (field: keyof ScenarioData, value: any) => {
    setScenarioData((prev) => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field if it exists
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[field];
        return newErrors;
      });
    }
    
    setUnsavedChanges(true);
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
    
    setUnsavedChanges(true);
  };
  
  const toggleDataSource = (id: string) => {
    setAvailableDataSources(
      availableDataSources.map(source => 
        source.id === id 
          ? { ...source, selected: !source.selected } 
          : source
      )
    );
    setUnsavedChanges(true);
  };
  
  const updateAnalysisParameter = (param: string, value: any) => {
    setAnalysisParameters(prev => ({
      ...prev,
      [param]: value
    }));
    setUnsavedChanges(true);
  };
  
  const toggleExpandedTool = (toolId: string) => {
    setExpandedAnalysisTools(prev => 
      prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };
  
  // Navigation functions
  const goToNextStep = () => {
    // Validate the current step before proceeding
    if (validateCurrentStep()) {
      const nextStep = currentStep + 1;
      if (nextStep <= 6) {
        setCurrentStep(nextStep);
        window.scrollTo(0, 0);
      }
    }
  };
  
  const goToPreviousStep = () => {
    const prevStep = currentStep - 1;
    if (prevStep >= 1) {
      setCurrentStep(prevStep);
      window.scrollTo(0, 0);
    }
  };
  
  const handleStepChange = (step: number) => {
    // Only allow jumping to a step if all previous steps are valid
    let canJump = true;
    for (let i = 1; i < step; i++) {
      if (!validateStep(i)) {
        canJump = false;
        break;
      }
    }
    
    if (canJump) {
      setCurrentStep(step);
      window.scrollTo(0, 0);
    }
  };
  
  // Validation functions
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Template selection
        return !!selectedTemplate;
      case 2: // Basic information
        return !!scenarioData.name && !!scenarioData.description;
      case 3: // Parameters
        // This is a simplified validation, expand as needed
        return true;
      case 4: // Data Sources
        return availableDataSources.some(source => source.selected);
      case 5: // Advanced settings
        return true;
      default:
        return true;
    }
  };
  
  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (currentStep) {
      case 1: // Template selection
        if (!selectedTemplate) {
          newErrors.template = 'Please select a template';
        }
        break;
      case 2: // Basic information
        if (!scenarioData.name.trim()) {
          newErrors.name = 'Scenario name is required';
        }
        if (!scenarioData.description.trim()) {
          newErrors.description = 'Scenario description is required';
        }
        break;
      case 3: // Parameters
        // Add validation for parameters as needed
        break;
      case 4: // Data Sources
        if (!availableDataSources.some(source => source.selected)) {
          newErrors.dataSources = 'Please select at least one data source';
        }
        break;
      case 5: // Advanced settings
        // Add validation for advanced settings as needed
        break;
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Create and save scenario
  const createScenario = () => {
    // Final validation before creation
    if (!validateCurrentStep()) {
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Creating scenario with data:', {
        ...scenarioData,
        modelingTechniques,
        dataSources: availableDataSources.filter(src => src.selected),
        analysisParameters
      });
      
      setLoading(false);
      setUnsavedChanges(false);
      
      // Show success message and redirect
      router.push('/dashboard/scenario');
    }, 1500);
  };
  
  // Handle saving draft
  const saveDraft = () => {
    console.log('Saving draft:', scenarioData);
    setUnsavedChanges(false);
    // Show success toast or notification
  };
  
  // Handle unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [unsavedChanges]);
  
  // Step content rendering
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Choose Template
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Choose a Scenario Template</h2>
            <p className="text-gray-600 mb-6">Select a starting point for your scenario analysis. You can customize all aspects in the following steps.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {scenarioTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-4 rounded-lg border text-left transition-colors ${
                    selectedTemplate.id === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                  }`}
                >
                  <h3 className="font-medium mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {template.variables.map((variable, index) => (
                      <span 
                        key={index}
                        className="px-2 py-0.5 bg-white rounded-full text-xs border border-gray-200"
                      >
                        {variable}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Default Timeframe: {template.defaultTimeHorizon}
                  </p>
                </button>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-md flex items-start">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
              <div className="text-sm text-blue-700">
                <p className="font-medium text-blue-800 mb-1">Tips for choosing a template:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Choose <strong>Economic Shock</strong> for currency, commodity, or market events</li>
                  <li>Choose <strong>Political Event</strong> for elections, policy changes, or regime transitions</li>
                  <li>Choose <strong>Security Crisis</strong> for conflict scenarios or stability assessments</li>
                  <li>Choose <strong>Custom</strong> for complete flexibility in your scenario design</li>
                </ul>
              </div>
            </div>
            
            {formErrors.template && (
              <p className="mt-2 text-red-600 text-sm">{formErrors.template}</p>
            )}
          </div>
        );
        
      case 2: // Basic Information
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <p className="text-gray-600 mb-6">Provide essential details about your scenario.</p>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="scenario-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Scenario Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="scenario-name"
                  type="text"
                  value={scenarioData.name}
                  onChange={(e) => handleScenarioChange('name', e.target.value)}
                  placeholder="E.g., Currency Devaluation Impact Analysis"
                  className={`w-full p-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                />
                {formErrors.name && (
                  <p className="mt-1 text-red-600 text-sm">{formErrors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="scenario-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="scenario-description"
                  value={scenarioData.description}
                  onChange={(e) => handleScenarioChange('description', e.target.value)}
                  placeholder="Describe the scenario and its purpose"
                  rows={3}
                  className={`w-full p-2 border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                />
                {formErrors.description && (
                  <p className="mt-1 text-red-600 text-sm">{formErrors.description}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="time-horizon" className="block text-sm font-medium text-gray-700 mb-1">
                    Time Horizon
                  </label>
                  <select
                    id="time-horizon"
                    value={scenarioData.timeHorizon}
                    onChange={(e) => handleScenarioChange('timeHorizon', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="3 Months">3 Months</option>
                    <option value="6 Months">6 Months</option>
                    <option value="1 Year">1 Year</option>
                    <option value="2 Years">2 Years</option>
                    <option value="5 Years">5 Years</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                    Region Focus
                  </label>
                  <select
                    id="region"
                    value={scenarioData.region}
                    onChange={(e) => handleScenarioChange('region', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Global</option>
                    <option value="North Africa">North Africa</option>
                    <option value="East Africa">East Africa</option>
                    <option value="West Africa">West Africa</option>
                    <option value="Central Africa">Central Africa</option>
                    <option value="Southern Africa">Southern Africa</option>
                    <option value="Middle East">Middle East</option>
                  </select>
                </div>
              </div>
              
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-md">
                <div className="flex items-start">
                  <Lightbulb className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-amber-900 mb-1">AI Suggestions</h5>
                    <p className="text-sm text-amber-800">
                      Based on your selected template ({selectedTemplate.name}), consider focusing on key economic indicators and regional trade patterns as key variables in your analysis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 3: // Parameters
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Scenario Parameters</h2>
            <p className="text-gray-600 mb-6">Define the key variables and parameters for your scenario.</p>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Key Variables</h3>
              
              {selectedTemplate.variables.map((variable, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {variable}
                    </label>
                    <div className="flex space-x-2">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                        Required
                      </span>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Base Value
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        placeholder="Base value"
                        onChange={(e) => {
                          const variables = {...scenarioData.variables};
                          variables[variable] = {
                            ...variables[variable as keyof typeof variables],
                            baseValue: e.target.value
                          };
                          handleScenarioChange('variables', variables);
                        }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Min Value
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        placeholder="Minimum"
                        onChange={(e) => {
                          const variables = {...scenarioData.variables};
                          variables[variable] = {
                            ...variables[variable as keyof typeof variables],
                            minValue: e.target.value
                          };
                          handleScenarioChange('variables', variables);
                        }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Max Value
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        placeholder="Maximum"
                        onChange={(e) => {
                          const variables = {...scenarioData.variables};
                          variables[variable] = {
                            ...variables[variable as keyof typeof variables],
                            maxValue: e.target.value
                          };
                          handleScenarioChange('variables', variables);
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <label className="block text-xs text-gray-500 mb-1">
                      Notes
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Additional information about this variable"
                      onChange={(e) => {
                        const variables = {...scenarioData.variables};
                        variables[variable] = {
                          ...variables[variable as keyof typeof variables],
                          notes: e.target.value
                        };
                        handleScenarioChange('variables', variables);
                      }}
                    />
                  </div>
                </div>
              ))}
              
              <button
                className="mt-2 flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                <PlusCircle className="h-4 w-4 mr-1.5" />
                Add Custom Variable
              </button>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium text-blue-800 mb-1">Tips for setting parameters:</p>
                  <ul className="space-y-1">
                    <li>Set base values based on current conditions</li>
                    <li>Define min/max values to establish realistic ranges</li>
                    <li>More variables allow for more nuanced analysis, but increase complexity</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 4: // Data Sources
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Data Sources</h2>
            <p className="text-gray-600 mb-6">Select data sources to use in your scenario analysis.</p>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Available Data Sources</h3>
                <div className="flex items-center text-sm">
                  <span className="mr-2 text-gray-500">Sort by:</span>
                  <select className="border border-gray-300 rounded-md py-1 px-2 text-sm">
                    <option>Recently Updated</option>
                    <option>Quality Score</option>
                    <option>Name</option>
                    <option>Type</option>
                  </select>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <span className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300 text-blue-600 mr-2"
                            checked={availableDataSources.every(source => source.selected)}
                            onChange={() => {
                              const allSelected = availableDataSources.every(source => source.selected);
                              setAvailableDataSources(
                                availableDataSources.map(source => ({ ...source, selected: !allSelected }))
                              );
                            }}
                          />
                          Source
                        </span>
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {availableDataSources.map(source => (
                      <tr key={source.id} className={source.selected ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              className="rounded border-gray-300 text-blue-600 mr-2 focus:ring-blue-500"
                              checked={source.selected}
                              onChange={() => toggleDataSource(source.id)}
                            />
                            <span className="text-sm font-medium text-gray-900">{source.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{source.type}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{source.lastUpdated}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  source.quality >= 90 ? 'bg-green-500' : 
                                  source.quality >= 80 ? 'bg-yellow-500' : 
                                  'bg-red-500'
                                }`}
                                style={{ width: `${source.quality}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium">{source.quality}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end mt-3">
                <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center font-medium">
                  <PlusCircle className="h-4 w-4 mr-1.5" />
                  Add Custom Data Source
                </button>
              </div>
            </div>
            
            {formErrors.dataSources && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {formErrors.dataSources}
              </div>
            )}
            
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 flex items-start mb-6">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Data Quality Notice</p>
                <p>The quality of your scenario results depends on the quality and recency of your data sources. We recommend using sources with a quality score of 85% or higher.</p>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Selected Data Summary</h5>
              <div className="grid grid-cols-2 gap-3 text-sm text-blue-800">
                <div className="flex items-center">
                  <Database className="h-4 w-4 text-blue-600 mr-1.5" />
                  <span>{availableDataSources.filter(s => s.selected).length} of {availableDataSources.length} sources selected</span>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 text-blue-600 mr-1.5" />
                  <span>Most recent data: {new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <BarChart className="h-4 w-4 text-blue-600 mr-1.5" />
                  <span>Avg. quality score: {Math.round(availableDataSources.filter(s => s.selected).reduce((sum, source) => sum + source.quality, 0) / availableDataSources.filter(s => s.selected).length)}%</span>
                </div>
                <div className="flex items-center">
                  <RefreshCw className="h-4 w-4 text-blue-600 mr-1.5" />
                  <span>Auto-refresh data on run</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 5: // Advanced Simulation Options
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Advanced Options</h2>
            <p className="text-gray-600 mb-6">Configure advanced analysis settings for more detailed results.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-medium mb-3">Simulation Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Iterations
                      <span className="ml-1 text-xs text-gray-500">(Higher = more accurate, slower)</span>
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="range"
                        min="100"
                        max="10000"
                        step="100"
                        value={analysisParameters.iterations}
                        onChange={(e) => updateAnalysisParameter('iterations', parseInt(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-sm font-medium w-20 text-right">{analysisParameters.iterations.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confidence Level
                    </label>
                    <div className="flex space-x-2">
                      {[80, 85, 90, 95, 99].map(level => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => updateAnalysisParameter('confidenceLevel', level)}
                          className={`px-3 py-1 text-sm rounded-md ${
                            analysisParameters.confidenceLevel === level
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {level}%
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time Horizon
                    </label>
                    <div className="flex space-x-2">
                      {[3, 6, 12, 24, 36].map(months => (
                        <button
                          key={months}
                          type="button"
                          onClick={() => updateAnalysisParameter('timeHorizonMonths', months)}
                          className={`px-3 py-1 text-sm rounded-md whitespace-nowrap ${
                            analysisParameters.timeHorizonMonths === months
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {months < 12 ? `${months}m` : `${months/12}y`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Analysis Techniques</h3>
                <div className="bg-white border border-gray-200 rounded-lg divide-y">
                  {[
                    { id: 'monte-carlo', name: 'Monte Carlo Simulation', description: 'Run multiple random simulations to determine probability distributions' },
                    { id: 'sensitivity', name: 'Sensitivity Analysis', description: 'Test how changes in variables affect outcomes' },
                    { id: 'correlation', name: 'Correlation Analysis', description: 'Identify relationships between different variables' },
                    { id: 'second-order', name: 'Second-Order Effects', description: 'Calculate secondary impacts from primary outcomes' }
                  ].map(technique => (
                    <div key={technique.id} className="p-3">
                      <div className="flex items-start">
                        <div className="flex-1">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={modelingTechniques.includes(technique.id)}
                              onChange={() => handleModelingTechniqueToggle(technique.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                            />
                            <span className="font-medium text-sm">{technique.name}</span>
                          </label>
                          <p className="text-xs text-gray-500 ml-6 mt-0.5">{technique.description}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleExpandedTool(technique.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {expandedAnalysisTools.includes(technique.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      
                      {expandedAnalysisTools.includes(technique.id) && (
                        <div className="mt-2 ml-6 text-xs">
                          {technique.id === 'monte-carlo' && (
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-gray-600 mb-1">Distribution Type</label>
                                <select className="w-full border border-gray-300 rounded-md py-1 px-2">
                                  <option>Normal</option>
                                  <option>Uniform</option>
                                  <option>Log-normal</option>
                                  <option>Custom</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-gray-600 mb-1">Result Format</label>
                                <select className="w-full border border-gray-300 rounded-md py-1 px-2">
                                  <option>Full Distribution</option>
                                  <option>Percentiles</option>
                                  <option>Summary Only</option>
                                </select>
                              </div>
                            </div>
                          )}
                          
                          {technique.id === 'sensitivity' && (
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-gray-600 mb-1">Sensitivity Levels</label>
                                <select 
                                  className="w-full border border-gray-300 rounded-md py-1 px-2"
                                  value={analysisParameters.sensitivityLevels}
                                  onChange={(e) => updateAnalysisParameter('sensitivityLevels', parseInt(e.target.value))}
                                >
                                  <option value="3">3 Levels (±10%)</option>
                                  <option value="5">5 Levels (±20%)</option>
                                  <option value="7">7 Levels (±30%)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-gray-600 mb-1">Analysis Method</label>
                                <select className="w-full border border-gray-300 rounded-md py-1 px-2">
                                  <option>One-at-a-time</option>
                                  <option>Global</option>
                                  <option>Morris Method</option>
                                </select>
                              </div>
                            </div>
                          )}
                          
                          {technique.id === 'correlation' && (
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-gray-600 mb-1">Correlation Method</label>
                                <select className="w-full border border-gray-300 rounded-md py-1 px-2">
                                  <option>Pearson</option>
                                  <option>Spearman</option>
                                  <option>Kendall</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-gray-600 mb-1">Highlight Threshold</label>
                                <select 
                                  className="w-full border border-gray-300 rounded-md py-1 px-2"
                                  value={analysisParameters.correlationThreshold}
                                  onChange={(e) => updateAnalysisParameter('correlationThreshold', parseFloat(e.target.value))}
                                >
                                  <option value="0.5">Strong (≥0.5)</option>
                                  <option value="0.7">Very Strong (≥0.7)</option>
                                  <option value="0.9">Extremely Strong (≥0.9)</option>
                                </select>
                              </div>
                            </div>
                          )}
                          
                          {technique.id === 'second-order' && (
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-gray-600 mb-1">Effect Depth</label>
                                <select className="w-full border border-gray-300 rounded-md py-1 px-2">
                                  <option>Secondary (2nd order)</option>
                                  <option>Tertiary (3rd order)</option>
                                  <option>Deep (≥4th order)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-gray-600 mb-1">Effect Threshold</label>
                                <select className="w-full border border-gray-300 rounded-md py-1 px-2">
                                  <option>Only Strong Effects</option>
                                  <option>Moderate & Strong</option>
                                  <option>All Effects</option>
                                </select>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-4 border-t border-gray-200 pt-4">
              <h3 className="font-medium mb-3">Visualization & Output</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {[
                  { id: 'impact-heatmap', name: 'Impact Heatmap', icon: Grid },
                  { id: 'time-series', name: 'Time Series', icon: LineChart },
                  { id: 'decision-tree', name: 'Decision Tree', icon: GitBranch },
                  { id: 'risk-matrix', name: 'Risk Matrix', icon: Target },
                  { id: 'network-graph', name: 'Network Graph', icon: Network }
                ].map(viz => {
                  const IconComponent = viz.icon;
                  return (
                    <button
                      key={viz.id}
                      type="button"
                      onClick={() => setSelectedVisualization(viz.id)}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        selectedVisualization === viz.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent className="h-6 w-6 mx-auto mb-1" />
                      <span className="text-xs font-medium">{viz.name}</span>
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-800">
                  <span className="font-medium">Analysis Configuration Summary:</span> {modelingTechniques.includes('monte-carlo') ? 'Monte Carlo simulation' : 'Standard simulation'} with {analysisParameters.iterations.toLocaleString()} iterations over a {analysisParameters.timeHorizonMonths}-month horizon at {analysisParameters.confidenceLevel}% confidence.
                </p>
              </div>
            </div>
          </div>
        );
        
      case 6: // Review & Create
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Review & Create</h2>
            <p className="text-gray-600 mb-6">Verify your scenario configuration before proceeding.</p>
            
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-medium">Scenario Summary</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Template</p>
                    <p className="text-base">{selectedTemplate.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-base">{scenarioData.name || '(Not specified)'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Description</p>
                    <p className="text-base">{scenarioData.description || '(Not specified)'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Time Horizon</p>
                    <p className="text-base">{scenarioData.timeHorizon}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Region</p>
                    <p className="text-base">{scenarioData.region || 'Global'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Data Sources</p>
                    <p className="text-base">{availableDataSources.filter(s => s.selected).length} selected</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex items-start">
                  <Database className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-blue-900 mb-1">Data Quality</h5>
                    <p className="text-sm text-blue-800">
                      {availableDataSources.some(s => s.selected) 
                        ? `${Math.round(availableDataSources.filter(s => s.selected).reduce((sum, source) => sum + source.quality, 0) / availableDataSources.filter(s => s.selected).length)}% average quality score` 
                        : 'No data sources selected'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                <div className="flex items-start">
                  <BrainCircuit className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-purple-900 mb-1">Analysis Techniques</h5>
                    <p className="text-sm text-purple-800">
                      {modelingTechniques.length > 0 
                        ? `${modelingTechniques.length} advanced techniques selected` 
                        : 'Standard analysis only'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-green-900 mb-1">Estimated Time</h5>
                    <p className="text-sm text-green-800">
                      {modelingTechniques.length > 3 
                        ? '5-8 minutes to process' 
                        : modelingTechniques.length > 0 
                        ? '2-4 minutes to process' 
                        : 'Less than 1 minute'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <Lightbulb className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                <div>
                  <h5 className="font-medium text-amber-900 mb-1">AI Recommendations</h5>
                  <ul className="space-y-2 text-sm text-amber-800">
                    <li className="flex items-center">
                      <Check className="h-3.5 w-3.5 text-amber-600 mr-1.5" />
                      Adding "Trade Policy" as a variable would improve this model
                    </li>
                    {!modelingTechniques.includes('monte-carlo') && (
                      <li className="flex items-center">
                        <Check className="h-3.5 w-3.5 text-amber-600 mr-1.5" />
                        Consider enabling Monte Carlo simulation for better risk assessment
                      </li>
                    )}
                    {availableDataSources.filter(s => s.selected).length > 0 && (
                      <li className="flex items-center">
                        <Check className="h-3.5 w-3.5 text-amber-600 mr-1.5" />
                        Your data sources are {Math.round(availableDataSources.filter(s => s.selected).reduce((sum, source) => sum + source.quality, 0) / availableDataSources.filter(s => s.selected).length) >= 90 ? 'high' : 'moderate'} quality and recent
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 p-4 rounded-lg">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="auto-save"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  defaultChecked
                />
                <label htmlFor="auto-save" className="text-sm text-gray-700">
                  Save scenario configuration for future use
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notification"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  defaultChecked
                />
                <label htmlFor="notification" className="text-sm text-gray-700">
                  Notify me when processing completes
                </label>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  // Main render function
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <DashboardHeader
        title="Create New Scenario"
        description="Configure a new scenario for analysis"
        bgColor="white"
        sticky
      >
        <div className="flex items-center space-x-2">
          <button
            onClick={saveDraft}
            className="flex items-center bg-white border border-gray-300 rounded-md py-2 px-3 text-sm hover:bg-gray-50"
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-1.5" />
            Save Draft
          </button>
          {currentStep === 6 && (
            <button
              onClick={createScenario}
              className="flex items-center bg-blue-600 text-white rounded-md py-2 px-3 text-sm hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Clock className="h-4 w-4 mr-1.5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1.5" />
                  Create Scenario
                </>
              )}
            </button>
          )}
        </div>
      </DashboardHeader>
      
      <div className="flex-1 p-6 max-w-6xl mx-auto w-full">
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard/scenario')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Scenarios
          </button>
        </div>
        
        <div className="mb-8">
          <ProgressTracker
            steps={['Template', 'Basics', 'Parameters', 'Data', 'Advanced', 'Review']}
            currentStep={currentStep}
            onChange={handleStepChange}
          />
        </div>
        
        {renderStepContent()}
        
        <div className="mt-6 flex justify-between">
          <button
            onClick={goToPreviousStep}
            className={`px-4 py-2 flex items-center rounded-md ${
              currentStep === 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            disabled={currentStep === 1 || loading}
          >
            <ChevronRight className="h-4 w-4 mr-1.5 rotate-180" />
            Previous
          </button>
          
          {currentStep < 6 ? (
            <button
              onClick={goToNextStep}
              className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
              disabled={loading}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1.5" />
            </button>
          ) : (
            <button
              onClick={createScenario}
              className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Clock className="h-4 w-4 mr-1.5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1.5" />
                  Create Scenario
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
