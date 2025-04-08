import React from 'react';
import { 
  Info, AlertCircle, BarChart4, Clock, Globe, 
  Calendar, ExternalLink, FileSpreadsheet, RefreshCw 
} from 'lucide-react';
import { DataSource } from '@/types/dataSource';
import { getDataSourcesByIds, calculateDataQualityScore } from '@/lib/utils/dataSources';

interface DataSourceInfoPanelProps {
  dataSourceIds: string[];
  onClose: () => void;
  className?: string;
}

export default function DataSourceInfoPanel({
  dataSourceIds,
  onClose,
  className = ''
}: DataSourceInfoPanelProps) {
  // Get data sources by their IDs
  const dataSources = getDataSourcesByIds(dataSourceIds);
  
  // Calculate quality scores
  const qualityScores = calculateDataQualityScore(dataSourceIds);
  
  if (dataSources.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-lg border border-gray-200 p-4 ${className}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Data Source Information</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>
        <div className="flex items-center justify-center py-8">
          <AlertCircle className="h-6 w-6 text-yellow-500 mr-2" />
          <p className="text-gray-600">No data sources available</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <Info className="h-5 w-5 mr-2 text-blue-600" />
            Data Source Information
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>
      </div>
      
      {/* Quality score summary */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Data Quality Assessment</h4>
        
        <div className="grid grid-cols-4 gap-3">
          <QualityScore 
            label="Overall Quality" 
            score={qualityScores.overallScore} 
            icon={BarChart4} 
          />
          <QualityScore 
            label="Reliability" 
            score={qualityScores.reliabilityScore} 
            icon={AlertCircle} 
          />
          <QualityScore 
            label="Coverage" 
            score={qualityScores.coverageScore} 
            icon={Globe} 
          />
          <QualityScore 
            label="Freshness" 
            score={qualityScores.freshnessScore} 
            icon={Clock} 
          />
        </div>
      </div>
      
      {/* Data sources list */}
      <div className="p-4 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          {dataSources.map(source => (
            <div key={source.id} className="border border-gray-200 rounded-md overflow-hidden">
              <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-gray-800">{source.name}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    source.reliability >= 85 ? 'bg-green-100 text-green-800' :
                    source.reliability >= 70 ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {source.reliability}% Reliable
                  </span>
                </div>
              </div>
              
              <div className="p-3">
                <p className="text-xs text-gray-600 mb-3">{source.description}</p>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                    <span>Updated: {formatLastUpdated(source.lastUpdated)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                    <span>Frequency: {formatUpdateFrequency(source.updateFrequency)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                    <span>Type: {formatType(source.type)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                    <span>Coverage: {formatTimespan(source.coverage.timespan)}</span>
                  </div>
                </div>
                
                {source.coverage.regions && source.coverage.regions.length > 0 && (
                  <div className="mt-2">
                    <h5 className="text-xs font-medium text-gray-700 mb-1">Regions Covered:</h5>
                    <div className="flex flex-wrap gap-1">
                      {source.coverage.regions.map(region => (
                        <span key={region} className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {source.url && (
                  <div className="mt-3 pt-2 border-t border-gray-100">
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      View source <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
        Data sources last verified: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
}

// Helper component for quality scores
interface QualityScoreProps {
  label: string;
  score: number;
  icon: React.ElementType;
}

function QualityScore({ label, score, icon: Icon }: QualityScoreProps) {
  const getColorClass = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  return (
    <div className="bg-white rounded border border-gray-200 p-2">
      <div className="flex items-center mb-1">
        <Icon className="h-3.5 w-3.5 mr-1 text-gray-500" />
        <span className="text-xs text-gray-600">{label}</span>
      </div>
      <div className="font-bold text-lg leading-none text-center mt-1">
        <span className={getColorClass(score)}>
          {Math.round(score)}%
        </span>
      </div>
    </div>
  );
}

// Helper functions
function formatLastUpdated(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatUpdateFrequency(frequency: string): string {
  switch (frequency) {
    case 'realtime': return 'Real-time';
    case 'daily': return 'Daily';
    case 'weekly': return 'Weekly';
    case 'monthly': return 'Monthly';
    case 'quarterly': return 'Quarterly';
    case 'annual': return 'Annually';
    case 'irregular': return 'Irregular';
    default: return frequency;
  }
}

function formatType(type: string): string {
  // Capitalize first letter
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function formatTimespan(timespan: { start: Date, end: Date | 'present' }): string {
  const startYear = timespan.start.getFullYear();
  const endYear = timespan.end === 'present' ? 'Present' : timespan.end.getFullYear();
  return `${startYear} - ${endYear}`;
}
