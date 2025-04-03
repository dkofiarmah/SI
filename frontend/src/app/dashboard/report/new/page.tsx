'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import { 
  ChevronLeft, Send, Save, Layers, Plus, 
  Trash2, Calendar, Check, AlertTriangle, Globe,
  MapPin, Filter, Download, Share2, BrainCircuit,
  Info, X
} from 'lucide-react';

// Mock data for report configuration options
const reportTopics = [
  'Economic Development',
  'Foreign Investment',
  'Political Stability',
  'Security Threats',
  'Infrastructure Projects',
  'Natural Resources',
  'Trade Agreements',
  'Governance Issues',
  'Technology Adoption',
  'Climate Change Impact',
  'Regional Integration'
];

const reportTypes = [
  { id: 'comprehensive', name: 'Comprehensive Analysis', description: 'In-depth report covering multiple aspects of selected topics' },
  { id: 'security', name: 'Security Brief', description: 'Focused assessment of security risks and stability factors' },
  { id: 'economic', name: 'Economic Outlook', description: 'Analysis of economic trends, investments, and market conditions' },
  { id: 'entity', name: 'Entity Profile', description: 'Detailed background on selected organizations or individuals' }
];

const regions = [
  'All Regions',
  'North Africa',
  'East Africa',
  'West Africa',
  'Central Africa',
  'Southern Africa',
  'Middle East'
];

const countriesByRegion = {
  'North Africa': ['Egypt', 'Algeria', 'Morocco', 'Tunisia', 'Libya'],
  'East Africa': ['Kenya', 'Ethiopia', 'Tanzania', 'Uganda', 'Rwanda', 'South Sudan', 'Somalia', 'Djibouti'],
  'West Africa': ['Nigeria', 'Ghana', 'Senegal', 'Ivory Coast', 'Mali'],
  'Central Africa': ['DRC', 'Cameroon', 'Chad', 'CAR', 'Congo-Brazzaville'],
  'Southern Africa': ['South Africa', 'Angola', 'Zambia', 'Zimbabwe', 'Botswana', 'Namibia'],
  'Middle East': ['Saudi Arabia', 'UAE', 'Qatar', 'Oman', 'Jordan', 'Iraq']
};

const citiesByCountry = {
  'Egypt': ['Cairo', 'Alexandria', 'Giza'],
  'Nigeria': ['Lagos', 'Abuja', 'Kano', 'Ibadan'],
  'Kenya': ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'],
  'Saudi Arabia': ['Riyadh', 'Jeddah', 'Mecca', 'Medina'],
  'UAE': ['Dubai', 'Abu Dhabi', 'Sharjah'],
  'South Africa': ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria'],
  'Ethiopia': ['Addis Ababa', 'Dire Dawa', 'Mekelle'],
  'Ghana': ['Accra', 'Kumasi'],
  'Tanzania': ['Dar es Salaam', 'Dodoma', 'Mwanza'],
  'Uganda': ['Kampala', 'Entebbe'],
  'Rwanda': ['Kigali'],
  'South Sudan': ['Juba']
};

const reportEntities = [
  'African Development Bank',
  'Sahara Group',
  'NEOM',
  'Ahmed Hassan',
  'Nala Okoro',
  'Mahmoud Al-Faisal',
  'Asha Mwangi',
  'Safaricom PLC',
  'KenGen',
  'Ethiopian Airlines'
];

export default function CreateReportPage() {
  const router = useRouter();
  
  // Report configuration state
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState('comprehensive');
  const [selectedRegion, setSelectedRegion] = useState('East Africa');
  const [selectedCountry, setSelectedCountry] = useState('Kenya');
  const [selectedCity, setSelectedCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);
  const [includeOptions, setIncludeOptions] = useState({
    executiveSummary: true,
    dataVisualizations: true,
    riskAssessment: true,
    recommendations: true,
    historicalContext: false,
    entityProfiles: true
  });
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [customEntityInput, setCustomEntityInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Filtered options based on selections
  const availableCountries = selectedRegion && selectedRegion !== 'All Regions' 
    ? countriesByRegion[selectedRegion as keyof typeof countriesByRegion] || [] 
    : [];
  
  const availableCities = selectedCountry 
    ? citiesByCountry[selectedCountry as keyof typeof citiesByCountry] || [] 
    : [];

  // Initialize date range to current month
  useEffect(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    setStartDate(formatDateForInput(firstDayOfMonth));
    setEndDate(formatDateForInput(lastDayOfMonth));

    // Set default Kenya-centric topics
    setSelectedTopics(['Economic Development', 'Political Stability']);

  }, []);

  // Formats date as YYYY-MM-DD for input elements
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Handle region change and reset lower-level selections
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(e.target.value);
    setSelectedCountry('');
    setSelectedCity('');
  };

  // Handle country change and reset city selection
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
    setSelectedCity('');
  };

  // Toggle topic selection
  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic) 
        : [...prev, topic]
    );
  };

  // Add custom topic
  const addCustomTopic = () => {
    if (customTopicInput.trim() !== '' && !selectedTopics.includes(customTopicInput.trim())) {
      setSelectedTopics(prev => [...prev, customTopicInput.trim()]);
      setCustomTopicInput('');
    }
  };

  // Toggle entity selection
  const toggleEntity = (entity: string) => {
    setSelectedEntities(prev => 
      prev.includes(entity) 
        ? prev.filter(e => e !== entity) 
        : [...prev, entity]
    );
  };

  // Add custom entity
  const addCustomEntity = () => {
    if (customEntityInput.trim() !== '' && !selectedEntities.includes(customEntityInput.trim())) {
      setSelectedEntities(prev => [...prev, customEntityInput.trim()]);
      setCustomEntityInput('');
    }
  };

  // Toggle report section inclusion
  const toggleIncludeOption = (option: keyof typeof includeOptions) => {
    setIncludeOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // In a real application, you would send this data to an API
      console.log({
        title: reportTitle,
        type: reportType,
        region: selectedRegion,
        country: selectedCountry,
        city: selectedCity,
        timeFrame: {
          startDate,
          endDate
        },
        topics: selectedTopics,
        entities: selectedEntities,
        sections: includeOptions
      });
      
      setIsSaving(false);
      
      // Navigate to reports list with success message
      router.push('/dashboard/reports?status=created');
    }, 1500);
  };

  // Handle back navigation
  const handleBack = () => {
    router.push('/dashboard/reports');
  };

  // Handle save as template
  const handleSaveTemplate = () => {
    // Implementation for saving the current configuration as a template
    alert('Template saved! This would save the current configuration for future use.');
  };

  return (
    <div className="p-6">
      <DashboardHeader
        title="Create New Intelligence Report"
        description="Configure and generate a new intelligence report based on your requirements"
        showInfoTip
        infoTipContent="Create a comprehensive analysis report that combines multiple data sources and AI-powered insights."
      >
        <div className="flex space-x-2">
          <button
            onClick={handleBack}
            className="flex items-center text-teal-600 hover:text-teal-700 font-medium"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Reports
          </button>
        </div>
      </DashboardHeader>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main configuration area */}
          <div className="lg:w-2/3 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <label htmlFor="reportTitle" className="block text-lg font-bold mb-2 text-gray-800">Report Title</label>
                <input
                  id="reportTitle"
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="Enter a descriptive title for your report"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  required
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-bold mb-4 text-gray-800">Report Type</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportTypes.map(type => (
                    <div
                      key={type.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        reportType === type.id 
                          ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-500' 
                          : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                      onClick={() => setReportType(type.id)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-800">{type.name}</h3>
                        {reportType === type.id && <Check className="h-5 w-5 text-teal-600" />}
                      </div>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
                  Geographic Focus 
                  <span className="relative inline-flex align-middle ml-1">
                    <Info className="h-4 w-4 text-gray-400 hover:text-teal-600 cursor-pointer" />
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                    <select 
                      value={selectedRegion} 
                      onChange={handleRegionChange}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                    >
                      {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select 
                      value={selectedCountry} 
                      onChange={handleCountryChange}
                      disabled={!selectedRegion || selectedRegion === 'All Regions'}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500 disabled:bg-gray-100"
                    >
                      <option value="">-- Select Country --</option>
                      {availableCountries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City / District</label>
                    <select 
                      value={selectedCity} 
                      onChange={(e) => setSelectedCity(e.target.value)}
                      disabled={!selectedCountry}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500 disabled:bg-gray-100"
                    >
                      <option value="">-- Select City/District (Optional) --</option>
                      {availableCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-1.5 text-gray-500"/>
                    Time Range
                  </h3>
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
                    <div className="w-full sm:w-auto">
                      <label htmlFor="startDate" className="block text-xs text-gray-500 mb-1">From</label>
                      <input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none text-sm"
                      />
                    </div>
                    <div className="w-full sm:w-auto">
                      <label htmlFor="endDate" className="block text-xs text-gray-500 mb-1">To</label>
                      <input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none text-sm"
                      />
                    </div>
                    <div className="w-full sm:w-auto sm:ml-4">
                      <label className="block text-xs text-gray-500 mb-1">Quick Select</label>
                      <div className="flex flex-wrap gap-2">
                        {['Last Month', 'Last Quarter', 'Last Year'].map(period => (
                          <button
                            key={period}
                            type="button"
                            className="px-2 py-1 text-xs border border-gray-300 rounded bg-white hover:bg-gray-50 text-gray-700"
                            onClick={() => {
                              // Quick date range selection logic would go here
                              alert(`Setting date range to ${period}`);
                            }}
                          >
                            {period}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800">Topics & Areas of Focus</h2>
                  <div className="relative">
                    <input
                      type="text"
                      value={customTopicInput}
                      onChange={(e) => setCustomTopicInput(e.target.value)}
                      placeholder="Add custom topic..."
                      className="w-full p-2 pl-3 pr-10 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCustomTopic();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addCustomTopic}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-teal-600 hover:text-teal-700"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {reportTopics.map(topic => (
                    <div
                      key={topic}
                      className={`py-1 px-3 rounded-full cursor-pointer text-sm transition-all ${
                        selectedTopics.includes(topic)
                          ? 'bg-teal-600 text-white font-medium'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => toggleTopic(topic)}
                    >
                      {topic}
                    </div>
                  ))}
                </div>
                
                {/* Custom topics */}
                {selectedTopics.filter(topic => !reportTopics.includes(topic)).length > 0 && (
                  <div className="mt-3">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Custom Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTopics.filter(topic => !reportTopics.includes(topic)).map(topic => (
                        <div
                          key={topic}
                          className="py-1 px-3 rounded-full cursor-pointer text-sm bg-purple-100 text-purple-700 font-medium flex items-center"
                        >
                          {topic}
                          <button
                            type="button"
                            onClick={() => toggleTopic(topic)}
                            className="ml-1.5 p-0.5 rounded hover:bg-purple-200"
                          >
                            <X className="h-3 w-3 text-purple-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedTopics.length === 0 && (
                  <div className="text-sm text-gray-500 italic">
                    Select at least one topic to focus your report on.
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800">Include Specific Entities</h2>
                  <div className="relative">
                    <input
                      type="text"
                      value={customEntityInput}
                      onChange={(e) => setCustomEntityInput(e.target.value)}
                      placeholder="Add entity..."
                      className="w-full p-2 pl-3 pr-10 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCustomEntity();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addCustomEntity}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-teal-600 hover:text-teal-700"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {reportEntities.map(entity => (
                    <div
                      key={entity}
                      className={`py-1 px-3 rounded-full cursor-pointer flex items-center text-sm transition-all ${
                        selectedEntities.includes(entity)
                          ? 'bg-purple-100 text-purple-700 font-medium'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => toggleEntity(entity)}
                    >
                      {entity}
                      {selectedEntities.includes(entity) && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleEntity(entity);
                          }}
                          className="ml-1.5 p-0.5 rounded hover:bg-purple-200"
                        >
                          <X className="h-3 w-3 text-purple-600" />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {/* Custom entities */}
                  {selectedEntities.filter(entity => !reportEntities.includes(entity)).map(entity => (
                    <div
                      key={entity}
                      className="py-1 px-3 rounded-full cursor-pointer flex items-center text-sm bg-blue-100 text-blue-700 font-medium"
                    >
                      {entity}
                      <button
                        type="button"
                        onClick={() => toggleEntity(entity)}
                        className="ml-1.5 p-0.5 rounded hover:bg-blue-200"
                      >
                        <X className="h-3 w-3 text-blue-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
                  Data Sources 
                  <span className="relative inline-flex align-middle ml-1">
                    <Info className="h-4 w-4 text-gray-400 hover:text-teal-600 cursor-pointer" />
                  </span>
                </h2>
                <div className="space-y-3 text-sm">
                  {[
                    { id: 'savannah', label: 'Savannah Intelligence Core Data', checked: true, disabled: true },
                    { id: 'news', label: 'News Sources (120+ outlets)', checked: true },
                    { id: 'economic', label: 'Economic Indicators', checked: true },
                    { id: 'social', label: 'Social Media Analysis', checked: true },
                    { id: 'govt', label: 'Government Publications', checked: true },
                    { id: 'satellite', label: 'Satellite Imagery', checked: false },
                    { id: 'proprietary', label: 'Proprietary Network Data', checked: true },
                    { id: 'user_risk_matrix', label: 'My Data: Project Alpha Risk Matrix', checked: false },
                    { id: 'user_regional_sales', label: 'My Data: Regional Sales DB', checked: false },
                  ].map(source => (
                    <div key={source.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={source.id}
                        defaultChecked={source.checked}
                        disabled={source.disabled}
                        className="mr-3 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 disabled:opacity-50"
                      />
                      <label
                        htmlFor={source.id}
                        className={`text-gray-700 ${source.disabled ? 'text-gray-400' : ''}`}
                      >
                        {source.label}
                      </label>
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => router.push('/dashboard/data-management')}
                    className="text-xs text-teal-600 hover:underline mt-2 font-medium"
                  >
                    Manage User Data Sources...
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar with options and preview */}
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-6">
              <div className="p-6">
                <h2 className="text-lg font-bold mb-4 text-gray-800">Report Options & Preview</h2>
                
                <div className="mb-6">
                  <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50/50">
                    <h3 className="font-medium mb-3 text-gray-800">Report Structure</h3>
                    <div className="space-y-2 text-sm">
                      {[ 
                        { id: 'exec-summary', label: 'Executive Summary', key: 'executiveSummary' as keyof typeof includeOptions, estimate: '1-2 pages' },
                        { id: 'visualizations', label: 'Data Visualizations', key: 'dataVisualizations' as keyof typeof includeOptions, estimate: '3-5 charts' },
                        { id: 'risk', label: 'Risk Assessment', key: 'riskAssessment' as keyof typeof includeOptions, estimate: '2-3 pages' },
                        { id: 'recommendations', label: 'Recommendations', key: 'recommendations' as keyof typeof includeOptions, estimate: '1-2 pages' },
                        { id: 'historical', label: 'Historical Context', key: 'historicalContext' as keyof typeof includeOptions, estimate: '2-3 pages' },
                        { id: 'profiles', label: 'Entity Profiles', key: 'entityProfiles' as keyof typeof includeOptions, estimate: '1 page each' },
                      ].map(option => (
                        <div key={option.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={option.id}
                              checked={includeOptions[option.key]}
                              onChange={() => toggleIncludeOption(option.key)}
                              className="mr-2 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                            />
                            <label htmlFor={option.id} className="text-gray-700">{option.label}</label>
                          </div>
                          <span className="text-xs text-gray-500">{option.estimate}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50/50">
                    <h3 className="font-medium mb-2 text-gray-800">AI-Assisted Generation</h3>
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id="use-ai"
                        defaultChecked={true}
                        className="mr-2 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <label htmlFor="use-ai" className="text-gray-700 text-sm">Use AI to enhance report</label>
                    </div>
                    <p className="text-xs text-gray-500">
                      AI will analyze selected data sources to identify patterns, generate insights, and suggest visualizations.
                    </p>
                    <button
                      type="button"
                      className="mt-2 flex items-center text-teal-600 text-sm hover:text-teal-700"
                    >
                      <BrainCircuit className="h-4 w-4 mr-1" />
                      Advanced AI Options
                    </button>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
                    <h3 className="font-medium mb-3 text-gray-800">Template Options</h3>
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={handleSaveTemplate}
                        className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 bg-white"
                      >
                        <Save className="h-4 w-4 mr-2 text-gray-500" />
                        Save as Template
                      </button>
                      <button
                        type="button"
                        className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 bg-white"
                      >
                        <Layers className="h-4 w-4 mr-2 text-gray-500" />
                        Load Template
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-800">Report Preview</h3>
                    <span className="text-xs text-gray-500">Est. pages: 8-12</span>
                  </div>
                  <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 h-48 flex flex-col items-center justify-center text-center">
                    {reportTitle ? (
                      <>
                        <h3 className="font-medium text-gray-800 mb-1">{reportTitle}</h3>
                        <p className="text-xs text-gray-500 mb-2">
                          {selectedRegion}{selectedCountry && ` • ${selectedCountry}`}{selectedCity && ` • ${selectedCity}`}
                        </p>
                        <div className="flex flex-wrap justify-center gap-1 mb-2">
                          {selectedTopics.slice(0, 3).map((topic, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs">
                              {topic}
                            </span>
                          ))}
                          {selectedTopics.length > 3 && (
                            <span className="px-1.5 py-0.5 bg-gray-200 text-gray-500 rounded-full text-xs">
                              +{selectedTopics.length - 3}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">
                          {startDate} to {endDate}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-400 mb-2">Enter report details to see preview</p>
                        <p className="text-xs text-gray-500">Preview shows how your report will look</p>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 flex flex-col gap-2">
                  <button
                    type="submit"
                    disabled={isSaving || !reportTitle || selectedTopics.length === 0}
                    className={`w-full py-3 px-4 rounded-md text-white font-semibold flex items-center justify-center ${
                      isSaving || !reportTitle || selectedTopics.length === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-teal-600 hover:bg-teal-700'
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-r-2 border-white mr-2"></div>
                        Generating Report...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Generate Report
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 font-medium text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
                
                {(!reportTitle || selectedTopics.length === 0) && (
                  <div className="mt-4 flex items-start p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                    <div className="text-xs text-yellow-700">
                      <p className="font-medium mb-1">Please complete required fields:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {!reportTitle && <li>Enter a report title</li>}
                        {selectedTopics.length === 0 && <li>Select at least one topic</li>}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}