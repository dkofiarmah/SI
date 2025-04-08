import React, { useState, useEffect } from 'react';
import { 
  Database, Filter, Search, X,
  BarChart4, RefreshCw, CheckCircle2, 
  AlertCircle, Clock
} from 'lucide-react';
import { DataSource, DataSourceFilter, DataSourceSelectionOptions } from '@/types/dataSource';
import { filterDataSources, getAllDataSources, calculateDataQualityScore } from '@/lib/utils/dataSources';

interface DataSourceSelectorProps {
  selectedSources: string[];
  onChange: (selectedSourceIds: string[]) => void;
  options?: DataSourceSelectionOptions;
  showQualityScore?: boolean;
  className?: string;
}

export default function DataSourceSelector({
  selectedSources = [], // Add default empty array here
  onChange,
  options = {
    allowMultiple: true,
    requiredTypes: undefined,
    suggestedSources: undefined,
    preselectedSources: undefined,
    filterDefaults: undefined
  },
  showQualityScore = false,
  className = ''
}: DataSourceSelectorProps) {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [filteredSources, setFilteredSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [dataQuality, setDataQuality] = useState({
    overallScore: 0,
    coverageScore: 0,
    reliabilityScore: 0,
    freshnessScore: 0
  });
  
  // Initialize filter with defaults if provided
  const [filter, setFilter] = useState<DataSourceFilter>(
    options.filterDefaults || {
      types: undefined,
      categories: undefined,
      regions: undefined,
      countries: undefined,
      minReliability: 70,
      maxAge: undefined,
      searchTerm: '',
      tags: undefined
    }
  );
  
  useEffect(() => {
    async function fetchDataSources() {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        const sources = getAllDataSources();
        setDataSources(sources);
        
        // Apply initial filtering
        setFilteredSources(filterDataSources({ 
          ...filter, 
          searchTerm 
        }));
        
        // Pre-select sources if provided
        if (options.preselectedSources && options.preselectedSources.length > 0 && selectedSources.length === 0) {
          onChange(options.preselectedSources);
        }
      } catch (error) {
        console.error('Error fetching data sources:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDataSources();
  }, []);
  
  useEffect(() => {
    // Update filtered sources when filter or search changes
    setFilteredSources(filterDataSources({
      ...filter,
      searchTerm
    }));
  }, [filter, searchTerm]);
  
  useEffect(() => {
    // Calculate data quality score when selected sources change
    if (showQualityScore && selectedSources.length > 0) {
      const qualityScore = calculateDataQualityScore(selectedSources);
      setDataQuality(qualityScore);
    }
  }, [selectedSources, showQualityScore]);
  
  const handleSourceToggle = (sourceId: string) => {
    let newSelectedSources: string[];
    
    if (options.allowMultiple) {
      newSelectedSources = selectedSources.includes(sourceId)
        ? selectedSources.filter(id => id !== sourceId)
        : [...selectedSources, sourceId];
    } else {
      newSelectedSources = [sourceId];
    }
    
    onChange(newSelectedSources);
  };
  
  const handleTypeFilterChange = (type: string) => {
    const newSelectedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    
    setSelectedTypes(newSelectedTypes);
    setFilter({
      ...filter,
      types: newSelectedTypes.length > 0 
        ? newSelectedTypes as any[] 
        : undefined
    });
  };
  
  const handleReliabilityFilterChange = (value: number) => {
    setFilter({
      ...filter,
      minReliability: value
    });
  };
  
  const handleMaxAgeFilterChange = (days: number | undefined) => {
    setFilter({
      ...filter,
      maxAge: days
    });
  };
  
  const clearFilters = () => {
    setFilter({
      types: undefined,
      categories: undefined,
      regions: undefined,
      countries: undefined,
      minReliability: 0,
      maxAge: undefined,
      searchTerm: '',
      tags: undefined
    });
    setSearchTerm('');
    setSelectedTypes([]);
  };
  
  // Get a list of available data source types from the data
  const availableTypes = Array.from(new Set(dataSources.map(source => source.type)));
  
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <Database className="h-5 w-5 mr-2 text-teal-600" />
            Data Sources
            {showFilters && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({filteredSources.length} available)
              </span>
            )}
          </h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm text-teal-600 hover:text-teal-800 flex items-center"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            <Filter className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        {/* Search and filters */}
        <div className={`space-y-3 ${showFilters ? 'block' : 'hidden'}`}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search data sources..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-teal-500 focus:border-teal-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-500" />
              </button>
            )}
          </div>
          
          {/* Type filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Source Types</label>
            <div className="flex flex-wrap gap-2">
              {availableTypes.map(type => (
                <button
                  key={type}
                  onClick={() => handleTypeFilterChange(type)}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedTypes.includes(type)
                      ? 'bg-teal-100 text-teal-800 border border-teal-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Reliability slider */}
          <div>
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Minimum Reliability</label>
              <span className="text-sm text-gray-500">{filter.minReliability || 0}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={filter.minReliability || 0}
              onChange={(e) => handleReliabilityFilterChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-1"
            />
          </div>
          
          {/* Age filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Age</label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Any', value: undefined },
                { label: 'Last week', value: 7 },
                { label: 'Last month', value: 30 },
                { label: 'Last quarter', value: 90 },
                { label: 'Last year', value: 365 }
              ].map(option => (
                <button
                  key={option.label}
                  onClick={() => handleMaxAgeFilterChange(option.value)}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    filter.maxAge === option.value
                      ? 'bg-teal-100 text-teal-800 border border-teal-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Clear filters button */}
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear all filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Data sources list */}
      <div className="p-4 max-h-64 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center py-4">
            <RefreshCw className="h-5 w-5 text-teal-600 animate-spin" />
            <span className="ml-2 text-sm text-gray-600">Loading data sources...</span>
          </div>
        ) : filteredSources.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>No data sources match your criteria.</p>
            <button
              onClick={clearFilters}
              className="mt-2 text-sm text-teal-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredSources.map(source => {
              const isSelected = selectedSources.includes(source.id);
              const isSuggested = options.suggestedSources?.includes(source.id);
              
              return (
                <div 
                  key={source.id}
                  className={`p-3 rounded-md border ${
                    isSelected 
                      ? 'border-teal-300 bg-teal-50' 
                      : isSuggested
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                  } transition-colors`}
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="text-sm font-medium text-gray-900">{source.name}</h4>
                        {isSuggested && !isSelected && (
                          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{source.description}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500 space-x-4">
                        <span className="flex items-center">
                          <BarChart4 className="h-3 w-3 mr-1" />
                          Reliability: {source.reliability}%
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatLastUpdated(source.lastUpdated)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => handleSourceToggle(source.id)}
                        className={`p-1.5 rounded ${
                          isSelected
                            ? 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {isSelected ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <span className="h-5 w-5 block rounded-full border-2 border-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Selected sources summary */}
      {selectedSources.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            {selectedSources.length} source{selectedSources.length !== 1 ? 's' : ''} selected
          </h4>
          
          {showQualityScore && (
            <div className="bg-gray-50 p-2 rounded-md mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-700">Data Quality Score</span>
                <span className={`text-xs font-bold ${getScoreColorClass(dataQuality.overallScore)}`}>
                  {Math.round(dataQuality.overallScore)}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getScoreBackgroundClass(dataQuality.overallScore)}`}
                  style={{ width: `${dataQuality.overallScore}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="text-center">
                  <span className="text-xs text-gray-500 block">Reliability</span>
                  <span className={`text-xs font-bold ${getScoreColorClass(dataQuality.reliabilityScore)}`}>
                    {Math.round(dataQuality.reliabilityScore)}%
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-xs text-gray-500 block">Coverage</span>
                  <span className={`text-xs font-bold ${getScoreColorClass(dataQuality.coverageScore)}`}>
                    {Math.round(dataQuality.coverageScore)}%
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-xs text-gray-500 block">Freshness</span>
                  <span className={`text-xs font-bold ${getScoreColorClass(dataQuality.freshnessScore)}`}>
                    {Math.round(dataQuality.freshnessScore)}%
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            {selectedSources.map(sourceId => {
              const source = dataSources.find(s => s.id === sourceId);
              if (!source) return null;
              
              return (
                <div 
                  key={sourceId}
                  className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs"
                >
                  <span className="truncate max-w-[150px]">{source.name}</span>
                  <button
                    onClick={() => handleSourceToggle(sourceId)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions
function formatLastUpdated(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  }
}

function getScoreColorClass(score: number): string {
  if (score >= 90) return 'text-green-600';
  if (score >= 70) return 'text-teal-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-red-600';
}

function getScoreBackgroundClass(score: number): string {
  if (score >= 90) return 'bg-green-500';
  if (score >= 70) return 'bg-teal-500';
  if (score >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
}
