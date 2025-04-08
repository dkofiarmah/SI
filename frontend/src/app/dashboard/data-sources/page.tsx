'use client';

import React, { useState, useEffect } from 'react';
import { 
  Database, Search, Filter, RefreshCw, Plus, 
  ExternalLink, Clock, Download, BarChart4, Link,
  Check, XCircle
} from 'lucide-react';
import { getAllDataSources, filterDataSources } from '@/lib/utils/dataSources';
import { DataSource, DataSourceFilter, DataSourceType, DataSourceCategory } from '@/types/dataSource';
import DashboardHeader from '@/components/DashboardHeader';

type ViewMode = 'grid' | 'list';
type SortField = 'name' | 'reliability' | 'lastUpdated' | 'type';
type SortOrder = 'asc' | 'desc';

export default function DataSourcesPage() {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [filteredSources, setFilteredSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<DataSourceFilter>({});
  const [showFilter, setShowFilter] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('reliability');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  
  useEffect(() => {
    loadDataSources();
  }, []);
  
  useEffect(() => {
    if (dataSources.length > 0) {
      applyFiltersAndSort();
    }
  }, [dataSources, filter, searchTerm, sortField, sortOrder]);
  
  const loadDataSources = async () => {
    setLoading(true);
    try {
      // In a real app, you'd fetch from an API
      const sources = getAllDataSources();
      setDataSources(sources);
      setFilteredSources(sources);
    } catch (error) {
      console.error('Error loading data sources:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const applyFiltersAndSort = () => {
    // Apply filters
    let result = filterDataSources({
      ...filter,
      searchTerm
    });
    
    // Apply sorting
    result = sortDataSources(result, sortField, sortOrder);
    
    setFilteredSources(result);
  };
  
  const sortDataSources = (sources: DataSource[], field: SortField, order: SortOrder): DataSource[] => {
    return [...sources].sort((a, b) => {
      let comparison = 0;
      
      switch (field) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'reliability':
          comparison = a.reliability - b.reliability;
          break;
        case 'lastUpdated':
          comparison = a.lastUpdated.getTime() - b.lastUpdated.getTime();
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }
      
      return order === 'asc' ? comparison : -comparison;
    });
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (updatedFilter: Partial<DataSourceFilter>) => {
    setFilter({
      ...filter,
      ...updatedFilter
    });
  };
  
  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    if (isSelectMode) {
      setSelectedSources([]);
    }
  };
  
  const toggleSourceSelection = (sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedSources.length === filteredSources.length) {
      setSelectedSources([]);
    } else {
      setSelectedSources(filteredSources.map(source => source.id));
    }
  };
  
  const getSourceStatusLabel = (source: DataSource) => {
    if (!source.available) return 'Unavailable';
    if (source.requiresSubscription) return 'Premium';
    return 'Available';
  };
  
  const getSourceStatusColor = (source: DataSource) => {
    if (!source.available) return 'text-red-600 bg-red-50 border-red-200';
    if (source.requiresSubscription) return 'text-purple-600 bg-purple-50 border-purple-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };
  
  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.round((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };
  
  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Data Sources"
        description="Browse, filter, and manage all available data sources"
        bgColor="white"
        showInfoTip
        infoTipContent="Data sources provide the foundation for all analysis in the platform. You can see details about each source, filter by type, and check reliability ratings."
      />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search data sources..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Controls */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <button
                  className={`px-3 py-1.5 text-sm border-r border-gray-300 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </button>
                <button
                  className={`px-3 py-1.5 text-sm ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => setViewMode('list')}
                >
                  List
                </button>
              </div>
              
              <button
                onClick={() => setShowFilter(!showFilter)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border ${showFilter ? 'bg-blue-50 text-blue-600 border-blue-200' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
              >
                <Filter className="h-4 w-4" />
                Filter
              </button>
              
              <button
                onClick={toggleSelectMode}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border ${isSelectMode ? 'bg-blue-50 text-blue-600 border-blue-200' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
              >
                <Check className="h-4 w-4" />
                {isSelectMode ? 'Cancel' : 'Select'}
              </button>
              
              <button
                onClick={loadDataSources}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border border-gray-300 text-gray-600 hover:bg-gray-50"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
          
          {/* Filters Panel */}
          {showFilter && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Data Source Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Source Types</label>
                <div className="flex flex-wrap gap-1">
                  {['all', 'news', 'economic', 'social', 'government', 'security', 'satellite', 'intelligence', 'academic', 'ngo', 'custom'].map(type => (
                    <button
                      key={type}
                      onClick={() => handleFilterChange({ 
                        types: type === 'all' ? undefined : [type as DataSourceType] 
                      })}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        (type === 'all' && !filter.types) || 
                        (filter.types?.includes(type as DataSourceType)) 
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
                <div className="flex flex-wrap gap-1">
                  {['all', 'core', 'external', 'partner', 'custom', 'premium'].map(category => (
                    <button
                      key={category}
                      onClick={() => handleFilterChange({ 
                        categories: category === 'all' ? undefined : [category as DataSourceCategory] 
                      })}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        (category === 'all' && !filter.categories) || 
                        (filter.categories?.includes(category as DataSourceCategory)) 
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Reliability Filter */}
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
                  onChange={(e) => handleFilterChange({ minReliability: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-1"
                />
              </div>
              
              {/* Freshness Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Freshness</label>
                <div className="flex flex-wrap gap-1">
                  {[
                    { label: 'Any', value: undefined },
                    { label: 'Last week', value: 7 },
                    { label: 'Last month', value: 30 },
                    { label: 'Last quarter', value: 90 },
                    { label: 'Last year', value: 365 }
                  ].map(option => (
                    <button
                      key={option.label}
                      onClick={() => handleFilterChange({ maxAge: option.value })}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        filter.maxAge === option.value
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Selection Controls */}
          {isSelectMode && selectedSources.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-600">
                  {selectedSources.length} {selectedSources.length === 1 ? 'source' : 'sources'} selected
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  Export Selected ({selectedSources.length})
                </button>
                <button className="px-3 py-1.5 text-sm text-white bg-red-600 rounded-md hover:bg-red-700">
                  Remove from View
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Results Summary */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            Showing {filteredSources.length} of {dataSources.length} data sources
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={`${sortField}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortField(field as SortField);
                setSortOrder(order as SortOrder);
              }}
              className="border border-gray-300 rounded-md text-sm px-2 py-1"
            >
              <option value="reliability-desc">Highest Reliability</option>
              <option value="reliability-asc">Lowest Reliability</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="lastUpdated-desc">Recently Updated</option>
              <option value="lastUpdated-asc">Oldest Updated</option>
              <option value="type-asc">Type (A-Z)</option>
            </select>
            
            {isSelectMode && (
              <button 
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {selectedSources.length === filteredSources.length ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-lg text-gray-700">Loading data sources...</span>
          </div>
        )}
        
        {/* No Results */}
        {!loading && filteredSources.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <XCircle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No data sources found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter settings.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilter({});
              }}
              className="px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50"
            >
              Clear all filters
            </button>
          </div>
        )}
        
        {/* Data Sources Grid View */}
        {!loading && filteredSources.length > 0 && viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSources.map(source => (
              <div 
                key={source.id} 
                className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${
                  isSelectMode && selectedSources.includes(source.id) ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => isSelectMode && toggleSourceSelection(source.id)}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{source.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {source.type.charAt(0).toUpperCase() + source.type.slice(1)}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getSourceStatusColor(source)}`}>
                          {getSourceStatusLabel(source)}
                        </span>
                      </div>
                    </div>
                    {isSelectMode && (
                      <div className={`h-5 w-5 rounded-full border ${
                        selectedSources.includes(source.id) 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'border-gray-300'
                      } flex items-center justify-center`}>
                        {selectedSources.includes(source.id) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {source.description}
                  </p>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <BarChart4 className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                      <span className="text-xs text-gray-600">
                        {source.reliability}% Reliable
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                      <span className="text-xs text-gray-600">
                        {formatLastUpdated(source.lastUpdated)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {source.category.charAt(0).toUpperCase() + source.category.slice(1)}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-500 hover:text-gray-700">
                      <Link className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-500 hover:text-gray-700">
                      <Download className="h-4 w-4" />
                    </button>
                    {source.url && (
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1 text-gray-500 hover:text-gray-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Data Sources List View */}
        {!loading && filteredSources.length > 0 && viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {isSelectMode && (
                    <th className="px-4 py-3 w-12">
                      <input 
                        type="checkbox" 
                        checked={selectedSources.length === filteredSources.length && filteredSources.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                      />
                    </th>
                  )}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reliability
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSources.map(source => (
                  <tr 
                    key={source.id} 
                    className={`hover:bg-gray-50 ${
                      isSelectMode && selectedSources.includes(source.id) ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => isSelectMode && toggleSourceSelection(source.id)}
                  >
                    {isSelectMode && (
                      <td className="px-4 py-3 w-12">
                        <input 
                          type="checkbox" 
                          checked={selectedSources.includes(source.id)}
                          onChange={() => toggleSourceSelection(source.id)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-800">{source.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{source.description}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {source.type.charAt(0).toUpperCase() + source.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              source.reliability >= 85 ? 'bg-green-500' :
                              source.reliability >= 70 ? 'bg-blue-500' :
                              source.reliability >= 50 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${source.reliability}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs text-gray-600">{source.reliability}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {formatLastUpdated(source.lastUpdated)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getSourceStatusColor(source)}`}>
                        {getSourceStatusLabel(source)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-1 text-gray-500 hover:text-gray-700">
                          <Link className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-gray-700">
                          <Download className="h-4 w-4" />
                        </button>
                        {source.url && (
                          <a 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-1 text-gray-500 hover:text-gray-700"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Add New Data Source Button */}
        <div className="fixed bottom-6 right-6">
          <button className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center">
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
