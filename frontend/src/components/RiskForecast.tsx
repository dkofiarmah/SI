import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, AlertCircle, Calendar, Zap, 
  Shield, Target, AlertTriangle, ArrowRight, 
  Filter, Info, Sliders, Lightbulb, RefreshCw
} from 'lucide-react';
import EnhancedDashboardCard from './EnhancedDashboardCard';

interface RiskAlert {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high';
  timeframe: string;
  category: string;
  description: string;
  source: string;
  impactAreas: string[];
  timestamp: Date;
  confidence: number;
}

interface RiskForecastProps {
  selectedRegion?: string;
  selectedCountry?: string;
  timeframe?: string;
}

export default function RiskForecast({ 
  selectedRegion = 'All Regions', 
  selectedCountry = '', 
  timeframe = '30'
}: RiskForecastProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState<string[]>([]);
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);
  const [anomalyDetected, setAnomalyDetected] = useState(false);

  // Function to generate a random alert
  const generateRandomAlert = useCallback((id: string, severity: 'low' | 'medium' | 'high'): RiskAlert => {
    const titles = {
      high: [
        'Political instability risk increasing',
        'Severe weather warning affecting supply chains',
        'Currency devaluation imminent',
        'Regulatory changes impacting foreign investments',
        'Civil unrest escalating in urban centers'
      ],
      medium: [
        'Inflation rate rising above projections',
        'Labor disputes affecting manufacturing',
        'Trade restrictions being considered',
        'Infrastructure vulnerabilities identified',
        'Public health concerns emerging'
      ],
      low: [
        'Minor delays in permit processing expected',
        'Seasonal fluctuations in commodity prices',
        'Slight increase in border crossing times',
        'Potential changes to local tax structure',
        'Minor shifts in consumer sentiment'
      ]
    };

    const timeframes = {
      high: ['Next 7 days', '2-3 weeks', 'This month'],
      medium: ['1-2 months', 'Next quarter', 'Q3 2025'],
      low: ['Next 6 months', 'Late 2025', 'Q1 2026']
    };

    const categories = ['Political', 'Economic', 'Environmental', 'Social', 'Security', 'Regulatory'];
    
    const descriptions = {
      high: [
        'Critical situation developing with potential significant impacts to operations and investments.',
        'Immediate attention required as developments are rapidly evolving with high uncertainty.',
        'Substantial disruptions expected with wide-ranging consequences across multiple sectors.'
      ],
      medium: [
        'Situation requires monitoring as impacts could become significant if trends continue.',
        'Moderate disruptions expected with specific sectors particularly vulnerable.',
        'Developing situation with unclear trajectory but potential for escalation.'
      ],
      low: [
        'Minor issue with limited immediate impacts but worth monitoring for changes.',
        'Low-level concerns that may aggregate over time into larger challenges.',
        'Early warning indicators showing subtle shifts in underlying conditions.'
      ]
    };

    const randomTitle = titles[severity][Math.floor(Math.random() * titles[severity].length)];
    const randomTimeframe = timeframes[severity][Math.floor(Math.random() * timeframes[severity].length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomDescription = descriptions[severity][Math.floor(Math.random() * descriptions[severity].length)];
    
    // Random timestamp in the last 24 hours
    const randomTimestamp = new Date();
    randomTimestamp.setHours(randomTimestamp.getHours() - Math.floor(Math.random() * 24));
    
    // Random confidence level appropriate for severity
    const confidenceBase = severity === 'high' ? 70 : severity === 'medium' ? 60 : 50;
    const randomConfidence = confidenceBase + Math.floor(Math.random() * 30);
    
    // Random impact areas
    const allImpactAreas = ['Operations', 'Supply Chain', 'Financial', 'Reputation', 'Legal', 'Personnel'];
    const numImpactAreas = Math.floor(Math.random() * 3) + 1; // 1-3 impact areas
    const randomImpactAreas: string[] = [];
    
    while (randomImpactAreas.length < numImpactAreas) {
      const randomArea = allImpactAreas[Math.floor(Math.random() * allImpactAreas.length)];
      if (!randomImpactAreas.includes(randomArea)) {
        randomImpactAreas.push(randomArea);
      }
    }

    return {
      id,
      title: randomTitle,
      severity,
      timeframe: randomTimeframe,
      category: randomCategory,
      description: randomDescription,
      source: 'Savannah Intelligence Analysis',
      impactAreas: randomImpactAreas,
      timestamp: randomTimestamp,
      confidence: randomConfidence
    };
  }, []);

  // Function to refresh alerts - memoized with useCallback to prevent render issues
  const refreshAlerts = useCallback(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate random alerts
      const numHigh = Math.floor(Math.random() * 2) + 1; // 1-2 high alerts
      const numMedium = Math.floor(Math.random() * 3) + 2; // 2-4 medium alerts
      const numLow = Math.floor(Math.random() * 3) + 2; // 2-4 low alerts
      
      const newAlerts: RiskAlert[] = [];
      
      // Generate high severity alerts
      for (let i = 0; i < numHigh; i++) {
        newAlerts.push(generateRandomAlert(`h-${i}`, 'high'));
      }
      
      // Generate medium severity alerts
      for (let i = 0; i < numMedium; i++) {
        newAlerts.push(generateRandomAlert(`m-${i}`, 'medium'));
      }
      
      // Generate low severity alerts
      for (let i = 0; i < numLow; i++) {
        newAlerts.push(generateRandomAlert(`l-${i}`, 'low'));
      }
      
      // Sort by severity (high to low) and then by timestamp (newest first)
      newAlerts.sort((a, b) => {
        const severityOrder = { high: 3, medium: 2, low: 1 };
        if (severityOrder[a.severity] !== severityOrder[b.severity]) {
          return severityOrder[b.severity] - severityOrder[a.severity];
        }
        return b.timestamp.getTime() - a.timestamp.getTime();
      });
      
      setAlerts(newAlerts);
      setLastUpdated(new Date());
      setAnomalyDetected(Math.random() > 0.7); // 30% chance of anomaly
      setIsLoading(false);
    }, 1200);
  }, [generateRandomAlert]);

  // Generate initial alerts
  useEffect(() => {
    refreshAlerts();
  }, [selectedRegion, selectedCountry, timeframe, refreshAlerts]);

  // Function to toggle severity filter
  const toggleSeverityFilter = (severity: string) => {
    setSelectedSeverityFilter(prev => 
      prev.includes(severity)
        ? prev.filter(s => s !== severity)
        : [...prev, severity]
    );
  };

  // Filter alerts by severity if filters are selected
  const filteredAlerts = selectedSeverityFilter.length > 0
    ? alerts.filter(alert => selectedSeverityFilter.includes(alert.severity))
    : alerts;

  // Calculate risk score trend
  const highWeight = 3;
  const mediumWeight = 2;
  const lowWeight = 1;
  
  const highCount = alerts.filter(a => a.severity === 'high').length;
  const mediumCount = alerts.filter(a => a.severity === 'medium').length;
  const lowCount = alerts.filter(a => a.severity === 'low').length;
  
  const weightedScore = (highCount * highWeight + mediumCount * mediumWeight + lowCount * lowWeight) / 
                       (highCount + mediumCount + lowCount || 1);
  
  const riskTrend = {
    direction: weightedScore > 2 ? 'down' : weightedScore < 1.5 ? 'up' : 'stable',
    value: `${(weightedScore / 3 * 100).toFixed(0)}%`,
    label: 'risk level'
  } as const;

  // Additional card actions
  const cardActions = (
    <>
      <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center">
        <Sliders className="h-3.5 w-3.5 mr-2 text-gray-500" />
        Customize Alert Criteria
      </button>
      <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center">
        <Target className="h-3.5 w-3.5 mr-2 text-gray-500" />
        Set Risk Thresholds
      </button>
      <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center">
        <Lightbulb className="h-3.5 w-3.5 mr-2 text-gray-500" />
        View Recommendations
      </button>
    </>
  );

  // Format relative time for timestamps
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };
  
  return (
    <EnhancedDashboardCard
      title="Risk Forecast"
      icon={<TrendingUp className="h-5 w-5 text-purple-600" />}
      lastUpdated={lastUpdated}
      status={anomalyDetected ? 'warning' : 'normal'}
      trend={riskTrend}
      isLoading={isLoading}
      refreshInterval={90}
      onRefresh={refreshAlerts}
      infoTooltip="The Risk Forecast card shows upcoming potential risks categorized by severity and timeframe. Data updates automatically or can be manually refreshed."
      actions={cardActions}
      isCollapsible={true}
      onFullScreenToggle={() => console.log('Toggle fullscreen for Risk Forecast')}
      allowFavorite={true}
    >
      {/* Severity Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">Filter:</span>
          <button
            onClick={() => toggleSeverityFilter('high')}
            className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${
              selectedSeverityFilter.includes('high') ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            High
          </button>
          <button
            onClick={() => toggleSeverityFilter('medium')}
            className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${
              selectedSeverityFilter.includes('medium') ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            Medium
          </button>
          <button
            onClick={() => toggleSeverityFilter('low')}
            className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${
              selectedSeverityFilter.includes('low') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Low
          </button>
        </div>
        
        <button 
          onClick={() => setSelectedSeverityFilter([])}
          className={`text-xs text-blue-600 hover:underline ${selectedSeverityFilter.length === 0 ? 'hidden' : ''}`}
        >
          Clear Filters
        </button>
      </div>
      
      {/* Alerts List */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => (
            <div 
              key={alert.id}
              className={`p-3 rounded-md border transition-all duration-200 ${
                alert.severity === 'high' ? 'bg-red-50 border-red-200' :
                alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                'bg-green-50 border-green-200'
              } ${expandedAlertId === alert.id ? 'ring-2 ring-blue-300' : 'hover:shadow-sm'}`}
            >
              <div className="flex justify-between">
                <div className="flex items-start gap-2">
                  {alert.severity === 'high' && <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />}
                  {alert.severity === 'medium' && <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />}
                  {alert.severity === 'low' && <Info className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />}
                  
                  <div>
                    <h3 className={`font-medium text-sm ${
                      alert.severity === 'high' ? 'text-red-800' :
                      alert.severity === 'medium' ? 'text-yellow-800' :
                      'text-green-800'
                    }`}>
                      {alert.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{alert.category}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className={`text-xs font-medium ${
                        alert.severity === 'high' ? 'text-red-700' :
                        alert.severity === 'medium' ? 'text-yellow-700' :
                        'text-green-700'
                      }`}>
                        {alert.timeframe}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500">
                    {formatRelativeTime(alert.timestamp)}
                  </span>
                  <button
                    onClick={() => setExpandedAlertId(expandedAlertId === alert.id ? null : alert.id)}
                    className="text-xs text-blue-600 hover:underline mt-1"
                  >
                    {expandedAlertId === alert.id ? 'Collapse' : 'View Details'}
                  </button>
                </div>
              </div>
              
              {expandedAlertId === alert.id && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-700">
                    <p className="mb-2">{alert.description}</p>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div>
                        <span className="text-gray-500">Source:</span> {alert.source}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Confidence:</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div 
                            className={`h-full rounded-full ${
                              alert.confidence > 70 ? 'bg-green-500' :
                              alert.confidence > 50 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${alert.confidence}%` }}
                          ></div>
                        </div>
                        <span>{alert.confidence}%</span>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <span className="text-gray-500">Impact Areas:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {alert.impactAreas.map(area => (
                          <span 
                            key={area}
                            className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-3">
                      <button className="text-blue-600 hover:underline text-xs flex items-center">
                        Take Action <ArrowRight className="h-3 w-3 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Shield className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No alerts match your current filters</p>
            {selectedSeverityFilter.length > 0 && (
              <button 
                onClick={() => setSelectedSeverityFilter([])}
                className="text-blue-600 hover:underline mt-2"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500 flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" />
          <span>{filteredAlerts.length} alerts shown</span>
        </div>
        
        <Link
          href="/dashboard/scenario"
          className="text-blue-600 text-sm font-medium hover:underline flex items-center"
        >
          Scenario Planning
          <ArrowRight className="h-4 w-4 ml-1.5" />
        </Link>
      </div>
    </EnhancedDashboardCard>
  );
}