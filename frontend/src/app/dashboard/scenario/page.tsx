'use client';

import React, { useState } from 'react';
import {
  PlusCircle, Settings, BrainCircuit,
  Play, AlertTriangle, TrendingUp, Filter,
  Share2, Download, Clock, Activity, Target,
  Globe
} from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import { scenarioTemplates } from '@/data/mock/data';

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
};

export default function ScenarioPage() {
  const [activeScenario, setActiveScenario] = useState<ScenarioRun | null>(null);
  const [showNewScenario, setShowNewScenario] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(scenarioTemplates[0]);
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [scenarioData, setScenarioData] = useState<ScenarioData>({
    name: '',
    description: '',
    timeHorizon: '6 Months',
    region: '',
    variables: {},
    steps: [],
    parameters: {},
    dataInputs: [],
  });

  // Function to handle form field changes
  const handleScenarioChange = (field: keyof ScenarioData, value: ScenarioData[keyof ScenarioData]) => {
    setScenarioData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Function to handle template selection and set default values
  const handleTemplateSelect = (template: ScenarioTemplate) => {
    setSelectedTemplate(template);
    setScenarioData(prev => ({
      ...prev,
      template: template.id,
      timeHorizon: template.defaultTimeHorizon
    }));
  };

  // Function to move to next step
  const nextStep = () => {
    setWizardStep(prev => prev + 1);
  };

  // Function to move to previous step
  const prevStep = () => {
    setWizardStep(prev => Math.max(1, prev - 1));
  };

  // Function to create the scenario
  const createScenario = () => {
    // In a real app, this would submit the data to an API
    console.log('Creating scenario with data:', scenarioData);
    // Add the new scenario to the list
    // Reset the form and close the modal
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
    });
    setShowNewScenario(false);
  };

  // Sample scenario runs
  const scenarioRuns: ScenarioRun[] = [
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
  ];

  // New Scenario Modal with Step Wizard
  const NewScenarioModal = () => {
    // Render different steps based on wizardStep
    const renderStepContent = () => {
      switch (wizardStep) {
        case 1: // Template Selection
          return (
            <>
              <div className="mb-6 flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">1</div>
                <div className="ml-3">
                  <h4 className="font-medium">Choose Template</h4>
                  <p className="text-sm text-gray-600">Select the type of scenario you want to create</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
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
                    <h5 className="font-medium mb-1">{template.name}</h5>
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
            </>
          );
        
        case 2: // Basic Information
          return (
            <>
              <div className="mb-6 flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">2</div>
                <div className="ml-3">
                  <h4 className="font-medium">Basic Information</h4>
                  <p className="text-sm text-gray-600">Define the basic details of your scenario</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scenario Name*
                  </label>
                  <input
                    type="text"
                    value={scenarioData.name}
                    onChange={(e) => handleScenarioChange('name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter a descriptive name for your scenario"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description*
                  </label>
                  <textarea
                    value={scenarioData.description}
                    onChange={(e) => handleScenarioChange('description', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                    placeholder="Describe the scenario objectives and scope"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Horizon
                  </label>
                  <select 
                    value={scenarioData.timeHorizon}
                    onChange={(e) => handleScenarioChange('timeHorizon', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="3 Months">3 Months</option>
                    <option value="6 Months">6 Months</option>
                    <option value="1 Year">1 Year</option>
                    <option value="2 Years">2 Years</option>
                    <option value="5 Years">5 Years</option>
                  </select>
                </div>
              </div>
            </>
          );
        
        case 3: // Parameters
          return (
            <>
              <div className="mb-6 flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">3</div>
                <div className="ml-3">
                  <h4 className="font-medium">Scenario Parameters</h4>
                  <p className="text-sm text-gray-600">Define the specific parameters for your scenario</p>
                </div>
              </div>
              
              {selectedTemplate.variables[0] !== 'User Defined' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {selectedTemplate.variables.map((variable, index) => (
                      <div key={index}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {variable}
                        </label>
                        {variable.includes('%') ? (
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter percentage"
                            onChange={(e) => {
                              const updatedParams = { ...scenarioData.parameters };
                              updatedParams[variable] = e.target.value;
                              handleScenarioChange('parameters', updatedParams);
                            }}
                          />
                        ) : variable.includes('Duration') ? (
                          <div className="flex">
                            <input
                              type="number"
                              className="flex-1 p-2 border border-gray-300 rounded-l-md"
                              placeholder="Duration"
                              onChange={(e) => {
                                const updatedParams = { ...scenarioData.parameters };
                                updatedParams[variable] = `${e.target.value} ${scenarioData.parameters[`${variable}_unit`] || 'Months'}`;
                                handleScenarioChange('parameters', updatedParams);
                              }}
                            />
                            <select 
                              className="w-32 p-2 border-t border-b border-r border-gray-300 rounded-r-md bg-gray-50"
                              onChange={(e) => {
                                const updatedParams = { ...scenarioData.parameters };
                                const paramValue = scenarioData.parameters[variable];
                                const value = typeof paramValue === 'string' ? paramValue.split(' ')[0] : '';
                                updatedParams[`${variable}_unit`] = e.target.value;
                                updatedParams[variable] = `${value} ${e.target.value}`;
                                handleScenarioChange('parameters', updatedParams);
                              }}
                              defaultValue="Months"
                            >
                              <option>Days</option>
                              <option>Weeks</option>
                              <option>Months</option>
                            </select>
                          </div>
                        ) : (
                          <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder={`Enter ${variable.toLowerCase()}`}
                            onChange={(e) => {
                              const updatedParams = { ...scenarioData.parameters };
                              updatedParams[variable] = e.target.value;
                              handleScenarioChange('parameters', updatedParams);
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    This is a custom scenario. Define your own parameters below:
                  </p>
                  <div className="border border-gray-200 rounded-md p-4">
                    <div className="flex mb-4">
                      <input
                        type="text"
                        className="flex-1 p-2 border border-gray-300 rounded-l-md"
                        placeholder="Parameter Name"
                      />
                      <input
                        type="text"
                        className="flex-1 p-2 border-t border-b border-gray-300"
                        placeholder="Parameter Value"
                      />
                      <button className="p-2 bg-blue-600 text-white rounded-r-md">Add</button>
                    </div>
                    <div className="text-sm text-gray-500">
                      No parameters added yet. Add your custom parameters above.
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-indigo-50 border border-indigo-100 rounded-md p-4 mt-6">
                <div className="flex items-start">
                  <BrainCircuit className="h-5 w-5 text-indigo-600 mt-1 mr-2" />
                  <div>
                    <h4 className="font-medium text-indigo-900">AI Recommendations</h4>
                    <p className="text-sm text-indigo-700 mt-1">
                      Based on your scenario parameters, consider including:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-indigo-700">
                      <li className="flex items-center">
                        <Target className="h-3 w-3 mr-1" />
                        Regional trade flow analysis
                      </li>
                      <li className="flex items-center">
                        <Activity className="h-3 w-3 mr-1" />
                        Currency market volatility tracking
                      </li>
                      <li className="flex items-center">
                        <Globe className="h-3 w-3 mr-1" />
                        Cross-border policy implications
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          );
        
        case 4: // Data Sources
          return (
            <>
              <div className="mb-6 flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">4</div>
                <div className="ml-3">
                  <h4 className="font-medium">Data Sources</h4>
                  <p className="text-sm text-gray-600">Select the data sources to use in your scenario</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'economic', name: 'Economic Indicators', description: 'GDP, inflation, trade balance, etc.' },
                    { id: 'social', name: 'Social Metrics', description: 'Population, education, health, etc.' },
                    { id: 'security', name: 'Security Indexes', description: 'Conflict data, risk assessments, etc.' },
                    { id: 'political', name: 'Political Analysis', description: 'Governance indicators, election data, etc.' },
                    { id: 'infrastructure', name: 'Infrastructure Data', description: 'Transport, energy, telecoms, etc.' },
                    { id: 'custom', name: 'Custom Data', description: 'Upload or connect your own datasets' }
                  ].map((source) => (
                    <label 
                      key={source.id}
                      className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                    >
                      <input 
                        type="checkbox" 
                        className="mt-1 mr-3 rounded border-gray-300 text-blue-600"
                        onChange={(e) => {
                          const newDataInputs = e.target.checked 
                            ? [...scenarioData.dataInputs, source.id]
                            : scenarioData.dataInputs.filter(id => id !== source.id);
                          handleScenarioChange('dataInputs', newDataInputs);
                        }}
                        checked={scenarioData.dataInputs.includes(source.id)}
                      />
                      <div>
                        <h5 className="font-medium text-sm">{source.name}</h5>
                        <p className="text-xs text-gray-600 mt-1">{source.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mt-2">
                  <h5 className="font-medium text-sm mb-2">Data Time Range</h5>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">Historical data from:</span>
                    <select className="p-1.5 border border-gray-300 rounded text-sm">
                      <option>Last 1 Year</option>
                      <option>Last 3 Years</option>
                      <option>Last 5 Years</option>
                      <option>Last 10 Years</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          );
        
        case 5: // Review
          return (
            <>
              <div className="mb-6 flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">5</div>
                <div className="ml-3">
                  <h4 className="font-medium">Review & Create</h4>
                  <p className="text-sm text-gray-600">Review your scenario details before creation</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h5 className="font-medium mb-2">Scenario Overview</h5>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Name:</dt>
                      <dd className="text-sm font-medium">{scenarioData.name || 'Not specified'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Template:</dt>
                      <dd className="text-sm font-medium">{selectedTemplate.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Time Horizon:</dt>
                      <dd className="text-sm font-medium">{scenarioData.timeHorizon}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-600 mb-1">Description:</dt>
                      <dd className="text-sm bg-white p-2 rounded border border-gray-200">{scenarioData.description || 'No description provided'}</dd>
                    </div>
                  </dl>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h5 className="font-medium mb-2">Parameters</h5>
                  {Object.keys(scenarioData.parameters).length > 0 ? (
                    <ul className="space-y-1">
                      {Object.entries(scenarioData.parameters)
                        .filter(([key]) => !key.includes('_unit'))
                        .map(([key, value]) => (
                        <li key={key} className="flex justify-between text-sm">
                          <span className="text-gray-600">{key}:</span>
                          <span className="font-medium">{value}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No parameters defined</p>
                  )}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h5 className="font-medium mb-2">Data Sources</h5>
                  {scenarioData.dataInputs.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {scenarioData.dataInputs.map(source => (
                        <span key={source} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {source.charAt(0).toUpperCase() + source.slice(1)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No data sources selected</p>
                  )}
                </div>
              </div>
            </>
          );
        
        default:
          return null;
      }
    };

    // Progress indicator
    const totalSteps = 5;
    const progress = (wizardStep / totalSteps) * 100;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-[800px] max-h-[80vh] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold">Create New Scenario</h3>
            <button 
              onClick={() => {
                setWizardStep(1);
                setShowNewScenario(false);
              }}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <span className="sr-only">Close</span>
              ×
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
            <div 
              className="h-2 bg-blue-600 rounded-full" 
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Step Indicator */}
          <div className="flex mb-6 border-b border-gray-100 pb-4">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <button
                key={i}
                className={`flex-1 text-center py-2 text-xs font-medium rounded-t-md transition-colors ${
                  i + 1 === wizardStep 
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : i + 1 < wizardStep
                      ? 'text-green-600'
                      : 'text-gray-500'
                }`}
                onClick={() => {
                  // Only allow going back or to completed steps
                  if (i + 1 <= wizardStep) {
                    setWizardStep(i + 1);
                  }
                }}
              >
                {i + 1 < wizardStep && (
                  <span className="mr-1">✓</span>
                )}
                {i === 0 ? 'Template' : 
                 i === 1 ? 'Details' : 
                 i === 2 ? 'Parameters' : 
                 i === 3 ? 'Data' : 'Review'}
              </button>
            ))}
          </div>
          
          {/* Step Content */}
          <div className="mb-6">
            {renderStepContent()}
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between border-t border-gray-200 pt-4">
            {wizardStep > 1 ? (
              <button 
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                Previous
              </button>
            ) : (
              <button 
                onClick={() => {
                  setWizardStep(1);
                  setShowNewScenario(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            
            {wizardStep < totalSteps ? (
              <button 
                onClick={nextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                disabled={wizardStep === 2 && (!scenarioData.name || !scenarioData.description)}
              >
                Next
              </button>
            ) : (
              <button 
                onClick={createScenario}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                Create Scenario
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
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
            onClick={() => setShowNewScenario(true)}
            className="flex items-center bg-blue-600 text-white rounded-md py-2 px-3 text-sm hover:bg-blue-700"
          >
            <PlusCircle className="h-4 w-4 mr-1.5" />
            New Scenario
          </button>
          <button className="flex items-center bg-white border border-gray-300 rounded-md py-2 px-3 text-sm hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-1.5" />
            Filter
          </button>
        </div>
      </DashboardHeader>

      <div className="flex-1 p-6 bg-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scenarios List */}
          <div className="lg:col-span-2 space-y-4">
            {scenarioRuns.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => setActiveScenario(scenario)}
                className={`w-full text-left p-4 rounded-lg border bg-white hover:border-blue-300 transition-colors ${
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
                        scenario.results.impact === 'high' ? 'bg-red-100 text-red-800' :
                        scenario.results.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {scenario.results.impact.charAt(0).toUpperCase() + scenario.results.impact.slice(1)} Impact
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
              </button>
            ))}
          </div>

          {/* Active Scenario Details */}
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
      </div>

      {/* New Scenario Modal */}
      {showNewScenario && <NewScenarioModal />}
    </div>
  );
}
