'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardHeader from '@/components/DashboardHeader';
import { 
  Search, Filter, Download, Share2, Plus, Trash2, 
  ChevronDown, Star, StarOff, MoreHorizontal, Check, 
  ListFilter, SlidersHorizontal, X
} from 'lucide-react';

// Add interfaces
interface Report {
  id: string;
  title: string;
  type: string;
  region: string;
  country: string;
  date: string;
  author: string;
  topics: string[];
  confidence: 'High' | 'Medium' | 'Low';
  status: 'Published' | 'Draft' | 'In Review';
  starred: boolean;
  summary: string;
}

interface Filters {
  types: string[];
  regions: string[];
  topics: string[];
  dateRange: {
    start: string;
    end: string;
  };
  confidence: string[];
  status: string[];
}

// Mock data for report topics and entities
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

// Mock reports data
const mockReports: Report[] = [
  {
    id: 'report-001',
    title: 'Kenya Economic Outlook Q1 2025',
    type: 'economic',
    region: 'East Africa',
    country: 'Kenya',
    date: 'Apr 1, 2025',
    author: 'Analysis Team',
    topics: ['Economic Development', 'Foreign Investment'],
    confidence: 'High',
    status: 'Published',
    starred: true,
    summary: 'Comprehensive analysis of Kenyan economic trends for Q1 2025, including GDP growth projections, inflation analysis, and foreign investment outlook.'
  },
  {
    id: 'report-002',
    title: 'Ethiopia Infrastructure Development',
    type: 'comprehensive',
    region: 'East Africa',
    country: 'Ethiopia',
    date: 'Mar 28, 2025',
    author: 'Infrastructure Team',
    topics: ['Infrastructure Projects', 'Economic Development'],
    confidence: 'Medium',
    status: 'Published',
    starred: false,
    summary: 'Detailed assessment of ongoing and planned infrastructure projects across Ethiopia, with focus on transportation networks and energy sector developments.'
  },
  {
    id: 'report-003',
    title: 'Lagos Security Situation',
    type: 'security',
    region: 'West Africa',
    country: 'Nigeria',
    date: 'Mar 25, 2025',
    author: 'Security Analysis Team',
    topics: ['Security Threats', 'Political Stability'],
    confidence: 'Medium',
    status: 'Published',
    starred: false,
    summary: 'Analysis of security conditions in Lagos metropolitan area, including threat assessment, stability factors, and recommendations for risk mitigation.'
  },
  {
    id: 'report-004',
    title: 'Egypt-Saudi Relations Outlook',
    type: 'comprehensive',
    region: 'North Africa',
    country: 'Egypt',
    date: 'Mar 22, 2025',
    author: 'Political Analysis Team',
    topics: ['Political Stability', 'Foreign Investment'],
    confidence: 'High',
    status: 'Published',
    starred: true,
    summary: 'Strategic assessment of Egypt-Saudi relations and implications for regional stability, economic collaboration, and geopolitical dynamics.'
  },
  {
    id: 'report-005',
    title: 'Safaricom PLC Entity Profile',
    type: 'entity',
    region: 'East Africa',
    country: 'Kenya',
    date: 'Mar 20, 2025',
    author: 'Corporate Intelligence Team',
    topics: ['Technology Adoption', 'Economic Development'],
    confidence: 'High',
    status: 'Published',
    starred: false,
    summary: 'Comprehensive profile of Safaricom PLC, including leadership analysis, financial position, market strategy, and regional expansion outlook.'
  },
  {
    id: 'report-006',
    title: 'East Africa Smart Cities Initiative',
    type: 'comprehensive',
    region: 'East Africa',
    country: '',
    date: 'Mar 15, 2025',
    author: 'Regional Analysis Team',
    topics: ['Infrastructure Projects', 'Technology Adoption'],
    confidence: 'Medium',
    status: 'Draft',
    starred: true,
    summary: 'Review of smart city initiatives across major East African urban centers, technological implementation challenges, and investment opportunities.'
  },
  {
    id: 'report-007',
    title: 'Emerging Leaders: Kenya Political Landscape',
    type: 'entity',
    region: 'East Africa',
    country: 'Kenya',
    date: 'Mar 20, 2025',
    author: 'Political Analysis Team',
    topics: ['Political Stability', 'Governance Issues'],
    confidence: 'Medium',
    status: 'Draft',
    starred: false,
    summary: 'Profiles of emerging political leaders in Kenya with analysis of their networks, policy positions, and potential impact on stability and governance.'
  }
];

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<Filters>({
    types: [],
    regions: [],
    topics: [],
    dateRange: {
      start: '',
      end: ''
    },
    confidence: [],
    status: []
  });
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = searchQuery === '' || 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      report.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTypes = filters.types.length === 0 || filters.types.includes(report.type);
    const matchesRegions = filters.regions.length === 0 || filters.regions.includes(report.region);
    const matchesTopics = filters.topics.length === 0 || 
      report.topics.some(topic => filters.topics.includes(topic));
    const matchesConfidence = filters.confidence.length === 0 || 
      filters.confidence.includes(report.confidence);
    const matchesStatus = filters.status.length === 0 || 
      filters.status.includes(report.status);
    
    // Date range filtering logic would go here
    
    return matchesSearch && matchesTypes && matchesRegions && 
      matchesTopics && matchesConfidence && matchesStatus;
  }).sort((a, b) => {
    if (sortField === 'date') {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortDirection === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    } else if (sortField === 'title') {
      return sortDirection === 'asc' 
        ? a.title.localeCompare(b.title) 
        : b.title.localeCompare(a.title);
    } else if (sortField === 'confidence') {
      const confidenceOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      return sortDirection === 'asc' 
        ? confidenceOrder[a.confidence] - confidenceOrder[b.confidence] 
        : confidenceOrder[b.confidence] - confidenceOrder[a.confidence];
    }
    return 0;
  });

  const handleToggleFilter = (filterType: keyof Filters, value: string) => {
    setFilters(prev => {
      // Handle dateRange separately
      if (filterType === 'dateRange') {
        return prev; // For now, we don't handle dateRange in this function
      }
      
      const currentFilters = [...prev[filterType] as string[]];
      const valueIndex = currentFilters.indexOf(value);
      
      if (valueIndex === -1) {
        currentFilters.push(value);
      } else {
        currentFilters.splice(valueIndex, 1);
      }
      
      return {
        ...prev,
        [filterType]: currentFilters
      };
    });
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleSelectReport = (reportId: string) => {
    setSelectedReports(prev => {
      if (prev.includes(reportId)) {
        return prev.filter(id => id !== reportId);
      } else {
        return [...prev, reportId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedReports.length === filteredReports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(filteredReports.map(report => report.id));
    }
  };

  const handleToggleStar = (reportId: string) => {
    setReports(prev => 
      prev.map(report => 
        report.id === reportId 
          ? { ...report, starred: !report.starred } 
          : report
      )
    );
  };

  const handleDeleteReports = () => {
    setReports(prev => prev.filter(report => !selectedReports.includes(report.id)));
    setSelectedReports([]);
  };

  const getConfidenceBadgeColor = (confidence: Report['confidence']) => {
    switch (confidence) {
      case 'High':
        return 'text-green-700 bg-green-100';
      case 'Medium':
        return 'text-yellow-700 bg-yellow-100';
      case 'Low':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusBadgeColor = (status: Report['status']) => {
    switch (status) {
      case 'Published':
        return 'text-blue-700 bg-blue-100';
      case 'Draft':
        return 'text-gray-700 bg-gray-100';
      case 'In Review':
        return 'text-yellow-700 bg-yellow-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="p-6">
      <DashboardHeader
        title="Intelligence Reports"
        description="Browse, manage, and create detailed intelligence reports"
        showInfoTip
        infoTipContent="Browse, filter, and manage all intelligence reports. Create new reports or update existing ones."
      >
        <div className="flex space-x-2">
          <Link 
            href="/dashboard/report/new" 
            className="flex items-center bg-blue-600 text-white rounded-md py-2 px-3 text-sm hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Create New Report
          </Link>
        </div>
      </DashboardHeader>

      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
          {selectedReports.length === 0 && (
            <>
              <div className="relative flex-grow max-w-md">
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-3 py-2 rounded-md border text-sm font-medium flex items-center ${
                    showFilters || Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : false) 
                      ? 'bg-teal-50 text-teal-700 border-teal-200' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <ListFilter className="h-4 w-4 mr-1.5" />
                  Filters
                  {Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : false) && (
                    <span className="ml-1.5 px-1.5 py-0.5 bg-teal-600 text-white text-xs rounded-full">
                      {Object.values(filters).reduce((count, filter) => 
                        count + (Array.isArray(filter) ? filter.length : 0), 0
                      )}
                    </span>
                  )}
                </button>
                <div className="relative">
                  <button 
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-1.5" />
                    Sort by
                    <ChevronDown className="h-4 w-4 ml-1.5" />
                  </button>
                </div>
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <button 
                    className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'bg-white'}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid view"
                  >
                    <div className="grid grid-cols-2 gap-1">
                      <div className="h-1.5 w-1.5 bg-gray-500 rounded-sm"></div>
                      <div className="h-1.5 w-1.5 bg-gray-500 rounded-sm"></div>
                      <div className="h-1.5 w-1.5 bg-gray-500 rounded-sm"></div>
                      <div className="h-1.5 w-1.5 bg-gray-500 rounded-sm"></div>
                    </div>
                  </button>
                  <button 
                    className={`px-3 py-2 ${viewMode === 'list' ? 'bg-gray-100' : 'bg-white'}`}
                    onClick={() => setViewMode('list')}
                    title="List view"
                  >
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="h-0.5 w-4 bg-gray-500 rounded-sm"></div>
                      <div className="h-0.5 w-4 bg-gray-500 rounded-sm"></div>
                      <div className="h-0.5 w-4 bg-gray-500 rounded-sm"></div>
                    </div>
                  </button>
                  <button 
                    className={`px-3 py-2 ${viewMode === 'table' ? 'bg-gray-100' : 'bg-white'}`}
                    onClick={() => setViewMode('table')}
                    title="Table view"
                  >
                    <div className="grid grid-cols-3 gap-1">
                      <div className="h-0.5 w-1 bg-gray-500 rounded-sm"></div>
                      <div className="h-0.5 w-1 bg-gray-500 rounded-sm"></div>
                      <div className="h-0.5 w-1 bg-gray-500 rounded-sm"></div>
                      <div className="h-0.5 w-1 bg-gray-500 rounded-sm"></div>
                      <div className="h-0.5 w-1 bg-gray-500 rounded-sm"></div>
                      <div className="h-0.5 w-1 bg-gray-500 rounded-sm"></div>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}
          
          {selectedReports.length > 0 && (
            <>
              <div className="text-sm text-gray-600">
                {selectedReports.length} selected
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleDeleteReports}
                  className="px-3 py-2 border border-gray-300 bg-white rounded-md text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-200 flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Delete
                </button>
                <button 
                  className="px-3 py-2 border border-gray-300 bg-white rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Download className="h-4 w-4 mr-1.5" />
                  Export
                </button>
                <button 
                  className="px-3 py-2 border border-gray-300 bg-white rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Share2 className="h-4 w-4 mr-1.5" />
                  Share
                </button>
                <button 
                  onClick={() => setSelectedReports([])}
                  className="px-3 py-2 border border-gray-300 bg-white rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>

        {showFilters && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-700">Filter Reports</h3>
              <button 
                onClick={() => setFilters({
                  types: [],
                  regions: [],
                  topics: [],
                  dateRange: {
                    start: '',
                    end: ''
                  },
                  confidence: [],
                  status: []
                })}
                className="text-sm text-teal-600 hover:text-teal-700"
              >
                Reset All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Report Type</h4>
                <div className="space-y-1">
                  {reportTypes.map(type => (
                    <label key={type.id} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.types.includes(type.id)}
                        onChange={() => handleToggleFilter('types', type.id)}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 h-4 w-4 mr-2"
                      />
                      <span className="text-sm text-gray-700">{type.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Region</h4>
                <div className="space-y-1">
                  {regions.filter(r => r !== 'All Regions').map(region => (
                    <label key={region} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.regions.includes(region)}
                        onChange={() => handleToggleFilter('regions', region)}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 h-4 w-4 mr-2"
                      />
                      <span className="text-sm text-gray-700">{region}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Status & Confidence</h4>
                <div className="mb-3 space-y-1">
                  {['Draft', 'In Review', 'Published'].map(status => (
                    <label key={status} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.status.includes(status)}
                        onChange={() => handleToggleFilter('status', status)}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 h-4 w-4 mr-2"
                      />
                      <span className="text-sm text-gray-700">{status}</span>
                    </label>
                  ))}
                </div>
                <div className="space-y-1">
                  {['High', 'Medium', 'Low'].map(confidence => (
                    <label key={confidence} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.confidence.includes(confidence)}
                        onChange={() => handleToggleFilter('confidence', confidence)}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 h-4 w-4 mr-2"
                      />
                      <span className="text-sm text-gray-700">{confidence} Confidence</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredReports.map(report => (
              <div key={report.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <Link 
                      href={`/dashboard/report/${report.id}`}
                      className="hover:text-blue-600"
                    >
                      <h3 className="font-medium text-lg text-gray-900 line-clamp-2">{report.title}</h3>
                    </Link>
                    <button 
                      onClick={() => handleToggleStar(report.id)}
                      title={report.starred ? "Unstar" : "Star"}
                      className={`p-1 rounded-full ${report.starred ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      {report.starred ? <Star className="h-5 w-5" /> : <StarOff className="h-5 w-5" />}
                    </button>
                  </div>
                  <div className="mt-2 text-sm text-gray-600 line-clamp-3">
                    {report.summary}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1">
                    {report.topics.slice(0, 2).map(topic => (
                      <span 
                        key={topic}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {topic}
                      </span>
                    ))}
                    {report.topics.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                        +{report.topics.length - 2}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                    <span>{report.author}</span>
                    <span>{report.date}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceBadgeColor(report.confidence)}`}>
                        {report.confidence}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox"
                        checked={selectedReports.includes(report.id)}
                        onChange={() => handleSelectReport(report.id)}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'list' && (
          <div className="divide-y divide-gray-200">
            {filteredReports.map(report => (
              <div 
                key={report.id} 
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start">
                  <div className="mr-3 pt-1">
                    <input 
                      type="checkbox"
                      checked={selectedReports.includes(report.id)}
                      onChange={() => handleSelectReport(report.id)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link 
                          href={`/dashboard/report/${report.id}`}
                          className="font-medium text-gray-900 hover:text-blue-600"
                        >
                          {report.title}
                        </Link>
                        <div className="flex items-center mt-1 space-x-3 text-xs text-gray-500">
                          <span>{report.region}{report.country && ` • ${report.country}`}</span>
                          <span>•</span>
                          <span>{report.date}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleToggleStar(report.id)}
                        title={report.starred ? "Unstar" : "Star"}
                        className={`p-1 rounded-full ${report.starred ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        {report.starred ? <Star className="h-5 w-5" /> : <StarOff className="h-5 w-5" />}
                      </button>
                    </div>
                    <div className="mt-1.5 line-clamp-2 text-sm text-gray-600">
                      {report.summary}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 items-center">
                      <div className="flex gap-2">
                        <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getConfidenceBadgeColor(report.confidence)}`}>
                          {report.confidence}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                      <span className="text-gray-300 text-xs">•</span>
                      <div className="flex flex-wrap gap-1">
                        {report.topics.slice(0, 2).map(topic => (
                          <span 
                            key={topic}
                            className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs"
                          >
                            {topic}
                          </span>
                        ))}
                        {report.topics.length > 2 && (
                          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">
                            +{report.topics.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'table' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="pl-4 py-3">
                    <input 
                      type="checkbox"
                      checked={selectedReports.length > 0 && selectedReports.length === filteredReports.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
                    />
                  </th>
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center">
                      <span>Title</span>
                      {sortField === 'title' && (
                        <ChevronDown className={`h-4 w-4 ml-1 transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region/Country
                  </th>
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">
                      <span>Date</span>
                      {sortField === 'date' && (
                        <ChevronDown className={`h-4 w-4 ml-1 transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('confidence')}
                  >
                    <div className="flex items-center">
                      <span>Confidence</span>
                      {sortField === 'confidence' && (
                        <ChevronDown className={`h-4 w-4 ml-1 transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map(report => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="pl-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input 
                          type="checkbox"
                          checked={selectedReports.includes(report.id)}
                          onChange={() => handleSelectReport(report.id)}
                          className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
                        />
                        <button 
                          onClick={() => handleToggleStar(report.id)}
                          title={report.starred ? "Unstar" : "Star"}
                          className={`ml-2 ${report.starred ? 'text-yellow-500' : 'text-gray-300 hover:text-gray-400'}`}
                        >
                          {report.starred ? <Star className="h-4 w-4" /> : <StarOff className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <Link 
                          href={`/dashboard/report/${report.id}`}
                          className="font-medium text-gray-900 hover:text-blue-600"
                        >
                          {report.title}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span>{report.region}</span>
                      {report.country && (
                        <span className="text-gray-500 text-sm"> • {report.country}</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span>{report.date}</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceBadgeColor(report.confidence)}`}>
                        {report.confidence}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                      <button className="text-gray-400 hover:text-gray-500">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredReports.length === 0 && (
          <div className="py-12 px-4 text-center">
            <div className="text-gray-400 mb-3">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No reports found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? `No results found for "${searchQuery}"` : 'No reports match your filter criteria'}
            </p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear search
              </button>
            )}
            {Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : false) && (
              <button 
                onClick={() => setFilters({
                  types: [],
                  regions: [],
                  topics: [],
                  dateRange: {
                    start: '',
                    end: ''
                  },
                  confidence: [],
                  status: []
                })}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 ml-2"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {filteredReports.length > 0 && (
          <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 sm:px-6 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-700">
              Showing <span className="font-medium">{filteredReports.length}</span> results
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-3">
                Reports per page: <span className="font-medium">10</span>
              </span>
              <nav className="flex items-center space-x-1">
                <button className="p-2 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  <ChevronDown className="h-5 w-5 transform rotate-90" />
                </button>
                <span className="text-sm text-gray-700">
                  Page <span className="font-medium">1</span> of <span className="font-medium">1</span>
                </span>
                <button className="p-2 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  <ChevronDown className="h-5 w-5 transform -rotate-90" />
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}