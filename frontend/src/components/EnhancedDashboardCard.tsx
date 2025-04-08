import React, { useState, useEffect, useRef } from 'react';
import { 
  MoreVertical, RefreshCw, Maximize2, Minimize2, Star, 
  StarOff, Info, ChevronDown, ChevronUp, ExternalLink,
  Download, Database, AlertCircle, Clock, Calendar,
  Zap, Check, AlertTriangle, ArrowUp, ArrowDown, ArrowRight,
  FileText, Share2, BarChart2, HelpCircle, Shield
} from 'lucide-react';
import { DataSource } from '@/types/dataSource';

interface Trend {
  direction: 'up' | 'down' | 'stable';
  value: string;
  label: string;
  percentChange?: number;
  comparedTo?: string;
}

interface Insight {
  text: string;
  priority: 'low' | 'medium' | 'high';
  actionText?: string;
  onAction?: () => void;
}

interface Benchmark {
  label: string;
  value: string;
  description?: string;
}

interface RawDataInfo {
  available: boolean;
  recordCount?: number;
  downloadUrl?: string;
  sampleData?: Record<string, any>;
}

interface EnhancedDashboardCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  lastUpdated?: Date;
  status?: 'normal' | 'warning' | 'critical' | 'success';
  trend?: Trend;
  isLoading?: boolean;
  refreshInterval?: number; // in seconds
  onRefresh?: () => void;
  isCollapsible?: boolean;
  onCollapseChange?: (isCollapsed: boolean) => void;
  infoTooltip?: string;
  actions?: React.ReactNode;
  allowFavorite?: boolean;
  onFullScreenToggle?: () => void;
  className?: string;
  insights?: Insight[];
  dataSources?: DataSource[];
  dataFreshnessCritical?: boolean;
  rawData?: RawDataInfo;
  metricDescription?: string;
  benchmarks?: Benchmark[];
  isRealTime?: boolean;
  shareableLink?: string;
  alertThreshold?: number;
  showDataSourceInfo?: boolean;
}

export default function EnhancedDashboardCard({
  title,
  icon,
  children,
  lastUpdated,
  status = 'normal',
  trend,
  isLoading = false,
  refreshInterval,
  onRefresh,
  isCollapsible = false,
  onCollapseChange,
  infoTooltip,
  actions,
  allowFavorite = false,
  onFullScreenToggle,
  className = '',
  insights = [],
  dataSources = [],
  dataFreshnessCritical = false,
  rawData,
  metricDescription,
  benchmarks = [],
  isRealTime = false,
  shareableLink,
  alertThreshold,
  showDataSourceInfo = false
}: EnhancedDashboardCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [refreshCountdown, setRefreshCountdown] = useState(refreshInterval || 0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showMetricInfo, setShowMetricInfo] = useState(false);
  const [showDataSourcesInfo, setShowDataSourcesInfo] = useState(false);
  const [showBenchmarks, setShowBenchmarks] = useState(false);
  
  const actionsRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  // Calculate data freshness
  const calculateFreshness = () => {
    if (!lastUpdated) return { label: 'Unknown', class: 'text-gray-400' };
    
    const now = new Date();
    const diffMs = now.getTime() - lastUpdated.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) {
      return { label: 'Just now', class: 'text-green-600' };
    } else if (diffMins < 60) {
      return { label: `${diffMins}m ago`, class: 'text-green-600' };
    } else if (diffHours < 6) {
      return { label: `${diffHours}h ago`, class: 'text-green-600' };
    } else if (diffHours < 24) {
      return { label: `${diffHours}h ago`, class: 'text-yellow-600' };
    } else if (diffDays < 3) {
      return { label: `${diffDays}d ago`, class: 'text-yellow-600' };
    } else if (diffDays < 7) {
      return { label: `${diffDays}d ago`, class: 'text-orange-600' };
    } else {
      return { label: `${diffDays}d ago`, class: 'text-red-600' };
    }
  };
  
  const freshness = calculateFreshness();
  
  // Handle auto-refresh
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (refreshInterval && !isLoading && !isCollapsed) {
      setRefreshCountdown(refreshInterval);
      
      interval = setInterval(() => {
        setRefreshCountdown(prev => {
          if (prev <= 1) {
            // Schedule the refresh callback to run after state update is complete
            setTimeout(() => {
              if (onRefresh) onRefresh();
            }, 0);
            
            // Reset the countdown
            return refreshInterval;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [refreshInterval, isLoading, onRefresh, isCollapsed]);
  
  // Handle clicking outside the actions menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setIsActionsOpen(false);
      }
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Format the trend change for display
  const formatTrendChange = () => {
    if (!trend?.percentChange) return null;
    
    return (
      <div className={`text-xs ${
        trend.direction === 'up' ? 'text-green-600' :
        trend.direction === 'down' ? 'text-red-600' :
        'text-gray-600'
      }`}>
        <span className="flex items-center">
          {trend.direction === 'up' && <ArrowUp className="h-3 w-3 mr-0.5" />}
          {trend.direction === 'down' && <ArrowDown className="h-3 w-3 mr-0.5" />}
          {trend.direction === 'stable' && <ArrowRight className="h-3 w-3 mr-0.5" />}
          {trend.percentChange > 0 ? '+' : ''}{trend.percentChange}%
          {trend.comparedTo && <span className="ml-1 text-gray-500">vs {trend.comparedTo}</span>}
        </span>
      </div>
    );
  };
  
  // Render the status indicator
  const renderStatusIndicator = () => {
    let statusIcon, statusClass;
    
    switch (status) {
      case 'warning':
        statusIcon = <AlertTriangle className="h-4 w-4" />;
        statusClass = 'text-yellow-500';
        break;
      case 'critical':
        statusIcon = <AlertCircle className="h-4 w-4" />;
        statusClass = 'text-red-500';
        break;
      case 'success':
        statusIcon = <Check className="h-4 w-4" />;
        statusClass = 'text-green-500';
        break;
      default:
        return null;
    }
    
    return (
      <div className={`mr-2 ${statusClass}`}>
        {statusIcon}
      </div>
    );
  };
  
  // Calculate data sources reliability
  const averageReliability = dataSources.length > 0
    ? Math.round(dataSources.reduce((sum, source) => sum + source.reliability, 0) / dataSources.length)
    : 0; // Default to 0 instead of null
    
  // Find oldest data source
  const oldestSource = dataSources.length > 0
    ? dataSources.reduce((oldest, current) => 
        oldest.lastUpdated.getTime() < current.lastUpdated.getTime() ? oldest : current
      )
    : null;
  
  // Render the data source info panel
  const renderDataSourcesInfo = () => {
    if (!showDataSourceInfo || dataSources.length === 0) return null;
    
    return (
      <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200 z-10 p-3">
        <div className="flex justify-between items-center mb-2 border-b pb-2 border-gray-100">
          <h3 className="font-medium text-gray-800 flex items-center">
            <Info className="h-4 w-4 mr-1.5 text-blue-600" />
            Data Sources
          </h3>
          <button 
            onClick={() => setShowDataSourcesInfo(false)}
            className="text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center"
          >
            ×
          </button>
        </div>
        
        <div className="text-xs text-gray-600 mb-3 bg-blue-50 p-2 rounded-md">
          This analysis is powered by {dataSources.length} data source{dataSources.length !== 1 ? 's' : ''} with 
          an average reliability of <span className="font-semibold">{averageReliability}%</span>.
        </div>
        
        <div className="space-y-2 max-h-60 overflow-y-auto mb-2">
          {dataSources.map(source => (
            <div key={source.id} className="border border-gray-200 rounded p-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-150">
              <div className="flex justify-between items-center">
                <span className="font-medium text-xs text-gray-700">{source.name}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  source.reliability >= 85 ? 'bg-green-100 text-green-800' :
                  source.reliability >= 70 ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {source.reliability}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{source.description}</p>
              {source.url && (
                <a 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center mt-1"
                >
                  Details <ExternalLink className="h-3 w-3 ml-0.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Render metric info tooltip
  const renderMetricInfo = () => {
    if (!showMetricInfo || !metricDescription) return null;
    
    return (
      <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200 z-10 p-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-gray-800 flex items-center">
            <HelpCircle className="h-4 w-4 mr-1.5 text-blue-600" />
            About this Metric
          </h3>
          <button 
            onClick={() => setShowMetricInfo(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">
          {metricDescription}
        </p>
        
        {benchmarks.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Benchmark Comparisons:</h4>
            <div className="space-y-2">
              {benchmarks.map((benchmark, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{benchmark.label}:</span>
                  <span className="font-medium">{benchmark.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {alertThreshold !== undefined && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center">
            <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
            <span className="text-sm text-gray-600">
              Alert threshold: <span className="font-medium">{alertThreshold}</span>
            </span>
          </div>
        )}
      </div>
    );
  };
  
  // Helper for formatting relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    
    // Format date for older updates
    return date.toLocaleDateString();
  };
  
  // Render insights section
  const renderInsights = () => {
    if (insights.length === 0) return null;
    
    return (
      <div className="mt-3 pt-3 border-t border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Zap className="h-4 w-4 mr-1.5 text-blue-600" />
          Insights
        </h3>
        <div className="space-y-2">
          {insights.map((insight, index) => (
            <div 
              key={index} 
              className={`rounded-lg p-2 text-sm ${
                insight.priority === 'high' ? 'bg-red-50 border-l-4 border-red-500' :
                insight.priority === 'medium' ? 'bg-yellow-50 border-l-4 border-yellow-500' :
                'bg-blue-50 border-l-4 border-blue-500'
              }`}
            >
              <p className={`${
                insight.priority === 'high' ? 'text-red-800' :
                insight.priority === 'medium' ? 'text-yellow-800' :
                'text-blue-800'
              }`}>
                {insight.text}
              </p>
              {insight.actionText && (
                <button 
                  onClick={insight.onAction}
                  className={`mt-1.5 text-xs px-2 py-1 rounded ${
                    insight.priority === 'high' ? 'bg-red-200 text-red-800 hover:bg-red-300' :
                    insight.priority === 'medium' ? 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300' :
                    'bg-blue-200 text-blue-800 hover:bg-blue-300'
                  } inline-flex items-center`}
                >
                  {insight.actionText}
                  <ChevronRight className="h-3 w-3 ml-1" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Render share options
  const renderShareOptions = () => {
    if (!shareableLink) return null;
    
    return (
      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
        <div className="text-xs text-gray-500">Share this data:</div>
        <div className="flex gap-2">
          <button 
            className="text-gray-500 hover:text-gray-700 p-1"
            title="Copy link"
            onClick={() => {
              navigator.clipboard.writeText(shareableLink);
              // Show copied notification (would implement in a real app)
            }}
          >
            <LinkIcon className="h-4 w-4" />
          </button>
          <button 
            className="text-gray-500 hover:text-gray-700 p-1"
            title="Export as PDF"
          >
            <FileText className="h-4 w-4" />
          </button>
          <button 
            className="text-gray-500 hover:text-gray-700 p-1"
            title="Share visualization"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };
  
  // Add the data sources info button to the card header toolbar
  const renderToolbar = () => {
    return (
      <div className="flex items-center">
        {showDataSourceInfo && dataSources.length > 0 && (
          <button
            onClick={() => setShowDataSourcesInfo(!showDataSourcesInfo)}
            className="relative p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            title="Data Sources"
          >
            <Info className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  };
  
  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Card Header */}
      <div className="px-4 py-3 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center space-x-2">
          {renderStatusIndicator()}
          
          {icon && <div className="flex-shrink-0">{icon}</div>}
          
          <h2 className="font-medium text-gray-800">{title}</h2>
          
          {infoTooltip && (
            <div className="relative" ref={tooltipRef}>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowTooltip(!showTooltip)}
              >
                <Info className="h-4 w-4" />
              </button>
              
              {showTooltip && (
                <div className="absolute z-10 w-64 p-2 mt-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-md shadow-lg left-0">
                  {infoTooltip}
                </div>
              )}
            </div>
          )}
          
          {metricDescription && (
            <div className="relative">
              <button
                className="text-gray-400 hover:text-gray-600 ml-1"
                onClick={() => {
                  setShowMetricInfo(!showMetricInfo);
                  setShowDataSourcesInfo(false);
                }}
              >
                <HelpCircle className="h-4 w-4" />
              </button>
              {renderMetricInfo()}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {isRealTime && (
            <div className="flex items-center text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded">
              <span className="animate-pulse relative flex h-2 w-2 mr-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Live
            </div>
          )}
          
          {lastUpdated && (
            <div className="text-xs flex items-center" title={`Last updated: ${lastUpdated.toLocaleString()}`}>
              <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
              <span className={freshness.class}>
                {freshness.label}
              </span>
            </div>
          )}
          
          {/* Data source reliability indicator */}
          {dataSources.length > 0 && (
            <div className="relative">
              <button
                className={`flex items-center text-xs ${
                  averageReliability >= 85 ? 'text-green-600' :
                  averageReliability >= 70 ? 'text-yellow-600' :
                  'text-red-600'
                }`}
                onClick={() => {
                  setShowDataSourcesInfo(!showDataSourcesInfo);
                  setShowMetricInfo(false);
                }}
                title="View data sources"
              >
                <Database className="h-3.5 w-3.5 mr-1" />
                {averageReliability}%
              </button>
              {renderDataSourcesInfo()}
            </div>
          )}
          
          {refreshInterval && onRefresh && !isCollapsed && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className={`text-gray-400 hover:text-gray-600 ${isLoading ? 'animate-spin' : ''}`}
              title={`Auto-refreshes in ${refreshCountdown}s`}
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
          
          {allowFavorite && (
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={isFavorite ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-400 hover:text-gray-600'}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? <Star className="h-4 w-4" /> : <StarOff className="h-4 w-4" />}
            </button>
          )}
          
          {onFullScreenToggle && (
            <button
              onClick={() => {
                setIsFullScreen(!isFullScreen);
                if (onFullScreenToggle) onFullScreenToggle();
              }}
              className="text-gray-400 hover:text-gray-600"
              title={isFullScreen ? 'Exit fullscreen' : 'View in fullscreen'}
            >
              {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          )}
          
          {isCollapsible && (
            <button
              onClick={() => {
                const newCollapsedState = !isCollapsed;
                setIsCollapsed(newCollapsedState);
                if (onCollapseChange) onCollapseChange(newCollapsedState);
              }}
              className="text-gray-400 hover:text-gray-600"
              title={isCollapsed ? 'Expand' : 'Collapse'}
            >
              {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </button>
          )}
          
          {actions && (
            <div className="relative" ref={actionsRef}>
              <button
                onClick={() => setIsActionsOpen(!isActionsOpen)}
                className="text-gray-400 hover:text-gray-600"
                title="More options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              
              {isActionsOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
                  {actions}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Card Content */}
      {!isCollapsed && (
        <div className="p-4">
          {trend && (
            <div className="mb-4 flex items-baseline">
              <span className="text-2xl font-bold mr-2">{trend.value}</span>
              <span className="text-gray-500 text-sm mr-3">{trend.label}</span>
              {formatTrendChange()}
            </div>
          )}
          
          {children}
          
          {renderInsights()}
          
          {renderShareOptions()}
          
          {/* Data freshness warning */}
          {dataFreshnessCritical && oldestSource && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="text-xs text-gray-500 flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                Some data is {formatRelativeTime(oldestSource.lastUpdated)} 
                {oldestSource.lastUpdated.getTime() < Date.now() - 7 * 24 * 60 * 60 * 1000 && (
                  <span className="ml-1 text-yellow-600 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-0.5" />
                    Outdated
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Add X component if it's not imported from lucide-react
export const X = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"></path>
    <path d="m6 6 12 12"></path>
  </svg>
);

// Add ChevronRight component if it's not imported from lucide-react
export const ChevronRight = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

// Add LinkIcon component if it's not imported from lucide-react
export const LinkIcon = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
  </svg>
);