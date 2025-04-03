"use client";

import React, { useState } from 'react';
import {
  Search, ChevronLeft, Info, AlertTriangle, UploadCloud,
  Database, Link, CircleDot, CheckCircle2, XCircle, MoreHorizontal, Eye, Edit3, Trash2,
  Plus, RefreshCw, FileText, Clock, Settings, ArrowRight, ChevronDown
} from 'lucide-react';
import DataImportModal, { ImportConfig } from '@/components/DataImportModal';

// Import mock data
const mockUserDataSources = [
  { 
    id: 'uds1', 
    name: 'Project Alpha - Risk Matrix.xlsx', 
    type: 'Upload', 
    status: 'Connected', 
    lastUpdated: 'Apr 1, 2025', 
    size: '1.2MB' 
  },
  { 
    id: 'uds2', 
    name: 'Regional Sales DB (Postgres)', 
    type: 'Database', 
    status: 'Connected', 
    lastUpdated: 'Apr 2, 2025 (Live)', 
    size: '15GB' 
  },
  { 
    id: 'uds3', 
    name: 'Competitor Activity Feed (API)', 
    type: 'API', 
    status: 'Error', 
    lastUpdated: 'Mar 30, 2025', 
    size: 'N/A' 
  },
  { 
    id: 'uds4', 
    name: 'Historical Incident Reports (CSV)', 
    type: 'Upload', 
    status: 'Processing', 
    lastUpdated: 'Apr 2, 2025', 
    size: '55MB' 
  },
];

export default function DataManagementPage() {
  const [dataSources, setDataSources] = useState(mockUserDataSources);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [filterType, setFilterType] = useState('');

  // Filter data sources based on search query and filter
  const filteredDataSources = dataSources.filter(source => {
    const matchesSearch = searchQuery === '' || 
      source.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === '' || source.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleImportComplete = (importConfig: ImportConfig) => {
    console.log('Import completed:', importConfig);
    // Add the new data source to the list
    const newDataSource = {
      id: `uds${dataSources.length + 1}`,
      name: importConfig.name || 'Untitled Data Source',
      type: importConfig.sourceType === 'file' ? 'Upload' : 
            importConfig.sourceType === 'database' ? 'Database' : 'API',
      status: 'Processing',
      lastUpdated: 'Just now',
      size: importConfig.sourceType === 'file' ? 
        `${(importConfig.connectionDetails.fileSize / (1024 * 1024)).toFixed(2)}MB` : 'N/A',
    };
    
    setDataSources([newDataSource, ...dataSources]);
  };

  const handleDeleteDataSource = (id: string) => {
    setDataSources(dataSources.filter(source => source.id !== id));
  };

  const getStatusIcon = (status: string) => { 
    switch (status) { 
      case 'Connected': 
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'Processing': 
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'Error': 
        return <XCircle className="h-4 w-4 text-red-500" />;
      default: 
        return <CircleDot className="h-4 w-4 text-gray-400" />; 
    } 
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-inter">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Data Management</h1>
          <p className="text-gray-600">Connect, import, and manage your data sources</p>
        </div>
        <button 
          onClick={() => window.history.back()} 
          className="text-sm text-teal-600 hover:text-teal-700 flex items-center font-medium"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </button>
      </div>

      {/* Search and Controls */}
      <div className="mb-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <input 
            type="text"
            placeholder="Search data sources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex space-x-2">
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">All Types</option>
              <option value="Upload">File Uploads</option>
              <option value="Database">Databases</option>
              <option value="API">APIs</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="bg-teal-600 text-white rounded-lg py-2 px-4 flex items-center hover:bg-teal-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Import Data
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="font-semibold text-gray-800">My Data Sources</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-teal-100 text-teal-700' : 'text-gray-500'}`}
            >
              <FileText className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-teal-100 text-teal-700' : 'text-gray-500'}`}
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4 font-medium">Name</th>
                  <th className="py-3 px-4 font-medium">Type</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Last Updated</th>
                  <th className="py-3 px-4 font-medium">Size</th>
                  <th className="py-3 px-4 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDataSources.length > 0 ? (
                  filteredDataSources.map(source => (
                    <tr key={source.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-800">{source.name}</td>
                      <td className="py-3 px-4 text-gray-600">{source.type}</td>
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-1.5">
                          {getStatusIcon(source.status)} {source.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{source.lastUpdated}</td>
                      <td className="py-3 px-4 text-gray-600">{source.size}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button className="p-1 text-gray-400 hover:text-teal-600 rounded-full hover:bg-gray-100">
                            <Eye className="h-4 w-4"/>
                          </button>
                          <button className="p-1 text-gray-400 hover:text-teal-600 rounded-full hover:bg-gray-100">
                            <Edit3 className="h-4 w-4"/>
                          </button>
                          <button 
                            className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
                            onClick={() => handleDeleteDataSource(source.id)}
                          >
                            <Trash2 className="h-4 w-4"/>
                          </button>
                          <button className="p-1 text-gray-400 hover:text-teal-600 rounded-full hover:bg-gray-100">
                            <MoreHorizontal className="h-4 w-4"/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      {searchQuery ? 'No data sources match your search' : 'No data sources found'} <br />
                      <button 
                        onClick={() => setIsImportModalOpen(true)}
                        className="mt-2 text-teal-600 hover:text-teal-700 font-medium"
                      >
                        Import your first data source
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDataSources.length > 0 ? (
              filteredDataSources.map(source => (
                <div key={source.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      {source.type === 'Upload' ? (
                        <UploadCloud className="h-6 w-6 text-blue-500 mr-2" />
                      ) : source.type === 'Database' ? (
                        <Database className="h-6 w-6 text-purple-500 mr-2" />
                      ) : (
                        <Link className="h-6 w-6 text-green-500 mr-2" />
                      )}
                      <h3 className="font-medium text-gray-800 truncate max-w-[180px]">{source.name}</h3>
                    </div>
                    <div className="flex">
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className="flex items-center gap-1.5">
                        {getStatusIcon(source.status)} {source.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Updated:</span>
                      <span className="text-gray-700">{source.lastUpdated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Size:</span>
                      <span className="text-gray-700">{source.size}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
                    <button className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center">
                      <Eye className="h-3.5 w-3.5 mr-1" /> View
                    </button>
                    <button className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center">
                      <Edit3 className="h-3.5 w-3.5 mr-1" /> Edit
                    </button>
                    <button 
                      className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center"
                      onClick={() => handleDeleteDataSource(source.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-gray-500">
                {searchQuery ? 'No data sources match your search' : 'No data sources found'} <br />
                <button 
                  onClick={() => setIsImportModalOpen(true)}
                  className="mt-2 text-teal-600 hover:text-teal-700 font-medium"
                >
                  Import your first data source
                </button>
              </div>
            )}
            
            {/* Add new data source card */}
            <div 
              className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-center hover:border-teal-500 hover:bg-teal-50 transition-colors cursor-pointer min-h-[200px]"
              onClick={() => setIsImportModalOpen(true)}
            >
              <Plus className="h-10 w-10 text-teal-500 mb-2" />
              <h3 className="font-medium text-gray-800 mb-1">Add New Data Source</h3>
              <p className="text-sm text-gray-500">Import files, connect databases, or link APIs</p>
            </div>
          </div>
        )}
      </div>

      {/* Data Management Features Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-3">
            <RefreshCw className="h-6 w-6 text-teal-600 mr-2" />
            <h3 className="font-semibold text-gray-800">Auto-Refresh</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Schedule automatic updates for your data sources to ensure your analyses are based on the latest information.
          </p>
          <button className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center">
            Configure Schedules <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-3">
            <Link className="h-6 w-6 text-teal-600 mr-2" />
            <h3 className="font-semibold text-gray-800">Data Integration</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Define how your data integrates with Savannah Intelligence's core datasets for comprehensive analysis.
          </p>
          <button className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center">
            Manage Integration Rules <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-3">
            <Settings className="h-6 w-6 text-teal-600 mr-2" />
            <h3 className="font-semibold text-gray-800">Data Transformations</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Apply cleaning, normalization, and enrichment rules to ensure your data meets quality standards.
          </p>
          <button className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center">
            Configure Transformations <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>

      {/* Data Insights Section */}
      <div className="mt-8 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Data Insights</h3>
          <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">View All</button>
        </div>
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
            <div className="flex items-center text-blue-800">
              <Info className="h-5 w-5 mr-2 text-blue-600" />
              <p className="font-medium">Database Connection Health</p>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              Your PostgreSQL connection has been stable for 30 days without interruptions.
            </p>
          </div>
          <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-md">
            <div className="flex items-center text-yellow-800">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
              <p className="font-medium">Potential Data Quality Issue</p>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              &quot;Historical Incident Reports&quot; contains 23 missing date values that may affect time-based analysis.
            </p>
          </div>
          <div className="p-3 bg-green-50 border border-green-100 rounded-md">
            <div className="flex items-center text-green-800">
              <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
              <p className="font-medium">Data Recommendation</p>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Combining your &quot;Project Alpha&quot; data with our security incidents dataset could enhance risk assessment.
            </p>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      <DataImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onImportComplete={handleImportComplete} 
      />
    </div>
  );
}

const LayoutGrid = ({ className }: { className?: string }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
};